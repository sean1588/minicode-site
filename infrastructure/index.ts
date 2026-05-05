import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

interface SiteConfig {
  name: string;            // logical site key (e.g. "minicode", "claudepanion")
  resourcePrefix: string;  // Pulumi resource name prefix; "site" preserves the original URNs
  domainName: string;
  certificateArn?: string; // when set, cert creation/validation is skipped
}

interface CreateSiteArgs extends SiteConfig {
  awsResourceName: string; // used for AWS-level naming + tags (e.g. "minicode-site")
  hostedZone: pulumi.Output<aws.route53.GetZoneResult>;
  usEast1: aws.Provider;
}

interface SiteOutputs {
  bucketName: pulumi.Output<string>;
  bucketArn: pulumi.Output<string>;
  cdnId: pulumi.Output<string>;
  cdnDomain: pulumi.Output<string>;
  domain: string;
  url: pulumi.Output<string>;
}

const config = new pulumi.Config();
const projectName = config.get("projectName") || "minicode-site";
const hostedZoneName = config.get("hostedZoneName") || "seanholung.com";
const sites = config.requireObject<SiteConfig[]>("sites");

function validateCloudFrontCertificateArn(certificateArn: string): string {
  const arnParts = certificateArn.split(":");

  if (arnParts.length < 6 || arnParts[2] !== "acm") {
    throw new Error(
      `certificateArn must be an ACM certificate ARN. Received "${certificateArn}".`
    );
  }

  const certificateRegion = arnParts[3];

  if (certificateRegion !== "us-east-1") {
    throw new Error(
      `CloudFront requires ACM certificates in us-east-1. Received "${certificateRegion}" in certificateArn.`
    );
  }

  return certificateArn;
}

const usEast1 = new aws.Provider("us-east-1", {
  region: "us-east-1",
});

const hostedZone = aws.route53.getZoneOutput({
  name: hostedZoneName,
  privateZone: false,
});

function createSite(args: CreateSiteArgs): SiteOutputs {
  const { resourcePrefix, awsResourceName, domainName, certificateArn } = args;
  const displayName = args.name.charAt(0).toUpperCase() + args.name.slice(1);

  const tags = {
    Project: awsResourceName,
    Component: "marketing-site",
  };

  const siteBucket = new aws.s3.Bucket(resourcePrefix, {
    forceDestroy: false,
    tags,
  });

  new aws.s3.BucketPublicAccessBlock(`${resourcePrefix}-public-access`, {
    bucket: siteBucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
  });

  const oac = new aws.cloudfront.OriginAccessControl(`${resourcePrefix}-oac`, {
    name: `${awsResourceName}-oac`,
    description: `CloudFront access for ${displayName} site bucket`,
    originAccessControlOriginType: "s3",
    signingBehavior: "always",
    signingProtocol: "sigv4",
  });

  const prettyUrlRewriter = new aws.cloudfront.Function(`${resourcePrefix}-pretty-url-rewriter`, {
    name: `${awsResourceName}-pretty-url-rewriter`,
    runtime: "cloudfront-js-2.0",
    comment: "Rewrites directory-style paths to index.html for static-site routing",
    publish: true,
    code: `function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/") {
    return request;
  }

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  if (!uri.includes(".")) {
    request.uri = uri + "/index.html";
  }

  return request;
}`,
  });

  let viewerCertificateArn: pulumi.Input<string>;
  const certificateDependencies: pulumi.Resource[] = [];

  if (certificateArn) {
    viewerCertificateArn = validateCloudFrontCertificateArn(certificateArn);
  } else {
    const certificate = new aws.acm.Certificate(
      `${resourcePrefix}-certificate`,
      {
        domainName,
        validationMethod: "DNS",
        tags,
      },
      { provider: args.usEast1 }
    );

    const certificateValidationOption = certificate.domainValidationOptions[0];

    const certificateValidationRecord = new aws.route53.Record(`${resourcePrefix}-certificate-validation`, {
      zoneId: args.hostedZone.zoneId,
      name: certificateValidationOption.resourceRecordName,
      type: certificateValidationOption.resourceRecordType,
      records: [certificateValidationOption.resourceRecordValue],
      ttl: 60,
      allowOverwrite: true,
    });

    const certificateValidation = new aws.acm.CertificateValidation(
      `${resourcePrefix}-certificate-validation-result`,
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certificateValidationRecord.fqdn],
      },
      { provider: args.usEast1 }
    );

    viewerCertificateArn = certificate.arn;
    certificateDependencies.push(certificateValidation);
  }

  const cdn = new aws.cloudfront.Distribution(`${resourcePrefix}-cdn`, {
    enabled: true,
    comment: `${displayName} static site`,
    defaultRootObject: "index.html",
    priceClass: "PriceClass_100",
    httpVersion: "http2and3",
    aliases: [domainName],
    origins: [
      {
        domainName: siteBucket.bucketRegionalDomainName,
        originId: "s3-site",
        originAccessControlId: oac.id,
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: "s3-site",
      viewerProtocolPolicy: "redirect-to-https",
      allowedMethods: ["GET", "HEAD", "OPTIONS"],
      cachedMethods: ["GET", "HEAD"],
      compress: true,
      cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      functionAssociations: [
        {
          eventType: "viewer-request",
          functionArn: prettyUrlRewriter.arn,
        },
      ],
    },
    customErrorResponses: [
      {
        errorCode: 403,
        responseCode: 200,
        responsePagePath: "/index.html",
        errorCachingMinTtl: 10,
      },
      {
        errorCode: 404,
        responseCode: 200,
        responsePagePath: "/index.html",
        errorCachingMinTtl: 10,
      },
    ],
    restrictions: {
      geoRestriction: { restrictionType: "none" },
    },
    viewerCertificate: {
      acmCertificateArn: viewerCertificateArn,
      sslSupportMethod: "sni-only",
      minimumProtocolVersion: "TLSv1.2_2021",
    },
    tags,
  }, { dependsOn: certificateDependencies });

  new aws.s3.BucketPolicy(`${resourcePrefix}-policy`, {
    bucket: siteBucket.id,
    policy: pulumi
      .all([siteBucket.arn, cdn.arn])
      .apply(([bucketArn, cdnArn]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "AllowCloudFrontServicePrincipal",
              Effect: "Allow",
              Principal: { Service: "cloudfront.amazonaws.com" },
              Action: "s3:GetObject",
              Resource: `${bucketArn}/*`,
              Condition: { StringEquals: { "AWS:SourceArn": cdnArn } },
            },
          ],
        })
      ),
  });

  new aws.route53.Record(`${resourcePrefix}-alias-record`, {
    zoneId: args.hostedZone.zoneId,
    name: domainName,
    type: "A",
    aliases: [
      {
        name: cdn.domainName,
        zoneId: cdn.hostedZoneId,
        evaluateTargetHealth: false,
      },
    ],
    allowOverwrite: true,
  });

  return {
    bucketName: siteBucket.bucket,
    bucketArn: siteBucket.arn,
    cdnId: cdn.id,
    cdnDomain: cdn.domainName,
    domain: domainName,
    url: pulumi.interpolate`https://${domainName}`,
  };
}

const siteOutputs: Record<string, SiteOutputs> = {};
for (const site of sites) {
  siteOutputs[site.name] = createSite({
    ...site,
    awsResourceName: `${site.name}-site`,
    hostedZone,
    usEast1,
  });
}

// Per-site outputs. Read in CI as `pulumi stack output sitesJson --json` and
// index by site name (e.g. .minicode.bucketName, .claudepanion.cdnId).
export const sitesJson = pulumi.output(siteOutputs);

// Backwards-compatible top-level outputs for the legacy single-site workflow.
// Resolve to the first site declared in config (which is minicode today).
const primary = siteOutputs[sites[0].name];
export const siteBucketName = primary.bucketName;
export const siteBucketArn = primary.bucketArn;
export const siteCdnId = primary.cdnId;
export const siteCdnDomain = primary.cdnDomain;
export const siteDomain = primary.domain;
export const siteUrl = primary.url;

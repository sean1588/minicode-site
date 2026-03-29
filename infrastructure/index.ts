import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const siteName = config.get("siteName") || "minicode-site";
const domainName = config.get("domainName") || "minicode.seanholung.com";
const hostedZoneName = config.get("hostedZoneName") || "seanholung.com";
const configuredCertificateArn = config.get("certificateArn");

function validateCloudFrontCertificateArn(certificateArn: string): string {
  const arnParts = certificateArn.split(":");

  if (arnParts.length < 6 || arnParts[2] !== "acm") {
    throw new Error(
      `minicode-site:certificateArn must be an ACM certificate ARN. Received "${certificateArn}".`
    );
  }

  const certificateRegion = arnParts[3];

  if (certificateRegion !== "us-east-1") {
    throw new Error(
      `CloudFront requires ACM certificates in us-east-1. Received "${certificateRegion}" in minicode-site:certificateArn.`
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

const siteBucket = new aws.s3.Bucket("site", {
  forceDestroy: false,
  tags: {
    Project: siteName,
    Component: "marketing-site",
  },
});

new aws.s3.BucketPublicAccessBlock("site-public-access", {
  bucket: siteBucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

const oac = new aws.cloudfront.OriginAccessControl("site-oac", {
  name: `${siteName}-oac`,
  description: "CloudFront access for Minicode site bucket",
  originAccessControlOriginType: "s3",
  signingBehavior: "always",
  signingProtocol: "sigv4",
});

const existingCertificateArn = configuredCertificateArn
  ? validateCloudFrontCertificateArn(configuredCertificateArn)
  : undefined;

let viewerCertificateArn: pulumi.Input<string>;
const certificateDependencies: pulumi.Resource[] = [];

if (existingCertificateArn) {
  viewerCertificateArn = existingCertificateArn;
} else {
  const certificate = new aws.acm.Certificate(
    "site-certificate",
    {
      domainName,
      validationMethod: "DNS",
      tags: {
        Project: siteName,
        Component: "marketing-site",
      },
    },
    { provider: usEast1 }
  );

  const certificateValidationOption = certificate.domainValidationOptions[0];

  const certificateValidationRecord = new aws.route53.Record("site-certificate-validation", {
    zoneId: hostedZone.zoneId,
    name: certificateValidationOption.resourceRecordName,
    type: certificateValidationOption.resourceRecordType,
    records: [certificateValidationOption.resourceRecordValue],
    ttl: 60,
    allowOverwrite: true,
  });

  const certificateValidation = new aws.acm.CertificateValidation(
    "site-certificate-validation-result",
    {
      certificateArn: certificate.arn,
      validationRecordFqdns: [certificateValidationRecord.fqdn],
    },
    { provider: usEast1 }
  );

  viewerCertificateArn = certificate.arn;
  certificateDependencies.push(certificateValidation);
}

const cdn = new aws.cloudfront.Distribution("site-cdn", {
  enabled: true,
  comment: "Minicode static site",
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
  tags: {
    Project: siteName,
    Component: "marketing-site",
  },
}, { dependsOn: certificateDependencies });

new aws.s3.BucketPolicy("site-policy", {
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

new aws.route53.Record("site-alias-record", {
  zoneId: hostedZone.zoneId,
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

export const siteBucketName = siteBucket.bucket;
export const siteBucketArn = siteBucket.arn;
export const siteCdnId = cdn.id;
export const siteCdnDomain = cdn.domainName;
export const siteDomain = domainName;
export const siteUrl = pulumi.interpolate`https://${domainName}`;

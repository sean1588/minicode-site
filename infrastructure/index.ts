import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const siteName = config.get("siteName") || "minicode-site";

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

const cdn = new aws.cloudfront.Distribution("site-cdn", {
  enabled: true,
  comment: "Minicode static site",
  defaultRootObject: "index.html",
  priceClass: "PriceClass_100",
  httpVersion: "http2and3",
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
    cloudfrontDefaultCertificate: true,
  },
  tags: {
    Project: siteName,
    Component: "marketing-site",
  },
});

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

export const siteBucketName = siteBucket.bucket;
export const siteBucketArn = siteBucket.arn;
export const siteCdnId = cdn.id;
export const siteCdnDomain = cdn.domainName;
export const siteUrl = pulumi.interpolate`https://${cdn.domainName}`;

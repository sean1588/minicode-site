# Minicode Infrastructure

Pulumi IaC for deploying the Hugo site to a private S3 bucket behind CloudFront, with Route53 + ACM wiring for `minicode.seanholung.com`.

## Prereqs

- Pulumi CLI
- AWS credentials with permissions for S3 + CloudFront + IAM policy updates
- Pulumi access token when using the Pulumi Cloud backend

## Quickstart

```bash
cd infrastructure
npm install
pulumi stack init dev # first time only
pulumi config set aws:region us-west-2
# optional overrides (defaults are already set in Pulumi.dev.yaml)
pulumi config set minicode-site:domainName minicode.seanholung.com
pulumi config set minicode-site:hostedZoneName seanholung.com
# optional: reuse an existing ACM certificate for CloudFront
# this must be for the site domain and must live in us-east-1
pulumi config set minicode-site:certificateArn arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
pulumi up
```

If `minicode-site:certificateArn` is omitted, the program will create and DNS-validate a new ACM certificate in `us-east-1` using the configured Route53 hosted zone.

## Outputs

- `siteBucketName`: S3 bucket to sync Hugo `public/` assets into
- `siteCdnId`: CloudFront distribution ID for invalidations
- `siteCdnDomain`: CloudFront domain name
- `siteDomain`: configured custom domain name
- `siteUrl`: HTTPS URL for the deployed site

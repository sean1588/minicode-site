# Minicode Infrastructure

Pulumi IaC for deploying the Hugo site to a private S3 bucket behind CloudFront.

## Prereqs

- Pulumi CLI
- AWS credentials with permissions for S3 + CloudFront + IAM policy updates
- Pulumi access token

## Quickstart

```bash
cd infrastructure
npm install
pulumi stack init dev # first time only
pulumi config set aws:region us-west-2
pulumi up
```

## Outputs

- `siteBucketName`: S3 bucket to sync Hugo `public/` assets into
- `siteCdnId`: CloudFront distribution ID for invalidations
- `siteCdnDomain`: CloudFront domain name
- `siteUrl`: HTTPS URL for the deployed site

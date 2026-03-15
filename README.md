# Minicode Site

Minimal Hugo + Pulumi bootstrap for `minicode-site`.

## Repo layout

- `site/` — Hugo site source
- `infrastructure/` — Pulumi program for S3 + CloudFront hosting
- `.github/workflows/deploy-site.yml` — GitHub Actions deploy workflow

## Local site work

```bash
cd site
hugo server -D
```

Build locally:

```bash
cd site
hugo --minify
```

## Infrastructure

Prereqs:
- Node.js 22+
- Pulumi CLI
- AWS credentials with permissions for S3, CloudFront, and IAM policy updates
- Pulumi access token

```bash
cd infrastructure
npm install
pulumi stack init dev # first time only
pulumi config set aws:region us-west-2
pulumi up
```

Useful outputs:

```bash
pulumi stack output siteBucketName
pulumi stack output siteCdnId
pulumi stack output siteUrl
```

## GitHub Actions deploy

Workflow: `.github/workflows/deploy-site.yml`

Required repo secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `PULUMI_ACCESS_TOKEN`
- `PULUMI_STACK` (example: `sean1588/minicode-site/dev`)

What the workflow does:
1. installs infra dependencies
2. selects or creates the Pulumi stack
3. runs `pulumi up`
4. builds the Hugo site using the deployed CDN URL as `baseURL`
5. syncs `site/public/` to S3
6. invalidates CloudFront

## Notes

- The bucket is private; CloudFront accesses it through Origin Access Control.
- The default Pulumi region is `us-west-2`.
- For a custom domain, extend the Pulumi program with ACM + Route53 before switching `baseURL` permanently.

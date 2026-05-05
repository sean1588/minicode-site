# Minicode Site

Minimal Hugo + Pulumi bootstrap for `minicode-site`.

## Repo layout

- `sites/<subdomain>/` — one Hugo project per subdomain (e.g. `sites/minicode/`, `sites/claudepanion/`)
- `infrastructure/` — Pulumi program; provisions one S3 bucket + CloudFront distribution + ACM cert + Route53 alias per entry in `minicode-site:sites` config
- `.github/workflows/deploy-site.yml` — deploys on push to `main` (matrix-fans-out one job per site)
- `.github/workflows/preview-site.yml` — runs `pulumi preview` + a Hugo build for each site on every PR

## Local site work

```bash
cd sites/minicode
hugo server -D
```

Build locally:

```bash
cd sites/minicode
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
# All sites at once (returns a JSON map keyed by site name)
pulumi stack output sitesJson --json

# Backwards-compatible shortcuts for the primary site (currently minicode)
pulumi stack output siteBucketName
pulumi stack output siteCdnId
pulumi stack output siteUrl
```

To add a new site, append a block to `minicode-site:sites` in `Pulumi.dev.yaml`:

```yaml
- name: example
  resourcePrefix: example
  domainName: example.seanholung.com
  # certificateArn: <us-east-1 ACM ARN>   # omit to provision a fresh cert + DNS validation
```

Then add the site key to the `matrix.site` list in both deploy and preview workflows, and create the corresponding `sites/example/` Hugo project.

## GitHub Actions

Required repo secrets (shared by both workflows):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `PULUMI_ACCESS_TOKEN`

### Deploy (`deploy-site.yml`)

Triggers on push to `main` when `sites/minicode/**`, `infrastructure/**`, or the workflow itself changes. Steps:

1. installs infra dependencies
2. selects the Pulumi stack
3. runs `pulumi up`
4. builds the Hugo site using the deployed CDN URL as `baseURL`
5. syncs `sites/minicode/public/` to S3
6. invalidates CloudFront

### Preview (`preview-site.yml`)

Triggers on PRs against `main` for the same paths. Steps:

1. installs infra dependencies
2. runs `pulumi preview --diff` (no resource changes applied)
3. builds the Hugo site with `hugo --minify` so template / content errors fail the PR check

Build artifacts are not uploaded anywhere — this is a fail-fast sanity check.

## Notes

- The bucket is private; CloudFront accesses it through Origin Access Control.
- The default Pulumi region is `us-west-2`.
- For a custom domain, extend the Pulumi program with ACM + Route53 before switching `baseURL` permanently.

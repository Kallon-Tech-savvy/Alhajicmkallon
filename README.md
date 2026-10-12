# Alhaji C. M. Kallon — Portfolio

Personal website built with Next.js, React, TypeScript, and Tailwind CSS.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

The development/build pre-step generates the content index. Useful checks:

```bash
npm run test:content
npm run lint
npm run test:boundaries
npm run build
```

## Deployment

The existing Vercel project and production domain should be preserved.

### Default path: Vercel Git integration

Vercel's Git integration remains the automatic deployment path for pull requests and changes merged into the configured production branch (`main`). Verify the existing connection in Vercel Dashboard → project → Settings → Git before changing repository or domain settings.

### Optional manual GitHub Actions production deployment

`.github/workflows/vercel-production.yml` adds a manually triggered production deployment. It is intentionally not triggered on every push because automatic Vercel Git deployment is already enabled; running both automatically could create duplicate production deployments.

Before using the manual workflow, configure these repository-level values in GitHub → Settings → Secrets and variables → Actions:

| Name | Type | Purpose |
| --- | --- | --- |
| `VERCEL_TOKEN` | Secret | Vercel CLI authentication |
| `VERCEL_ORG_ID` | Variable | Existing Vercel team/organization ID |
| `VERCEL_PROJECT_ID` | Variable | Existing Vercel project ID |

Use the IDs from the existing Vercel project; do not create a replacement project. Give the token the minimum practical scope and lifetime. Never commit it or put it in a public file. The workflow expects the GitHub Actions variables and secret to be present.

To deploy manually: open the repository's **Actions** tab → **Manual Vercel production deployment** → **Run workflow**, then type `deploy` in the confirmation input. This deploys to production. The workflow runs the content test, lint, and boundary checks before pulling the Vercel production environment, building, and deploying prebuilt output.

For stronger release controls, configure a GitHub Actions environment named `production` with required reviewers or other appropriate protection rules before using this workflow. A manual trigger is a safety gate, not a substitute for reviewing the diff and confirming the intended project/domain.

### Setup wizard

Run the repeatable interactive wizard from the repository root:

```bash
chmod +x scripts/wizard-vercel-deployment.sh
bash scripts/wizard-vercel-deployment.sh
```

It walks through checking the existing Vercel project, verifying Git integration, capturing project identifiers, creating a Vercel token, and configuring the Actions secret/variables. It writes non-secret identifiers to the ignored local `.env.local` file and attempts to set the repository Actions values with the GitHub CLI (`gh`). Install and authenticate `gh` first if you want the wizard to configure GitHub directly; otherwise follow its manual instructions.

The wizard does not trigger a deployment. Review all values and confirm the production URL before manually running the deployment workflow.

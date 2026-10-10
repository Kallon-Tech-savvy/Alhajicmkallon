#!/usr/bin/env bash
# Repeatable setup wizard for the portfolio's Vercel deployment paths.
# Native Vercel Git integration stays automatic; the Actions path is manual.
set -euo pipefail
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1 && [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
  BOLD=$(tput bold); DIM=$(tput dim); RESET=$(tput sgr0); BLUE=$(tput setaf 4); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
else BOLD=""; DIM=""; RESET=""; BLUE=""; GREEN=""; YELLOW=""; fi
TOTAL_STAGES=6; STAGE_INDEX=0; ENV_FILE=.env.local
WRITTEN_ENV=""; WRITTEN_SECRET=""; WRITTEN_VAR=""; SKIPPED=""
_clear() { [[ -t 1 ]] || return 0; if command -v tput >/dev/null 2>&1; then tput clear; else printf '\033[2J\033[3J\033[H'; fi; }
banner() { _clear; printf '\n%s%s  %s%s\n' "$BOLD" "$BLUE" "$1" "$RESET"; printf '%s  %s stages%s\n\n' "$DIM" "$TOTAL_STAGES" "$RESET"; printf '%s  This wizard configures Vercel and GitHub Actions; it will not\n  trigger a production deployment. Stop with Ctrl-C and rerun later.%s\n' "$DIM" "$RESET"; pause "Ready to start?"; }
stage() { _clear; STAGE_INDEX=$((STAGE_INDEX + 1)); printf '\n%s%s▸ Stage %s/%s · %s%s\n' "$BOLD" "$BLUE" "$STAGE_INDEX" "$TOTAL_STAGES" "$1" "$RESET"; }
say() { printf '  %s\n' "$1"; }
step() { printf '  %s•%s %s\n' "$BLUE" "$RESET" "$1"; }
note() { printf '  %s%s%s\n' "$DIM" "$1" "$RESET"; }
warn() { printf '  %s⚠ %s%s\n' "$YELLOW" "$1" "$RESET"; }
open_url() { local url="$1"; printf '  %s↗ opening%s %s\n' "$GREEN" "$RESET" "$url"; { if command -v wslview >/dev/null 2>&1; then wslview "$url"; elif command -v explorer.exe >/dev/null 2>&1; then explorer.exe "$url"; elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$url"; elif command -v open >/dev/null 2>&1; then open "$url"; else false; fi; } >/dev/null 2>&1 || warn "couldn't open browser; visit manually: $url"; }
pause() { printf '  %s%s%s ' "$DIM" "$1" "$RESET"; read -r _ || true; }
confirm() { local reply=""; printf '  %s? %s [y/N] ' "$YELLOW" "$1"; read -r reply || true; [[ "$reply" =~ ^[Yy]$ ]]; }
ask() { local key="$1" prompt="$2" input=""; printf '  %s%s%s ' "$BOLD" "$prompt" "$RESET"; read -r input || return 1; printf -v "$key" '%s' "$input"; }
ask_secret() { local key="$1" prompt="$2" input=""; printf '  %s%s%s ' "$BOLD" "$prompt" "$RESET"; read -r -s input || return 1; printf '\n'; printf -v "$key" '%s' "$input"; }
write_env() { local key="$1" value="$2" tmp; [[ -e "$ENV_FILE" ]] || (umask 077 && : > "$ENV_FILE"); tmp=$(mktemp); grep -v "^$key=" "$ENV_FILE" > "$tmp" || true; printf "%s='%s'\n" "$key" "$value" >> "$tmp"; cat "$tmp" > "$ENV_FILE"; rm -f "$tmp"; WRITTEN_ENV="$WRITTEN_ENV $key"; printf '  %s✓ wrote%s %s → %s\n' "$GREEN" "$RESET" "$key" "$ENV_FILE"; }
set_secret() { local name="$1" value="$2"; if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1 && printf '%s' "$value" | gh secret set "$name" >/dev/null 2>&1; then WRITTEN_SECRET="$WRITTEN_SECRET $name"; printf '  %s✓ set%s GitHub secret %s\n' "$GREEN" "$RESET" "$name"; return; fi; SKIPPED="$SKIPPED GitHub secret $name"; warn "could not set GitHub secret $name; add it manually in repository Settings → Secrets and variables → Actions"; }
set_var() { local name="$1" value="$2"; if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1 && gh variable set "$name" --body "$value" >/dev/null 2>&1; then WRITTEN_VAR="$WRITTEN_VAR $name"; printf '  %s✓ set%s GitHub variable %s\n' "$GREEN" "$RESET" "$name"; return; fi; SKIPPED="$SKIPPED GitHub variable $name"; warn "could not set GitHub variable $name; add it manually in repository Settings → Secrets and variables → Actions"; }
finish() { _clear; printf '\n%s%s  ✓ Wizard finished%s\n' "$BOLD" "$GREEN" "$RESET"; [[ -n "$WRITTEN_ENV" ]] && note "local values written:$WRITTEN_ENV"; [[ -n "$WRITTEN_SECRET" ]] && note "GitHub secrets set:$WRITTEN_SECRET"; [[ -n "$WRITTEN_VAR" ]] && note "GitHub variables set:$WRITTEN_VAR"; [[ -n "$SKIPPED" ]] && warn "still to do manually:$SKIPPED"; printf '\n'; }

banner "Portfolio deployment setup"
stage "Check local tools and repository"
say "Run from the root of Kallon-Tech-savvy/Alhajicmkallon."
step "Confirm the Git remote and working tree are correct."
step "GitHub CLI is needed to write Actions values: https://cli.github.com/"
if ! command -v gh >/dev/null 2>&1; then warn "gh is not installed; add values manually in GitHub settings."; else gh auth status || warn "gh is not authenticated; run gh auth login before configuring values."; fi
pause "Repository/tool check complete?"
stage "Verify the existing Vercel project"
open_url "https://vercel.com/dashboard"
step "Open the existing portfolio project. Do not create a second project or change the production domain."
step "Project Settings → General: locate the Project ID."
step "Locate the owning team/organization ID from the existing project's Vercel configuration/settings. Do not guess if it is not shown."
ask VERCEL_PROJECT_ID "Project ID:"
ask VERCEL_ORG_ID "Team/organization ID:"
if [[ -z "$VERCEL_PROJECT_ID" || -z "$VERCEL_ORG_ID" ]]; then warn "Both IDs are required for the manual Actions deployment."; exit 1; fi
write_env VERCEL_PROJECT_ID "$VERCEL_PROJECT_ID"; write_env VERCEL_ORG_ID "$VERCEL_ORG_ID"
note "These IDs are not credentials. .env.local is ignored by Git."
stage "Confirm native Git integration"
open_url "https://vercel.com/dashboard"
step "Open the existing project → Settings → Git."
step "Confirm repository Kallon-Tech-savvy/Alhajicmkallon and production branch main."
step "Preserve the current domain and settings. Native Git integration remains the automatic Preview/production path."
pause "Have you verified the project and Git connection?"
stage "Create a Vercel access token"
open_url "https://vercel.com/account/settings"
step "Locate Access Tokens in Vercel account settings; navigation can vary."
step "Create a token with the minimum scope and lifetime needed to deploy this project."
step "Copy it. Never paste it into chat, commit it, or save it in .env.local."
ask_secret VERCEL_TOKEN "Paste Vercel token (hidden):"
if [[ -z "$VERCEL_TOKEN" ]]; then warn "A token is required for the Actions workflow."; exit 1; fi
stage "Configure repository Actions values"
if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
  warn "Add values in GitHub → repository Settings → Secrets and variables → Actions."
  note "Secret: VERCEL_TOKEN. Variables: VERCEL_ORG_ID and VERCEL_PROJECT_ID."
  SKIPPED="$SKIPPED GitHub Actions secret VERCEL_TOKEN and variables VERCEL_ORG_ID / VERCEL_PROJECT_ID"
elif confirm "Set secret VERCEL_TOKEN and variables VERCEL_ORG_ID / VERCEL_PROJECT_ID now?"; then
  set_secret VERCEL_TOKEN "$VERCEL_TOKEN"; set_var VERCEL_ORG_ID "$VERCEL_ORG_ID"; set_var VERCEL_PROJECT_ID "$VERCEL_PROJECT_ID"
else SKIPPED="$SKIPPED GitHub Actions values not set"; fi
unset VERCEL_TOKEN
stage "Review deployment paths and production gate"
open_url "https://github.com/Kallon-Tech-savvy/Alhajicmkallon/actions"
step "Native Git integration stays automatic. The additional Actions workflow is manual to avoid duplicate automatic production deployments."
step "The workflow runs tests, lint, boundary checks, pulls production configuration, builds, and deploys prebuilt output."
step "Open Manual Vercel production deployment → Run workflow. Type deploy only when intentionally deploying to production."
warn "Do not deploy until IDs, token scope, and the existing production domain are verified."
if confirm "Do you understand that running this workflow deploys to production?"; then say "Acknowledged. This wizard does not trigger deployment."; else say "No deployment action taken."; fi
finish

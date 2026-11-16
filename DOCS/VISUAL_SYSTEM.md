# Swiss visual system

The frontend uses a Swiss-inspired grid, large sans-serif typography, numbered
sections, crisp rules and a small set of strong colours. The visual direction is
energetic and editorial; reading pages retain comfortable type and line lengths.

## Tokens and ownership

`src/app/globals.css` owns semantic colours, theme modes, typography, controls,
reading styles and accessibility defaults. `src/styles/swiss.css` owns the masthead,
homepage display compositions, project presentation and shared footer. Avoid adding
page-level palettes or a second chain of theme overrides.

- Paper and ink: `--ui-background`, `--ui-text`, and their supporting surface tokens.
- Action and focus: `--ui-accent`, `--ui-action`, `--ui-on-action`.
- Display colours: fixed cobalt `--brand-blue`, vermilion `--brand-orange`, paper
  `--brand-paper` and ink `--brand-ink`. Fixed blue fields always use paper text;
  orange fields use ink. Do not use orange for small text on paper.
- Status colours are separate semantic tokens for success, error and warning.
- Corner radius: `--panel-radius`; Tailwind radius utilities reference this token.
  Circular portraits and graphic motifs are deliberate exceptions.

Both themes use the same layout. The saved Light/Dark/System preference is applied
before paint, responds to system changes and syncs between tabs. Never use a fixed
light-colour label on a semantic dark background or vice versa.

## Layout and typography

Align wide sections to `--layout-max` (78rem) and `--page-gutter`. Keep article text
inside the existing reading columns. Inter is the display and body typeface;
JetBrains Mono is for code. Use `page-intro` and `page-title` for route headers.
Display text uses tight spacing and a large scale; body copy retains relaxed leading.

Use `swiss-meta` for compact uppercase labels, `swiss-button` for display actions,
`swiss-text-link` for underlined editorial links, and `ui-primary`/`ui-field` for
application controls. Keep labels meaningful and focus rings visible. Decorative
symbols are hidden from assistive technology. Use the inline SVG marks in `SwissMarks.tsx` for arrows and asterisks; platform
emoji must not replace the visual geometry.

The homepage shows the work before the practice and learning sections. Project
status remains explicit: AEEM is a working website; MJ Studio is in development.
Do not turn programme figures into website performance claims.

## Interaction and motion

The display headline has one short CSS entrance. Project previews, arrows, cards
and the graphic poster respond to hover. There are no continuous marquees,
scroll hijacking or motion libraries in the initial homepage runtime. Reduced
motion disables animation and transitions. Content stays visible without JavaScript;
Reveal wrappers may shift into place but never hide text while waiting for a script.

Chat and search still load on demand. Navigation, keyboard focus, contact fallback,
conversation retry and cancellation keep their existing behavior.

## Verification

- `npm run test:homepage-performance` checks server/client architecture without
  depending on exact headlines or JSX formatting.
- `npm run test:browser-bundle` checks production full-text exclusion, emitted theme
  utilities and palette contrast.
- `npm run test:interactions` checks search, chat, navigation, contact draft
  preservation, reduced motion, and six main routes across four screen/theme pairs.
- Inspect desktop, mobile and dark previews after changing typography or spacing.
  Long code examples scroll inside their reading column, not across the page.

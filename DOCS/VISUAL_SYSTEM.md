# Application visual system

Use the semantic palette in `src/app/globals.css`. Tailwind v4 registers the utility names through `@theme inline`; runtime aliases also support existing inline styles. Do not add a separate palette to a page.

- Background: midnight. Content panels: surface. Raised controls: navy.
- Body text: ivory. Supporting text: muted. Links and focus indicators: accent.
- Prominent actions: `ui-primary` (pale blue with dark text). Compact chat actions use the darker blue fill with light text.
- The mobile navigation is deliberately light: menu, menu-ink, menu-muted, menu-border, menu-hover and menu-active. It belongs to the same palette but remains distinct from the underlying dark page.
- Success, warning and danger are status colours, not competing decorative accents.

Align wide page containers to `--layout-max` (72rem). Preserve narrower article/reading containers. Use `page-intro` below the fixed navigation, `section-space` for content sections, `page-title` for route headings and `section-title` for large section headings. Use 1–1.5rem gaps within controls and cards; larger gaps separate content groups. The homepage hero is the intentional display-size exception.

Use Inter for headings and prose (`font-display`, `font-body`), and JetBrains Mono for code and terminal details. Labels should be at least 0.75rem with moderate letter spacing. Use `ui-field` for form inputs and `ui-panel` for standalone elevated surfaces. Keep visible focus rings and explicit non-colour state labels.

After a production build, `npm run test:browser-bundle` verifies that essential theme utilities were emitted and that the core text/surface combinations meet a 4.5:1 contrast budget. This checks tokens, not every possible image overlay or browser rendering; retain visual QA for those cases.

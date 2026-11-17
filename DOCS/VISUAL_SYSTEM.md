# Swiss × Carbon visual system

The interface blends the portfolio's Swiss editorial character with IBM Carbon's
productive UI principles. Large type, numbered sections, geometric artwork and
orange accents remain personal to the site. IBM Plex, blue actions, neutral layers,
a dark masthead and consistent controls make task-focused surfaces more systematic.

This is a custom implementation informed by Carbon. It does not import Carbon React
or claim full Carbon conformance or IBM affiliation.

## Ownership and tokens

- `src/app/globals.css`: semantic theme tokens, spacing, typography, reading surfaces
  and accessibility defaults.
- `src/styles/components.css`: application controls, form panels, contextual fields,
  selected/disabled/focus states, notices, shell links, search and chat.
- `src/styles/swiss.css`: expressive homepage layouts, brand geometry, project
  presentation and the shared masthead/footer composition.

Keep each component's styles in one place. Change shared tokens instead of adding
a second page palette or a chain of theme overrides.

The light theme uses white, Gray 10 and Gray 20 surfaces; the dark theme uses Gray
100, Gray 90 and Gray 80. `--ui-field-on-layer` gives fields a distinct contextual
surface on form panels. `--ui-border` is for strong field boundaries;
`--ui-border-subtle` divides tiles and layers. Blue 60 is the primary action colour.
Blue 70 is used for light-theme links so they remain readable on raised surfaces;
dark-theme links use Blue 40. Focus uses blue in light contexts and white in dark
contexts. Status text uses the stronger palette tones needed for readable contrast.

The shell has an explicit inverse token context in both themes. Set both its
background and text foreground: changing custom-property values alone does not
change an inherited CSS `color`. The browser checks masthead contrast to protect
this distinction.

## Typography and layout

Use IBM Plex Sans for body and display text, and IBM Plex Mono for code and compact
technical labels. Both are served through Next's font pipeline. Avoid adding font
families or component libraries to the initial client bundle.

Expressive headings keep the Swiss scale with lighter Plex weights and less extreme
tracking. Productive UI uses 14px control text, 12px labels and 48px actions. Article
columns retain their comfortable width and long code samples scroll internally.

Spacing follows the Carbon scale (2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px),
with fixed 32px outer gutters and 16px gutters at small widths. The display hero uses
a 16-column 12/4 split; subsequent compositions divide into halves and quarters.
Existing reading layouts remain adapted to their content rather than being forced
into a dense application grid. `--layout-max` bounds the portfolio at 82rem.

## Components and interaction

- Primary actions: blue, square, label left and action icon right. Hover/active
  colours and an inset focus indicator are defined explicitly.
- Ghost and icon actions: quiet default, visible hover and keyboard focus.
- Fields: filled contextual surface, bottom rule, persistent label and inset focus.
  Keep native required/type validation and associated labels.
- Intent choices: native buttons with `aria-pressed`, selected fill and bottom rule.
  A fieldset/legend groups the optional enquiry topic.
- Notices: a coloured left rule with readable neutral body text; preserve entered
  content on delivery failure or email fallback.
- Search: opaque dialog above a dim backdrop, useful quick links and divided result
  rows. Preserve focus containment, Escape, and return focus.
- Chat: layered side panel, compact toolbar, structured suggestions and conversation
  surfaces. Preserve retry, cancellation, draft restoration and explicit privacy text.

Inline SVG marks in `SwissMarks.tsx` keep decorative arrows/asterisks consistent
without copying IBM's logo or depending on emoji fonts. Project status stays explicit:
AEEM is a working website; MJ Studio is in development.

Controls use short productive transitions. Expressive display motion is limited to
the headline entrance and restrained hover responses. Reduced motion disables both.
Content stays visible without JavaScript. Search and chat continue to load on demand.

## Verification and references

Run the usual build, typecheck, lint, module-boundary and test commands. Production
bundle checks cover full-text exclusion and theme contrast. Browser checks cover
keyboard interactions, notices, selected state, inverse-header contrast, reduced
motion and six routes across small/large light/dark viewports. Inspect screenshots
of the hero, forms, search and chat after changing these shared styles.

Official references used for this blend:

- [Carbon 2x Grid](https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview)
- [Carbon typography and IBM Plex](https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview)
- [Carbon colour tokens](https://www.carbondesignsystem.com/building-blocks/foundations/color/tokens)
- [Text input specifications](https://www.carbondesignsystem.com/building-blocks/core/components/text-input/specifications)
- [Button specifications](https://www.carbondesignsystem.com/building-blocks/core/components/button/specifications)

## Personal identity

The user-supplied identity is preserved at
`public/assets/brand/alhaji-kallon-identity.jpg` and used in the homepage composition
and social sharing metadata. Preserve the complete artwork and its 2:1 aspect
ratio; do not stretch it or apply dark-mode inversion. The compact masthead uses
live text with an orange slash so the name remains legible on narrow screens.

Navy `#042333`, warm ivory `#fffaf5`, and orange `#ff8500` now define the brand.
Orange actions use navy labels; light-theme text links use a darker orange for
contrast. IBM Plex typography, semantic tokens, and Swiss grid spacing remain.

Desktop navigation exposes Work, About, Writing, Learn and Contact directly.
Mobile navigation includes every primary destination and a native Learning paths
disclosure for course shortcuts. Search stays available in the masthead, with
intent preloading and a dismissible loading state. Keep keyboard focus containment,
Escape dismissal, active-page indications and no eager route prefetching.

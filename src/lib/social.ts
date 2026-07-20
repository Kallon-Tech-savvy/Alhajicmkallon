/**
 * Single source of truth for social/contact links.
 *
 * Previously Navbar.tsx and Footer.tsx each hardcoded their own copy of
 * this list, and they'd drifted apart — the mobile nav pointed at
 * github.com/alhajikallon (wrong) while the footer correctly pointed at
 * github.com/Kallon-Tech-savvy. Import from here instead of hardcoding
 * hrefs in a component, so there's exactly one place to fix a link.
 *
 * TODO: 'twitter' has no real handle yet (currently bare x.com). Swap in
 * the real profile URL, e.g. https://x.com/yourhandle, or remove the
 * entry until there is one — a link to the bare homepage reads as broken.
 */
export const SOCIAL_LINKS = [
  { name: 'facebook', href: 'https://www.facebook.com/profile.php?id=100072626448471' },
  { name: 'twitter', href: 'https://x.com/' },
  { name: 'linkedin', href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b' },
  { name: 'github', href: 'https://github.com/Kallon-Tech-savvy' },
  { name: 'mail', href: 'mailto:hello@alhajikallon.dev' },
] as const;

export type SocialLinkName = (typeof SOCIAL_LINKS)[number]['name'];

export function getSocialHref(name: SocialLinkName): string {
  return SOCIAL_LINKS.find((s) => s.name === name)?.href ?? '#';
}

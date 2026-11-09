export const THEME_KEY = 'portfolio-theme';
export function resolveTheme(preference, darkSystem) {
  return preference === 'dark' || (preference !== 'light' && darkSystem) ? 'dark' : 'light';
}
// Runs before paint; storage may be unavailable in privacy-restricted browsers.
export const THEME_BOOTSTRAP = `(()=>{let p='system';try{p=localStorage.getItem('${THEME_KEY}')||'system'}catch{}document.documentElement.dataset.theme=(p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))?'dark':'light'})()`;

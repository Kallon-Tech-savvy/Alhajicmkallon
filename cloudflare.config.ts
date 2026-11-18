import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "alhajicmkallon",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-17",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      RESEND_API_KEY: bindings.secret(),
      TURNSTILE_SECRET: bindings.secret(),
      CONTACT_TO_EMAIL: bindings.secret(),
      CHAT_CLIENT_IP_HEADER: bindings.text("cf-connecting-ip"),
      NEXT_PUBLIC_SITE_URL: bindings.text("https://alhajikallon.com"),
    },
  }),
});

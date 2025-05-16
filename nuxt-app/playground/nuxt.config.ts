export default defineNuxtConfig({
  modules: [
    "../src/module",
    "@nuxt/ui",
    "@vueuse/nuxt",
  ],
  myModule: {},
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
});
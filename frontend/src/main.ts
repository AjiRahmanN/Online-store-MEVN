import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { authentication } from "./plugins/authentication";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
authentication.install().then(() => {
  app.use(router);
  app.mount("#app");
});

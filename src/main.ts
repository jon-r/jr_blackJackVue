import { createPinia } from "pinia";
import { createApp } from "vue";

import "~/styles/reset.css";
import "~/styles/typeography.css";
import "~/styles/vars.css";

import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");

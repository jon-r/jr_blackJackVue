import { createPinia } from "pinia";
import { createApp } from "vue";

import "~/styles/styles.css";

import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");

import { createPinia } from "pinia";
import { createApp } from "vue";

import "~/styles/styles.css";

import App from "./components/App.vue";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");

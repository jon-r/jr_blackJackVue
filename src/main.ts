import { createPinia } from "pinia";
import { createApp } from "vue";

// prettier-ignore -> keep reset first
import "~/styles/reset.css";
import "~/styles/util.css";
import "~/styles/typography.css";
import "~/styles/vars.css";

import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");

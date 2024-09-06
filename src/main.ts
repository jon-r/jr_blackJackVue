import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "~/components/App.vue";
import "~/styles/styles.css";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");

import { createPinia } from "pinia";
import { createApp } from "vue";

import "~/styles/styles.css";

// @ts-expect-error -> not sure why it doesnt like this. Importing a .vue file?
import App from "./components/App.vue";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");

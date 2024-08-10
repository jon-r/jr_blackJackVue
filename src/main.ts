import { createApp } from "vue";

import App from "./app.ts";
import "./assets/style.css";
import store from "./store/store.ts";

const app = createApp(App);

app.use(store);

app.mount("#app");

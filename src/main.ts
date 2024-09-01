import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import "./assets/style.css";

// import store, { storeKey } from "./store/store.ts";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
// app.use(store, storeKey);

app.mount("#app");

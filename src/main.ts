import { createApp } from 'vue'
import './assets/style.css'
import App from './app.ts'
import store from "./store/store.ts";

const app = createApp(App)

app.use(store);

app.mount('#app');

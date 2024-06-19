import { createApp } from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import router from "./router/router.js";

import VueDatePicker from '@vuepic/vue-datepicker';

//掛載 fontawesome
import FontAwesomeIcon from'@/plugins/fontawesome.js'
//

//掛載 google-login
import vue3GoogleLogin from 'vue3-google-login'
//

//掛載  element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//
import axios from 'axios';

import Cookies from 'js-cookie';




const app = createApp(App);


app.component("VueDatePicker", VueDatePicker)
app.component("font-awesome-icon",FontAwesomeIcon)
//google
app.use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENTID
  })
//

//element
app.use(ElementPlus)
//
app.use(Buefy);
app.use(router);
app.mount("#app");


// axios.interceptors.request.use(function(config){
//   if(localStorage.getItem('token')!=null){
//     config.headers.common['Authorization']=localStorage.getItem('token');
//   }
//   return config
// },function(error){console.log('失敗訊息'+error)});


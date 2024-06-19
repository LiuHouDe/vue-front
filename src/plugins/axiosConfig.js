import axios from "axios";
import router from '../router/router.js'
import Swal from 'sweetalert2'

const axios1 = axios.create({
  baseURL: import.meta.env.VITE_END_URL,
})
axios1.interceptors.request.use(function (config) {
  if (localStorage.getItem('token') != null) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  }
  return config;
}, function (error) { console.log('失敗訊息' + error) });

axios1.interceptors.response.use(function (config) {
  return config;
}, function (error) {
  if (sessionStorage.getItem("logout") == 'true') {
    sessionStorage.clear();
    localStorage.clear();
    router.push({ name: "user-login-link" });
    return;
  }
  if (error.response.data.status == 403) {
    console.log(error.response.data.status, 777777)
    Swal.fire({
      position: "top",
      title: "請重新登入！",
      icon: "success",
      confirmButtonText: "確認！",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        localStorage.clear();
        router.push({ name: "user-login-link" });

      }
    });
  }
  if (error.response.data.status == 400) {
    Swal.fire({
      position: "top",
      title: error.response.data.message,
      icon: "error",
      confirmButtonText: "確認！",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: "order-ticket" });
      }
    });
  }
  if (error.response.data.status == 901) {
    Swal.close();
    Swal.fire({
      position: "top",
      title: error.response.data.message,
      icon: "error",
      confirmButtonText: "確認！",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: "order-findOrder" });
      }
    });
  }
});

export default axios1 

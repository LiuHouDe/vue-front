<template>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <form class="login100-form validate-form">
          <span class="login100-form-title p-b-26"> Log in to continue </span>
          <span class="login100-form-title p-b-48">
            <i class="zmdi zmdi-font"></i>
          </span>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="username" placeholder="請輸入信箱" v-model="username" />
          </div>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="password" name="userpassword" placeholder="請輸入密碼" v-model="userpassword" />
          </div>
          <el-button class="forgetPasswordButton" plain @click="open">忘記密碼</el-button>
          <div class="container-login100-form-btn">
            <div class="wrap-login100-form-btn">
              <div class="login100-form-bgbtn"></div>
              <button class="login100-form-btn" @click="login" type="button">
                Login
              </button>
            </div>
          </div>

          <div class="googlebutton text-center">
            <span>或是透過第三方登入</span>
            <!-- google登入-->
            <GoogleLogin :callback="callback" />
            <!--  -->
          </div>

          <div class="text-center p-t-115">
            <span class="txt1"> 沒有帳號? </span>

            <RouterLink :to="{ name: 'user-register-link' }">點擊註冊</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import axiosapi from "@/plugins/axiosConfig.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Cookies from "js-cookie"; //new

//透過Prop 跟 Inject 控制顯示//

//
const router = useRouter();

const username = ref("");
const userpassword = ref("");


const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const relode = inject('relode')


onMounted(() => {
  relode()
})


function login() {
  let data = {
    username: username.value,
    password: userpassword.value,
  };
  if (username.value === "" || userpassword.value === "") {
    Toast.fire({
      icon: "error",
      title: "請輸入帳號與密碼    ",
    });
    return;
  }

  axiosapi
    .post("/user/pass/login", data)
    .then((response) => {
      if (response.data.success) {
        axiosapi.defaults.headers.authorization =
          "Bearer " + response.data.token;
        sessionStorage.setItem("token", response.data.token);
        // Cookies.set("token",response.data.token,{expires: new Date(new Date().getTime()+(100*60*1000))}); //new
        localStorage.setItem("token", response.data.token);
        //執行navbar刷新
        router.push({ name: "user-profile-link" });
      } else {
        Toast.fire({
          icon: "error",
          title: response.data.message,
        });
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//google登入 於ENV設定 CLIENTID
const callback = (response) => {
  let data = {
    credential: response.credential,
  };
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  axiosapi
    .post(`/user/pass/login/google`, data)
    .then((response) => {
      if (response.data.success) {
        axiosapi.defaults.headers.authorization =
          "Bearer " + response.data.token;
        sessionStorage.setItem("token", response.data.token); //JWTtoken
        localStorage.setItem("token", response.data.token);
        ElMessage({
          type: "success",
          message: response.data.message,
        });
        router.push({ path: "/user/profile" });
      } else {
        Toast.fire({
          icon: "error",
          title: response.data.message,
        });
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};
//

//忘記密碼
import { ElMessage, ElMessageBox } from "element-plus";

const open = () => {
  ElMessageBox.prompt("請輸入您的Email", "忘記密碼", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    inputPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    inputErrorMessage: "請輸入正確email",
  })
    .then(({ value }) => {
      axiosapi
        .get(`/user/pass/sendForgetPasswordEmail/${value}`)
        .then((response) => {
          if (response.status == 200) {
            ElMessage({
              type: "success",
              message: "請透過Email接收重置密碼郵件",
            });
          }
        })
        .catch((error) => {
          ElMessage({
            type: "error",
            message: "查無Eamil，請檢查Email是否正確",
          });
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消",
      });
    });
};
//
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

.forgetPasswordButton {
  margin-inline-start: 70%;
}

.googlebutton {
  margin-top: 30px;
}

body,
html {
  height: 100%;
  font-family: Poppins-Regular, sans-serif;
}

a {
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

a:focus {
  outline: none !important;
}

a:hover {
  text-decoration: none;
  color: #6a7dfe;
  color: -webkit-linear-gradient(left, #21d4fd, #b721ff);
  color: -o-linear-gradient(left, #21d4fd, #b721ff);
  color: -moz-linear-gradient(left, #21d4fd, #b721ff);
  color: linear-gradient(left, #21d4fd, #b721ff);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0px;
}

p {
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
}

ul,
li {
  margin: 0px;
  list-style-type: none;
}

input {
  outline: none;
  border: none;
}

textarea {
  outline: none;
  border: none;
}

textarea:focus,
input:focus {
  border-color: transparent !important;
}

input:focus::-webkit-input-placeholder {
  color: transparent;
}

input:focus:-moz-placeholder {
  color: transparent;
}

input:focus::-moz-placeholder {
  color: transparent;
}

input:focus:-ms-input-placeholder {
  color: transparent;
}

textarea:focus::-webkit-input-placeholder {
  color: transparent;
}

textarea:focus:-moz-placeholder {
  color: transparent;
}

textarea:focus::-moz-placeholder {
  color: transparent;
}

textarea:focus:-ms-input-placeholder {
  color: transparent;
}

input::-webkit-input-placeholder {
  color: #adadad;
}

input:-moz-placeholder {
  color: #adadad;
}

input::-moz-placeholder {
  color: #adadad;
}

input:-ms-input-placeholder {
  color: #adadad;
}

textarea::-webkit-input-placeholder {
  color: #adadad;
}

textarea:-moz-placeholder {
  color: #adadad;
}

textarea::-moz-placeholder {
  color: #adadad;
}

textarea:-ms-input-placeholder {
  color: #adadad;
}

button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}

iframe {
  border: none !important;
}

.txt1 {
  font-family: Poppins-Regular;
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
}

.txt2 {
  font-family: Poppins-Regular;
  font-size: 13px;
  color: #333333;
  line-height: 1.5;
}

.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #272727;
}

.wrap-login100 {
  width: 390px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 77px 55px 33px 55px;

  box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
}

.login100-form {
  width: 100%;
}

.login100-form-title {
  display: block;
  font-family: Poppins-Bold;
  font-size: 30px;
  line-height: 1.2;
  text-align: center;
  color: grey;
}

.login100-form-title i {
  font-size: 60px;
}

.wrap-input100 {
  width: 100%;
  position: relative;
  border-bottom: 2px solid #adadad;
  margin-bottom: 15px;
}

.input100 {
  font-family: Poppins-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;

  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px;
}

.focus-input100 {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.focus-input100::before {
  content: "";
  display: block;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;

  background: #6a7dfe;
  background: -webkit-linear-gradient(left, #21d4fd, #b721ff);
  background: -o-linear-gradient(left, #21d4fd, #b721ff);
  background: -moz-linear-gradient(left, #21d4fd, #b721ff);
  background: linear-gradient(left, #21d4fd, #b721ff);
}

.focus-input100::after {
  font-family: Poppins-Regular;
  font-size: 15px;
  color: #999999;
  line-height: 1.2;

  content: attr(data-placeholder);
  display: block;
  width: 100%;
  position: absolute;
  top: 16px;
  left: 0px;
  padding-left: 5px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.input100:focus+.focus-input100::after {
  top: -15px;
}

.input100:focus+.focus-input100::before {
  width: 100%;
}

.has-val.input100+.focus-input100::after {
  top: -15px;
}

.has-val.input100+.focus-input100::before {
  width: 100%;
}

.btn-show-pass {
  font-size: 15px;
  color: #999999;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  padding-right: 5px;
  cursor: pointer;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.btn-show-pass:hover {
  color: #6a7dfe;
  color: -webkit-linear-gradient(left, #21d4fd, #b721ff);
  color: -o-linear-gradient(left, #21d4fd, #b721ff);
  color: -moz-linear-gradient(left, #21d4fd, #b721ff);
  color: linear-gradient(left, #21d4fd, #b721ff);
}

.btn-show-pass.active {
  color: #6a7dfe;
  color: -webkit-linear-gradient(left, #21d4fd, #b721ff);
  color: -o-linear-gradient(left, #21d4fd, #b721ff);
  color: -moz-linear-gradient(left, #21d4fd, #b721ff);
  color: linear-gradient(left, #21d4fd, #b721ff);
}

.container-login100-form-btn {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 13px;
}

.wrap-login100-form-btn {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
  border-radius: 25px;
  overflow: hidden;
  margin: 0 auto;
}

.login100-form-bgbtn {
  position: absolute;
  z-index: -1;
  width: 300%;
  height: 100%;
  background: #a64bf4;
  background: -webkit-linear-gradient(right,
      #21d4fd,
      #b721ff,
      #21d4fd,
      #b721ff);
  background: -o-linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  background: -moz-linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  background: linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  top: 0;
  left: -100%;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login100-form-btn {
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #fff;
  line-height: 1.2;
  text-transform: uppercase;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 50px;
}

.wrap-login100-form-btn:hover .login100-form-bgbtn {
  left: 0;
}

/*[ PADDING ]
///////////////////////////////////////////////////////////
*/

.p-t-115 {
  padding-top: 75px;
}

.p-b-26 {
  padding-bottom: 26px;
}

.p-b-48 {
  padding-bottom: 48px;
}
</style>

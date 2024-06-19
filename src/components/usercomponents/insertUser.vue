<template>
  <div class="limiter">
    <form class="container rounded-3">
      <div class="col-6 text-vieshow title-element mx-auto">
        <h2 class="fs-2">填寫會員資料</h2>
      </div>
      <div class="form-group">
        <div class="col-6 mx-auto">
          <label class="form-label fs-5">會員姓名</label>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="EX:王" aria-label="First name" maxlength="10"
              v-model="userFirstname" @blur="checkName" />
            <input type="text" class="form-control" placeholder="EX:小名" aria-label="Last name" maxlength="10"
              v-model="userLastname" @blur="checkName" />
          </div>
          <span v-if="nameErrorMsg" class="error">{{ nameErrorMsg }}</span>
        </div>
      </div>

      <div class=" form-group">
        <div class="col-6 mx-auto">
          <label for="inputPassword " class="form-label fs-5">會員密碼</label>
          <input type="password" class="form-control" id="inputPassword" placeholder="請輸入密碼" @blur="checkPasswor"
            v-model="password" autocomplete="off" />
          <span v-if="passwordErrorMessage" class="error">{{
            passwordErrorMessage
          }}</span>
        </div>
      </div>

      <div class="form-group">
        <div class="col-6 mx-auto">
          <label for="inputEmail" class="form-label fs-5">會員Email</label>
          <input type="email" class="form-control" id="inputEmail" placeholder="請輸入Email" @blur="checkEmail"
            name="email" v-model="email" />
          <span v-if="emailErrorMessage" class="error">{{
            emailErrorMessage
          }}</span>
        </div>
      </div>

      <div class="form-group">
        <div class="col-6 mx-auto">
          <label for="inputPhone" class="form-label fs-5">會員手機號</label>
          <input type="text" class="form-control" id="inputPhone" placeholder="請輸入手機號 Ex:0900000000" maxlength="10"
            v-model="phone" @blur="checkedPhone" />
          <span v-if="phoneErrorMsg" class="error">{{ phoneErrorMsg }}</span>
        </div>
      </div>

      <div class="form-group">
        <div class="col-6 mx-auto">
          <label for="inputPhone" class="form-label fs-5  ">性別</label>
          <div class="col-3 form-label">
            <input type="radio" id="inputGenderM" value="M" v-model="gender" />
            <label for="inputGenderM">先生</label>
          </div>
          <div class="col-3 form-label">
            <input type="radio" id="inputGenderF" value="F" v-model="gender" />
            <label for="inputGenderF">女士</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-6 mx-auto">
          <label for="inputBirth" class="form-label fs-5">會員生日</label>
          <!-- Single-picker选择单个日期、model-type指定日期格式、auto-apply选择日期后，自动应用该日期、:enable-time-picker 只能选择日期不能選時間 -->
          <VueDatePicker id="inputBirth" v-model="birth" Single-picker model-type="yyyy-MM-dd" auto-apply
            :enable-time-picker="false" :max-date="new Date()" />
        </div>
      </div>



      <div class="form-group">
        <el-row :gutter="20">
          <el-col :span="3" :offset="6">
            <button type="button" class="btn btn-secondary" @click="cleanProfile">清除</button>
          </el-col>
          <el-col :span="3">
            <button type="button" class="btn btn-primary" @click="resign">註冊</button>
          </el-col>
          <el-col :span="3">
            <button type="button" class="btn btn-primary" @click="testResign">一鍵帶入</button>
          </el-col>

        </el-row>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axiosApi from "@/plugins/axiosConfig.js";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRouter } from "vue-router";

const userFirstname = ref("");
const userLastname = ref("");
const password = ref("");
const email = ref("");
const phone = ref("");
// 将 Date 对象转换为 ISO 8601 格式的字符串 ,如"2024-05-06T12:34:56.789Z",透過split分割[T],取第一個元素,就是日期部分
const birth = ref(new Date().toISOString().split("T")[0]);
const gender = ref("M");
const image = ref("");
const router = useRouter();

const nameErrorMsg = ref(null);
const emailErrorMessage = ref(null);
const phoneErrorMsg = ref(null);
const passwordErrorMessage = ref(null)

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

function resign() {
  checkName();
  checkEmail();
  checkedPhone();
  checkPasswor();

  if (
    nameErrorMsg.value != null ||
    emailErrorMessage.value != null ||
    phoneErrorMsg.value != null
    || passwordErrorMessage.value != null
  ) {
    Toast.fire({
      icon: "error",
      title: "資料有誤",
    });
    return;
  }
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  let data = {
    userFirstname: userFirstname.value,
    userLastname: userLastname.value,
    password: password.value,
    email: email.value,
    phone: phone.value,
    birth: birth.value,
    gender: gender.value,
    image: image.value,
  };
  axiosApi
    .post("/user/pass/register", data)
    .then((response) => {
      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        }).then(function (result) {
          if (result.isConfirmed) {
            router.push({ name: "user-login-link" });
          }
        });
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
          allowOutsideClick: false,
        });
        console.log(response.data);
        setTimeout(function () {
          Swal.close();
        }, 1500);
      }
    })
    .catch(function (error) {
      Swal.fire({
        text: "失敗訊息:" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}

function checkPasswor() {
  passwordErrorMessage.value = null;
  if (password.value === "") {
    passwordErrorMessage.value = "密碼不得為空";
    return
  }
}




function checkEmail() {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  emailErrorMessage.value = null;
  if (!pattern.test(email.value)) {
    emailErrorMessage.value = "Email格式不符合";
    return;
  }
  axiosApi
    .get("/user/pass/check/email", { params: { email: email.value } })
    .then((response) => {
      if (!response.data.success) {
        emailErrorMessage.value = response.data.message;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function checkName() {
  nameErrorMsg.value = null;
  if (userFirstname.value === "" || userLastname.value === "") {
    nameErrorMsg.value = "姓名不得為空";
    return;
  }
  // let pattern = /^[\u4E00-\u9FFF]{0,}$/;
  // let firstnameResult = pattern.test(userFirstname.value);
  // let lasttnameResult = pattern.test(userLastname.value);
  // if (!firstnameResult || !lasttnameResult) {
  //   nameErrorMsg.value = "姓名須為中文";
  //   return;
  // }
}

function checkedPhone() {
  phoneErrorMsg.value = null;
  let pattern = /^[0-9]{10}$/;
  if (!pattern.test(phone.value)) {
    phoneErrorMsg.value = "手機號不合規";
    return;
  }
  axiosApi
    .get("/user/pass/check/phone", { params: { phone: phone.value } })
    .then((response) => {
      if (!response.data.success) {
        phoneErrorMsg.value = response.data.message;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function cleanProfile() {
  userFirstname.value = "";
  userLastname.value = "";
  password.value = "";
  email.value = "";
  phone.value = "";
  gender.value = "M";
  nameErrorMsg.value = null;
  phoneErrorMsg.value = null;
  emailErrorMessage.value = null;
  birth.value = new Date().toISOString().split("T")[0];
}

function testResign() {
  userFirstname.value = "王";
  userLastname.value = "大名";
  password.value = "123456";
  email.value = "hsuzake@gmail.com";
  phone.value = "0911111111";
  gender.value = "M";
}



</script>

<style scoped>
.limiter {
  width: 100%;
  min-height: 93vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #272727;
}

.text-vieshow {
  color: white;
}

.title-element {
  margin-top: 20px;
  margin-bottom: 10px;
}

.form-label {
  color: #F0F0F0;
}

.form-group {
  margin-bottom: 1rem;
}

.left {
  margin-right: 0;
}

.error {
  color: red;
}
</style>

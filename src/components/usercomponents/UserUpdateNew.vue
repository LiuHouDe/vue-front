<template>
  <div class="limiter">

    <el-row :span="24">

      <el-col :span="4">
        <UseRadvertise></UseRadvertise>
      </el-col>



      <!-- <el-col :span="2" class="userNavbar">
        <el-container>
          <el-aside width="100%">
            <UserNavbar></UserNavbar>
          </el-aside>
        </el-container>
      </el-col> -->

      <el-col :span="16">
        <form class="common-layout">
          <div class="col-6 text-vieshow title-element mx-auto">
            <h2 class="fs-2 form-text">修改會員資料</h2>
          </div>
          <div class="form-group">
            <div class="col-6  mx-auto">
              <label class=" form-text fs-5">會員姓名</label>
              <div class="input-group">
                <input type="text" class="form-control" placeholder="EX:王" aria-label="First name" maxlength="10"
                  v-model="userFirstname" @blur="checkName">
                <input type="text" class="form-control" placeholder="EX:小名" aria-label="Last name" maxlength="10"
                  v-model="userLastname" @blur="checkName">
              </div>
              <span v-if="nameErrorMsg" class="error">{{ nameErrorMsg }}</span>
              <!-- <p class=" form-text">&#40;1.不可為空白2.必須全為中文&#41;</p> -->
            </div>
          </div>
          <div class="form-group">
            <div class="col-6 mx-auto">
              <label for="inputPhone" class="form-text fs-5">會員手機號</label>
              <input type="text" class="form-control" id="inputPhone" placeholder="請輸入手機號 Ex:0900000000" maxlength="10"
                v-model="phone" @blur="checkedPhone">
              <span v-if="phoneErrorMsg" class="error">{{ phoneErrorMsg }}</span>
            </div>
          </div>

          <div class="form-group">
            <div class="col-6 mx-auto">
              <label for="inputPhone" class="form-text fs-5">性別</label>
              <div class="col-3">
                <input type="radio" id="inputGenderM" value="M" v-model="gender">
                <label for="inputGenderM" class="form-text">先生</label>
              </div>
              <div class="col-3">
                <input type="radio" id="inputGenderF" value="F" v-model="gender">
                <label for="inputGenderF" class="form-text">女士</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="col-6 mx-auto">
              <label for="inputBirth" class="form-text fs-5">會員生日</label>
              <!-- Single-picker选择单个日期、model-type指定日期格式、auto-apply选择日期后，自动应用该日期、:enable-time-picker 只能选择日期不能選時間 -->
              <VueDatePicker id="inputBirth" v-model="birth" Single-picker model-type="yyyy-MM-dd" auto-apply
                :enable-time-picker="false" :max-date="new Date()" />
            </div>
          </div>



          <div class="form-group">
            <el-row :gutter="20">
              <el-col :span="3" :offset="6">
                <button type="button" class="btn btn-secondary" @click="cleanProfile">重置</button>
              </el-col>
              <el-col :span="3">
                <button type="button" class="btn btn-primary" @click="usermodify">送出</button>
              </el-col>
            </el-row>
          </div>
        </form>



      </el-col>
      <el-col :span="4">
        <UseRadvertise></UseRadvertise>
      </el-col>

    </el-row>


  </div>



</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axiosApi from "@/plugins/axiosConfig.js";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRouter } from "vue-router";

import UserNavbar from "./UserNavbar.vue";


import UseRadvertise from "./UseRadvertise.vue";



const userFirstname = ref(sessionStorage.getItem("userFirstname"));
const userLastname = ref(sessionStorage.getItem("userLastname"));
const phone = ref(sessionStorage.getItem("phone"));
const birth = ref(sessionStorage.getItem("birth"));
const gender = ref(sessionStorage.getItem("gender"));

const router = useRouter();

const nameErrorMsg = ref(null);
const phoneErrorMsg = ref(null);

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

function usermodify() {
  checkName();
  checkedPhone();

  if (nameErrorMsg.value != null || phoneErrorMsg.value != null) {
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
    phone: phone.value,
    birth: birth.value,
    gender: gender.value,
  };
  axiosApi
    .put(
      `user/check/changeUserProfile/${sessionStorage.getItem("token")}`,
      data
    )
    .then((response) => {
      Toast.fire({
        text: "更新成功,自動導回個人信息頁面",
        icon: "success",
      });
      router.push({ name: "user-profile-link" });
    })
    .catch(function (error) {
      Swal.fire({
        text: "失敗訊息:" + error.message + "請重新登入",
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
      router.push({ name: "user-login-link" });
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
}

function cleanProfile() {
  userFirstname.value = sessionStorage.getItem("userFirstname");
  userLastname.value = sessionStorage.getItem("userLastname");
  phone.value = sessionStorage.getItem("phone");
  birth.value = sessionStorage.getItem("birth");
  gender.value = sessionStorage.getItem("gender");

  nameErrorMsg.value = null;
  phoneErrorMsg.value = null;
}
</script>



<style scoped>
.limiter {
  width: 100%;
  min-height: 88vh;

  background: #272727;
}


.testborder {
  border: 15px;
  border-radius: 25px;
}

.text-vieshow {
  color: #2f96ee;
}

.title-element {
  margin-bottom: 10px;
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

.userNavbar {
  padding-top: 15%;
  background-color: white;
  border-radius: 35px;
}

.common-layout {
  margin-top: 10%;
}

.form-text {
  color: white;
}
</style>

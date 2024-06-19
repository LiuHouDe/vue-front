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
        <div class="common-layout container">
          <el-container>
            <form class="container rounded-3">
              <div class="col-6 text-vieshow title-element mx-auto">
                <h2 class="fs-2">修改密碼</h2>
              </div>

              <div class="form-group">
                <div class="col-6 mx-auto">
                  <label for="inputPassword" class="form-label fs-5">新密碼</label>
                  <input type="password" class="form-control" id="inputPassword" placeholder="請輸入密碼" v-model="password"
                    autocomplete="off">
                </div>
              </div>
              <div class="form-group">
                <div class="col-6 mx-auto">
                  <label for="checkPassword" class="form-label fs-5">請再次確認密碼</label>
                  <input type="password" class="form-control" id="checkPassword" placeholder="請輸入密碼"
                    v-model="checkPassword" autocomplete="off" @change="isPasswordSame">
                  <p v-if="passwordErrorMessage" class="error">{{ passwordErrorMessage }}</p>
                </div>
              </div>
              <div class="form-group">
                <el-row :gutter="20">
                  <el-col :span="3" :offset="6">
                    <button type="button" class="btn btn-secondary" @click="cleanInput">清空</button>
                  </el-col>
                  <el-col :span="3">
                    <button type="button" class="btn btn-primary" @click="changePasssword">送出</button>
                  </el-col>
                </el-row>
              </div>
            </form>
          </el-container>
        </div>
      </el-col>


      <el-col :span="4">
        <UseRadvertise></UseRadvertise>
      </el-col>

    </el-row>

  </div>


</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axiosapi from "@/plugins/axiosConfig.js";
import { ElMessage } from "element-plus";

// import UserNavbar from "./UserNavbar.vue";

import UseRadvertise from "./UseRadvertise.vue";



const password = ref('')
const checkPassword = ref('')
const passwordErrorMessage = ref('')


const route = useRoute();
const router = useRouter();

function isPasswordSame() {
  passwordErrorMessage.value = "";
  if (password.value !== checkPassword.value) {
    passwordErrorMessage.value = "上下密碼不相符";
  }
  if (password.value == "" || checkPassword.value == "") {
    passwordErrorMessage.value = "密碼不得為空";
  }
}
function cleanInput() {
  passwordErrorMessage.value = "";
  checkPassword.value = "";
  password.value = "";
}
function changePasssword() {
  isPasswordSame();
  if (passwordErrorMessage.value !== "") {
    return;
  }
  let data = {
    password: password.value,
  };
  axiosapi
    .put(`/user/pass/check/changePaaword/${sessionStorage.getItem("token")}`, data)
    .then((response) => {
      console.log(response.status);
      if (response.status == 200) {
        ElMessage({
          type: "success",
          message: "密碼修改成功，跳轉至個人信息頁面",
        });
        router.push({ name: "user-profile-link" });
      }
    })
    .catch((error) => {
      if (error.response.status == 404)
        ElMessage({
          type: "error",
          message: "Token已失效請重新登入",
        });
        localStorage.clear();
        sessionStorage.clear();
      router.push({ name: "user-login-link" });
    });
}
</script>

<style scoped>
.limiter {
  width: 100%;
  min-height: 88vh;
  background: #272727;
}

.fs-2 {
  margin-bottom: 30px;
}

.text-vieshow {
  color: white;
}

.error {
  color: red;
  margin-bottom: 15px;
}

button {
  margin-top: 10px;
}

.common-layout {
  margin-top: 10%;
  /* padding: 30px; */
  /* border-width: medium;
    border-style: solid; */
  /* border-radius: 15px */
}

/* .userNavbar {
  padding-top: 15%;
  background-color: white;
  border-radius: 35px;
} */

.form-label {
  color: white;
}
</style>

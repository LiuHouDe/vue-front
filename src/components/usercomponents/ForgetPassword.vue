<template>
  <div class="limiter">
    <form class="container rounded-3">
      <div class="col-6 text-vieshow title-element mx-auto">
        <h2 class="fs-2 form-label">密碼重置</h2>
      </div>

      <div class="form-group">
        <div class="col-6 mx-auto">
          <label for="inputPassword" class="form-label fs-5">新密碼</label>
          <input type="password" class="form-control" id="inputPassword" placeholder="請輸入密碼" v-model="password"
            autocomplete="off" />
        </div>
      </div>
      <div class="form-group">
        <div class="col-6 mx-auto">
          <label for="checkPassword" class="form-label fs-5 ">請再次確認密碼</label>
          <input type="password" class="form-control" id="checkPassword" placeholder="請輸入密碼" v-model="checkPassword"
            autocomplete="off" @change="isPasswordSame" />
          <p v-if="emailErrorMessage" class="error">{{ emailErrorMessage }}</p>
        </div>
      </div>
      <div class="form-group">
        <div class="row col-6 mx-auto">
          <div class="col-4 col-md-2">
            <button type="button" class="btn btn-secondary" @click="cleanInput">
              Clean
            </button>
          </div>
          <div class="col-7 col-md-3">
            <button type="button" class="btn btn-primary" @click="changePasssword">
              確認修改
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axiosapi from "@/plugins/axiosConfig.js";
import { ElMessage } from "element-plus";

const password = ref("");
const checkPassword = ref("");
const emailErrorMessage = ref("");

const route = useRoute();
const router = useRouter();

function isPasswordSame() {
  emailErrorMessage.value = "";
  if (password.value !== checkPassword.value) {
    emailErrorMessage.value = "上下密碼不相符";
  }
  if (password.value == "" || checkPassword.value == "") {
    emailErrorMessage.value = "密碼不得為空";
  }
}
function cleanInput() {
  emailErrorMessage.value = "";
  checkPassword.value = "";
  password.value = "";
}

function changePasssword() {
  isPasswordSame();
  if (emailErrorMessage.value !== "") {
    return;
  }
  let data = {
    password: password.value,
  };
  axiosapi
    .put(`/user/pass/check/changePaaword/${route.params.token}`, data)
    .then((response) => {
      console.log(response.status);
      if (response.status == 200) {
        ElMessage({
          type: "success",
          message: "密碼修改成功，跳轉至登入頁面",
        });
        router.push({ name: "user-login-link" });
      }
    })
    .catch((error) => {
      if (error.response.status == 404)
        ElMessage({
          type: "error",
          message: "Token已失效請重新索取密碼重製信",
        });
      router.push({ name: "user-login-link" });
    });
}
</script>

<style scoped>
.limiter {
  width: 100%;
  min-height: 85vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #272727;
}

.fs-2 {
  margin-bottom: 30px;
}

.error {
  color: red;
  margin-bottom: 15px;
}

button {
  margin-top: 10px;
}

.form-label {
  color: white;
}
</style>

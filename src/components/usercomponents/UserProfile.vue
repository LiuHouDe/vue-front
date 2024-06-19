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
        <div class="common-layout   ">
          <!-- <el-aside hight="100vh" width="200px" style="background-color: white;">
              <UserNavbar></UserNavbar>
            </el-aside> -->
          <el-container>
            <el-header class="container fs-2 elheader">個人信息頁面</el-header>
            <el-main>
              <div class="card " style="width: 400px;">
                <PhototestModal v-if="(downlodPhoto !== '')" :photoUrl="downlodPhoto" class="mx-auto">
                </PhototestModal>
                <span class="fs-6 mx-auto">點擊圖片即可上傳，圖片上傳需小於2MB</span>
                <div class="card-body">
                  <h1 class="card-title fs-3 text-center">{{ userinfo.userFirstname +
                    userinfo.userLastname }}
                  </h1>
                  <div class="row">
                    <font-awesome-icon icon="fa-solid fa-envelope" size="2xl" class="col-2" />
                    <el-tooltip placement="right" content="使用者信箱">
                      <span class="card-text col-8">{{ userinfo.email }}</span>
                    </el-tooltip>

                    <font-awesome-icon icon="phone" size="2xl" class="col-2" />
                    <el-tooltip placement="right" content="使用者手機號">
                      <span class="card-text col-8   ">{{ userinfo.phone }}</span>
                    </el-tooltip>
                    <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" size="2xl" class="col-2" />
                    <el-tooltip placement="right" content="使用者消費金額">
                      <p class="card-text col-8">{{ userinfo.consumption }}</p>
                    </el-tooltip>
                    <font-awesome-icon icon="fa-solid fa-gift" size="2xl" class="col-2" />
                    <el-tooltip placement="right" content="使用者等級">
                      <p class="card-text col-8  ">{{ userinfo.userlevel }}</p>
                    </el-tooltip>
                    <font-awesome-icon icon="fa-solid fa-cake-candles" size="2xl" class="col-2" />
                    <el-tooltip placement="right" content="生日">
                      <p class="card-text col-8  ">{{ userinfo.birth }}</p>
                    </el-tooltip>
                    <font-awesome-icon :icon="isverifiedIcon" :style="{ color: isverifiedIconColor }" class="col-2"
                      size="2xl" />
                    <el-tooltip placement="right" content="信箱是否已驗證">
                      <p class="card-text col-4 ">{{ userinfo.isverified ? "已驗證" : "未驗證" }}</p>
                    </el-tooltip>
                    <button type="button" v-if="!userinfo.isverified" @click="sendVerifyEmail"
                      class="btn btn-primary col-4">發送驗證信</button>
                  </div>
                </div>
              </div>
            </el-main>
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
import { ref, onMounted, inject } from "vue";
import axiosApi from "@/plugins/axiosConfig.js";
import PhototestModal from "./PhototestModal.vue";
import UserNavbar from "./UserNavbar.vue";
import { ElMessage } from "element-plus";
import Swal from "sweetalert2";

const isverifiedIcon = ref(["fas", "circle-exclamation"]);
const isverifiedIconColor = ref("#ff0000");



const userinfo = ref({})
const visable = ref(false)
const downlodPhoto = ref('')

const reload = inject("relode");





onMounted(function () {
  findUser();
});

function sendVerifyEmail() {
  axiosApi
    .get(`/user/pass/sendVeriftEmail/${sessionStorage.getItem("token")}`)
    .then((response) => {
      if (response.status == 200) {
        Swal.fire({
          text: "郵件發送成功，請透過Email進行驗證",
          icon: "success",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        });
      }
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: "登入失效，請重新登入",
      });
    });
}



function findUser() {
  let data = {
    token: sessionStorage.getItem("token"),
  };
  axiosApi
    .get("user/profile", { params: data })
    .then((response) => {

      userinfo.value = response.data;

      downlodPhoto.value =
        import.meta.env.VITE_END_URL +
        "/user/pass/finduserphoto/" +
        response.data.email;
      sessionStorage.setItem("id", response.data.id);
      sessionStorage.setItem("userFirstname", response.data.userFirstname);
      sessionStorage.setItem("userLastname", response.data.userLastname);
      sessionStorage.setItem("email", response.data.email);
      sessionStorage.setItem("phone", response.data.phone);
      sessionStorage.setItem("gender", response.data.gender);
      sessionStorage.setItem("birth", response.data.birth);
      sessionStorage.setItem("isverified", response.data.isverified);

      if (userinfo.value.isverified) {
        isverifiedIcon.value = ["fas", "check"];
        isverifiedIconColor.value = "#63E6BE";
      }
      visable.value = true;

      reload();
    })
    .catch(function (error) { console.log(error) });
}








import UseRadvertise from "./UseRadvertise.vue";












</script>

<style scoped>
.card {
  margin: auto;
}

.common-layout {
  margin-top: 30px;
  padding: 30px;
}

.elheader {
  color: white;
}

.fs-6 {
  font-size: 0.8rem !important;
}

.limiter {
  width: 100%;
  min-height: 88vh;
  /* display: flex; */
  /* flex-wrap: wrap; */
  background: #272727;
}

.footer-banner {
  margin-top: 0;
}

.userNavbar {
  padding-top: 15%;
  background-color: white;
  border-radius: 35px;
}
</style>

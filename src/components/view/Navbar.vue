<template>
  <div class="navbar">
    <div class="nav-logo">
      <img src="/SAO2.png "></img>
    </div>
    <div class="nav-items">
      <ul>
        <li>
          <RouterLink :to="{ name: 'index-link' }"> 首頁 </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'movie-link' }"> 電影列表 </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'order-ticket' }" style="color: white">購票／查詢場次</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'cinema-list-link' }">影城資訊</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'custService-link' }"> 客服中心 </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'user-profile-link' }">會員資料</RouterLink>
        </li>
        <li>
          <RouterLink class="food" to="/food">餐飲</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'order-findOrder' }" style="color: white">訂單查詢</RouterLink>
        </li>
        <!-- <li>
          <RouterLink class="food-order" to="/food/order">餐飲訂單</RouterLink>
        </li> -->
      </ul>
    </div>
    <div class="nav-buttons">
      <div v-if="!token" class="nav-button">
        <div class="anim-layer"></div>
        <RouterLink :to="{ name: 'user-login-link' }">Sign Up/Log in</RouterLink>
      </div>

      <div v-else>
        <el-row>
          <h5 class="phototext">{{ name }}</h5>
          <el-dropdown>
            <el-avatar :size="45" :src="downlodPhoto">
              <img src="/404UserPhoto.png" />
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>

                <el-dropdown-item @click="callLogOut" class="demo-dropdown fs-5">登出</el-dropdown-item>
                <el-dropdown-item @click="this.$router.push('/user/profile')"
                  class="demo-dropdown fs-6">會員資料</el-dropdown-item>
                <el-dropdown-item @click="this.$router.push('/user/change-password')"
                  class="demo-dropdown fs-6">修改密碼</el-dropdown-item>
                <el-dropdown-item @click="this.$router.push('/user/profile/update')"
                  class="demo-dropdown fs-6">修改會員資料</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-row>
      </div>

    </div>

    <div id="hamburger-menu" @click="openMobileMenu">&#9776;</div>
  </div>

  <div id="mobile-menu" :style="{ display: mobileMenuDisplay, transform: mobileMenuTransform }">
    <div class="mobile-nav-items">
      <ul>
        <li>
          <RouterLink :to="{ name: 'index-link' }"> 首頁 </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'movie-link' }"> 電影列表 </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'cinema-list-link' }">影城資訊</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'user-profile-link' }">會員資料</RouterLink>
        </li>
        <li><RouterLink :to="{ name: 'custService-link' }"> 客服中心 </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'order-ticket' }" style="color: white">購票／查詢場次</RouterLink>
        </li>
        <li>
          <RouterLink class="food-order" to="/food">餐飲</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'order-findOrder' }" style="color: white">訂單查詢</RouterLink>
        </li>
      </ul>
    </div>

    <div v-if="!token" class="mobile-nav-button">
      <div class="anim-layer"></div>
      <RouterLink :to="{ name: 'user-login-link' }">Sign Up/Log in</RouterLink>
    </div>
    <button v-else @click="callLogOut">登出</button>
    <div id="hamburger-cross" @click="closeMobileMenu">&#10006;</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuDisplay: "none",
      mobileMenuTransform: "translateX(-100%)",
      token: sessionStorage.getItem("token"),
      downlodPhoto: import.meta.env.VITE_END_URL + "/user/pass/finduserphoto/" + sessionStorage.getItem("email"),
      name: sessionStorage.getItem("userFirstname") + sessionStorage.getItem("userLastname"),
    };
  },
  inject: ['relode'],
  methods: {
    openMobileMenu() {
      /*打開表單 將Style 改為flex 一開始的版本未顯示的原因是因為在點擊事件後 v-show僅更換了display屬性導致該屬性的style變為空值 */
      this.mobileMenuDisplay = "flex";
      setTimeout(() => {
        this.mobileMenuTransform = "translateX(0%)";
      }, 50);
    },
    closeMobileMenu() {
      this.mobileMenuTransform = "translateX(-100%)";
      setTimeout(() => {
        this.mobileMenuDisplay = "none";
      }, 300);
    },
    checkScreenWidth() {
      if (window.innerWidth > 770) {
        this.mobileMenuDisplay = "none";
      }
    },
    callLogOut() {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem("logout", true)
      this.relode();
      this.$router.push('/')
    },
  },




  mounted() {
    /*監聽事件*/
    window.addEventListener("resize", this.checkScreenWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
};
</script>
<style scoped>
body {
  padding: 0px;
  margin: 0px;
}

.phototext {
  color: white;
  margin-top: 13px;
  margin-right: 10px
}

.navbar {
  position: relative;
  display: flex;
  padding: 10px;
  background-color: #141214;
  justify-content: space-around;
  align-items: center;
  box-shadow: 7px 5px 15px -4px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 7px 5px 15px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 5px 15px -4px rgba(0, 0, 0, 0.75);
}

.nav-items>ul>li {
  /*控制class nav-item中的li元素樣式*/
  position: relative;
  display: inline;
  list-style: none;
  margin: 10px;
  padding: 10px 20px;
  cursor: pointer;
}

.nav-items>ul>li>a {
  color: white;
  text-decoration: none;
}

.nav-items>ul>li::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 0.17rem;
  background-color: #c52726;
  left: 0;
  bottom: 0;
  transform-origin: 0% 100%;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-items>ul>li:hover::after {
  transform: scaleX(1);
}

.nav-logo a,
.nav-button a {
  color: white;
  list-style: none;
  text-decoration: none;
  display: flex;
}

.nav-logo {
  font-size: 32px;
}

.nav-button {
  background-color: #c52726;
  border-radius: 50px;
  position: relative;
  display: inline-block;
  overflow: hidden;
  cursor: pointer;
  margin-left: 0.5px;
}

.nav-buttons {
  gap: 1;
}

.anim-layer {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 100%;
  background-color: white;
  transition: width 0.3s ease, left 0.3s ease;
}

.nav-button:hover .anim-layer {
  width: 100%;
  left: 0;
}

.nav-button:hover a {
  color: #141214;
}

.nav-button a {
  display: block;
  padding: 10px 20px;
  color: white;
  text-decoration: none;
  position: relative;
  z-index: 1;
}

#hamburger-menu,
#mobile-menu {
  display: none;
}





@media only screen and (max-width: 770px) {
  #mobile-menu {
    /*手機板表單*/
    background-color: #c52726;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
    z-index: 999;
    /*顯示於最上層 */
  }

  .mobile-nav-items>ul {
    padding: 0px;
  }

  .mobile-nav-items>ul>li {
    text-align: center;
    position: relative;
    list-style: none;
    margin: 10px;
    padding: 10px 20px;
    cursor: pointer;
  }

  .mobile-nav-items>ul>li>a {
    color: white;
    text-decoration: none;
  }

  .mobile-nav-items>ul>li::after {
    /*手機板表單動態效果底部水平線*/
    content: "";
    position: absolute;
    width: 100%;
    height: 0.17rem;
    background-color: white;
    left: 0;
    bottom: 0;
    transform-origin: 0% 100%;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .mobile-nav-items>ul>li:hover::after {
    transform: scaleX(1);
  }

  .mobile-nav-button {
    background-color: #141214;
    border-radius: 50px;
    position: relative;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
  }

  .mobile-nav-button .anim-layer {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 100%;
    background-color: white;
    transition: width 0.3s ease, left 0.3s ease;
  }

  .mobile-nav-button:hover .anim-layer {
    width: 100%;
    left: 0;
  }

  .mobile-nav-button:hover a {
    color: #141214;
  }

  .mobile-nav-button a {
    display: block;
    padding: 10px 20px;
    color: white;
    text-decoration: none;
    position: relative;
    z-index: 1;
  }

  .nav-items>ul,
  .nav-button {
    display: none;
  }

  #hamburger-cross {
    display: block;
    color: white;
    cursor: pointer;
    font-size: 40px;
    position: absolute;
    top: 20px;
    right: 26px;
  }

  #hamburger-menu {
    display: block;
    color: white;
    cursor: pointer;
    font-size: 24px;
  }
}
</style>

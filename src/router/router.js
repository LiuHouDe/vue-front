import {
  createRouter,
  createWebHistory,
} from "vue-router";

import MovieD from "../components/Page/MovieD.vue";
import userRouters from "./user-routers";
import index from "@/components/Page/index.vue";
import NotFound from "@/views/NotFound.vue";
import Comment from "@/components/Page/Comment.vue";
import MovieList from "@/components/Page/MovieList.vue";
import backComment from "@/components/view/backComment.vue";
import orderRouters from "./order-routers";
import cinemaRouters from "./cinema-router.js";
import { ElMessage } from "element-plus";
import routerCustService from "@/components/view/CustomerService/csrouter.js";

import FoodOrderPage from "@/views/FoodOrderPage.vue";
// import FoodOrderFinish from "@/components/view/FoodOrderFinish.vue"
// import FoodBackstage from "@/views/FoodBackstage.vue";

const routes = [
  {
    name: "MovieD-link",
    path: "/MovieD",
    component: MovieD,
  },
  {
    name: "comment-link",
    path: "/comment",
    component: Comment,
  },
  {
    name: "backcomment-link",
    path: "/backcomment",
    component: backComment,
  },
  {
    name: "movie-link",
    path: "/movielist",
    component: MovieList,
  },
  {
    name: "index-link",
    path: "/",
    component: index,
  },
  { path: "/:pathMatch(.*)*", name: "notfound-link", component: NotFound },

  ...userRouters,
  ...orderRouters,
  ...cinemaRouters,
  ...routerCustService,
  { name: "food-order-page-link", path: "/food", component: FoodOrderPage },
  // { name: "food-order-finish-link",path: "/food/order",component: FoodOrderFinish},
  // { name: "backstage-food-link", path: "/backstage/food", component: FoodBackstage },
];
const router = createRouter({
  routes,
  history: createWebHistory(),
});

//導航攔截器
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem("token");
  const isverified = sessionStorage.getItem("isverified");

  if (
    (to.path.includes("/user") || to.path.match("/order/findOrder") || to.path.match("/order/booking")) &&
    !isAuthenticated
  ) {
    ElMessage({
      message: "請先登入",
      type: "error",
    });
    next({ name: "user-login-link" });
  }
  else if ((to.path.match("/order/findOrder") || to.path.match("/order/booking") || to.path.match("/custService")) &&
    (!isverified || isverified == "false")) {
    ElMessage({
      message: "請先驗證email",
      type: "warning",
    });
    next({ name: "user-profile-link" });
  } else if (to.path.includes("/comment") && !isAuthenticated) {
    next({ name: "user-login-link" });
  }
  else {
    next();
  }
});

export default router;

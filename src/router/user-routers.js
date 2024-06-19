import insertUser from "@/components/usercomponents/insertUser.vue";
import LoginUser from "@/components/usercomponents/LoginUser.vue";
import UserProfile from "@/components/usercomponents/UserProfile.vue";

import VerifyEmail from "@/components/usercomponents/VerifyEmail.vue";
import UserUpdateNew from "@/components/usercomponents/UserUpdateNew.vue";
import ForgetPassword from "@/components/usercomponents/ForgetPassword.vue";
import PhototestModal from "@/components/usercomponents/PhototestModal.vue";
import ChangePassword from "@/components/usercomponents/ChangePassword.vue";

export default [
  { name: "user-register-link", path: "/register", component: insertUser },
  { name: "user-login-link", path: "/login", component: LoginUser },
  { name: "user-profile-link", path: "/user/profile", component: UserProfile },
  {
    name: "verify-email-link",
    path: "/verify-email/:token",
    component: VerifyEmail,
  },
  {
    name: "user-update-new-link",
    path: "/user/profile/update",
    component: UserUpdateNew,
  },
  {
    name: "user-reset-password-link",
    path: "/reset-password/:token",
    component: ForgetPassword,
  },
  {
    name: "user-change-password-link",
    path: "/user/change-password",
    component: ChangePassword,
  },
  {
    name: "PhototestModal-link",
    path: "/user/PhototestModal",
    component: PhototestModal,
  },
];

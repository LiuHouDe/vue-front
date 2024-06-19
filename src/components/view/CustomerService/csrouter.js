//引入SFC元件
import custService from "./cs.vue";
import csreply from "./csreply.vue";

//設定路由網址
export default [
    { name: "custService-link", path: "/custService", component: custService },
    { name: "csreply-link", path: "/csreply", component: csreply },

]


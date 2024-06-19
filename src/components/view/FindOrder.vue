<template>
    <div class="div1 container">
        <div class="div2">
            <h2>訂單總覽</h2>
        </div>

        <table width="800px">
            <tr>
                <th>編號</th>
                <th>電影</th>
                <th>訂單總金額</th>
                <th>付款方式</th>
                <th>訂單創建日期</th>
                <th>訂單明細</th>
                <th>操作</th>
            </tr>
            <tr v-for="item in orders">
                <td>{{ item.no }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.order_amount }}</td>
                <td>{{ item.supplier }}</td>
                <td>{{ item.create_date }}</td>
                <td><button :value="item.order_id" @click="detail">詳情</button></td>
                <td v-if="item.order_status"><button :value="item.order_id" @click="refund">退款</button></td>
                <td v-else>已退款</td>
            </tr>
        </table>
    </div>
    <div class="div3"><v-pagination class="page" v-model="page" :pages="pages" :range-size="1" active-color="#DCEDFF"
            @update:modelValue="updateHandler" /></div>
</template>

<script setup>
    import axiosApi from '@/plugins/axiosConfig.js';
    import { ref,onBeforeMount } from "vue"
    import { useRouter,useRoute } from 'vue-router'
    import Swal from 'sweetalert2'
    
    const router = useRouter();
    const route = useRoute();
    let userId=sessionStorage.getItem("id"); //測試固定
    let page=ref(1); //預設
    let orders=ref('');
    let pages=ref();
    onBeforeMount(function(){
        if(route.query.previousFlag=='true'){
            page.value=parseInt(route.query.page);
        }
        axiosApi.get("/order/movie/getOrder?userId="+userId+"&page="+page.value).then(function(response){
        orders.value=response.data.orders;
        pages.value = response.data.pages;
    }).catch(function (response) {
        console.log(response);
    });
});

function detail(event) {
    router.push({ path: "/order/findOrderDetail", query: { orderId: event.target.value , page:page.value}});
};

import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

function updateHandler() {
    axiosApi.get("/order/movie/getOrder?userId=" + userId + "&page=" + page.value).then(function (response) {
        orders.value = response.data.orders;
    }).catch(function (response) {
        console.log(response);
    });
}

function refund(event) {
    Swal.fire({ position: "top", title: "退款處理中！", allowOutsideClick: false, showConfirmButton: false });
    axiosApi.get("/order/movie/deleteOrder?orderId=" + event.target.value).then(function (response) {
        if (response.data.success == true) {
            Swal.close();
            Swal.fire({
                position: "top",
                icon: "success",
                title: "退款成功！",
                confirmButtonText: "確認！",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.go(0);
                }
            })
        }

    }).catch(function (response) {
        console.log(response);
    });
}


</script>

<style scoped>
td {
    padding: 5px;
}

table {
    margin: 0 auto;
    margin-top: 50px;
}

table,
th,
td {
    border: 1px solid black;
    text-align: center;
}

.div1 {
    width: 900px;
    height: 600px;
    margin: 0 auto;
    margin-top: 100px;
}

.div2 {
    margin: 0 auto;
    text-align: center;
}

h2 {
    font-size: 30px;
    font-weight: bold;
}

.div3 {
    width: 900px;
    height: 300px;
    margin: 0 auto;
}

ul,
li {
    list-style: none;
    padding: 0;
}

ul {
    display: flex;
    justify-content: center;
}
</style>
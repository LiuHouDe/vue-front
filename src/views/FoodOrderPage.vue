<template>
  <!-- 商品圖以及數量調整&購物車按鈕 -->
  <div class="row">
    <FoodOrderPageCard v-for="oneFood in food" :key="oneFood.id" :menu=oneFood :quantities="[1, 2, 3, 4]"
    @add-to-cart="addToCart" v-model:num="oneFood.num" @update-buy-num="handleUpdate">
    </FoodOrderPageCard>
  </div>


  <!-- 分頁 -->
  <div class="col-2 page" v-show="total != 0">
    <Paginate :first-last-button="true" first-button-text="&lt;&lt;" last-button-text="&gt;&gt;" prev-text="&lt;"
      next-text="&gt;" :page-count="pages" :initial-page="current" v-model="current" :click-handler="callFind">
    </Paginate>
  </div>
  <br>
  <!-- 購物車清單 -->
  <div class="row">
    <Cart :buy="Number(selectedBuyNum)" :item=item :cartItems="cartItems">
  </Cart>
  <!-- <p>Selected number: {{ selectedBuyNum }}</p>
  <p>foodId number: {{ item.id }}</p> -->
  </div>
  


</template>

<script setup>
import Swal from 'sweetalert2';
import axiosapi from "../plugins/axiosConfig.js";
import Paginate from "vuejs-paginate-next";

import FoodOrderPageCard from "@/components/view/FoodOrderPageCard.vue";
import Cart from '@/components/foodcomponents/Cart.vue';
import { ref, onMounted } from "vue";

//FoodOrderPageCard
const oneFood = ref({});
const food = ref(null);
const findName = ref("");


//pagination start
const total = ref(0); //總資料筆數
const pages = ref(20); //分頁總數
const current = ref(1); //目前頁碼
const start = ref(0); //起始資料位置
const rows = ref(3); //分頁資料筆數
const lastPageRows = ref(0);
//pagination end



// //cart start
const cartItems = ref([]);
const buy = ref(0);
const item = ref({});
const selectedBuyNum = ref(null);
// //cart end

// checkout start

// checkout end

function handleUpdate(number) {
  
  selectedBuyNum.value = number;
  console.log("number", selectedBuyNum.value);
  
}


function addToCart(id) {
  console.log("addToCart start");
  console.log("id", id);
  
  
  Swal.fire({
        text: "確定選擇此項商品?",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
      }).then(function(){
        console.log("加入購物車");
        console.log("selectedBuyNum.value", selectedBuyNum.value);
        if(selectedBuyNum.value!=null){
          callFindById(id);
        }else{
          alert('請選擇數量');
        }
        
      });
  

}

function callFindById(id) {
  // Swal.fire({
  //   text: "Loading......",
  //   showConfirmButton: false,
  //   allowOutsideClick: false,
  // });
  // foodId.value = id;

// let data = {
//   food_id : foodId.value,
//   buy_number : selectedBuyNum.value
// }

  axiosapi
    .get(`/backstage/food/${id}`)
    .then(function (response) {
      console.log("response", response.data.list[0]);
      if (response.data.list.length != 0) {
        item.value = response.data.list[0];
        
        console.log("item.value", item.value);
      
        
          cartItems.value.push({ 
            item: item.value,
            buy: selectedBuyNum.value });
        
            

      }
      setTimeout(function () {
        Swal.close();
      }, 500);
    })
    .catch(function (error) {
      console.log("callFindById error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}

function callFind(page) {
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  console.log("page", current.value);
  if (page) {
    start.value = (page - 1) * rows.value;
    current.value = page;
  } else {
    start.value = 0;
    current.value = 1;
  }

  if (findName.value === "") {
    findName.value = null;
  }

  let data = {
    start: start.value,
    rows: rows.value,
    dir: false,
    order: "id",
    name: findName.value,
  };

  axiosapi
    .post("/backstage/food/find", data)
    .then(function (response) {
      console.log("data", data);
      console.log("counts", response.data.counts);
      console.log("response", response);
      console.log("start.value", start.value);
      console.log("rows.value", rows.value);
      food.value = response.data.list;

      //pagination start
      console.log("counts", response.data.counts);
      total.value = response.data.counts;
      console.log("total", total.value);

      pages.value = Math.ceil(response.data.counts / rows.value);
      lastPageRows.value = response.data.counts % rows.value;
      //pagination end

      setTimeout(function () {
        Swal.close();
      }, 500);
    })
    .catch(function (error) {
      console.log("callFind Error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}



// function checkOut(){
//   // Swal.fire({
//   //   text: "Loading......",
//   //   showConfirmButton: false,
//   //   allowOutsideClick: false,
//   // });
//   const injectdata = {
//   parentMessage: 'Hello from parent!',
//   anotherMessage: 'Another message from parent'
// }

// provide('injectdata', injectdata)

//   const data = {
//     user: user.value.id,
//     totalAmount: totalAmount.value
//   };
//   axiosapi.post('/foodorder', data).then(response => {
//       console.log('createFoodOrder', response);
//       alert('購買成功');




//       setTimeout(function () {
//         Swal.close();
//       }, 500);
    
//       router.push({ path:"/food/order"});

      
//     })
//     .catch(error => {
//       console.error('error:', error);
//     });
// }




onMounted(function () {
  callFind();
  
});

</script>

<style scoped>
.page{
  margin: 0 auto;
}
</style>
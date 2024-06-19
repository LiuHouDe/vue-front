<template>
<div class="container">
  <span class="username">{{ userinfo.userFirstname +
                    userinfo.userLastname }}用戶的購物車</span>
  <span class="usermail">{{ userinfo.email }}</span>
    <table class="table">
    <thead>
      <tr class="table-primary">
        <th scope="col">品項</th>
        <th scope="col">商品名稱</th>
        <th scope="col">商品單價</th>
        <th scope="col">商品數量</th>
        <th scope="col">商品總金額</th>
        <th scope="col">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(cartItem, index) in cartItems" :key="index">
        <th scope><img class="item_img" :src="`${path}${cartItem.item.id}`" :alt="cartItem.item.name"></th>
        <td><div class="item_name">{{cartItem.item.name}}</div></td>
        <td><div class="item_price">{{cartItem.item.price}}</div></td>
        <td><div class="item_buy">{{cartItem.buy}}</div></td>
        <td><div class="item_total">{{cartItem.item.price * cartItem.buy}}</div></td>
        <td><button type="button" class="btn btn-primary" @click="doclick(cartItem.item.id)">刪除</button></td>
      </tr>
      
    </tbody>
    <tfoot>
        <tr>
          <td colspan="4">總金額</td>
          <td>{{ totalAmount }}</td>
          <!-- <td><button type="button" class="checkout" @click="checkout">結帳</button></td> -->
          <td><button type="button" class="print" @click="printCart">列印購物車</button></td>
        </tr>
      </tfoot>
  </table>
  
</div>

</template>
    
<script setup>
import { ref, onMounted } from "vue";
import { computed} from 'vue';
import axiosapi from '@/plugins/axiosConfig';
// import Swal from 'sweetalert2';

const path = import.meta.env.VITE_FOODPICTURE_URL;
const userinfo = ref("");

const props = defineProps({
  buy: Number,
  item: Object,
  cartItems: {
    type: Array,
    default: () => []
  }
});

function doclick(id){
  console.log("deleteItem start");
  const index = props.cartItems.findIndex(cartItem => cartItem.item.id === id);
  if (index !== -1) {
    props.cartItems.splice(index, 1);
  }
}


const totalAmount = computed(() => {
  return props.cartItems.reduce((total, cartItem) => {
    return total + (cartItem.item.price * cartItem.buy);
  }, 0);
});



// const user = computed(() => store.state.user);
// import { useRoute,useRouter } from 'vue-router';
// const route=useRoute();
// const router=useRouter();

// function checkout(){
//   // Swal.fire({
//   //   text: "Loading......",
//   //   showConfirmButton: false,
//   //   allowOutsideClick: false,
//   // });
//   const data = {
//     // user: user.value.id,
//     user: response.data.email,
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





function findUser() {
  let data = {
    token: sessionStorage.getItem("token"),
  };
  axiosapi
    .get("user/profile", { params: data })
    .then((response) => {

      userinfo.value = response.data;

    })
    .catch(function (error) { 
      console.log(error) 

    });
}


onMounted(function () {
  findUser();
});





function printCart() {
  let printContent = `
    
  <span class="username">${userinfo.value.userFirstname + userinfo.value.userLastname} 用戶的購物車</span>
      <span class="usermail">${userinfo.value.email}</span>
          
  <table class="table">
        <thead>
          <tr class="table-primary">
            <th scope="col">品項</th>
            <th scope="col">商品名稱</th>
            <th scope="col">商品單價</th>
            <th scope="col">商品數量</th>
            <th scope="col">商品總金額</th>
          </tr>
        </thead>
        <tbody>
          ${props.cartItems.map(cartItem => `
            <tr>
              <th scope="row"><img class="item_img" src="${path}${cartItem.item.id}" alt="${cartItem.item.name}"></th>
              <td>${cartItem.item.name}</td>
              <td>${cartItem.item.price}</td>
              <td>${cartItem.buy}</td>
              <td>${cartItem.item.price * cartItem.buy}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">總金額</td>
            <td>${totalAmount.value}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  let printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>星爆影城餐飲</title>');
  printWindow.document.write(`
    <style>
      .print-container {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      .username {
        font-weight: bold;
        font-size: 1.2em;
      }
      .usermail {
        font-size: 1em;
        color: #555;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th, .table td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      .table-primary th {
        background-color: #f2f2f2;
      }
      .item_img {
        width: 10%;
      }
    </style>
  `);
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContent);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();

  
  router.push({ path: "/" });
}

</script>
    
<style scoped>
body{
    background-color: rgba(0, 0, 0,.2);
}
.container{
    border: 2px solid black;
}
h1{
    font-size: 2em;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
}
.item_img{
    width: 10%
}
tbody{
  border: 3px ;
}
.checkout{
    text-align: center;
    margin: 0 auto;
    border-radius: 5px;
}
.username{
  font-weight: bold;
  font-size: 1.2em;
  text-align: left;
  
}
.usermail{
  font-size: 1em;
  color: #555;
  text-align: right;
}
</style>
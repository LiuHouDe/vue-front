<template>
    <div class="col-lg-4 col-md-6">
    <div class="card">
      <img class="card-img-top" :src="`${path}${menu.id}`" :alt="menu.name" />
      <div class="card-body">
        <h5 class="card-title">{{ menu.name }}</h5>
        <div class="card-text text-end text-danger">NT$ {{ menu.price }}</div>
        <div class="row">

            <!-- 數量調整按鈕 -->
            <select @change="changeNum" class="form-select" aria-label="Default select example" >
                <option></option>
                <option v-for="buynum in quantities" :key="buynum" :value="buynum" >{{ buynum }}</option>    
            </select>

            <!-- 購物車按鈕 -->
          <div class="col text-end">
            <a href="#" class="btn btn-primary" @click="cartClick(menu.id)" :key="menu.id" :value="menu.id"
              >加入購物車</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>    
</template>
    
<script setup>
const path = import.meta.env.VITE_FOODPICTURE_URL;
const props = defineProps(["quantities","menu"]);
const emits = defineEmits(["addToCart","updateBuyNum"]);
function cartClick(id) {
  emits("addToCart", id);
}

function changeNum(event) {
  console.log("changeNum", event.target.value);
  emits('updateBuyNum', event.target.value);
}


</script>
    
<style scoped>
img {
  width: 200px;
  margin: 0 auto;
}
.card {
  width: 80%;
  margin: 5% auto;
  border-radius: 10px;
  box-shadow: 3px 3px 5px black;
}
.form-select{
    width:35%;
    margin-left: 20px;
}
</style>
    

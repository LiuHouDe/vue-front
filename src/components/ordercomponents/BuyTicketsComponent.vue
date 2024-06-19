<template>
  
          <div class="div1-0">
          影城：<select id="search_1" size="1" @change="dochange1" style="width:150px;">
            <option value="default_1">請選擇</option>
            <option v-for="item in cinema" :key="item" :value="item.cinema_id">{{item.name}}</option>
          </select>
          <br><br>
          電影：<select id="search_2" size="1" @change="dochange2" style="width:150px;">
            <option value="default_2">請選擇</option>
            <option v-for="item in movies" :key="item" :value="item.movie_id+'-'+item.cinema_id">{{item.name}}</option>
          </select>
          <br><br>
          日期：<select id="search_3" size="1" @change="dochange3" style="width:150px;">
            <option value="default_3">請選擇</option>
            <option v-for="item in movieDate" :key="item" :value="item.movie_id+'-'+item.cinema_id+'-'+item.Start_time">{{item.Start_time}}</option>
          </select>
          <br><br>
          場次：<select id="search_4" size="1" @change="dochange4" style="width:150px;">
            <option value="default_4">請選擇</option>
            <option v-for="item in movieTime" :key="item" :value="item.Screening_id">{{item.auditorium_number}}廳 {{item.Start_time}}</option>
          </select>
          <br>
            <button @click="buy" type="button" class="button1">購票</button>
            <button @click="search" type="button" class="button2">查詢座位表</button>
        </div>
  
</template>
  
<script setup>
  const props = defineProps(["cinema","movies","movieDate","movieTime","movieShowtimes"])
  const emits = defineEmits(["update:modelValue", "cinemaChange","movieChange","dateChange","showTimeChange","searchScreening","buyTicket"])
  function dochange1(event) {
      emits("cinemaChange",event.target.value);
  }
  function dochange2(event){
    emits("movieChange",event.target.value);
  }
  function dochange3(event){
    emits("dateChange",event.target.value);
  }
  function dochange4(event){
    emits("showTimeChange",event.target.value);
  }
  function search(){
    emits("searchScreening");
  }
  function buy(){
    emits("buyTicket");
  }
</script>
  
<style scoped>
.div1-0{
  float: right;
  /* margin:0 auto; */
  text-align: center;
  width: 400px;
  margin-top: 50px;
  margin-bottom:30px ;
  margin-left: 50px;
  /* margin-right: 150px; */
}
.button1{
  margin-top: 20px;
  width: 100px;
}
.button2{
  margin-top: 20px;
  width: 100px;
}
</style>
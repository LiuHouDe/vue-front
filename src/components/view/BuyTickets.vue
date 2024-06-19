<template>
    <div class="limiter">
    <el-row :span="24">
     <el-col :span="4">
        <UseRadvertise></UseRadvertise>
      </el-col>
    <el-col :span="16"> 
    <div class="div1">
    <showtimes :cinema="cinema" :movies="movies" :movieDate="movieDate" :movieTime="movieTime" :movieShowtimes="movieShowtimes" @cinema-change="dochange1" @movie-change="dochange2" @date-change="dochange3" @show-time-change="dochange4" @search-screening="doclick1" @buy-ticket="doclick2">
    </showtimes>
    <div>
    <h2 style="margin-bottom:15px;font-size: 40px;">線上訂票須知</h2>
    <h3 style="width: 900px;line-height:40px">１.我可以訂購多少張電影票?<br></h3>
    <ul  style="line-height:40px;">
            <li>● 每一筆交易最多可訂購 5 張票，但不限交易次數。</li>
    </ul>
    <h3 style="width: 900px;line-height:40px">２.我可以使用什麼付款方式?<br></h3> 
    <ul  style="line-height:40px;">
            <li>● 目前提供了LINEPAY、綠界、paypal金流付款。</li>
    </ul>
     <h3 style="width: 900px;line-height:40px">３.什麼是電影分級?<br></h3>    
        <ul  style="line-height:40px;">
            <li>● 普Ｇ 普遍級：一般觀眾皆可觀賞。</li>
            <li>● 護 P 保護級：未滿六歲之兒童不得觀賞，六歲以上十二歲未滿之兒童須父母、師長或成年親友陪伴輔導觀賞。</li>
            <li>● PG12 輔導十二歲級：未滿十二歲之兒童不得觀賞。</li>
            <li>● PG15 輔導十五歲級：未滿十五歲之人不得觀賞。</li>
            <li>● R 限制級：未滿十八歲之人不得觀賞。</li>
        </ul>
    <h3 style="width: 900px;line-height:40px">４.訂票須先加入會員?<br></h3> 
    <ul  style="line-height:40px;">
            <li>● 是的。為提供完善的會員服務，欲訂票請先加入會員，請輸入真實號碼並完成身分驗證即可完成加入會員。</li>
    </ul>
    <h3 style="width: 900px;line-height:40px">５.如何確認訂票是否成功?<br></h3> 
    <ul  style="line-height:40px;">
            <li>● 當付款完成後跳轉至此次訂單明細頁面，或者直接去訂單紀錄查看時有出現即付款成功。</li>
    </ul>    
    <h3 style="width: 900px;line-height:40px">６.完成訂票後，是否可以更改座位或場次?<br></h3> 
    <ul  style="line-height:40px;">
            <li>● 不可，請直接在訂單頁面線上辦理退款且取消訂單後再重新訂票。</li>
    </ul>   
    </div>
    </div>
    </el-col>
    <el-col :span="4">
        <UseRadvertise></UseRadvertise>
    </el-col>
</el-row>
</div>
</template>

<script setup>
    import showtimes from '../ordercomponents/BuyTicketsComponent.vue';
    import axiosApi from '@/plugins/axiosConfig.js';
    import { onBeforeMount } from 'vue';
    import { ref } from "vue"
    import { useRouter } from 'vue-router'
    import Swal from 'sweetalert2'
    import UseRadvertise from '../usercomponents/UseRadvertise.vue';

    const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    });

    const router=useRouter();

    const cinema=ref('');
    const movies=ref('');
    const movieDate=ref('');
    const movieTime=ref('');
    const screeningId=ref('');
    const movieShowtimes=ref('');


    function dochange1(event) {
            movies.value='';
            movieDate.value='';
            movieTime.value='';
            // movieShowtimes.value='';
            screeningId.value='';
            if(event=='default_1'){
                return;
            }
        axiosApi.get("/order/movie/findMovie?cinemaId="+event).then(function (response) {
            movies.value=response.data.movies;
            }).catch(function (response) {
                console.log(response);
            })
    }

        function dochange2(event){
            movieDate.value='';
            movieTime.value='';
            screeningId.value='';
            if(event=='default_2'){
                return;
            }
            axiosApi.get("/order/movie/dates?cinemaId="+event.substring(event.indexOf("-")+1,event.length)+"&movieId="+event.substring(0,event.indexOf("-"))).then(function (response) {
            movieDate.value=response.data.dates;
            }).catch(function (response) {
                console.log(response);
            })
        }

        function dochange3(event){

            movieTime.value='';
            screeningId.value='';
            if(event=='default_3'){
                return;
            }
            let tempArray =[]; 
            //item.movie_id+'-'+item.cinema_id+'-'+item.Start_time
            let currentIndex=0;
            let nextIndex=event.indexOf("-");
            for(let i=1;i<=3;i++){
                if(i==3){
                    tempArray.push(event.substring(currentIndex,event.length));
                    continue;
                }
                tempArray.push(event.substring(currentIndex,nextIndex));
                currentIndex=nextIndex+1;
                nextIndex=event.indexOf("-",currentIndex);
            } 
            axiosApi.get("/order/movie/times?cinemaId="+tempArray[1]+"&Date="+tempArray[2]+"&movieId="+tempArray[0]).then(function (response) {
            movieTime.value=response.data.times;
            }).catch(function (response) {
                console.log(response);
            })
        }

        function dochange4(event) {
        if(event=="default_4"){
            screeningId.value='';
            return;
        }
        screeningId.value=event;
        }

        function doclick1(){
            if(screeningId.value==''){
            Toast.fire({
            icon: "error",
            title: "請選擇選項！"
            });
                return;
            }           
            router.push({ path: "/order/screening" ,query: { screeningId: screeningId.value }});
        }

        function doclick2(){
            if(screeningId.value==''){
            Toast.fire({
            icon: "error",
            title: "請選擇選項！"
            });    
                return;
            }           
            router.push({ path: "/order/booking" ,query: { screeningId: screeningId.value }});
        }

        onBeforeMount(function(){
            axiosApi.get("/order/movie/findAllCinema").then(function (response) {
                cinema.value=response.data.allCinemaName;
            }).catch(function (response) {
                console.log(response);
            })
        })



</script>
    
<style scoped>
    .div1{
        width: 925px;
        margin:0 auto;
        /* margin-left: 20px; */
        margin-top: 40px;
        top: 75px;
    }
    h3{
        font-weight: bold;
    }
    .limiter {
  width: 100%;
  min-height: 88vh;
  /* display: flex; */
  /* flex-wrap: wrap; */
}
</style>
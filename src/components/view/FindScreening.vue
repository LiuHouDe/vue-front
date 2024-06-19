<template>
        <div class="div1">
        <h6>查詢結果</h6>
        <div>
        <h5 class="h5-1">電影名：{{movieName}}</h5>
        <h5 class="h5-2">開始時間：{{movieTime}}</h5>
        <h5 class="h5-3">電影廳次：第{{auditoriumNumber}}廳</h5>
        </div class="div2">    
         <img src="/public/SeatScreen.png"/>
         <table>
         <tr v-for="tr in movieShowtimes" >
                <td v-for="td in tr">
                    <img v-if="td.is_available=='未售出'" src="/public/standard_available.png" />
                    <img v-else-if="td.is_available=='已售出'" src="/public/sold.png" />
                </td>
        </tr>
        </table>
        <a href="javascript: void(0)" class="btn" @click="previous">回上一頁</a>
        </div>
        <Advertise></Advertise>
</template>
    
<script setup>
import { ref } from 'vue';
import { useRoute,useRouter } from 'vue-router'
import axiosApi from '@/plugins/axiosConfig.js';
import Advertise from '../ordercomponents/Advertise.vue';
const route = useRoute();
const router=useRouter();

const screeningId = ref('');
const movieShowtimes = ref('')
let movieName='';
let movieTime='';
let auditoriumNumber='';
// const movieTime=ref('');
screeningId.value = route.query.screeningId;
            //http://localhost:8080/movie/tickets?screeningId=
            axiosApi.get("/order/movie/tickets?screeningId="+screeningId.value).then(function (response) {
            movieShowtimes.value=response.data.tickets;
            let outerArray =[];
            let innerArray=[];
            let length=movieShowtimes.value.length;
            movieName=movieShowtimes.value[0].name;
            movieTime=movieShowtimes.value[0].Start_time;
            auditoriumNumber=movieShowtimes.value[0].auditorium_number;
            for(let i=1;i<=length;i++){
                innerArray.push(movieShowtimes.value[i-1]);
                if(i%18==0){
                    outerArray.push(innerArray.slice(i-18,i+1));
                    continue;
                }
                if(i==length){
                    outerArray.push(innerArray.slice((i-length/18),i+1));
                }
            }
            movieShowtimes.value=outerArray;
            }).catch(function (response) {
                console.log(response);
            })


        function previous(){
        // window.history.go(-1);
        router.go(-1);
        }  

</script>
    
<style scoped>
td{
 padding: 5px;
}
.div1{
    width: 900px;
    height: 900px;
    margin:0 auto;
    margin-top: 50px;
}
table{
margin:0 auto;
margin-top: 50px;    
}
.td1{
    padding-left: 10px;
}

.h5-1{
    margin-left: 30px;
    margin-bottom: 3px;
}
.h5-2{
    margin-left: 30px;
    margin-bottom: 3px;
}
.h5-3{
    margin-left: 30px;
    margin-bottom: 20px;
}
h6{
    margin-left: 30px;
    margin-bottom: 20px;
    font-size:50px;
    font-weight:bold;
}
.btn,
.btn:focus {
    position: relative;
    z-index: 1;
    /* min-width: 200px; */
    height: 40px;
    border: 2px solid #D24D57;
    background: #D24D57  ;
    border-radius: 0;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(0, 0, 0, 0.2);
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
    margin-top: 40px;
    margin-right:40px;
    border-radius: 10px 10px 10px 10px;
    float: right;
    /* padding: 10px 20px; */
}
.btn:after {
    content: "";
    position: absolute;
    height: 0%;
    left: 50%;
    top: 50%;
    width: 150%;
    z-index: -1;
    background: #D24D57;
    -moz-transform: translateX(-50%) translateY(-50%) rotate(-25deg);
    -ms-transform: translateX(-50%) translateY(-50%) rotate(-25deg);
    -webkit-transform: translateX(-50%) translateY(-50%) rotate(-25deg);
    transform: translateX(-50%) translateY(-50%) rotate(-25deg);
    -webkit-transition: all 0.75s ease 0s;
    -moz-transition: all 0.75s ease 0s;
    -o-transition: all 0.75s ease 0s;
    transition: all 0.75s ease 0s;
}
.btn:hover {
    color: #272323;
    text-shadow: none;
}
.btn:hover:after {
    height: 450%;
}
</style>
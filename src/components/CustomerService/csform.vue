<template>
  <div class="page-container">

    <div class="form-container">
        
        
            <h2>聯絡我們</h2>
    
            <!-- @submit.prevent="callCreate" -->
            <label for="email">電子郵件(要收到郵件的信箱)：</label>
            <input type="email"  id="email" name="email"  placeholder="輸入你的電子郵件" v-model="email" @blur="checkEmail">
            <span v-if="emailErrorMessage" class="error">{{
            emailErrorMessage
          }}</span>
            <br>
            
            <label for="category">選擇分類：</label>
            <select size="1" v-model="defcategory">
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
            <br>
            <label for="comments">內容描述：</label>
            <textarea  id="comments" name="comments" placeholder="輸入你的文字" v-model="text" @blur="checkText"></textarea>
            <span v-if="textErrorMessage" class="error">
              <br>
            {{textErrorMessage}}</span>
            
            <button  class="btn btn-primary" @click="callCreate">提交</button>
        
    </div>
  </div>
    </template>
        
    <script setup >
        import Swal from "sweetalert2"
        import axiosapi from "@/plugins/axiosConfig.js";
        import {ref} from "vue";
        import axios from "axios";
        import { useRouter } from "vue-router"
        const router = useRouter();
  
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        const categories=(['--請選擇--','票務問題','環境與設施','服務品質','電影相關','環境設施','安全秩序','其他']);
        // const props = defineProps(["modelValue", "categories"]);
        // const emits = defineEmits(["update:modelValue", "change"]);
        const defcategory=ref('--請選擇--');
    
        const email=ref('');
        const text=ref('');
        const token =ref(sessionStorage.getItem("token"));

        const emailErrorMessage = ref(null);
        
        const textErrorMessage = ref('');

  
        console.log("token",token.value);
        function callCreate(){
            axiosapi.defaults.headers.authorization = "Bearer "+ token;
            // 檢查資料輸入
            if (!checkEmail()) {
              Swal.fire({
                text: '電子郵件格式錯誤',
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
              })
              return; // 如果Email格式不正确，停止执行后续代码
            }
          
            if(defcategory.value=='--請選擇--'){
              Toast.fire({
                icon: "error",
                title: "請選擇分類",
              })
              return;
            }
            
            if (!email.value || !text.value) {
              Toast.fire({
                icon: "error",
                title: "請輸入資料",
              });
              return;
            }
            
            let data = {
            "userEmail": email.value,
            "text": text.value,
            "category":defcategory.value,
            "token":token.value};
            console.log("data:",data);

            
            axiosapi.post(`/customerServices`, data).then((response) => {
              if (response.status == 201) {
                Swal.fire({
                  text: '提交成功',
                  icon: 'success',
                  allowOutsideClick: false,
                  confirmButtonText: '確認',
                  }).then(function (result) {
                      if(result.isConfirmed) {
                        
                        axiosapi.get(`/back/custService/${email.value}`)
                          router.push({ name: "csreply-link" });
                      }
                  })
              }else if (response.status == 204) {
                console.log("No content");
  
  
            
  
  
              } else {
              console.log("Not created"); 
              }
            }).catch(function(error) {
              console.log("error", error);
                Swal.fire({
                  text: '請登入',
                  icon: 'error',
                  allowOutsideClick: false,
                  confirmButtonText: '確認',
                })
                
            });
            
        }
    
    function checkEmail() {
      let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      emailErrorMessage.value = null;
      if (!pattern.test(email.value)) {

        emailErrorMessage.value = "Email格式不符合";
        return false;
        
      }
        return true;
      
      
    }
    function checkText() {
      textErrorMessage.value = null;
      
      if (text.value.length == 0 ) {
        textErrorMessage.value = '內容描述不能為空';
        return false;
      } else {
        return true;
      }

    }
  
    
    
    
    </script>
        
    <style scoped>
  .page-container {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
    /* display: flex; */
    justify-content: center;
    align-items: center;
    height: 100vh;
    min-height: 100vh;
    flex-direction: column;
  }
  .form-container {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    margin: auto;


  }
  h2 {
    /* margin-bottom: 20px;
    color: #333;
    text-align: center;
    font-size: 24px; */
    color: #2c3e50;
    font-family: 'Arial', sans-serif;
    font-size: 28px;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  input[type="email"], select, textarea {
    width: calc(100% - 22px);
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
  }
  textarea {
    height: 100px;
    resize: none;
  }
  .btn-primary {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .btn-primary:hover {
    background-color: #0056b3;
  }
        
  .error {
  color: red;
}
.footer {
  margin-top: auto;
  padding: 10px 0;
  background: #333;
  color: #fff;
  text-align: center;
  width: 100%;
}
    </style>
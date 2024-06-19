<template>
    <div>
        <table>
            <tr>
                <td>
                    <FileUpload class="btn btn-primary" accept=".jpg,.png,.gif" v-model="files">
                        選擇檔案
                    </FileUpload>
                </td>
                
            </tr>
            <tr>
                <td><span v-if="files.length != 0">{{ files[0].name }}</span></td>
            </tr>
            <tr>
                <td colspan="2">
                    <!-- <input type="button" value="上傳圖片" v-on:click="uploadImage(item.id)"> -->
                    <input type="button" value="上傳圖片" v-on:click="() => { console.log('item:', item.id); uploadImage(item.id); }">
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <input type="button" class="btn btn-danger" value="刪除圖片" @click="removePic(item.id)">
                </td>
            </tr>
        </table>
    </div>
    
</template>

<script setup>
import Swal from 'sweetalert2';
import FileUpload from 'vue-upload-component'
import axiosapi from '@/plugins/axiosConfig.js';
import { ref, onMounted } from 'vue'

const props = defineProps(["item"]);
const files = ref([])

onMounted(() => {
    console.log('Mounted item:', props.item);
    console.log("files", files);
});

function validate(selected) {
    console.log("selected", selected)
    if (selected.length == 0) {
        alert("請選擇檔案");
        return false;
    }
    let uploadFile = selected[0];
    if (uploadFile.size > 10000000) {
        alert("檔案大小超出限制(10M)");
        return false;
    }
    return true;
}

function uploadImage(id) {
    console.log("upload id:", id)
    if (!validate(files.value)) {
        files.value = [];
        return;
    }

    const formData = new FormData();
    files.value.forEach(file => {
        formData.append('files', file.file); // 确保每个文件都附加到表单数据中
    });

    axiosapi.post(`/backstage/food/uploadPhoto/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            console.log('Image uploaded successfully:', response.data);
            files.value = [];
            alert('上傳成功！');
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
};



function removePic(id){
    console.log("removePic Start:", id);
  Swal.fire({
    text: "確定刪除？",
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonText: "確認",
    showCancelButton: true,
    cancelButtonText: "取消",
  }).then(function (result) {
    if (result.isConfirmed) {
      Swal.fire({
        text: "Loading......",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      axiosapi
        .delete(`/backstage/foodpicture/${id}`)
        .then(function (response) {
          if (response.data.success) {
            Swal.fire({
              text: response.data.message,
              icon: "success",
              allowOutsideClick: false,
              confirmButtonText: "確認",
            }).then(function () {
              console.log("delete success");
              
            });
          } else {
            Swal.fire({
              text: response.data.message,
              icon: "warning",
              allowOutsideClick: false,
              confirmButtonText: "確認",
            });
          }
        })
        .catch(function (error) {
          Swal.fire({
            text: "失敗：" + error.message,
            icon: "error",
            allowOutsideClick: false,
            confirmButtonText: "確認",
          });
        });
    }
  });
}
</script>

<style></style>
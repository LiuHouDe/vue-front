<template>
  <el-upload
    class="avatar-uploader"
    :action="actionlink"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img
      :src="imageUrl"
      class="avatar"
      onerror="this.src='/404UserPhoto.png'"
    />
  </el-upload>
</template>

<script setup lang="ts">
import { ref, defineProps,inject } from "vue";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";

const reload = inject("relode");

const props = defineProps(["photoUrl"]);

const imageUrl = ref(props.photoUrl);
const actionlink =
  import.meta.env.VITE_END_URL +
  `/user/pass/uploadUserPhoto/${sessionStorage.getItem("token")}`;



const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  reload();
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("Avatar picture must be JPG or PNG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

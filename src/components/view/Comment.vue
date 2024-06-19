<template>
  <div class="contain" style="background-color: #272727;color: white;">
    <!-- 固定電影資訊 -->
    <el-affix class="info" v-for="movies in movie" :key="movies.id" >
      <figure>
        <img :src="photoURL + movies.id" />
      </figure>
      <h2>電影名稱:{{ movies.name }}</h2>
      

      <h2>導演:{{ movies.director }}</h2>
     
      <h2>上映時間:{{ movies.releaseDate.substring(0, 10) }}</h2>
      <div>
        電影評分:
        <el-rate
          style="display: flex"
          :model-value="rate"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value} points"
        ></el-rate>
      </div>
    </el-affix>
    <div class="contents" v-for="movies in movie" :key="movies.id">
      <h2>{{ movies.name }}的電影評論</h2>
      <el-rate
        v-model="comment.rate"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        :max="5"
        :texts="['差', '不優', '尚可', '好', '超讚']"
        show-text
        score-template="{rate} points"
        allow-half
      />
      <div style="margin: 20px 0">
        <el-input
          type="textarea"
          placeholder="寫下你的想法"
          v-model="comment.content"
        ></el-input>
        <div style="text-align: right; margin: 10px 0">
          <el-button type="primary" @click="submitComment">提交</el-button>
        </div>
      </div>

      <div style="margin: 20px 0">
        <div
          style="
            margin: 10px 0;
            font-size: 24px;
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          評論列表
          <div>
            <el-button
              color="#c52726"
              type="button"
              plain
              @click="loadhighComments"
              style="justify-content: end"
              >高分</el-button
            >
            <el-button
              color="#c52726"
              plain
              type="button"
              @click="loadNewComments"
              >最新</el-button
            >
          </div>
        </div>

        <div style="margin: 20px 0; text-align: left">
          <div
            style="padding: 10px; display: flex"
            v-for="item in comments"
            :key="item.id"
          >
            <div style="width: 60px">
              <el-avatar :size="50" :src="userphoto + item.userId.email" />
            </div>
            <div style="flex: 1">
              <div>
                {{ item.userId.userLastname
                }}<span style="margin-left: 10px"
                  ><el-rate
                    :model-value="item.rate"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value} points"
                  /> </span
                ><span
                  style="font-size: 14px; margin-left: 10px; color: #999"
                  >{{ item.createtime }}</span
                >
              </div>
              <div style="margin-top: 10px" color="#666">
                {{ item.content }}
              </div>

              <div>
                <el-button
                  type="text"
                  @click="
                    replayComment(
                      item.commentId,
                      item.userId.userLastname,
                      item.movieId
                    )
                  "
                >
                  回覆
                </el-button>

                <el-button
                  v-if="item.userId.email === currentUserEmail"
                  type="text"
                  @click="
                    updateComment(
                      item.commentId,
                      item.target,
                      item.content,
                      item.rate
                    )
                  "
                >
                  修改
                </el-button>

                <el-button
                  v-if="item.userId.email === currentUserEmail"
                  type="text"
                  @click="deleteCommentDialog(item.commentId)"
                >
                  刪除
                </el-button>
                <!-- 點讚按鈕和顯示點讚數 -->
                <el-button type="text" @click="setGood(item.commentId)">
                  {{ item.good }}
                  <font-awesome-icon
                    icon="fa-regular fa-thumbs-up"
                    style="margin-left: 5px"
                    v-if="item.good === 0"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-thumbs-up"
                    style="margin-left: 5px"
                    v-else
                  />
                </el-button>

                <el-button type="text" @click="setBad(item.commentId)">
                  {{ item.useless }}
                  <font-awesome-icon
                    icon="fa-regular fa-thumbs-down"
                    style="margin-left: 5px"
                    v-if="item.useless === 0"
                  />
                  <font-awesome-icon
                    icon="fa-solid fa-thumbs-down"
                    style="margin-left: 5px"
                    v-else
                  />
                </el-button>
              </div>
              <div
                v-if="item.children.length"
                style="
                  margin-left: 30px;
                  background-color: gray;
                  padding: 10px;
                  border-radius: 10px;
                "
              >
                <div v-for="sub in item.children" :key="sub.commentId">
                  <div>
                    <el-avatar
                      :size="25"
                      :src="userphoto + sub.userId.email"
                      style="margin-top: 5px"
                    />
                    <b
                      style="cursor: pointer; margin-left: 10px"
                      @click="replayComment(sub.pid, sub.userId.userLastname)"
                    >
                      {{ sub.userId.userLastname }}</b
                    ><span
                      >:<span style="color: lightskyblue  ">
                        @{{ sub.target }}
                      </span>
                      <span>{{ sub.content }}</span></span
                    >
                    <!-- <img src="/public/icon_more.png" style="float: right" /> -->
                    <span style="float: right; margin-top: 10px">{{
                      sub.createtime
                    }}</span>
                    <el-button
                      type="text"
                      style="cursor: pointer; margin-left: 10px;color: lightskyblue;"

                      @click="replayComment(sub.pid, sub.userId.userLastname)"
                    >
                      回覆</el-button
                    >

                    <el-button
                      type="text"
                      v-if="sub.userId.email === currentUserEmail"
                      @click="
                        updateComment(
                          sub.commentId,
                          item.target,
                          sub.content,
                          sub.rate
                        )
                      "
                      style="float: right; margin-top: 8px;color: lightskyblue;"
                    >
                      修改
                    </el-button>

                    <el-button
                      type="text"
                      v-if="sub.userId.email === currentUserEmail"
                      @click="deleteCommentDialog(sub.commentId)"
                      style="float: right; margin-top: 8px;color: lightskyblue;"
                    >
                      刪除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 回復彈出視窗 -->
    <el-dialog v-model="replayDialogVisible" title="回覆 " width="500">
      <el-form :model="replayCommentForm">
        <el-form-item label="內容" :label-width="formLabelWidth">
          <el-input v-model="replayCommentForm.content" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="replayDialogVisible = false">取消</el-button>
          <el-button @click="saveReplayComment">確定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 修改彈出視窗 -->
    <el-dialog v-model="editDialogVisible" title="修改訊息" width="500">
      <el-form :model="editCommentForm">
        <el-rate
          v-model="editCommentForm.rate"
          v-show="editCommentForm.rate != null && editCommentForm.rate != 0"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          :max="5"
          :texts="['差', '不優', '尚可', '好', '超讚']"
          show-text
          score-template="{rate} points"
          allow-half
        />
        <el-form-item label="內容" :label-width="formLabelWidth">
          <el-input v-model="editCommentForm.content" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button @click="saveEditedComment">確定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 刪除談出視窗 -->
    <el-dialog v-model="deleteDialogVisible" title="刪除 " width="500">
      <h2>確定要刪除嗎?</h2>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button @click="confirmDelete">確定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  props: ["movieId", "userId.id"],
  setup(props) {
    // const { userId.id } = props;
    // console.log(userId.id);
    const route = useRoute();
    const router = useRouter();
    const movieId = route.query.movieId;
    const rate = ref(0);
    const comments = ref([]);
    const movie = ref([]);
    const userphoto = import.meta.env.VITE_END_URL + "/user/pass/finduserphoto/";
    const photoURL = import.meta.env.VITE_END_URL + "/backstage/movie/photo/";
    const comment = ref({
      rate: 0,
      content: "",
      userId: { id: "" },
      movieId: { id: movieId },
      token: sessionStorage.getItem("token"),
    });
    const currentUserEmail = sessionStorage.getItem("email");

    const replayDialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const deleteDialogVisible = ref(false);
    const replayCommentForm = ref({});
    const editCommentForm = ref({});
    const formLabelWidth = ref("50px");
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    const id = comment.value.movieId.id;
    const page = ref(0);
    const size = ref(10);
    const isLoading = ref(false);

    const loadMovie = () => {
      fetch(import.meta.env.VITE_END_URL + `/backstage/movie/${id}`)
        .then((res) => {
          if (res.status === 500) {
            Toast.fire({
              icon: "error",
              title: "載入失敗",
            });
            return {};
          }
          return res.json();
        })
        .then((res) => {
          movie.value = res.list;
        });
    };

    const loadComments = (append = false) => {
      if (isLoading.value) return;
      isLoading.value = true;
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment?movieId=${comment.value.movieId.id}&page=${page.value}&size=${size.value}`
      )
        .then((res) => {
          isLoading.value = false;
          if (res.status === 500) {
            Toast.fire({
              icon: "error",
              title: "載入失敗",
            });
            return {};
          }
          return res.json();
        })
        .then((res) => {
          rate.value = res.rate;
          if (append) {
            comments.value = comments.value.concat(res.comments);
          } else {
            comments.value = res.comments;
          }
          if (res.comments.length > 0) {
            page.value += 1;
          }
        });
    };

    const loadhighComments = () => {
      if (isLoading.value) return;
      isLoading.value = true;
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment/rate?movieId=${comment.value.movieId.id}`
      )
        .then((res) => {
          isLoading.value = false;
          if (res.status === 500) {
            Toast.fire({
              icon: "error",
              title: "載入失敗",
            });
            return {};
          }
          return res.json();
        })
        .then((res) => {
          rate.value = res.rate;

          comments.value = res.comments;
        });
    };

    const loadNewComments = () => {
      if (isLoading.value) return;
      isLoading.value = true;
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment/new?movieId=${comment.value.movieId.id}`
      )
        .then((res) => {
          isLoading.value = false;
          if (res.status === 500) {
            Toast.fire({
              icon: "error",
              title: "載入失敗",
            });
            return {};
          }
          return res.json();
        })
        .then((res) => {
          rate.value = res.rate;

          comments.value = res.comments;
        });
    };

    const resetAndLoadComments = () => {
      page.value = 0;
      comments.value = [];
      loadComments();
    };

    const handleScroll = () => {
      const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;
      if (bottomOfWindow) {
        loadComments(true);
      }
    };

    onMounted(() => {
      loadComments();
      window.addEventListener("scroll", handleScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    onBeforeMount(loadMovie);
   
    const setGood = (commentId) => {
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment/good/${commentId}?token=${encodeURIComponent(
            comment.value.token
          )}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            token: sessionStorage.getItem("token"),
          }),
        }
      ).then((res) => {
        if (res.status === 200) {
          ElMessage({
            message: "點贊成功.",
            grouping: true,
            type: "success",
          });
          resetAndLoadComments();
        } else {
          ElMessage({
            message: "點贊失敗.",
            grouping: true,
            type: "error",
          });
        }
      });
    };

    const setBad = (commentId) => {
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment/useless/${commentId}?token=${encodeURIComponent(
            comment.value.token
          )}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            token: sessionStorage.getItem("token"),
          }),
        }
      ).then((res) => {
        if (res.status === 200) {
          ElMessage({
            message: "倒贊成功.",
            grouping: true,
            type: "success",
          });
          resetAndLoadComments();
        } else {
          ElMessage({
            message: "倒贊失敗.",
            grouping: true,
            type: "error",
          });
        }
      });
    };

    const replayComment = (pid, target) => {
      replayCommentForm.value = {
        pid: pid,
        userId: {},
        movieId: {
          id: movieId,
        },
        target: target,
      };
      replayDialogVisible.value = true;
    };

    const saveReplayComment = () => {
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment?token=${encodeURIComponent(
            comment.value.token
          )}&movieid=${id}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            ...replayCommentForm.value,
            token: sessionStorage.getItem("token"),
          }),
        }
      ).then((res) => {
        if (res.status === 200) {
          ElMessage({
            message: "回覆成功.",
            grouping: true,
            type: "success",
          });
          resetAndLoadComments();
          replayCommentForm.value = {};
          replayDialogVisible.value = false;
        } else {
          ElMessage({
            message: "回覆失敗.",
            grouping: true,
            type: "error",
          });
          replayDialogVisible.value = false;
        }
      });
    };

    const updateComment = (commentId, target, content, rate) => {
      comment.value.commentId = commentId;
      comment.value.content = content;
      editCommentForm.value = {
        commentId: commentId,
        userId: {},
        username: "",
        rate: rate,
        movieId: {
          id: movieId,
        },
        target: target,
        content: content,
        token: comment.value.token,
      };
      editDialogVisible.value = true;
    };

    const saveEditedComment = () => {
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment/${comment.value.commentId}?token=${encodeURIComponent(
            comment.value.token
          )}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            ...editCommentForm.value,
            token: sessionStorage.getItem("token"),
          }),
        }
      )
        .then((res) => {
          if (res.status === 200) {
            ElMessage({
              message: "修改成功.",
              grouping: true,
              type: "success",
            });
            resetAndLoadComments();
            editDialogVisible.value = false;
          } else {
            editDialogVisible.value = false;
            ElMessage({
              message: "修改失敗.",
              grouping: true,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.error("Error updating comment:", error);
        });
    };

    const deleteCommentDialog = (commentId) => {
      deleteDialogVisible.value = true;
      comment.value.commentId = commentId;
    };

    const confirmDelete = () => {
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment/${comment.value.commentId}?token=${encodeURIComponent(
            comment.value.token
          )}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      ).then((res) => {
        if (res.status === 200) {
          ElMessage({
            message: "刪除成功.",
            grouping: true,
            type: "success",
          });
          resetAndLoadComments();
          deleteDialogVisible.value = false;
        } else {
          deleteDialogVisible.value = false;
          ElMessage({
            message: "刪除失敗.",
            grouping: true,
            type: "error",
          });
        }
      });
    };

    const submitComment = () => {
      if (props.token) {
        comment.value.token = props.token;
      }
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment?token=${encodeURIComponent(
            comment.value.token
          )}&movieid=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            ...comment.value,
            token: sessionStorage.getItem("token"),
          }),
        }
      ).then((res) => {
        if (res.status === 200) {
          ElMessage({
            message: "發布成功.",
            grouping: true,
            type: "success",
          });
          resetAndLoadComments();
          comment.value.content = "";
        } else {
          ElMessage({
            message: "發布失敗.",
            grouping: true,
            type: "error",
          });
          resetAndLoadComments();
        }
      });
    };

    return {
      rate,
      comments,
      comment,
      movie,
      replayDialogVisible,
      editDialogVisible,
      deleteDialogVisible,
      replayCommentForm,
      editCommentForm,
      formLabelWidth,
      photoURL,
      userphoto,
      currentUserEmail,
      loadComments,
      replayComment,
      saveReplayComment,
      updateComment,
      saveEditedComment,
      deleteCommentDialog,
      confirmDelete,
      submitComment,
      handleScroll,
      loadhighComments,
      loadNewComments,
      setGood,
      setBad,
      

    };
  },
};
</script>

<style scoped>
.contain {
  display: flex;
  flex-direction: row;
  background-color: rgb(255, 255, 255);
}
.info {
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-left: 200px;
  margin-right: 20px;
  width: 250px;
}
.contents {
  align-items: flex-end;
  flex-direction: column;
  margin-top: 30px;
  flex: 7;
  margin-right: 200px;
  float: right;
}
figure {
  max-width: 100%;
  border: 1px solid;
  margin-right: 2;
}
</style>

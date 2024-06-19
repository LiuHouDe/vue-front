<template>
  <div style="margin: 20px 0">
    <div
      style="
        margin: 10px 0;
        font-size: 24px;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
      "
    >
      評論列表
      <RouterLink v-if="!isLoggedIn" :to="{ name: 'user-login-link' }">
        <el-button style="float: right">發表評論</el-button>
      </RouterLink>
      <RouterLink
        v-else
        :to="{ name: 'comment-link', query: { movieId: movieId } }"
      >
        <el-button style="float: right"> 發表評論 </el-button></RouterLink
      >
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
            ><span style="font-size: 14px; margin-left: 10px; color: #999">{{
              item.createtime
            }}</span>
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
                  >:<span style="color: lightskyblue">
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
                  style="float: right; margin-top: 8px;color: lightskyblue;"
                  v-if="sub.userId.email === currentUserEmail"
                  @click="
                    updateComment(
                      sub.commentId,
                      item.target,
                      sub.content,
                      sub.rate
                    )
                  "
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
</template>

<script>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, computed } from "vue";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  props: ["movieId", "userId"],
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const movieId = route.query.movie;

    const rate = ref(0);
    const comments = ref([]);
    const movie = ref([]);
    const userphoto = import.meta.env.VITE_END_URL + "/user/pass/finduserphoto/";
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

    const id = movieId;
    const page = ref(0);
    const size = ref(10);
    const isLoading = ref(false);

    const isLoggedIn = computed(() => {
      return !!sessionStorage.getItem("token");
    });

    const loadComments = (append = false) => {
      if (isLoading.value) return;
      isLoading.value = true;
      fetch(
        import.meta.env.VITE_END_URL +
          `/comment?movieId=${movieId}&page=${page.value}&size=${size.value}`
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
      fetch(import.meta.env.VITE_END_URL + `/comment/rate?movieId=${movieId}`)
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
      fetch(import.meta.env.VITE_END_URL + `/comment/new?movieId=${movieId}`)
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
            message: "點讚成功.",
            grouping: true,
            type: "success",
          });
          resetAndLoadComments();
        } else if (res.status === 401) {
          ElMessage({
            message: "點讚失敗,請先登入.",
            grouping: true,
            type: "error",
          });
          router.push({ name: "user-login-link" });
        } else {
          ElMessage({
            message: "點讚失敗,請先登入..",
            grouping: true,
            type: "error",
          });
          router.push({ name: "user-login-link" });
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
      )
        .then((res) => {
          if (res.status === 200) {
            ElMessage({
              message: "倒讚成功.",
              grouping: true,
              type: "success",
            });
            resetAndLoadComments();
          } else if (res.status === 401) {
            ElMessage({
              message: "倒讚失敗,請先登入.",
              grouping: true,
              type: "error",
            });
            router.push({ name: "user-login-link" });
          } else {
            ElMessage({
              message: "倒讚失敗,請先登入..",
              grouping: true,
              type: "error",
            });
            router.push({ name: "user-login-link" });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          ElMessage({
            message: "伺服器錯誤，請稍後再試。",
            grouping: true,
            type: "error",
          });
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
      if (sessionStorage.getItem("token") != null) {
        replayDialogVisible.value = true;
      } else {
        ElMessage({
          message: "回覆失敗,請先登入.",
          grouping: true,
          type: "error",
        });
        router.push({ name: "user-login-link" });
      }
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
            message: "回覆失敗,請先登入.",
            grouping: true,
            type: "error",
          });
          router.push({ name: "user-login-link" });
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
            Toast.fire({
              icon: "success",
              title: "修改成功",
            });
            resetAndLoadComments();
            editDialogVisible.value = false;
          } else {
            editDialogVisible.value = false;
            Toast.fire({
              icon: "error",
              title: "修改失敗",
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
          Toast.fire({
            icon: "success",
            title: "刪除成功",
          });
          resetAndLoadComments();
          deleteDialogVisible.value = false;
        } else {
          deleteDialogVisible.value = false;
          Toast.fire({
            icon: "error",
            title: "刪除失敗",
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
          `/comment?token=${encodeURIComponent(comment.value.token)}`,
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
        if (res.status === 200 && comment.value.content !== "") {
          Toast.fire({
            icon: "success",
            title: "發布成功",
          });
          resetAndLoadComments();
          comment.value.content = "";
        } else {
          Toast.fire({
            icon: "error",
            title: "發布失敗",
          });
          resetAndLoadComments();
        }
      });
    };

    return {
      rate,
      movieId,
      comments,
      comment,
      movie,
      replayDialogVisible,
      editDialogVisible,
      deleteDialogVisible,
      replayCommentForm,
      editCommentForm,
      formLabelWidth,
      userphoto,
      isLoggedIn,
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

<style></style>

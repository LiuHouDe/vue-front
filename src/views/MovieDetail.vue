<template>
  <div class="movieContainer">
    <figure>
      <img
        src="/film_20240327014.jpg"
        alt=""
        class="moviePoster"
      />
      <a onclick="" class="view">立即訂票</a>
    </figure>
    <section class="movieInfo">
      <div class="titleArea">
        <h1>電影名稱:特技玩家</h1>
        <h2>導演：大衛雷奇</h2>
        <h2>
          演員：萊恩葛斯林、艾蜜莉布朗、溫斯頓杜克、亞倫泰勒強森、漢娜衛丁漢、史蒂芬妮許
        </h2>
        <h2>類型：動作、驚悚、劇情</h2>
        <h2>片長：2 時 7 分</h2>
        <time>上映日期：2024/04/26</time>
      </div>
    </section>
  </div>
</template>

<style scoped>
.movieContainer {
  display: flex;
  align-items: flex-start;
}

figure {
  max-width: 15%;
  border: 1px solid;
  margin-right: 20px;
}

.movieInfo {
  flex: 1;
  padding: 10px;
  text-align: left;
}
.titleArea {
  text-align: left;
}

.moviePoster {
  width: 100%; /* Adjust the width as needed */
}
</style>

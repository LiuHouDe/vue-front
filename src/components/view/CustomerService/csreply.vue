<template>
        <div class="response-container">
          <h1>已收到回覆,請耐心等候通知</h1>
          <RouterLink :to="{ path: '/' }" class="home-link">首頁</RouterLink>
        </div>
      </template>
      
      <style scoped>
      .response-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f4f4f9;
        text-align: center;
      }
      
      h1 {
        margin-bottom: 20px;
        color: #333;
        font-size: 2em;
      }
      
      .home-link {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #007bff;
        color: white;
        font-size: 1.2em;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      
      .home-link:hover {
        background-color: #0056b3;
      }
      </style>
      
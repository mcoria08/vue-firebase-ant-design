<script setup>
  import { ref, watch } from 'vue';
  import { useUserStore } from './stores/userStore.js';
  import { useRoute } from 'vue-router';

  const userStore = useUserStore();
  const route = useRoute();

  const selectedKeys = ref([]);
  watch(
    () => route.name,
    () => {
      selectedKeys.value = [route.name];
    }
  );
</script>

<template>
  <a-layout>
    <a-layout-header class="header" v-if="!userStore.loadingSession">
      <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="dark"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
          >
          <a-menu-item v-if="userStore.userData" key="home">
            <router-link to="/" >Home</router-link>
          </a-menu-item>
          <a-menu-item v-if="!userStore.userData" key="login">
            <router-link to="/login">Login</router-link>
          </a-menu-item>
          <a-menu-item v-if="!userStore.userData" key="register">
            <router-link to="/register">Register</router-link>
          </a-menu-item>
          <a-menu-item @click="userStore.logoutUser" v-if="userStore.userData" key="logout">
            Logout
          </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 50px">
      <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
        <h1 style="padding: 20px 0 0 0">Firebase + Vite</h1>
        <div v-if="userStore.loadingSession">Loading...</div>
        <router-view></router-view>
      </a-layout-content>
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      Ant Design 2023 Created by mCoria
    </a-layout-footer>

  </a-layout>
</template>

<style scoped>

</style>

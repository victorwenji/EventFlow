<template>
  <div id="app">
    <Navbar />
    <main class="container-fluid px-0">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/shared/Navbar.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
}
</style>

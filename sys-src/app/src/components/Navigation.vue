<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from './icons/Logo.vue'
</script>

<template>
  <nav>
    <Logo class="logo" />
    <RouterLink to="/">Home</RouterLink>
  </nav>
</template>

<style scoped>
svg {
  max-width: 65px;
  max-height: 65px;
  margin-right: 15px;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  background: #333;
  padding: 0 5px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 5px;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
  }
}
</style>

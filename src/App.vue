<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// initialize session
authStore.initializeSession()
</script>

<template>
  <router-view />
</template>

<style scoped></style>

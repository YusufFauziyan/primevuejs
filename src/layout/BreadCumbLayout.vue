<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const home = ref({
  label: 'Home',
  route: '/',
})

const items = computed(() => {
  const pathSegments = route.path.split('/').filter((segment) => segment !== '')
  const breadcrumbItems = []

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    breadcrumbItems.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      route: index < pathSegments.length - 1 ? currentPath : null,
    })
  })

  return breadcrumbItems
})
</script>

<template>
  <div class="container">
    <Breadcrumb :home="home" :model="items" class="text-xs">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>

    <router-view></router-view>
  </div>
</template>

<style scoped>
.p-breadcrumb {
  background-color: transparent;
  padding: 0.5rem 0;
}
</style>

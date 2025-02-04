<script setup>
import { ref } from 'vue'

const LIST_CATEGORIES = ['ALL', 'Electronics', 'Clothing', 'Shoes']

// ref
const priceValue = ref([20, 80])
</script>

<template>
  <main class="border rounded-2xl p-4 flex flex-col gap-2 w-[250px]">
    <div class="flex justify-between items-center">
      <p class="font-bold text-lg">Filters</p>
      <i class="pi pi-sliders-v opacity-60"></i>
    </div>
    <Divider style="margin: 0" />
    <div class="">
      <ul class="flex flex-col">
        <li
          v-for="category in LIST_CATEGORIES"
          :key="category"
          class="text-sm text-color hover:bg-primary hover:text-primary-contrast rounded-md p-2 duration-150 cursor-pointer flex justify-between items-center"
        >
          <a href="#" class="opacity-80">{{ category }}</a>
          <i class="pi pi-angle-right opacity-60"></i>
        </li>
      </ul>
    </div>
    <Divider style="margin: 0" />
    <div>
      <div class="flex justify-between items-center">
        <p class="font-bold text-lg">Price</p>
        <Button
          icon="pi pi-angle-right"
          variant="text"
          rounded
          aria-label="Filter"
          class="opacity-60 -rotate-90"
        />
      </div>

      <div class="card flex justify-center mt-2 mb-6">
        <Slider v-model="priceValue" range class="w-full" />
      </div>
    </div>

    <Button label="Apply" variant="contained" class="w-full" size="small" />

    <!-- <Divider style="margin: 0" /> -->
  </main>
</template>

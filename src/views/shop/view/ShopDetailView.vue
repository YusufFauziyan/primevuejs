<script setup>
import { ref, toRefs, onMounted } from 'vue'

// services
import { getProductById } from '@/services/productService'
import { handleApiError } from '@/utils/api'

const props = defineProps(['id'])

//ref
const { id } = toRefs(props)
const product = ref(null)
const loadingProduct = ref(true)
const selectedImage = ref(0)

const fetchProduct = async () => {
  console.log({ id: id.value })
  loadingProduct.value = true
  try {
    const res = await getProductById(id.value)
    product.value = res
  } catch (error) {
    const { status, message } = handleApiError(error)
    console.error(`Error ${status}: ${message}`)
  } finally {
    loadingProduct.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<template>
  <div class="flex gap-8 my-4">
    <div class="w-[40%] h-[40vh] flex gap-4">
      <!-- Thumbnail Images (Left Side) -->
      <div :class="['flex flex-col gap-4', { 'justify-evenly': product?.images.length >= 4 }]">
        <div
          v-for="({ url }, index) in product?.images.slice(0, 4)"
          :key="index"
          :class="[
            'w-[100px] h-[100px] rounded-lg shadow-md overflow-hidden cursor-pointer bg-primary-100 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105',
            { 'border-2 border-primary-400': selectedImage === index },
          ]"
          @click="selectedImage = index"
        >
          <img :src="url" alt="Thumbnail" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Main Image (Right Side) -->
      <div class="flex-1 rounded-xl shadow-xl overflow-hidden bg-primary-100">
        <img
          :src="product?.images[selectedImage]?.url"
          alt="Main Product"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div class="flex-1"></div>
  </div>
</template>

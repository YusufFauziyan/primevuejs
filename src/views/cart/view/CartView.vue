<script setup>
import { ref, onMounted } from 'vue'
import { faker } from '@faker-js/faker'
import { handleApiError } from '@/utils/api'
import { getAllCart } from '@/services/cartService'
import { getUserById } from '@/services/userService'
import { formatRupiah } from '@/utils/format-number'

// ref
const carts = ref()
const loadingCarts = ref(true)
const countProduct = ref(1)

const calculateTotalPrice = (finalPrice, qty) => {
  return formatRupiah(finalPrice * qty)
}

// fetch
const fetchCarts = async () => {
  loadingCarts.value = true

  try {
    const res = await getAllCart()

    const cartValues = await Promise.all(
      res.items.map(async (item) => ({
        ...item,
        seller: await getUserById(item.product.user_id),
      })),
    )

    carts.value = cartValues
  } catch (error) {
    const { status, message } = handleApiError(error)
    console.error(`Error ${status}: ${message}`)
  } finally {
    loadingCarts.value = false
  }
}

onMounted(() => {
  fetchCarts()
})
</script>

<template>
  <main class="my-8">
    <p class="font-bold text-lg">Your Cart</p>

    <div class="flex items-start gap-8 mt-6">
      <div class="flex-1 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
        <div
          v-for="(cart, index) in carts"
          :key="index"
          class="border p-4 rounded-xl flex flex-col gap-4"
        >
          <div class="flex items-center gap-4">
            <Checkbox binary />
            <Avatar :image="faker.image.avatar()" size="small" shape="circle" />
            <p class="font-medium capitalize">{{ cart?.seller?.username }}</p>
          </div>
          <div class="flex justify-between items-start gap-4 h-[100px]">
            <div class="flex items-start gap-4 h-full">
              <Checkbox binary />
              <div
                class="flex-1 rounded border overflow-hidden bg-primary-100 inline-block w-[100px] h-full"
              >
                <img
                  :src="cart?.product?.images[0]?.url"
                  alt="Main Product"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="flex flex-col h-full justify-between items-start">
                <div class="flex items-center gap-2">
                  <div
                    v-for="(category, i) in cart.product.categories"
                    :key="i"
                    class="border px-2 py-1 rounded-xl"
                  >
                    <p class="text-xs text-primary font-medium">{{ category }}</p>
                  </div>
                </div>
                <p class="font-bold line-clamp-1 ml-1">{{ cart.product.name }}</p>
                <p class="text-xs text-primary ml-1">
                  Total Price:
                  <span class="font-medium">{{
                    calculateTotalPrice(cart.product.final_price, cart.quantity)
                  }}</span>
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-4 items-end">
              <p
                v-if="cart.product.discount"
                class="text-xs text-primary/75 font-medium line-through"
              >
                {{ formatRupiah(Number(cart.product.discount)) }}
              </p>
              <p class="font-bold text-xl">
                {{ formatRupiah(Number(cart.product.final_price)) }}
              </p>
              <div class="flex items-center gap-4">
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  variant="text"
                  rounded
                  aria-label="Delete Product"
                  size="small"
                />
                <div class="border shadow ml-auto rounded flex gap-2 items-center justify-between">
                  <i
                    class="pi pi-plus cursor-pointer px-2 py-2 text-primary/60 border-r"
                    style="font-size: 0.5rem"
                  ></i>
                  <span class="text-xs font-bold px-2">{{ countProduct }}</span>
                  <i
                    class="pi pi-minus cursor-pointer px-2 py-2 text-primary/60 border-l"
                    style="font-size: 0.5rem"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border p-4 rounded-xl flex flex-col gap-4 min-w-[300px]">
        <p class="font-bold">Summary Order</p>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm">Subtotal:</p>
          <p class="text-sm font-medium">Rp 1.000.000</p>
        </div>
        <Button label="Checkout" variant="primary" size="small" />
      </div>
    </div>
  </main>
</template>

<style scoped>
img {
  mix-blend-mode: multiply;
}
</style>

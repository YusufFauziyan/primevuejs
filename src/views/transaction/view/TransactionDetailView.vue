<script setup>
import { ref, toRefs, onMounted } from 'vue'

const props = defineProps(['id'])

// ref
const { id } = toRefs(props)
</script>

<template>
  <main class="my-8">
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-2">
        <p class="font-bold text-lg">Transaction Detail</p>
        <p class="text-sm text-gray-500">Transaction ID: {{ id }}</p>
      </div>

      <Tag value="Paid" severity="success" />
    </div>
    <div class="my-12 flex flex-col gap-6">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <p class="font-bold">Shiiping Address (Buyer)</p>
          <p class="font-medium mt-2">Yusuf Fauziyan</p>
          <p class="text-sm text-gray-500">Jl. Kebon Jeruk No. 12, Jakarta Barat, 11520</p>
        </div>
        <div>
          <p class="font-bold">Shiiping Address (Seller)</p>
          <p class="font-medium mt-2">Yusuf Fauziyan</p>
          <p class="text-sm text-gray-500">Jl. Kebon Jeruk No. 12, Jakarta Barat, 11520</p>
        </div>
      </div>

      <Divider />

      <div>
        <p class="font-bold text-lg">Order Item</p>
        <div class="mt-4 grid grid-cols-2 gap-4 items-center">
          <div class="flex gap-4">
            <div
              class="flex-1 rounded border overflow-hidden bg-primary-100 inline-block max-w-[100px] h-full"
            >
              <img
                src="https://pngimg.com/d/iphone_12_PNG23.png"
                alt="Main Product"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="border px-2 py-1 rounded-xl w-fit">
                <p class="text-xs text-primary font-medium">category</p>
              </div>
              <p class="font-bold">iPhone 12 Pro Max</p>
              <p class="font-medium text-xs text-blue-500 hover:underline cursor-pointer">
                Go to Product
                <i class="pi pi-angle-right" style="font-size: 0.5rem" />
              </p>
            </div>
          </div>

          <p class="font-bold text-sm">1 x Rp 20.000.000</p>
        </div>
      </div>

      <Divider />

      <div>
        <p class="font-bold text-lg">Transaction</p>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <div>
            <p class="font-medium">Subtotal</p>
            <p class="text-sm text-gray-500">Rp 20.000.000</p>
          </div>
          <div>
            <p class="font-medium">Shipping Fee</p>
            <p class="text-sm text-gray-500">Rp 0</p>
          </div>
          <div>
            <p class="font-medium">Total</p>
            <p class="text-sm text-gray-500">Rp 20.000.000</p>
          </div>
          <div>
            <p class="font-medium">Payment Method</p>
            <p class="text-sm text-gray-500">Bank Transfer</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
img {
  mix-blend-mode: multiply;
}

.p-dialog-header {
  display: none !important;
}
</style>

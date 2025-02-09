<script setup>
import { useRouter } from 'vue-router'
import { ref, toRefs, onMounted } from 'vue'
import { formatRupiah } from '@/utils/format-number'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue'

// api
import { createOrder } from '@/services/orderService'
import { getAllAddress } from '@/services/addressService'
import { createPayment } from '@/services/paymentService'

// components

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const toast = useToast()

// store
const authStore = useAuthStore()

// ref
const { product } = toRefs(props)
const countProduct = ref(1)
const selectedImage = ref(0)
const loadingSubmit = ref(false)

const increment = () => {
  if (countProduct.value >= product.value.stock_quantity) return
  countProduct.value++
}

const decrement = () => {
  if (countProduct.value <= 1) return

  countProduct.value--
}

const showToast = (severity, summary, detail) => {
  toast.add({ severity, summary, detail, life: 3000 })
}

const handleBuyNow = async () => {
  if (!authStore.user) {
    return router.push({ name: 'Login', query: { returnTo: router.currentRoute.value.fullPath } })
  }

  loadingSubmit.value = true

  try {
    const findAddress = (await getAllAddress()).find((item) => item.default_address)
    if (!findAddress)
      return showToast('error', 'Default Address', 'Your default address not found!')

    const order = await createOrder({
      status: 'Pending',
      address_id: findAddress.id,
      orders: [{ product_id: product.value.id, quantity: countProduct.value }],
    })

    const { transactionToken } = await createPayment({ order_id: order.id })
    if (!transactionToken)
      return showToast('error', 'Transaction Failed', 'Could not create transaction.')

    window.snap.pay(transactionToken, {
      onSuccess: () => showToast('success', 'Payment Success', 'Thank you for your payment!'),
      onPending: () => showToast('warn', 'Payment Pending', 'Your payment is being processed.'),
      onError: () => showToast('error', 'Payment Failed', 'Please try again.'),
      onClose: () => console.log('Payment popup closed.'),
    })
  } catch (error) {
    console.error(error)
    showToast('error', 'Transaction Failed', 'Could not create transaction.')
  } finally {
    loadingSubmit.value = false
  }
}
</script>

<template>
  <div class="flex gap-8 my-4">
    <div class="w-[60%] h-[50vh] flex gap-4">
      <!-- Thumbnail Images (Left Side) -->
      <div :class="['flex flex-col gap-4', { 'justify-between': product?.images.length >= 4 }]">
        <div
          v-for="({ url }, index) in product?.images.slice(0, 4)"
          :key="index"
          :class="[
            'w-[150px] rounded-lg shadow-md overflow-hidden cursor-pointer bg-primary-100 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105',
            { 'border-2 border-primary-400': selectedImage === index },
          ]"
          @click="selectedImage = index"
        >
          <img :src="url" alt="Thumbnail" class="w-full h-full object-cover" />
        </div>
      </div>
      <!-- Main Image (Right Side) -->
      <div class="flex-1 rounded-xl shadow-xl overflow-hidden bg-primary-100 inline-block">
        <img
          :src="product?.images[selectedImage]?.url"
          alt="Main Product"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div class="flex-1 h-[50vh] flex flex-col gap-4 justify-between">
      <!-- Product Info -->
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold text-ellipsis">{{ product?.name }}</h1>
        <div class="flex items-center gap-2">
          <span class="flex gap-1">
            <i
              v-for="n in 5"
              :key="n"
              class="pi pi-star-fill text-yellow-400"
              style="font-size: 1rem"
            />
          </span>
          <p class="text-primary-400">5/5</p>
        </div>
        <div class="flex items-center gap-4 mt-1">
          <p class="font-bold text-lg">
            {{ formatRupiah(Number(product?.price) - Number(product?.discount)) }}
          </p>
          <p class="text-lg line-through opacity-50" v-if="product?.discount">
            {{ formatRupiah(Number(product?.price)) }}
          </p>
          <Chip
            :label="`-${Math.round((Number(product?.discount) / Number(product?.price)) * 100)}%`"
            size="small"
            unstyled
            class="bg-red-100 text-red-500 px-4 py-2 rounded-full text-xs font-bold"
            v-if="product?.discount"
          />
        </div>
        <p class="text-sm text-primary/75">{{ product?.description }}</p>
      </div>
      <!-- Add to Cart -->
      <div class="flex items-center gap-4 border-t pt-4">
        <!-- <p class="text-xs text-primary-300 text-center">
          {{ product?.stock_quantity }} <br />
          Stock Left
        </p> -->
        <div
          class="py-2 px-2 bg-primary rounded-full flex gap-4 items-center justify-between w-[120px]"
        >
          <i
            class="pi pi-plus text-primary-contrast cursor-pointer p-2"
            style="font-size: 0.78rem"
            @click="increment"
          ></i>
          <span class="text-sm font-bold text-primary-contrast">{{ countProduct }}</span>
          <i
            class="pi pi-minus text-primary-contrast cursor-pointer p-2"
            style="font-size: 0.78rem"
            @click="decrement"
          ></i>
        </div>
        <button
          class="bg-primary text-primary-contrast py-2 px-4 rounded-full flex-1"
          @click="handleBuyNow"
          :loading="loadingSubmit"
        >
          Buy Now
        </button>
        <Button variant="text" icon="pi pi-shopping-cart" rounded />
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  mix-blend-mode: multiply;
}
</style>

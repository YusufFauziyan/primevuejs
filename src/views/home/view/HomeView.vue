<script setup>
import { ref, onMounted, watchEffect, watch, computed } from 'vue'

// form
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

import Banner from '../Banner.vue'
import NewProduct from '../NewProduct.vue'
import TopSelling from '../TopSelling.vue'
import DressStyle from '../DressStyle.vue'
import HappyCustomer from '../HappyCustomer.vue'
import { getAllProducts } from '@/services/productService'
import { handleApiError } from '@/utils/api/apiErrorHandler'
import { useAuthStore } from '@/stores/auth'

// validation schema
const schema = yup.object({
  addressTitle: yup.string().required('Address Title is required'),
  name: yup.string().required('Name is required'),
  surename: yup.string().required('Surename is required'),
  phone: yup.string().required('Phone is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('Zip Code is required'),
  address: yup.string().required('Address is required'),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

// definition field
const { value: addressTitle, errorMessage: addressTitleError } = useField('addressTitle')
const { value: name, errorMessage: nameError } = useField('name')
const { value: surename, errorMessage: surenameError } = useField('surename')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: city, errorMessage: cityError } = useField('city')
const { value: zipCode, errorMessage: zipCodeError } = useField('zipCode')
const { value: address, errorMessage: addressError } = useField('address')

// store
const authStore = useAuthStore()

// ref
const newProducts = ref([])
const soldProducts = ref([])
const loading = ref(true)
const dialogAddress = ref(false)

// computed
const hasAddress = computed(() => {
  return authStore.user?.address && authStore.user?.zip_code && authStore.user?.phone_number
})

// fetch products
const fetchNewestProducts = async () => {
  loading.value = true
  try {
    const { products } = await getAllProducts({ page: 1, limit: 4 })
    newProducts.value = products
    loading.value = false
  } catch (error) {
    const { status, message } = handleApiError(error)
    console.error(`Error ${status}: ${message}`)
  }
}

const fetchSoldestProducts = async () => {
  loading.value = true
  try {
    const { products } = await getAllProducts({ page: 1, limit: 4, orderBy: 'sold_quantity' })
    soldProducts.value = products
    loading.value = false
  } catch (error) {
    const { status, message } = handleApiError(error)
    console.error(`Error ${status}: ${message}`)
  }
}

const handleSaveAddress = handleSubmit(async (values) => {
  console.log('Form Submitted:', values)
})

watch(
  () => authStore.user,
  (user) => {
    if (user && !hasAddress.value) {
      dialogAddress.value = true
    }
  },
  { immediate: true },
)

onMounted(() => {
  fetchNewestProducts()
  fetchSoldestProducts()
})

watchEffect(() => {})
</script>

<template>
  <main>
    <Banner />

    <NewProduct :products="newProducts" />
    <div class="border-b w-full" />
    <TopSelling :products="soldProducts" />
    <DressStyle />
    <HappyCustomer />

    <Dialog v-model:visible="dialogAddress" modal class="min-w-[40%]" #container="">
      <form @submit.prevent="handleSaveAddress">
        <div class="px-6 py-8 flex flex-col gap-6">
          <h1 class="text-2xl font-semibold text-surface-950 dark:text-surface-0">
            Add New Address
          </h1>
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label
                for="addressTitle"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >Address Title</label
              >
              <InputText
                v-model="addressTitle"
                id="addressTitle"
                type="text"
                placeholder="Address Title"
                class="w-full"
                :invalid="!!addressTitleError"
                size="small"
              />
              <Message
                v-if="addressTitleError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ addressTitleError }}</Message
              >
            </div>
            <div class="">
              <label
                for="name"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >Name</label
              >
              <InputText
                v-model="name"
                id="name"
                type="text"
                placeholder="Address Title"
                class="w-full"
                :invalid="!!nameError"
                size="small"
              />
              <Message
                v-if="nameError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ nameError }}</Message
              >
            </div>
            <div class="">
              <label
                for="surename"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >Surename</label
              >
              <InputText
                v-model="surename"
                id="surename"
                type="text"
                placeholder="Address Title"
                class="w-full"
                :invalid="!!surenameError"
                size="small"
              />
              <Message
                v-if="surenameError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ surenameError }}</Message
              >
            </div>
            <div class="col-span-2">
              <label
                for="phone"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >Phone</label
              >
              <InputText
                v-model="phone"
                id="phone"
                type="text"
                placeholder="Address Title"
                class="w-full"
                :invalid="!!phoneError"
                size="small"
              />
              <Message
                v-if="phoneError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ phoneError }}</Message
              >
            </div>
            <div class="">
              <label
                for="city"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >City</label
              >
              <InputText
                v-model="city"
                id="city"
                type="text"
                placeholder="Address Title"
                class="w-full"
                :invalid="!!cityError"
                size="small"
              />
              <Message
                v-if="cityError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ cityError }}</Message
              >
            </div>
            <div class="">
              <label
                for="zipCode"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >Zip Code</label
              >
              <InputText
                v-model="zipCode"
                id="zipCode"
                type="text"
                placeholder="Address Title"
                class="w-full"
                :invalid="!!zipCodeError"
                size="small"
              />
              <Message
                v-if="zipCodeError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ zipCodeError }}</Message
              >
            </div>
            <div class="col-span-2">
              <label
                for="address"
                class="block text-sm text-surface-900 dark:text-surface-0 font-bold mb-1.5"
                >Address</label
              >
              <Textarea
                v-model="address"
                id="address"
                rows="4"
                placeholder="Address Title"
                class="w-full resize-none"
                :invalid="!!addressError"
                size="small"
              />
              <Message
                v-if="addressError"
                severity="error"
                variant="simple"
                size="small"
                class="mt-1"
                >{{ addressError }}</Message
              >
            </div>
          </div>
          <Button type="submit" label="Save" size="small" />
        </div>
      </form>
    </Dialog>
  </main>
</template>

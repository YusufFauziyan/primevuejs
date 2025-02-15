<script setup>
import { onMounted, computed, ref } from 'vue'
// form
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { VueTelInput } from 'vue-tel-input'
import { useAuthStore } from '@/stores/auth'
import { getUserById } from '@/services/userService'
import { getAllAddress } from '@/services/addressService'
import { formatRupiah } from '@/utils/format-number'
import { useToast } from 'primevue'
import { createOrder } from '@/services/orderService'
import { createPayment } from '@/services/paymentService'
import { deleteCart } from '@/services/cartService'

// define
const props = defineProps({
  checkout: {
    type: Array,
    required: true,
  },
})

// hook
const { user } = useAuthStore()
const toast = useToast()

// ref
const loadingSubmit = ref(false)

// validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('Zip Code is required'),
})

// form
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

// define form
const { value: addressId, errorMessage: addressIdError } = useField('addressId')
const { value: name, errorMessage: nameError } = useField('name')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: address, errorMessage: addressError } = useField('address')
const { value: city, errorMessage: cityError } = useField('city')
const { value: zipCode, errorMessage: zipCodeError } = useField('zipCode')

const showToast = (severity, summary, detail) => {
  toast.add({ severity, summary, detail, life: 3000 })
}

// submit form
const onSubmit = handleSubmit(async (values) => {
  console.log(values)
  loadingSubmit.value = true

  const orders = props.checkout.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
  }))

  try {
    if (!values.addressId) return showToast('error', 'Address', 'Your default address not found!')

    const order = await createOrder({
      status: 'Pending',
      address_id: values.addressId,
      orders,
    })

    const { transactionToken } = await createPayment({ order_id: order.id })

    if (!transactionToken)
      return showToast('error', 'Transaction Failed', 'Could not create transaction.')

    window.snap.pay(transactionToken, {
      onSuccess: async () => {
        showToast('success', 'Payment Success', 'Thank you for your payment!')
        //   remove selected product from cart
        await Promise.all(
          props.checkout.map(async (item) => {
            await deleteCart(item.id)
          }),
        )
      },
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
})

const totalPrice = computed(() => {
  return props.checkout.reduce((acc, curr) => acc + curr.product.final_price * curr.quantity, 0)
})

const fetchAddress = async () => {
  try {
    const response = await getAllAddress()

    const filterDefaultAddress = response.filter((address) => address.default_address)[0]

    resetForm({
      values: {
        addressId: filterDefaultAddress.id,
        name: user.username,
        phone: user.phone_number,
        city: filterDefaultAddress.city,
        zipCode: Number(filterDefaultAddress.postal_code),
        address: filterDefaultAddress.street_address,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

onMounted(fetchAddress)
</script>

<template>
  <main class="h-full">
    <form @submit.prevent="onSubmit">
      <div class="container py-12">
        <p class="font-bold text-xl">Shooping Cart</p>

        <div class="mt-12 grid grid-cols-3 gap-6">
          <div class="col-span-2">
            <div class="rounded-lg flex items-center gap-4 px-6 py-4 border shadow">
              <i class="pi pi-map-marker" style="font-size: 0.7rem"></i>

              <p class="font-bold text-xs">SHIPPING ADDRESS</p>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-6">
              <div>
                <label
                  for="name"
                  class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
                  >Your Name</label
                >
                <InputText
                  v-model="name"
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  class="w-full"
                  :invalid="!!nameError"
                  size="small"
                  readonly
                />

                <Message v-if="nameError" severity="error" variant="simple" size="small">{{
                  nameError
                }}</Message>
              </div>

              <div>
                <label
                  for="name"
                  class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
                  >Phone Number</label
                >
                <InputText
                  v-model="phone"
                  id="phone"
                  type="text"
                  placeholder="Phone"
                  class="w-full"
                  :invalid="!!phoneError"
                  size="small"
                  readonly
                />

                <Message v-if="phoneError" severity="error" variant="simple" size="small">{{
                  phoneError
                }}</Message>
              </div>

              <div>
                <label
                  for="city"
                  class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
                  >City</label
                >
                <InputText
                  v-model="city"
                  id="city"
                  type="text"
                  placeholder="City"
                  class="w-full"
                  :invalid="!!cityError"
                  size="small"
                  readonly
                />

                <Message v-if="cityError" severity="error" variant="simple" size="small">{{
                  cityError
                }}</Message>
              </div>

              <div>
                <label
                  for="city"
                  class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
                  >Zip Code</label
                >
                <InputText
                  v-model="zipCode"
                  id="zipCode"
                  type="number"
                  placeholder="Zip Code"
                  class="w-full"
                  :invalid="!!zipCodeError"
                  size="small"
                  readonly
                />

                <Message v-if="zipCodeError" severity="error" variant="simple" size="small">{{
                  zipCodeError
                }}</Message>
              </div>

              <div class="col-span-2">
                <label
                  for="city"
                  class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
                  >Address</label
                >
                <Textarea
                  v-model="address"
                  id="address"
                  rows="4"
                  placeholder="Input your Address"
                  class="w-full resize-none col-span-2"
                  :invalid="!!addressError"
                  size="small"
                  readonly
                />

                <Message v-if="addressError" severity="error" variant="simple" size="small">{{
                  addressError
                }}</Message>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <template #title>
                <p class="text-base font-bold m-0">Your Order</p>
              </template>
              <template #subtitle>
                <Divider style="margin: 0" />
              </template>
              <template #content>
                <div class="flex flex-col gap-3 pt-2">
                  <div
                    class="flex gap-4 border-b pb-3"
                    v-for="(item, index) in checkout"
                    :key="index"
                  >
                    <div
                      class="rounded border overflow-hidden bg-primary-100 w-[100px] h-[100px] flex items-center justify-center"
                    >
                      <img
                        :src="item?.product?.images[0]?.url"
                        alt="Main Product"
                        class="object-cover"
                      />
                    </div>

                    <div class="flex-1 flex-col flex items-start gap-2">
                      <p class="font-extrabold text-ellipsis text-sm line-clamp-1">
                        {{ item.product.name }}
                      </p>
                      <div class="flex items-center gap-1 text-xs">
                        <p class="font-bold">
                          {{ formatRupiah(Number(item.product.final_price)) }}
                        </p>
                        <span class="opacity-55">x</span>
                        <p>
                          {{ item.quantity }}
                        </p>
                      </div>

                      <div class="text-xs text-right w-full mt-2">
                        <p>Total Price</p>
                        <p class="font-bold text-xs">
                          {{ formatRupiah(Number(item.product.final_price) * item.quantity) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2 text-sm border-b py-3">
                    <div class="flex justify-between items-center gap-4">
                      <p class="font-medium">Total Price</p>
                      <p class="font-bold">
                        {{ formatRupiah(totalPrice) }}
                      </p>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                      <p class="font-medium">Shipping</p>
                      <p class="font-bold">
                        {{ formatRupiah(0) }}
                      </p>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                      <p class="font-medium">Voucher</p>
                      <p class="font-bold">- {{ formatRupiah(0) }}</p>
                    </div>
                  </div>

                  <div class="flex justify-between items-center gap-4 py-3">
                    <p class="font-medium">Total Payment</p>
                    <p class="font-extrabold">
                      {{ formatRupiah(totalPrice) }}
                    </p>
                  </div>
                </div>
              </template>
            </Card>
            <div class="flex flex-col gap-2 mt-4">
              <p class="text-xs text-primary/50 font-bold">* Make sure your Address is correct</p>
              <Button
                label="Pay Now"
                type="submit"
                class="w-full"
                variant="primary"
                size="small"
                icon="pi pi-wallet"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<style scoped>
img {
  mix-blend-mode: multiply;
}
</style>

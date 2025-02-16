<script setup>
import { ref } from 'vue'

// form
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// components

// define
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

// ref
const search = ref('')

// validation
const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
})

// form
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.user.username,
    phone: props.user.phone_number,
    email: props.user.email,
  },
})

// define form
const { value: name, errorMessage: nameError } = useField('name')

// onsubmit
const onSubmit = handleSubmit(async (values) => {
  console.log(values)
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <main class="py-4 px-6 flex flex-col gap-4">
      <p class="text-xl font-bold">Address Setting</p>

      <div class="flex items-center gap-2">
        <div class="w-full">
          <IconField>
            <InputIcon>
              <i class="pi pi-search"></i>
            </InputIcon>
            <InputText v-model="search" placeholder="Search the address here" class="w-full" />
          </IconField>
        </div>

        <Button
          type="button"
          label="Add Address"
          class="whitespace-nowrap"
          style="padding: 0.5rem 3rem"
        />
      </div>

      <div class="flex flex-col gap-4 mt-4">
        <p class="font-bold">Address List</p>

        <!-- default address -->
        <div
          class="border border-primary rounded overflow-hidden shadow p-4 flex gap-4 items-start justify-between"
        >
          <div class="flex flex-col gap-4">
            <div>
              <Tag severity="info" value="Default Address" rounded style="font-size: 0.7rem" />
            </div>
            <div>
              <p class="font-bold">Ttitle Address</p>
              <p class="mt-1 text-sm opacity-75">
                Jl. Raya Kuta No. 100, Kuta, Badung, Bali, Indonesia, 80361
              </p>
            </div>
            <div class="flex items-center gap-4">
              <Button label="Edit address" size="small" />
              <Button label="Delete address" size="small" severity="danger" variant="text" />
            </div>
          </div>
          <div class="flex items-center">
            <Button
              icon="pi pi-check"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Bookmark"
            />
          </div>
        </div>

        <div
          class="border rounded overflow-hidden shadow p-4 flex gap-4 items-start justify-between"
          v-for="(item, index) in Array(8)"
          :key="index"
        >
          <div class="flex flex-col gap-4">
            <div>
              <!-- <Tag severity="info" value="Default Address" rounded style="font-size: 0.7rem" /> -->
            </div>
            <div>
              <p class="font-bold">Ttitle Address</p>
              <p class="mt-1 text-sm opacity-75">
                Jl. Raya Kuta No. 100, Kuta, Badung, Bali, Indonesia, 80361
              </p>
            </div>
            <div class="flex items-center gap-4">
              <Button label="Edit address" size="small" />
              <Button label="Delete address" size="small" severity="danger" variant="text" />
            </div>
          </div>
          <div class="flex items-center">
            <Button
              icon="pi pi-bookmark"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Bookmark"
            />
          </div>
        </div>
      </div>
    </main>
  </form>
</template>

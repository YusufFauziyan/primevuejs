<script setup>
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

console.log(props.user)

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
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: email, errorMessage: emailError } = useField('email')

// onsubmit
const onSubmit = handleSubmit(async (values) => {
  console.log(values)
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <main class="py-4 px-6 flex flex-col gap-4">
      <p class="text-xl font-bold">Profile Setting</p>
      <!-- profile picture -->
      <div class="mt-4">
        <p class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-2">
          Profile Picture
        </p>
        <div class="flex items-center gap-8 mt-1">
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg"
            shape="circle"
            size="xlarge"
          />

          <div class="flex items-center gap-4">
            <Button label="Change Picture" size="small" />
            <Button label="Delete Picture" size="small" severity="danger" variant="text" raised />
          </div>
        </div>
      </div>

      <!-- Profile Name -->
      <div class="mt-6">
        <label
          for="name"
          class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
          >Profile Name</label
        >
        <InputText
          v-model="name"
          id="name"
          type="text"
          placeholder="Your Name"
          class="w-full"
          :invalid="!!nameError"
          size="small"
        />

        <Message v-if="nameError" severity="error" variant="simple" size="small">{{
          nameError
        }}</Message>
      </div>

      <!-- profile phone number -->
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
          disabled
        />

        <Message v-if="phoneError" severity="error" variant="simple" size="small">{{
          phoneError
        }}</Message>
      </div>

      <!-- profile email -->
      <div>
        <label
          for="email"
          class="block text-sm text-surface-900 dark:text-surface-0 font-semibold mb-1.5"
          >Email</label
        >
        <InputText
          v-model="email"
          id="email"
          type="text"
          placeholder="Email"
          class="w-full"
          :invalid="!!emailError"
          size="small"
          disabled
        />

        <Message v-if="emailError" severity="error" variant="simple" size="small">{{
          emailError
        }}</Message>
      </div>

      <!-- action -->
      <div class="justify-end flex mt-2">
        <Button type="submit" label="Save Changes" size="small" />
      </div>
    </main>
  </form>
</template>

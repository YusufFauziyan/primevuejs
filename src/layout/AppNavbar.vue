<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const { darkTheme, setToogleDarkTheme } = useThemeStore()

const isDarkTheme = ref(darkTheme)

const toggleDarkMode = () => {
  if (!document.startViewTransition) {
    executeDarkModeToggle()

    return
  }

  document.startViewTransition(() => executeDarkModeToggle())
}

const executeDarkModeToggle = () => {
  document.documentElement.classList.toggle('app-dark')
  isDarkTheme.value = !isDarkTheme.value
  setToogleDarkTheme()
}

onMounted(() => {
  if (darkTheme) {
    document.documentElement.classList.add('app-dark')
  }
})
</script>

<template>
  <div>
    <div class="bg-primary py-2">
      <div class="flex justify-between container items-center">
        <div />
        <div class="flex items-center gap-2">
          <p class="text-xs text-primary-contrast">Sign up and get 20% off to your first order.</p>
          <a href="#" class="underline text-xs text-primary-contrast">Sign Up Now</a>
        </div>
        <div class="cursor-pointer hover:opacity-50 duration-150">
          <i class="pi pi-times text-primary-contrast" style="font-size: 0.7rem"></i>
        </div>
      </div>
    </div>

    <div class="py-[1.5rem] flex items-center container">
      <div class="w-[150px]">
        <p class="font-bold">LOGO</p>
      </div>
      <div class="flex items-center justify-between gap-12 w-full">
        <div class="flex flex-nowrap items-center gap-6 font-light">
          <a href="#" class="text-xs whitespace-nowrap link">Shop</a>
          <a href="#" class="text-xs whitespace-nowrap link">On Sale</a>
          <a href="#" class="text-xs whitespace-nowrap link">New Arrivals</a>
          <a href="#" class="text-xs whitespace-nowrap link">Brands</a>
        </div>
        <div class="w-full rounded-full flex items-center py-2 px-4 shadow border gap-2">
          <i class="pi pi-search font-bold" style="font-size: 0.75rem"></i>

          <input
            type="text"
            class="bg-transparent text-xs w-full focus:outline-none"
            placeholder="Search for products..."
          />
        </div>

        <Button type="button" variant="text" rounded size="small" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': !isDarkTheme, 'pi-sun': isDarkTheme }]"></i>
        </Button>
        <div class="flex items-center gap-2">
          <Button
            label="Login"
            size="small"
            raised
            rounded
            style="padding-left: 1.5rem; padding-right: 1.5rem"
            as="router-link"
            to="/login"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link {
  position: relative;
  text-decoration: none; /* Menghilangkan underline default */
  color: inherit; /* Menggunakan warna teks default */
}

.link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px; /* Posisi underline */
  width: 0; /* Mulai dengan lebar 0 */
  height: 2px; /* Ketebalan underline */
  background-color: currentColor; /* Warna underline sama dengan teks */
  transition: width 0.3s ease; /* Animasi lebar underline */
}

.link:hover::after {
  width: 70%; /* Lebar underline menjadi 100% saat hover */
}
</style>

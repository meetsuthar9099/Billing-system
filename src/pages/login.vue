<script setup>
import router from '@/router';
// import logo from '@images/logo.svg?raw';
const logo = inject('logo')
const form = ref({
  email: '',
  password: '',
  remember: false,
})
const store = inject('store');
const InvalidCredentials = ref(false)

const onSubmit = async () => {
  try {
    await store.dispatch('login', form.value)
    router.push({ path: "/dashboard" })
  } catch (error) {
    InvalidCredentials.value = true
    console.log(error, "LoginFail");
  }
}

const isPasswordVisible = ref(false)
</script>

<template>
  <v-snackbar position="relative" color="#EF5350" location="top right" v-model="InvalidCredentials">
    <span style="color: white;">
      <VIcon icon="bx-error" class="me-2" />Invalid Credentials
    </span>
    <template #actions>
      <v-btn color="red" style="color: white;" variant="text" @click="InvalidCredentials = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" width="448" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <img :src="logo" width="300" />
          </div>
        </template>
      </VCardItem>

      <VCardText>
        <VForm validate-on="true" @submit.prevent="onSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="form.email" required autofocus placeholder="johndoe@email.com" label="Email"
                type="email" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="form.password" required label="Password" placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-end flex-wrap mt-2 mb-4">
                <a class="text-primary ms-2 mb-1" target="_blank"
                  href="https://backoffice.codecrewinfotech.com/forgot-password">
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn block type="submit">
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

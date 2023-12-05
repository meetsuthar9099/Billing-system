<script setup>
import router from '@/router';
import logo from '@images/logo.svg?raw';

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
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div class="d-flex text-primary" v-html="logo" />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          sneat
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

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
                <RouterLink class="text-primary ms-2 mb-1" to="javascript:void(0)">
                  Forgot Password?
                </RouterLink>
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

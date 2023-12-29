<script setup>
import moment from 'moment';

const store = inject('store');
const imageUrl = inject('imageUrl');
const user = computed(() => store.state.user)
const userImage = computed(() => {
  return user.value.photo ?
    imageUrl + user.value.photo : 'https://backoffice.codecrewinfotech.com/static/media/01.156de087ecf69314edd6.png'
})
const roleName = computed(() => store.state.role.role_name)

watchEffect(() => {
  user.value.dob = moment(user.value.dob).format('DD-MM-YYYY')
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details" elevation="0">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar rounded="lg" size="100" class="me-6" :image="userImage" />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <h1>{{ user.firstname }} {{ user.last_name }}</h1>
              <p>( {{ user.emp_code }} )</p>
            </div>

            <p class="text-body-1 mb-0">
              {{ roleName }}
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="4" cols="12">
                <VTextField v-model="user.firstname" readonly label="First Name" />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField v-model="user.middle_name" readonly label="Middle Name" />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="4" cols="12">
                <VTextField v-model="user.last_name" readonly label="Last Name" />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.company_email" label="Company E-mail" readonly type="email" />
              </VCol>

              <!-- 👉 Organization -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.personal_email" label="Personal E-mail" readonly />
              </VCol>
              <!-- 👉 Phone -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.mo_number" label="Phone Number" readonly />
              </VCol>

              <!-- 👉 Address -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.dob" readonly label="Date of birth" />
              </VCol>

              <!-- 👉 State -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.add_1" readonly label="Address" />
              </VCol>

              <!-- 👉 Zip Code -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.add_2" readonly label="Address 2" />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="user.city" readonly label="City" />
              </VCol>

              <!-- 👉 Currency -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.state" readonly label="State" />
              </VCol>
              <!-- 👉 Country -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.aadhar_number" readonly label="Aadhar Number" />
              </VCol>

              <!-- 👉 Language -->
              <VCol cols="12" md="6">
                <VTextField v-model="user.pan_number" readonly label="Pan Number" />
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    <!-- 
    <VCol cols="12">
    <VCard title="Deactivate Account">
      <VCardText>
        <div>
          <VCheckbox v-model="isAccountDeactivated" label="I confirm my account deactivation" />
        </div>

        <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-3">
          Deactivate Account
        </VBtn>
      </VCardText>
    </VCard>
    </VCol> -->
  </VRow>
</template>

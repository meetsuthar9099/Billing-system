<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
const store = inject('store');
const imageUrl = inject('imageUrl');
const user = computed(() => { return store.state.user })
const userImage = computed(() => { return imageUrl + user.value.photo })
const roleName = computed(() => { return store.state.role.role_name })
const accountData = {
  avatarImg: avatar1,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  org: 'ThemeSelection',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'USA',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}

const refInputEl = ref()
const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

const timezones = [
  '(GMT-11:00) International Date Line West',
  '(GMT-11:00) Midway Island',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-08:00) Tijuana',
  '(GMT-07:00) Arizona',
  '(GMT-07:00) Chihuahua',
  '(GMT-07:00) La Paz',
  '(GMT-07:00) Mazatlan',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central America',
  '(GMT-06:00) Central Time (US & Canada)',
  '(GMT-06:00) Guadalajara',
  '(GMT-06:00) Mexico City',
  '(GMT-06:00) Monterrey',
  '(GMT-06:00) Saskatchewan',
  '(GMT-05:00) Bogota',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT-05:00) Indiana (East)',
  '(GMT-05:00) Lima',
  '(GMT-05:00) Quito',
  '(GMT-04:00) Atlantic Time (Canada)',
  '(GMT-04:00) Caracas',
  '(GMT-04:00) La Paz',
  '(GMT-04:00) Santiago',
  '(GMT-03:30) Newfoundland',
  '(GMT-03:00) Brasilia',
  '(GMT-03:00) Buenos Aires',
  '(GMT-03:00) Georgetown',
  '(GMT-03:00) Greenland',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores',
  '(GMT-01:00) Cape Verde Is.',
  '(GMT+00:00) Casablanca',
  '(GMT+00:00) Dublin',
  '(GMT+00:00) Edinburgh',
  '(GMT+00:00) Lisbon',
  '(GMT+00:00) London',
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'BRL',
  'CAD',
  'CNY',
  'CZK',
  'DKK',
  'HKD',
  'HUF',
  'INR',
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
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

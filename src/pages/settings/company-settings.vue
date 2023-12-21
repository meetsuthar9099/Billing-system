<template>
  <div>
    <VForm class="d-flex flex-column gap-2" ref="form" @submit.prevent="onSubmit">
      <VCard class="pa-8">
        <VRow>
          <VCol cols="12">
            <h3>Basic info</h3>
          </VCol>
          <VCol cols="12">
            <VRow>
              <VCol cols="4">
                <VTextField density="comfortable" label="Company Name" name="display_name" :rules="rules.text"
                  v-model="model.company_name" placeholder="Enter Company Name" />
              </VCol>
              <VCol cols="4">
                <VTextField v-model="model.company_email" density="comfortable" label="Company Email "
                  placeholder="Enter Company Email" :rules="rules.email" />
              </VCol>
              <VCol cols="4">
                <VTextField v-model="model.company_telephone" density="comfortable" label="Company Telephone "
                  placeholder="Enter Company Number" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" label="PAN Number" type="text" v-model="model.pan_no"
                  placeholder="Enter Your PAN Number" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" label="GSTIN" v-model="model.gstin" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" v-model="model.cin" label="CIN" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCard>
      <VCard class="pa-8">
        <VRow>
          <VCol cols="12">
            <h3>Company Address</h3>
          </VCol>
          <VCol cols="12">
            <VRow>
              <VCol cols="6">
                <VSelect item-title="name" item-value="code" density="comfortable" label="Countries"
                  v-model="model.country_code" :items="countries" />
              </VCol>
              <VCol cols="6">
                <VTextField density="comfortable" label="State" v-model="model.state" type="text"
                  placeholder="Enter Your State" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <VTextarea label="Address" :auto-grow="true" v-model="model.address_street_1" rows="2" type="text"
                  placeholder="" />
              </VCol>
              <VCol cols="6">
                <VTextarea :auto-grow="true" label="Address2" v-model="model.address_street_2" rows="2" type="text"
                  placeholder="" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <VTextField density="comfortable" label="City" v-model="model.city" type="text"
                  placeholder="Enter Your City" />
              </VCol>
              <VCol cols="6">
                <VTextField density="comfortable" label="Zip Code" v-model="model.zip" type="number"
                  placeholder="Enter Your Zip Code" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCard>
      <VCard class="pa-8">
        <VRow>
          <VCol cols="12">
            <h3>Bank Details</h3>
          </VCol>
          <VCol cols="12">
            <VRow>
              <VCol cols="4">
                <VTextField density="comfortable" label="Bank Name" type="text" v-model="model.bank_name"
                  placeholder="Enter Your Bank Name" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" label="Account Holder Name" type="text" v-model="model.ac_holder_name"
                  placeholder="Enter Account Holder Name" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" label="Account Number" type="text" v-model="model.ac_no"
                  placeholder="Enter Your Account Number" />
              </VCol>
              <VCol cols="6">
                <VTextField density="comfortable" label="IFSC Code" type="text" v-model="model.ifsc_code"
                  placeholder="Enter Your IFSC code" />
              </VCol>
              <VCol cols="6">
                <VTextField density="comfortable" label="Swift Code" type="text" v-model="model.swift_code"
                  placeholder="Enter Your Swift code" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCard>
      <VCard class="pa-8">
        <VRow>
          <VCol cols="12">
            <h3>Tax Details</h3>
          </VCol>
          <VCol cols="12">
            <VRow>
              <VCol cols="4">
                <VTextField density="comfortable" label="CGST" type="text" append-inner-icon="mdi-percent"
                  v-model="model.cgst" placeholder="Enter CGST Value" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" label="SGST" type="text" append-inner-icon="mdi-percent"
                  v-model="model.sgst" placeholder="Enter Your Value" />
              </VCol>
              <VCol cols="4">
                <VTextField density="comfortable" label="IGST" type="text" append-inner-icon="mdi-percent"
                  v-model="model.igst" placeholder="Enter Your Value" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCard>
      <VCard class="pa-6 sticky-element">
        <VRow>
          <VCol class="d-flex justify-end gap-2" cols="12">
            <VBtn size="large" type="submit" color="success">Update</VBtn>
            <VBtn size="large" @click="router.back()" color="error">Back</VBtn>
          </VCol>
        </VRow>
      </VCard>
    </VForm>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const store = inject('store');
const model = ref({
  company_name: "",
  company_email: "",
  company_telephone: null,
  country_code: "IN",
  state: "",
  city: "",
  address_street_1: "",
  address_street_2: "",
  zip: null,
  gstin: "",
  cin: "",
  ac_no: null,
  ac_holder_name: "",
  bank_name: '',
  pan_no: "",
  ifsc_code: "",
  swift_code: "",
  cgst: null,
  sgst: null,
  igst: null,

});
const countries = [
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "United Kingdom", code: "GB" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "Japan", code: "JP" },
  { name: "France", code: "FR" },
  { name: "Brazil", code: "BR" },
  { name: "India", code: "IN" },
  { name: "China", code: "CN" },
  { name: "South Africa", code: "ZA" },
  { name: "Mexico", code: "MX" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Russia", code: "RU" },
  { name: "South Korea", code: "KR" },
  { name: "New Zealand", code: "NZ" },
];
const rules = {
  text: [(v) => !!v || "This Field is Required"],
  email: [
    (v) => !!v || "This Email is Required",
    (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
  ],
};
const settings = [
  {
    name: 'Basic Settings'
  },
  {
    name: 'Company Settings'
  }
]
onMounted(async () => {
  await store.dispatch("company/fetch");
  model.value = { ...companySettings.value };
});
const companySettings = computed(() => {
  console.log("store.state.company.settings", store.state.company.settings)
  return store.state.company.settings;
});
const form = ref(null);
const onSubmit = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      const modelData = model.value
      await store.dispatch('company/update', modelData)
    }
  } catch (error) {
    console.log(error, "errorsss");
  }
};

</script>



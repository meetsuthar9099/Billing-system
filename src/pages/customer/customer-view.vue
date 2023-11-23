<template>
    <v-dialog v-model="confirmationDialog" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to perform this action?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="copyBilling(true)">Yes</v-btn>
                <v-btn @click="copyBilling(false)">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <VForm class="d-flex flex-column gap-2" @submit.prevent="() => { }">
        <VCard class="pa-8">
            <VRow>
                <VCol cols="12">
                    <h3>Basic info</h3>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Display Name" v-model="display_name"
                                prepend-inner-icon="bx-user" placeholder="John" />
                        </VCol>

                        <VCol cols="6">
                            <VTextField density="comfortable" label="Primary Contect Name" v-model="primaryContectName"
                                placeholder="John Doe" />
                        </VCol>
                    </VRow>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Email" v-model="email" prepend-inner-icon="bx-envelope"
                                type="email" placeholder="johndoe@email.com" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Mobile" v-model="mobile" type="number"
                                prepend-inner-icon="bx-mobile" placeholder="+1 123 456 7890" />
                        </VCol>
                    </VRow>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Primary Currency" v-model="primaryCurrency"
                                type="number" prepend-inner-icon="bx-mobile" placeholder="+1 123 456 7890" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Website" v-model="website" type="text"
                                placeholder="www.johndoe.com" />
                        </VCol>
                    </VRow>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Prefix" v-model="prefix" type="text"
                                placeholder="+1 123 456 7890" />
                        </VCol>
                    </VRow>
                </VCol>
            </VRow>
        </VCard>
        <VCard class="pa-8">
            <VRow>
                <VCol cols="12">
                    <h3>Billing Address</h3>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Name" v-model="billing.name" type="text"
                                prepend-inner-icon="bx-user" placeholder="John" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Country" v-model="billing.country" type="text"
                                placeholder="············" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="State" v-model="billing.state" type="text"
                                placeholder="Gujarat" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="City" v-model="billing.city" type="text"
                                placeholder="Ahmedabad" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="6">
                            <VTextarea label="Address" :auto-grow="true" v-model="billing.address" rows="2" :max-rows="6"
                                type="text" placeholder="" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Phone" v-model="billing.phone"
                                prepend-inner-icon="bx-mobile" type="number" placeholder="············" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="6">
                            <VTextarea :auto-grow="true" label="Address2" v-model="billing.address2" rows="2" :max-rows="6"
                                type="text" placeholder="" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Zip Code" v-model="billing.zip" type="number"
                                placeholder="382443" />
                        </VCol>
                    </VRow>
                </VCol>
            </VRow>
        </VCard>
        <VCard class="pa-8">
            <VRow>
                <VCol cols="12" class="d-flex justify-space-between">
                    <h3>Shipping Address</h3>
                    <v-btn variant="outlined" color="primary" @click="openModel">
                        <VIcon icon="bx-copy" class="me-2" /><span>Copy from billing</span>
                    </v-btn>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Name" v-model="shipping.name" type="text"
                                prepend-inner-icon="bx-user" placeholder="John" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Country" v-model="shipping.country" type="text"
                                placeholder="············" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="State" v-model="shipping.state" type="text"
                                placeholder="Gujarat" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="City" v-model="shipping.city" type="text"
                                placeholder="Ahmedabad" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="6">
                            <VTextarea label="Address" :auto-grow="true" v-model="shipping.address" rows="2" type="text"
                                placeholder="" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Phone" v-model="shipping.phone"
                                prepend-inner-icon="bx-mobile" type="number" placeholder="············" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="6">
                            <VTextarea :auto-grow="true" label="Address2" v-model="shipping.address2" rows="2" type="text"
                                placeholder="" />
                        </VCol>
                        <VCol cols="6">
                            <VTextField density="comfortable" label="Zip Code" v-model="shipping.zip" type="number"
                                placeholder="382443" />
                        </VCol>
                    </VRow>
                </VCol>
            </VRow>
        </VCard>
        <VCard class="pa-6">
            <VRow>
                <VCol class="d-flex justify-end gap-2">
                    <v-btn size="large" color="success">Submit</v-btn>
                    <v-btn size="large" color="#dc3545">Back</v-btn>
                </VCol>
            </VRow>
        </VCard>
    </VForm>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const display_name = ref('')
const primaryContectName = ref('')
const email = ref('')
const mobile = ref(null)
const website = ref('')
const primaryCurrency = ref(null)
const prefix = ref('')
const confirmationDialog = ref(false);

const billing = ref({
    name: '',
    country: '',
    state: '',
    city: '',
    address: '',
    phone: null,
    address2: '',
    zip: null
})
let shipping = ref({
    name: '',
    country: '',
    state: '',
    city: '',
    address: '',
    phone: null,
    address2: '',
    zip: null
})
const openModel = () => { confirmationDialog.value = true }
const copyBilling = (val: Boolean) => {
    if (val) {
        shipping.value = { ...billing.value }
    }
    confirmationDialog.value = false
}


</script>

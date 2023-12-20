<template>
    <div>
        <v-dialog v-model="confirmationDialog" max-width="400">
            <v-card>
                <v-card-title>Confirmation</v-card-title>
                <v-card-text> Are you sure you want copy from Billing? </v-card-text>
                <v-card-actions>
                    <v-btn @click="copyBilling(true)">Yes</v-btn>
                    <v-btn @click="copyBilling(false)">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <VForm class="d-flex flex-column gap-2" @submit.prevent="onSubmit" ref="form">
            <VCard class="pa-8">
                <VRow>
                    <div>
                        <v-row align="center" justify="center">
                            <v-col>
                                <div class="text-right">Export</div>
                            </v-col>
                            <v-col>
                                <v-switch v-model="model.is_local" color="primary" hide-details></v-switch>
                            </v-col>
                            <v-col>
                                <div class="text-left">Local</div>
                            </v-col>
                        </v-row>
                    </div>
                    <VCol cols="12">
                        <h3>Basic info</h3>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Display Name" name="display_name"
                                    :rules="rules.text" v-model="model.name" prepend-inner-icon="bx-user"
                                    placeholder="John" />
                            </VCol>

                            <VCol cols="6">
                                <VTextField density="comfortable" label="Contect Name" v-model="model.contact_name"
                                    placeholder="John Doe" />
                            </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Email" v-model="model.email"
                                    prepend-inner-icon="bx-envelope" type="email" :rules="rules.email"
                                    placeholder="johndoe@email.com" />
                            </VCol>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Mobile" v-model="model.phone" type="number"
                                    prepend-inner-icon="bx-mobile" placeholder="+1 123 456 7890" />
                            </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <VSelect item-title="currency" item-value="_id" density="comfortable"
                                    label="Primary Currency" v-model="model.primary_currency" :items="currencies" />
                            </VCol>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Website" v-model="model.website" type="text"
                                    placeholder="www.johndoe.com" />
                            </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Prefix" v-model="model.prefix" type="text"
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
                                <VTextField density="comfortable" label="Name" v-model="model.billing.name" type="text"
                                    prepend-inner-icon="bx-user" placeholder="John" />
                            </VCol>
                            <VCol cols="6">
                                <VSelect item-title="name" item-value="code" density="comfortable" label="Countries"
                                    v-model="model.billing.country_id" :items="countries" />
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="State" v-model="model.billing.state" type="text"
                                    placeholder="Gujarat" />
                            </VCol>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="City" v-model="model.billing.city" type="text"
                                    placeholder="Ahmedabad" />
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol cols="6">
                                <VTextarea label="Address" :auto-grow="true" v-model="model.billing.address_street_1"
                                    rows="2" :max-rows="6" type="text" placeholder="" />
                            </VCol>
                            <VCol cols="6">
                                <VTextarea :auto-grow="true" label="Address2" v-model="model.billing.address_street_2"
                                    rows="2" :max-rows="6" type="text" placeholder="" />
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Phone" v-model="model.billing.phone"
                                    prepend-inner-icon="bx-mobile" type="number" placeholder="" />
                            </VCol>
                            <VCol cols="6">
                                <VTextField density="comfortable" label="Zip Code" v-model="model.billing.zip" type="number"
                                    placeholder="382443" />
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol cols="12">
                                <VTextField density="comfortable" label="GSTIN" v-model="model.billing.gstin" />
                            </VCol>
                        </VRow>
                    </VCol>
                </VRow>
            </VCard>
            <VCard class="pa-6">
                <VRow>
                    <VCol>
                        <v-select :items="projects" item-value="_id" density="comfortable" v-model="model.project_id"
                            label="Projects" multiple>
                            <template v-slot:selection="{ item }">
                                <v-chip class="me-3">
                                    <span>{{ item.title }}</span>
                                </v-chip>
                            </template>
                        </v-select>
                    </VCol>
                </VRow>
            </VCard>
            <VCard class="pa-6">
                <VRow>
                    <VCol class="d-flex justify-end gap-2" cols="12">
                        <VBtn size="large" type="submit" color="success">{{
                            getId == 0 ? "Create" : "Update" }} Customer</VBtn>
                        <VBtn size="large" @click="router.back()" color="error">Back</VBtn>
                    </VCol>
                </VRow>
            </VCard>
        </VForm>
        <div></div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const store = inject("store");
const confirmationDialog = ref(false);
const router = useRouter();
const route = useRoute();
const model = ref({
    is_local:false,
    name: "",
    project_id: [],
    contact_name: "",
    email: "",
    phone: null,
    website: "",
    primary_currency: "INR",
    prefix: "",
    billing: {
        name: "",
        country_id: "IN",
        state: "",
        city: "",
        address_street_1: "",
        phone: null,
        address_street_2: "",
        zip: null,
        gstin: null,
    },
    // shipping: {
    //     name: "",
    //     country_id: "IN",
    //     state: "",
    //     city: "",
    //     address_street_1: "",
    //     phone: null,
    //     address_street_2: "",
    //     zip: null,
    //     gstin: null,
    // },
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
const isEdit = ref(false);
const customer = computed(() => {
    return store.state.customers.customerUser;
});
const projects = computed(() => {
    return store.state.customers.projects;
});
const currencies = computed(() => {
    return store.state.customers.currencies;
});
let getId = route.params.id;
onMounted(async () => {
    await store.dispatch("customers/fetchCurrencies");
    if (getId != 0) {
        try {
            await store.dispatch("customers/fetchCustomer", getId);
            model.value = { ...customer.value };
        } catch (error) {
            router.push({ name: '404' })
        }
    }else{
        model.value.primary_currency = currencies.value.find(item=>item.is_default)?._id 
    }
    await store.dispatch("customers/fetchProjects",getId);
});

const rules = {
    text: [(v) => !!v || "This Field is Required"],
    email: [
        (v) => !!v || "This Email is Required",
        (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
    ],
};
const form = ref(null);
const onSubmit = async () => {
    try {
        const { valid } = await form.value.validate();
        if (valid) {
            if (route.params.id != 0) {
               await store.dispatch("customers/editCustomer", {
                    id: route.params.id,
                    model: model.value,
                });
            } else {
                await store.dispatch("customers/addCustomer", model.value);
            }
            router.go(-1);
        }
    } catch (error) {
        console.log(error, "errorsss");
    }
};

const openModel = () => {
    confirmationDialog.value = true;
};
const copyBilling = (val) => {
    if (val) {
        model.value.shipping = { ...model.value.billing };
    }
    confirmationDialog.value = false;
};
</script>
<style scoped>
.sticky-element {
    position: sticky;
    z-index: 999;
    top: 0px;
}
</style>
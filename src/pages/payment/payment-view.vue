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
                    <VCol cols="12">
                        <h3>Basic info</h3>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <VTextField density="comfortable" type="date" label="Date" name="date" :rules="rules.text"
                                    v-model="model.date" prepend-inner-icon="bx-calendar" placeholder="John" />
                            </VCol>

                            <VCol cols="6">
                                <VTextField density="comfortable" label="Payment Number" v-model="model.payment_number"
                                    placeholder="PAY-002" />
                            </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <VSelect item-title="name" item-value="_id" :hide-selected="true" label="Select Customer"
                                    name="customer_name" :rules="rules.date" :items="allCustomers"
                                    v-model="model.customer_id" prepend-inner-icon="bx-user" />
                            </VCol>
                            <VCol cols="6">
                                <VSelect
                                    :item-title="item => `${item.invoice_number} (${item.currency && item.currency.symbol} ${item.grand_total})`"
                                    item-value="_id" :hide-selected="true" label="Select Invoice" name="currency"
                                    :rules="rules.date" :items="invoices" v-model="model.invoice_id"
                                    prepend-inner-icon="bx-user" />
                                <span class="text-muted" v-if="model.invoice_id"> Due Amount:{{ getId == 0 ? amount_due :
                                    total_cost }} </span>
                            </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
                        <VRow>
                            <VCol cols="6">
                                <v-row>
                                    <v-col cols="2">
                                        <VTextField density="comfortable" :value="currency_symbol" type="text" />
                                    </v-col>
                                    <v-col cols="10">
                                        <VTextField density="comfortable" label="Amount"
                                            :class="{ 'red-border': amountError }" v-model="model.amount" type="number"
                                            placeholder="www.johndoe.com" />
                                    </v-col>
                                </v-row>
                                <span class="amountError" v-if="amountError"> Entered Payment is more than due amount of
                                    this
                                    invoice.</span>
                            </VCol>
                            <VCol cols="6">
                                <VSelect item-title="name" item-value="value" :hide-selected="true"
                                    label="Select Payment Mode" name="payment_mode" :items="paymentModes"
                                    v-model="model.payment_mode" prepend-inner-icon="bx-user" />
                            </VCol>
                        </VRow>
                    </VCol>
                    <VCol cols="12">
                        <VTextarea label="Notes" :auto-grow="true" v-model="model.notes" rows="2" type="text"
                            placeholder="" />
                    </VCol>
                </VRow>
            </VCard>
            <VCard class="pa-6">
                <VRow>
                    <VCol class="d-flex justify-end gap-2" cols="12">
                        <VBtn size="large" :disabled="amountError" type="submit" color="success">{{
                            getId == 0 ? "Create" : "Update" }} Payment</VBtn>
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
import moment from "moment";
import { useRoute, useRouter } from "vue-router";
const store = inject("store");
const confirmationDialog = ref(false);
const amountError = ref(false);
const currency_symbol = ref('₹')
const amount_due = ref(0)
const total_cost = ref(0)
const router = useRouter();
const route = useRoute();
const model = ref({
    date: moment().format('YYYY-MM-DD'),
    payment_number: null,
    customer_id: null,
    invoice_id: null,
    amount: [],
    payment_mode: [],
    notes: 1,

});

const isEdit = ref(false);
const customer = computed(() => {
    return store.state.customers.customerUser;
});
const projects = computed(() => {
    return store.state.customers.projects;
});
const paymentModes = computed(() => {
    console.log("store.state.payment.paymentModes", store.state.payment.paymentModes)
    return store.state.payment.paymentModes;
});
const payments = computed(() => { return store.state.payment.payments })

const payment = computed(() => {
    // console.log("store.state.payment.payment", store.state.payment.payment)
    return store.state.payment.payment
})
const allCustomers = computed(() => {
    return store.state.invoices.allCustomers;
});
const invoices = computed(() => {
    return store.state.invoices.customer_invoices;
});
let getId = route.params.id;
onMounted(async () => {
    await store.dispatch('payment/fetchAllPayments')
    await store.dispatch("invoices/fetchAllCustomers");
    await store.dispatch("payment/fetchPaymentModes");
    model.value = { ...payment.value }
    // await store.dispatch("invoices/fetchAllInvoice");
    await store.dispatch("payment/getPaymentNumber");
    model.value.payment_number = store.state.payment.payment_number
    if (getId != 0) {
        await store.dispatch("payment/fetch", { id: getId });
        try {
            model.value = { ...payment.value };
            currency_symbol.value = payment.value.currency.symbol
        } catch (error) {
            router.push({ name: '404' })
        }
    }
});
watchEffect(async () => {
    try {
        if (model.value.customer_id) {
            await store.dispatch("invoices/fetchAllCustomerInvoice", { customer_id: model.value.customer_id });
        }
    } catch (error) {
        console.log("ErrorInLoop", error);
    }
});
watchEffect(async () => {
    try {
        if (model.value.amount) {
            if (!route.params.id) {
                if (model.value.amount > amount_due.value) {
                    amountError.value = true
                } else {
                    amountError.value = false
                }
            } else {
                if (model.value.amount > total_cost.value) {
                    amountError.value = true
                } else {
                    amountError.value = false
                }
            }
        }
    } catch (error) {
        console.log("ErrorInLoop", error);
    }
});
watchEffect(async () => {
    try {
        if (model.value.invoice_id) {
            const otherPaymentData = payments.value.filter(x =>(x.invoice_id ==  model.value.invoice_id && x._id !== model.value._id))
            const totalAmount = otherPaymentData.reduce((accumulator, currentValue) => {
                accumulator += currentValue.amount;
                return accumulator
            }, 0);
            console.log("otherInvoiceData", totalAmount)
            const invoiceData = invoices.value.find(x => x._id == model.value.invoice_id)
            total_cost.value = invoiceData && invoiceData.grand_total - totalAmount             
            // if(invoiceData !=='undefined'){
            console.log("invoiceData._id", invoiceData)
            currency_symbol.value = invoiceData && invoiceData.currency.symbol
            model.value.amount = route.params.id == 0 ? invoiceData && invoiceData.amount_due : payment.value.amount
            amount_due.value = invoiceData && invoiceData.amount_due
            // }
        }
    } catch (error) {
        console.log("ErrorInLoop", error);
    }
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
                await store.dispatch("payment/editPayment", {
                    id: route.params.id,
                    model: model.value,
                });
            } else {
                await store.dispatch("payment/addPayment", model.value);
            }
            router.push({ path: "/payment" });
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
.merged-text-field {
    display: flex;
}

.amountError {
    color: #FF0000
}

.text-muted {
    color: #9ba7ad !important;
    font-size: 12px !important
}

.merged-input {
    flex: 1;
    margin-right: 8px;
    /* Adjust margin as needed for spacing */
}

.sticky-element {
    position: sticky;
    z-index: 999;
    top: 0px;
}
</style>
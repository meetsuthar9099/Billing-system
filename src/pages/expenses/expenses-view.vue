<template>
    <div>
        <v-snackbar position="relative" color="#EF5350" location="top right" v-model="InvalidCredentials.show">
            <span style="color: white;">
                <VIcon icon="bx-error" class="me-2" />{{ InvalidCredentials.message }}
            </span>
            <template #actions>
                <v-btn color="red" style="color: white;" variant="text" @click="InvalidCredentials.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
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
                    <VCol cols="6">
                        <VSelect item-title="category_name" item-value="_id" density="comfortable" :rules="rules.text"
                            :items="categories" label="Category" v-model="model.category" />
                    </VCol>
                    <VCol cols="6">
                        <VTextField density="comfortable" label="Date" v-model="model.due_date" :rules="rules.text" />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="6">
                        <VTextField density="comfortable" type="number" label="Amount" v-model="model.amount"
                            :rules="rules.text">
                            <template #append-inner>
                                <h3 class="px-2">₹</h3>
                            </template>
                        </VTextField>
                    </VCol>
                    <VCol cols="6">
                        <VSelect item-title="name" item-value="_id" density="comfortable" :items="customers"
                            label="Customer" v-model="model.customer" :rules="rules.text" />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="6">
                        <VSelect item-title="name" item-value="_id" density="comfortable" :items="paymentModes"
                            label="Payment mode" v-model="model.payment_mode" />
                    </VCol>
                    <VCol cols="6">
                        <VTextField density="comfortable" label="Note" v-model="model.note" />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="6">
                        <v-card class="pa-4 position-relative border">
                            <v-file-input
                                style="opacity: 0;height:100%; width:100%; top:0; left:-10px; z-index: 999; cursor: pointer !important"
                                :class="{ 'position-absolute': previewImage }" accept="*" show-size @change="imageStore" />
                            <div class="position-absolute d-flex align-center gap-2"
                                style="top: 23%;left: 36%; z-index: -1;cursor: pointer !important" v-if="!previewImage">
                                <h3>Upload Receipt</h3><v-icon size="50">mdi-cloud-upload</v-icon>
                            </div>
                            <div class="position-relative" v-if="previewImage">
                                <v-img :src="previewImage" border width="200" />
                                <v-btn color="none" size="40" icon="mdi-close" class="rounded-circle position-absolute"
                                    @click="resetImg" border style="bottom:-15px;left: 25%; z-index: 9999;" />
                            </div>
                        </v-card>
                    </VCol>
                </VRow>
            </VCard>
            <VCard class="pa-6">
                <VRow>
                    <VCol class="d-flex justify-end gap-2" cols="12">
                        <VBtn size="large" color="primary" v-if="getId != 0 && expense.receipt" @click="downloadReceipt">
                            Download</VBtn>
                        <VBtn size="large" type="submit" color="success">{{ getId == 0 ? "Create" : "Update" }} Expenses
                        </VBtn>
                        <VBtn size="large" @click="router.back()" color="error">Back</VBtn>
                    </VCol>

                </VRow>
            </VCard>
        </VForm>
    </div>
</template>
<script setup>
import moment from "moment";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const store = inject("store");
const imageUrl = inject("imageUrl");
const confirmationDialog = ref(false);
const router = useRouter();
const route = useRoute();
const model = ref({
    category: [],
    due_date: moment().format('DD-MM-YYYY'),
    amount: "",
    customer: [],
    payment_mode: [],
    note: "",
    receipt: ""
});
let getId = route.params.id;


const rules = {
    text: [(v) => !!v || "This Field is Required"],
    email: [
        (v) => !!v || "This Email is Required",
        (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
    ],
};
const form = ref(null);
const previewImage = ref(null);
const InvalidCredentials = ref({ show: false, message: '' })
const customers = computed(() => store.state.expenses.customers)
const categories = computed(() => store.state.expenses.categories)
const paymentModes = computed(() => store.state.expenses.paymentModes)

const imageStore = (event) => {
    try {
        model.value.receipt = event.target.files[0];
        if (model.value.receipt) {
            receiptType.value = model.value.receipt.type.split('/').pop()
            if (receiptType.value == 'pdf') {
                previewImage.value = "https://cdn4.iconfinder.com/data/icons/file-extensions-1/64/pdfs-512.png"
            } else {
                throw new Error('Unsupported file extension. Please use PDF')
            }
        } else {
            receiptType.value = ""
            previewImage.value = ""
        }
    } catch (error) {
        InvalidCredentials.value.show = true
        InvalidCredentials.value.message = error.message
        setTimeout(() => {
            InvalidCredentials.value.show = false
            InvalidCredentials.value.message = ''
        }, 2000);
    }
}
const receiptType = ref('')

const resetImg = () => {
    model.value.receipt = ""
    previewImage.value = ""
    receiptType.value = ""
}
const onSubmit = async () => {
    try {
        const { valid } = await form.value.validate();
        if (valid) {
            const formData = new FormData()
            formData.append('category', model.value.category)
            formData.append('due_date', model.value.due_date)
            formData.append('amount', model.value.amount)
            formData.append('customer', model.value.customer)
            formData.append('payment_mode', model.value.payment_mode)
            formData.append('note', model.value.note)
            if (!!model.value.receipt && typeof model.value.receipt == "object") {
                formData.append('receipt', model.value.receipt)
            }
            if (route.params.id == 0) {
                await store.dispatch("expenses/addExpenses", formData);
            } else {
                await store.dispatch("expenses/editExpense", { id: model.value._id, formData });
            }
            router.push({ name: "expenses" })
        }
    } catch (error) {
        console.log(error, "errorsss");
    }
};
const expense = computed(() => store.state.expenses.item)

onMounted(async () => {
    await store.dispatch("expenses/fetchCustomer")
    await store.dispatch("expenses/fetchCategory")
    await store.dispatch("expenses/fetchPaymentModes")
    if (route.params.id != 0) {
        await store.dispatch("expenses/fetchExpense", route.params.id)
        console.log(expense.value,"expense.value");
        model.value = expense.value
        const isPdf = model.value.receipt.split('.').pop() == 'pdf'
        if (isPdf) {
            previewImage.value = "https://cdn4.iconfinder.com/data/icons/file-extensions-1/64/pdfs-512.png"
        } else {
            previewImage.value = imageUrl + expense.value.receipt
        }
    }
})
const downloadReceipt = () => {
    store.dispatch("expenses/fetchReceipt", getId)
}
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
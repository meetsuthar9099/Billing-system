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
        <VForm class="d-flex flex-column gap-2" @submit.prevent="onSubmit" ref="form">
            <VCard class="pa-8">
                <VRow>
                    <VCol cols="6">
                        <VSelect item-title="category_name" :disabled="getId != 0" item-value="_id" density="comfortable"
                            @change="() => categoryChange()" :rules="rules.select" :items="categories" label="Category"
                            v-model="model.category" />
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
                        <VSelect item-title="name" item-value="_id" density="comfortable" :rules="rules.select"
                            :items="paymentModes" label="Payment mode" v-model="model.payment_mode" />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="6">
                        <VTextField item-title="name" item-value="_id" density="comfortable" label="Paid by"
                            v-model="model.paid_by" :rules="rules.text" />
                    </VCol>
                    <VCol cols="6">
                        <VTextField item-title="name" item-value="_id" density="comfortable" label="Paid to"
                            v-model="model.paid_to" :rules="rules.text" />
                    </VCol>

                </VRow>
                <VRow>
                    <VCol cols="6">
                        <VTextarea density="comfortable" rows="3" label="Remarks" v-model="model.note" />
                    </VCol>
                    <VCol cols="6">
                        <v-card elevation="0" class="pa-4 position-relative receipt-card" border>
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
const router = useRouter();
const route = useRoute();
const model = ref({
    category: null,
    due_date: moment().format('DD-MM-YYYY'),
    amount: null,
    paid_by: '',
    paid_to: '',
    payment_mode: null,
    note: '',
    receipt: ''
});
let getId = route.params.id;


const rules = {
    text: [(v) => !!v || "This Field is Required"],
    select: [(v) => (!!v || v == '' || !!v?.length) || "This Field is Required"],
    email: [
        (v) => !!v || "This Email is Required",
        (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
    ],
};
const form = ref(null);
const previewImage = ref(null);
const InvalidCredentials = ref({ show: false, message: '' })
const categories = computed(() => store.state.expenses.categories)
const paymentModes = computed(() => store.state.expenses.paymentModes)

const imageStore = (event) => {
    try {
        model.value.receipt = event.target.files[0];
        if (model.value?.receipt) {
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
watch(() => model.value.category, (val) => {
    const result = categories.value.find(item => item._id == val)
    if (getId == 0) {
        if (result && result?.recurring) {
            result.amount && (model.value.amount = result.amount)
            result.payment_mode && (model.value.payment_mode = result.payment_mode)
            result.pay_by && (model.value.paid_by = result.pay_by)
            result.pay_to && (model.value.paid_to = result.pay_to)
            result.note && (model.value.note = result.note)
        } else {
            model.value.amount = null
            model.value.payment_mode = []
            model.value.paid_by = null
            model.value.paid_to = null
            model.value.note = null
        }
    }
})

const onSubmit = async () => {
    try {
        const { valid } = await form.value.validate();
        if (valid) {
            const formData = new FormData()
            formData.append('category', model.value.category)
            formData.append('due_date', model.value.due_date)
            formData.append('amount', model.value.amount)
            formData.append('paid_by', model.value.paid_by)
            formData.append('paid_to', model.value.paid_to)
            formData.append('payment_mode', model.value.payment_mode)
            formData.append('note', model.value.note ? model.value.note : '')
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
    await store.dispatch("expenses/fetchCategory")
    await store.dispatch("expenses/fetchPaymentModes")
    if (route.params.id != 0) {
        await store.dispatch("expenses/fetchExpense", route.params.id)
        expense.value.due_date = moment(expense.value.due_date).format('DD-MM-YYYY')
        model.value = { ...expense.value }
        console.log(model.value, "model.value.receipt");
        const isPdf = model.value.receipt && model.value.receipt.split('.').pop() == 'pdf'
        if (isPdf) {
            previewImage.value = "https://cdn4.iconfinder.com/data/icons/file-extensions-1/64/pdfs-512.png"
        } else {
            previewImage.value = null
        }
    }
})
const downloadReceipt = () => {
    store.dispatch("expenses/fetchReceipt", getId)
}

</script>
<style scoped>
.sticky-element {
    position: sticky;
    z-index: 999;
    top: 0px;
}

.receipt-card {
    border: 1px solid #5a5b6e;
}
</style>
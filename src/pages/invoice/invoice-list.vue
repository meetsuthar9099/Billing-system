<template>
    <v-dialog v-model="bulkDeleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete these invoices?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="bulkDeleteInvoice()">Yes</v-btn>
                <v-btn @click="deleteModel = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="sendInvoiceModal" max-width="1000">
        <v-card>
            <v-card-title>Send Invoice</v-card-title>
            <v-divider></v-divider>
            <v-form @submit.prevent="submitForm" ref="form" style="padding: 20px;">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="model.to" label="To" required></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="model.subject" label="Subject" required></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-textarea v-model="model.body" label="Body" required></v-textarea>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-btn type="submit" :disabled="sending" color="primary">Submit</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="deleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete this invoice?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="deleteInvoices()">Yes</v-btn>
                <v-btn @click="deleteModel = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="sentModel" max-width="400">
        <v-card>
            <v-card-title>Are you sure?</v-card-title>
            <v-card-text>
                This invoice will be marked as sent
            </v-card-text>
            <v-card-actions>
                <v-btn @click="sentInvoice()">Yes</v-btn>
                <v-btn @click="deleteModel = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
    <h1>Invoices</h1>
    <div>
        <div class="mb-2">
            <v-row>
                <v-col cols="6">
                    <div><span>Page {{ pagination.currentPage }} of {{ pagination.totalPage }}</span></div>
                </v-col>
                <v-col cols="6" class="d-flex justify-end align-stretch">
                    <v-btn class="me-2" variant="outlined" v-if="bulkDeleteId.length > 1"
                        @click="bulkDeleteModel = true">Bulk Delete</v-btn>

                    <v-btn class="me-2" variant="outlined" @click="isFilterVisible = !isFilterVisible">
                        <span>filter</span>
                        <v-icon>{{ isFilterVisible ? 'mdi-close' : 'mdi-filter' }}</v-icon>
                    </v-btn>
                    <v-btn v-if="checkPermission('Add Invoice')" :to="{ path: 'invoice/0' }">
                        <v-icon>mdi-plus</v-icon>
                        <span>Add Invoice</span>
                    </v-btn>

                </v-col>
            </v-row>
        </div>
        <v-card height="auto" elevation="0" v-if="isFilterVisible" class="my-3 pa-5 d-flex align-center">
            <v-row>
                <v-col cols="12" class="pa-0 text-right">
                    <v-btn variant="link" href="javascript:void(0)" @click="resetFilter" class="me-4">Clear All</v-btn>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="3">
                            <VSelect item-title="name" item-value="_id" :hide-selected="true" label="Select Customer"
                                density="compact" name="display_name" :items="allCustomers" v-model="filter.customer_id"
                                prepend-inner-icon="bx-user" />
                        </v-col>
                        <v-col cols="2">
                            <VSelect item-value="id" item-title="title" :hide-selected="true" label="Select Status"
                                density="compact" name="display_name" :items="allStatus" v-model="filter.status"
                                prepend-inner-icon="bx-user" />
                        </v-col>
                        <v-col cols="2">
                            <VTextField label="Invoice Date From" v-model="filter.invoice_date_from" type="date"
                                density="compact"></VTextField>
                        </v-col>
                        <v-col cols="2">
                            <VTextField label="Invoice Date To" v-model="filter.invoice_date_to" type="date"
                                density="compact"></VTextField>
                        </v-col>
                        <v-col cols="3">
                            <VTextField label="Invoice Number" v-model="filter.invoice_number" density="compact">
                            </VTextField>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-card>
        <v-tabs v-model="filter.status">
            <v-tab :value="null" selected>All</v-tab>
            <v-tab value="1">Draft</v-tab>
            <v-tab value="2">Sent</v-tab>
        </v-tabs>
        <v-table class="rounded">
            <thead slot="head">
                <tr>
                    <th>Sr No</th>
                    <th>Invoice Number</th>
                    <th>Customer</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Amount Due</th>
                    <th>Payment status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in invoices" :key="'invoice' + index">
                    <td>{{ item.index }}</td>
                    <td>
                        <router-link :to="'invoice/pdf/' + item._id"><span class="text-primary">{{ item.invoice_number ?
                            item.invoice_number : '-' }}</span></router-link>
                    </td>
                    <td>{{ item.customer ? item.customer.contact_name : '-' }}</td>
                    <td>{{ item.invoice_date ? moment(item.invoice_date).format('DD-MM-YYYY') : '-' }}</td>
                    <td>{{ item.due_date ? moment(item.due_date).format('DD-MM-YYYY') : '-' }}</td>
                    <td class="badge-align">
                        <VBadge :color="item.status == 1 ? '#fef7d1' : item.status == 2 ? '#fef7d1' : '#c3ecd5'"
                            :content="item.status == 1 ? 'DRAFT' : item.status == 2 ? 'SENT' : 'COMPLETED'">
                        </VBadge>
                    </td>
                    <!-- {{ item }} -->
                    <td>{{ item.currency[0].symbol }}&nbsp;{{ item.amount_due }}</td>
                    <td class="badge-align">
                        <VBadge class="payment-status"
                            :color="item.payment_status == 1 ? '#fef7d1' : item.payment_status == 2 ? '#fef7d1' : '#c3ecd5'"
                            :content="item.payment_status == 1 ? 'UNPAID' : item.payment_status == 2 ? 'PARTIALLY PAID' : 'PAID'">
                        </VBadge>
                    </td>
                    <td width="200">
                        <div class="d-flex align-center justify-space-between">
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn :elevation="0" icon="mdi-dots-horizontal" color="none" v-bind="props"></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item :to="'invoice/pdf/' + item._id">
                                        <v-list-item-title><v-icon>mdi-eye</v-icon> View</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="item.status !== 3 && checkPermission('Update Invoice')"
                                        :to="'invoice/' + item._id">
                                        <v-list-item-title><v-icon>mdi-pencil</v-icon> Edit</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="sendInvoice(item._id)">
                                        <v-list-item-title><v-icon>mdi-send</v-icon>{{ item.status == 1 ? 'Send Invoice' :
                                            'Resend invoice' }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="item.status !== 3"
                                        @click="() => { item.status == 1 ? sentConfirm(item._id) : sentPayment(item._id) }">
                                        <v-list-item-title><v-icon>{{ item.status == 1 ? 'mdi-tick' : item.status == 2 ||
                                            item.status == 4 ? 'mdi-payment' : '' }}</v-icon>{{ item.status == 1 ?
        ' Mark As Sent' : item.status == 2 || item.status == 4 ? ' Record Payment' : ''
    }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="checkPermission('Delete Invoice')" @click="deleteConfirm(item._id)">
                                        <v-list-item-title><v-icon>mdi-delete</v-icon> Delete</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            <v-tooltip :text="item.description" v-if="item.description" location="left">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props">mdi-info</v-icon>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
                <tr v-if="!invoices.length > 0">
                    <td colspan="99" class="text-center"><v-icon class="me-2">mdi-alert</v-icon>No data available</td>
                </tr>
            </tbody>
        </v-table>
        <div class="mt-2">
            <v-pagination :length="pagination.totalPage" v-model="filter.currentPage" next-aria-label="Next">
            </v-pagination>
        </div>
    </div>
</template>
<script setup>
import { inject, onMounted } from 'vue';
import { checkPermission } from '@/mixins/permissionMixin'
import { useRoute, useRouter } from "vue-router";
import moment from 'moment'
const defaultFilter = Object.freeze({
    page: 2,
    status: 0,
    customer_id: null,
    invoice_number: null,
    due_date_from: null,
    due_date_to: null,
    limit: 1
})
const model = ref({
    invoice_id: null,
    customer_id: null,
    form: null,
    to: null,
    subject: null,
    body: null,
});
const form = ref(null);
const router = useRouter();
let deleteInvoiceId = null
let sentInvoiceId = null
const store = inject('store');
const isFilterVisible = ref(false)
const allStatus = ref([
    { id: 0, title: "Select Status" },
    { id: 1, title: "Draft" },
    { id: 2, title: "Sent" },
    { id: 3, title: "Completed" }
])
const bulkDeleteModel = ref(false)
const deleteModel = ref(false)
const sendInvoiceModal = ref(false)
const sentModel = ref(false)
let bulkDeleteId = ref([])
let checkAll = ref(false)
const filter = ref({})
const InvalidCredentials = ref({ show: false, message: '' })
// const myCheckbox = ref(null);
//computed
const invoices = computed(() => { return store.state.invoices.items })
const allCustomers = computed(() => {
    return store.state.invoices.allCustomers;
});

const pagination = computed(() => {
    return {
        totalPage: store.state.invoices.totalPage,
        limit: store.state.invoices.limit,
        currentPage: store.state.invoices.currentPage
    }
})

//method
const deleteConfirm = async (id) => {
    deleteModel.value = true
    deleteInvoiceId = id
}
const sendInvoice = async (id) => {
    sendInvoiceModal.value = true
    model.value.invoice_id = id
}
const sending = ref(false)
const submitForm = async () => {
    try {
        const { valid } = await form.value.validate();
        if (valid) {
            sending.value = true
            await store.dispatch("invoices/sendInvoice", model.value);
            sendInvoiceModal.value = false
            model.value = []
            sending.value = false
            doSearch()
        }
    } catch (error) {
        console.log("error", error)
        // projectError.value.isError = true
        // projectError.value.message = error?.message
        // setTimeout(() => {
        //     projectError.value.isError = false
        // }, 4000)
    }
};
const sentPayment = async (id) => {
    const invoiceData = store.state.invoices.items && store.state.invoices.items.find(x => x._id == id)
    const invoice = {
        date: moment().format('DD-MM-YYYY'),
        customer_id: invoiceData.customer_id,
        invoice_id: invoiceData._id
    }
    store.commit('payment/SET_PAYMENT', invoice)
    router.push({ path: `payment/${id}/0` })

}
const sentConfirm = async (id) => {
    sentModel.value = true
    sentInvoiceId = id
}
const doSearch = async () => {
    const query = {
        page: filter.value.currentPage,
        customer_id: filter.value.customer_id ? filter.value.customer_id : '',
        status: filter.value.status ? filter.value.status : '',
        invoice_number: filter.value.invoice_number,
        invoice_date_from: filter.value.invoice_date_from ? moment(filter.value.invoice_date_from).format('DD-MM-YYYY') : '',
        invoice_date_to: filter.value.invoice_date_to ? moment(filter.value.invoice_date_to).format('DD-MM-YYYY') : '',
        limit: filter.value.limit
    }
    console.log("Queryyy", query)
    await store.dispatch('invoices/fetchAll', { query });
}

const deleteInvoices = async () => {
    try {
        if (!!deleteInvoiceId) {
            await store.dispatch('invoices/deleteInvoice', { id: deleteInvoiceId });
            deleteModel.value = false
            doSearch()
        }
    } catch (error) {
        deleteModel.value = false
        InvalidCredentials.value.show = true
        InvalidCredentials.value.message = error.message
        setTimeout(() => {
            InvalidCredentials.value.show = false
            InvalidCredentials.value.message = ''
        }, 2000);
    }

}
const sentInvoice = async () => {
    if (!!sentInvoiceId) {
        await store.dispatch('invoices/sentInvoice', { id: sentInvoiceId });
        sentModel.value = false
        doSearch()
    }
}

const bulkDeleteInvoice = async () => {
    try {
        if (!!bulkDeleteId.value.length) {
            await store.dispatch('invoices/bulkDeleteInvoices', bulkDeleteId.value);
            bulkDeleteModel.value = false
            bulkDeleteId.value = []
            doSearch()
        }
    } catch (error) {
        bulkDeleteModel.value = false
        InvalidCredentials.value.show = true
        InvalidCredentials.value.message = error.message
        setTimeout(() => {
            InvalidCredentials.value.show = false
            InvalidCredentials.value.message = ''
        }, 2000);
    }

}
const bulkDelete = (val) => {
    if (!!val.target.checked) {
        bulkDeleteId.value.push(val.target.value);
    } else {
        bulkDeleteId.value = bulkDeleteId.value.filter(item => item !== val.target.value)
    }

}
const resetFilter = () => {
    filter.value = {
        status: 0,
        customer_id: null,
        invoice_number: null,
        due_date_from: null,
        due_date_to: null,
    }
}
//watcher
watch(filter, async () => {
    doSearch()
}, { deep: true })

watch(bulkDeleteId, async (val) => {
    checkAll.value = !!(val.length === invoices.value.length)
}, { deep: true })

onMounted(async () => {
    await store.dispatch("invoices/fetchAllCustomers");
    resetFilter()
    doSearch()
});

</script>
<style >
.badge-align .v-badge__badge {
    bottom: calc(100% - 6px) !important;
    left: calc(100% - 15px) !important;
}

/* .v-table>.v-table__wrapper>table>tbody>tr>td {
    padding: 0px 30px;
} */
</style>
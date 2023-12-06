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
                    <v-btn :to="{ path: 'invoice/0' }">
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
                        <v-col cols="6">
                            <VTextField label="Invoice Date From" v-model="filter.invoice_date_from" type="date"
                                density="compact"></VTextField>
                        </v-col>
                        <v-col cols="6">
                            <VTextField label="Invoice Date To" v-model="filter.invoice_date_to" type="date"
                                density="compact"></VTextField>
                        </v-col>
                        <v-col cols="6">
                            <VTextField label="Due Date From" v-model="filter.due_date_from" type="date" density="compact">
                            </VTextField>
                        </v-col>
                        <v-col cols="6">
                            <VTextField label="Due Date To" v-model="filter.due_date_to" type="date" density="compact">
                            </VTextField>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-card>
        <v-table class="rounded">
            <thead slot="head">
                <tr>
                    <th>
                        <!-- <v-checkbox v-model="checkAll" ref="myCheckbox"></v-checkbox> -->
                    </th>
                    <th>Actions</th>
                    <th>Customer</th>
                    <th>Invoice Number</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in invoices" :key="'invoice' + index">
                    <td width="100">
                        <v-checkbox :value="item._id" @click="bulkDelete"></v-checkbox>
                    </td>
                    <td width="200">
                        <v-btn class="me-2" color="#03A9F4" :to="'invoice/' + item._id" variant="tonal">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn color="error" @click="deleteConfirm(item._id)" variant="tonal">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                    <td>{{ item.customer ? item.customer.contact_name : '-' }}</td>
                    <td>{{ item.invoice_number ? item.invoice_number : '-' }}</td>
                    <td>{{ item.invoice_date ? moment(item.invoice_date).format('llll') : '-' }}</td>
                    <td>{{ item.due_date ? moment(item.due_date).format('llll') : '-' }}</td>
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
import moment from 'moment'
const defaultFilter = Object.freeze({
    page: 2,
    invoice_date_from: null,
    invoice_date_to: null,
    due_date_from: null,
    due_date_to: null,
    limit: 10
})
let deleteInvoiceId = null
const store = inject('store');
const isFilterVisible = ref(false)
const bulkDeleteModel = ref(false)
const deleteModel = ref(false)
let bulkDeleteId = ref([])
let checkAll = ref(false)
const filter = ref({})
// const myCheckbox = ref(null);
//computed
const invoices = computed(() => { return store.state.invoices.items })
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
const doSearch = async () => {
    const query = {
        page: filter.value.currentPage,
        invoice_date_from: filter.value.invoice_date_from ? moment(filter.value.invoice_date_from).startOf('day') : '',
        invoice_date_to: filter.value.invoice_date_to ? moment(filter.value.invoice_date_to).endOf('day') : '',
        due_date_from: filter.value.due_date_from ?
            moment(filter.value.due_date_from).startOf('day') : '',
        due_date_to: filter.value.due_date_to ?
            moment(filter.value.due_date_to).endOf('day') : '',
        limit: filter.value.limit
    }
    await store.dispatch('invoices/fetchAll', { query });
}

const deleteInvoices = async () => {
    if (!!deleteInvoiceId) {
        await store.dispatch('invoices/deleteInvoice', { id: deleteInvoiceId });
        deleteModel.value = false
        doSearch()
    }
}

const invoiceGenerate = (id) => {
    store.dispatch('invoices/invoiceGenerate', id)

}
// const convertToPDF = () => {
//     const byteData = new Uint8Array(buffer);
//     const blob = new Blob([byteData], { type: 'application/image' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'output.jpg';
//     link.click();

//     // Clean up by revoking the object URL
//     URL.revokeObjectURL(url);
// }
const bulkDeleteInvoice = async () => {
    if (!!bulkDeleteId.value.length) {
        await store.dispatch('invoices/bulkDeleteInvoices', bulkDeleteId.value);
        bulkDeleteModel.value = false
        bulkDeleteId.value = []
        doSearch()
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
    if (invoices.value.length == 0 || (!!filter.value.invoice_date_from || !!filter.value.invoice_date_to || !!filter.value.due_date_from || !!filter.value.due_date_to)) {
        filter.value = { ...defaultFilter }
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
    resetFilter()
});

</script>
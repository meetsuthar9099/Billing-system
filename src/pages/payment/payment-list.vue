<template>
    <v-dialog v-model="bulkDeleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete these customers?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="bulkdeletePayment()">Yes</v-btn>
                <v-btn @click="deleteModel = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="deleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete this customer?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="deletePayment()">Yes</v-btn>
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
                <v-col cols="6" class="d-flex justify-end">
                    <v-btn class="me-2" variant="outlined" v-if="selectCustomer.length > 1"
                        @click="bulkDeleteModel = true">Bulk
                        Delete</v-btn>

                    <v-btn class="me-2" variant="outlined" @click="isFilterVisible = !isFilterVisible">
                        <span>filter</span>
                        <v-icon>{{ isFilterVisible ? 'mdi-close' : 'mdi-filter' }}</v-icon>
                    </v-btn>
                    <v-btn v-if="checkPermission('Add Payment')" :to="{ path: 'payment/0' }">
                        <v-icon>mdi-plus</v-icon>
                        <span>Add Payment</span>
                    </v-btn>

                </v-col>
            </v-row>
        </div>
        <v-card height="100" elevation="0" v-if="isFilterVisible" class="my-3 pa-5 d-flex align-center">
            <v-row>
                <v-col cols="12" class="pa-0 text-right">
                    <a href="javascript:void(0)" @click="resetFilter" class="me-4">Clear All</a>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="4">
                            <VSelect item-title="name" item-value="_id" :hide-selected="true" label="Select Customer"
                                density="compact" name="display_name" :items="allCustomers" v-model="filter.customer_id"
                                prepend-inner-icon="bx-user" />
                        </v-col>
                        <v-col cols="4">
                            <VTextField label="Payment Number" v-model="filter.payment_number" density="compact">
                            </VTextField>
                        </v-col>
                        <v-col cols="4">
                            <VSelect item-title="name" item-value="value" :hide-selected="true" label="Select Payment Mode"
                                density="compact" name="display_name" :items="paymentModes" v-model="filter.payment_mode"
                                prepend-inner-icon="bx-user" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-card>
        <v-table class="rounded">
            <thead slot="head">
                <tr>
                    <th>
                        <v-checkbox v-model="checkAll" :value="true" @click="checkAllCustomer"
                            ref="myCheckbox"></v-checkbox>
                    </th>
                    <th>Date</th>
                    <th>Paymnent Number</th>
                    <th>Customer</th>
                    <th>Invoice Number</th>
                    <th>Payment Mode</th>
                    <th>Amount</th>
                    <th v-if="checkPermission('Update payment') || checkPermission('Delete Payment')">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in payments" :key="'customer' + index">
                    <td width="100">
                        <v-checkbox :value="item._id" v-model="selectCustomer"></v-checkbox>
                    </td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.payment_number }}</td>
                    <td>{{ item.customer.contact_name ? item.customer.contact_name : '-' }}</td>
                    <td>{{ item.invoice.invoice_number }}</td>
                    <td>{{ item.paymentMode.name }}</td>
                    <td>{{ item.currency.symbol }}&nbsp;{{ item.amount.toFixed(2) }}</td>
                    <td width="200" v-if="checkPermission('Update payment') || checkPermission('Delete Payment')">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-horizontal" color="none" v-bind="props"></v-btn>
                            </template>

                            <v-list>
                                <v-list-item v-if="checkPermission('Update Payment')" :to="'payment/' + item._id">
                                    <v-list-item-title><v-icon>mdi-pencil</v-icon> Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="checkPermission('Delete Payment')" @click="deleteConfirm(item._id)">
                                    <v-list-item-title><v-icon>mdi-delete</v-icon> Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
                <tr v-if="!payments.length > 0">
                    <td colspan="99"><v-icon class="me-2">mdi-alert</v-icon>No data available</td>
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
import {checkPermission}  from '@/mixins/permissionMixin'
const defaultFilter = Object.freeze({
    payment_mode: null,
    customer_id: null,
    payment_number: null,
    limit: 5
})
let deletePaymentId = null
const store = inject('store');
const isFilterVisible = ref(false)
const bulkDeleteModel = ref(false)
const deleteModel = ref(false)
let checkAll = ref(false)
const filter = ref({})
const selectCustomer = ref([])
// const myCheckbox = ref(null);

//computed
const payments = computed(() => { return store.state.payment.payments })
const allCustomers = computed(() => {
    return store.state.invoices.allCustomers;
});
const paymentModes = computed(() => {
    return store.state.payment.paymentModes;
});
const pagination = computed(() => {
    return {
        totalPage: store.state.payment.totalPage,
        limit: store.state.payment.limit,
        currentPage: store.state.payment.currentPage
    }
})

//method
const deleteConfirm = async (id) => {
    deleteModel.value = true
    deletePaymentId = id
}

const doSearch = async () => {
    const query = {
        page: filter.value.currentPage,
        customer_id: filter.value.customer_id ? filter.value.customer_id : '',
        payment_mode: filter.value.payment_mode ? filter.value.payment_mode : '',
        payment_number: filter.value.payment_number,
    }
    await store.dispatch('payment/fetchAll', { query });
}
const deletePayment = async () => {
    if (deletePaymentId) {
        await store.dispatch('payment/deletePayment', deletePaymentId);
        deleteModel.value = false
        doSearch()
    }
}
const bulkdeletePayment = async () => {
    if (!!selectCustomer.value.length) {
        await store.dispatch('customers/bulkdeletePayment', selectCustomer.value);
        bulkDeleteModel.value = false
        selectCustomer.value = []
        doSearch()
    }
}

const resetFilter = () => {
    filter.value = { ...defaultFilter }
}

//watcher
watch(filter, async () => {
    doSearch()
}, { deep: true })

watch(selectCustomer, async (val) => {
    console.log(val, "selectCustomer");
    checkAll.value = !!(val.length === customers.value.length)
}, { deep: true })

const checkAllCustomer = () => {
    if (!checkAll.value) {
        selectCustomer.value = customers.value.map(i => i._id)
    } else {
        selectCustomer.value = []
    }
}

//mounted
onMounted(async () => {
    await store.dispatch("payment/fetchPaymentModes");
    await store.dispatch("invoices/fetchAllCustomers");
    resetFilter()
    doSearch()
});

</script>
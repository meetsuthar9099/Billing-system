<template>
    <v-dialog v-model="bulkDeleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete these customers?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="bulkDeleteCustomer()">Yes</v-btn>
                <v-btn @click="bulkDeleteModel = false">No</v-btn>
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
                <v-btn @click="deleteCustomer()">Yes</v-btn>
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
                    <v-btn v-if="checkPermission('Add Customer')" :to="{ path: 'customer/0' }">
                        <v-icon>mdi-plus</v-icon>
                        <span>Add Customer</span>
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
                            <VTextField label="Display Name" v-model="filter.name" density="compact"></VTextField>
                        </v-col>
                        <v-col cols="4">
                            <VTextField label="Contact Name" v-model="filter.contact_name" density="compact"></VTextField>
                        </v-col>
                        <v-col cols="4">
                            <VTextField label="Phone" v-model="filter.phone" density="compact"></VTextField>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-card>
        <v-table class="rounded">
            <thead slot="head">
                <tr>
                    <th>Name</th>
                    <th>Contact Name</th>
                    <th>Email</th>
                    <th>phone</th>
                    <th v-if="checkPermission('Update Customer') || checkPermission('Delete Customer')">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in customers" :key="'customer' + index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.contact_name ? item.contact_name : '-' }}</td>
                    <td>{{ item.email ? item.email : '-' }}</td>
                    <td>{{ item.phone ? item.phone : '-' }}</td>
                    <td width="200" v-if="checkPermission('Update Customer') || checkPermission('Delete Customer')">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-horizontal" color="none" v-bind="props"></v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-if="checkPermission('Update Customer')" :to="'customer/' + item._id">
                                    <v-list-item-title><v-icon>mdi-pencil</v-icon> Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="checkPermission('Delete Customer')" @click="deleteConfirm(item._id)">
                                    <v-list-item-title><v-icon>mdi-delete</v-icon> Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
                <tr v-if="!customers.length > 0">
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
    currentPage: 1,
    name: '',
    contact_name: '',
    phone: null,
    limit: 5
})
let deleteCustomerId = null
const store = inject('store');
const isFilterVisible = ref(false)
const bulkDeleteModel = ref(false)
const deleteModel = ref(false)
let checkAll = ref(false)
const filter = ref({})
const selectCustomer = ref([])
// const myCheckbox = ref(null);

//computed
const customers = computed(() => { return store.state.customers.customerUsers })

const pagination = computed(() => {
    return {
        totalPage: store.state.customers.totalPage,
        limit: store.state.customers.limit,
        currentPage: store.state.customers.currentPage
    }
})

//method
const deleteConfirm = async (id) => {
    deleteModel.value = true
    deleteCustomerId = id
}
const doSearch = async () => {
    const query = {
        page: filter.value.currentPage,
        name: filter.value.name,
        contact_name: filter.value.contact_name,
        phone: filter.value.phone
    }
    await store.dispatch('customers/fetchAll', { query });
}
const deleteCustomer = async () => {
    if (deleteCustomerId) {
        await store.dispatch('customers/deleteCustomer', deleteCustomerId);
        deleteModel.value = false
        doSearch()
    }
}
const bulkDeleteCustomer = async () => {
    if (!!selectCustomer.value.length) {
        await store.dispatch('customers/bulkDeleteCustomer', selectCustomer.value);
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
    }else{
        selectCustomer.value = []
    }
}

//mounted
onMounted(async () => {
    resetFilter()
});

</script>
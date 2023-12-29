<template>
    <v-dialog v-model="bulkDeleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete these expenses?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="bulkDeleteexpense()">Yes</v-btn>
                <v-btn @click="deleteModel = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="deleteModel" max-width="400">
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text>
                Are you sure you want to delete this expense?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="deleteExpense()">Yes</v-btn>
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
                    <v-btn class="me-2" variant="outlined" v-if="selectExpense.length > 1"
                        @click="bulkDeleteModel = true">Bulk
                        Delete</v-btn>

                    <v-btn class="me-2" variant="outlined" @click="isFilterVisible = !isFilterVisible">
                        <span>filter</span>
                        <v-icon>{{ isFilterVisible ? 'mdi-close' : 'mdi-filter' }}</v-icon>
                    </v-btn>
                    <v-btn v-if="checkPermission('Add Expense')" :to="{ path: 'expense/0' }">
                        <v-icon>mdi-plus</v-icon>
                        <span>Add expense</span>
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
                        <v-col cols="3">
                            <VSelect label="Customer" item-title="name" item-value="_id" :items="customers" v-model="filter.customer" density="compact">
                            </VSelect>
                        </v-col>
                        <v-col cols="3">
                            <VSelect label="Category" item-title="category_name" item-value="_id" :items="categories" v-model="filter.category" density="compact">
                            </VSelect>
                        </v-col>
                        <v-col cols="3">
                            <VTextField type="date" label="From Date" v-model="filter.due_from" density="compact">
                            </VTextField>
                        </v-col>
                        <v-col cols="3">
                            <VTextField type="date" label="To Date" v-model="filter.due_to" density="compact"></VTextField>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-card>
        <v-table class="rounded">
            <thead slot="head">
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Customer</th>
                    <th>Note</th>
                    <th>Amount</th>
                    <th v-if="checkPermission('Update Expense') || checkPermission('Delete Expense')">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in expenses" :key="'expense' + index">
                    <td>{{ moment(item.due_date).format('DD-MM-YYYY') }}</td>
                    <td>{{ item.category ? item.category.category_name : "-" }}</td>
                    <td>{{ item.customer ? item.customer.name : "-" }}</td>
                    <td>{{ item.note ? item.note : '-' }}</td>
                    <td>{{ item.amount ? item.amount : '-' }}</td>
                    <td width="200" v-if="checkPermission('Update Expense') || checkPermission('Delete Expense')">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-horizontal" color="none" v-bind="props"></v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-if="checkPermission('Update Expense')" :to="'expense/' + item._id">
                                    <v-list-item-title><v-icon>mdi-pencil</v-icon> Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="checkPermission('Delete Expense')" @click="deleteConfirm(item._id)">
                                    <v-list-item-title><v-icon>mdi-delete</v-icon> Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
                <tr v-if="!expenses.length > 0">
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
import { checkPermission } from '@/mixins/permissionMixin'
import moment from 'moment';

const defaultFilter = Object.freeze({
    customer: null,
    category: null,
    due_from: null,
    due_to: null,
})
let deleteExpenseId = null
const store = inject('store');
const isFilterVisible = ref(false)
const bulkDeleteModel = ref(false)
const deleteModel = ref(false)
let checkAll = ref(false)
const filter = ref({})
const selectExpense = ref([])
// const myCheckbox = ref(null);

//computed
const customers = computed(() => store.state.expenses.customers)
const categories = computed(() => store.state.expenses.categories)
const expenses = computed(() => { return store.state.expenses.items })

const pagination = computed(() => {
    return {
        totalPage: store.state.expenses.totalPage,
        limit: store.state.expenses.limit,
        currentPage: store.state.expenses.currentPage
    }
})

//method
const deleteConfirm = async (id) => {
    deleteModel.value = true
    deleteExpenseId = id
}
const doSearch = async () => {
    const query = {
        customer: filter.value.customer,
        category: filter.value.category,
        due_from: filter.value.due_from,
        due_to: filter.value.due_to
    }
    await store.dispatch('expenses/fetchExpenses');
}
const deleteExpense = async () => {
    if (deleteExpenseId) {
        await store.dispatch('expenses/deleteExpense', deleteExpenseId);
        deleteModel.value = false
        doSearch()
    }
}
const bulkDeleteexpense = async () => {
    if (!!selectExpense.value.length) {
        await store.dispatch('expenses/bulkDeleteexpense', selectExpense.value);
        bulkDeleteModel.value = false
        selectExpense.value = []
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

watch(selectExpense, async (val) => {
    checkAll.value = !!(val.length === expenses.value.length)
}, { deep: true })

const checkAllexpense = () => {
    if (!checkAll.value) {
        selectExpense.value = expenses.value.map(i => i._id)
    } else {
        selectExpense.value = []
    }
}

//mounted
onMounted(async () => {
    await store.dispatch("expenses/fetchCustomer")
    await store.dispatch("expenses/fetchCategory")
    resetFilter()
});

</script>
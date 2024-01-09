<template>
    <div>
        <v-dialog v-model="addCategory" :overlay="false" max-width="800px" transition="dialog-transition">
            <v-card class="pa-5">
                <v-card-title class="text-center mb-3"><strong>Add Expense Category</strong></v-card-title>
                <v-form @submit.prevent="onSubmit">
                    <VRow>
                        <VCol cols="6">
                            <v-text-field name="name" density="compact" label="Category Name" v-model="model.name" />
                        </VCol>
                        <VCol cols="6">
                            <v-text-field name="description" density="compact" label="Description"
                                v-model="model.description" />
                        </VCol>
                        <VCol cols="6" v-if="model.recurring">
                            <v-text-field name="amount" density="compact" type="number" label="Amount"
                                v-model="model.amount">
                                <template #append-inner>
                                    <h3 class="px-2">₹</h3>
                                </template>
                            </v-text-field>
                        </VCol>
                        <VCol cols="6" v-if="model.recurring">
                            <v-select :items="paymentModes" item-title="name" item-value="_id" name="payment_mode"
                                density="compact" label="Payment Mode" v-model="model.payment_mode" />
                        </VCol>
                        <VCol cols="6" v-if="model.recurring">
                            <v-text-field name="pay_by" density="compact" label="Pay by" v-model="model.pay_by" />
                        </VCol>
                        <VCol cols="6" v-if="model.recurring">
                            <v-text-field name="pay_to" density="compact" label="Pay to" v-model="model.pay_to" />
                        </VCol>
                        <VCol cols="6" v-if="model.recurring">
                            <v-text-field name="note" density="compact" label="Remarks" v-model="model.note" />
                        </VCol>
                        <VCol cols="6">
                            <v-checkbox class="ms-1" name="Recurring" density="compact" label="Recurring" v-model="model.recurring" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="12" class="d-flex justify-end gap-2">
                            <v-btn color="success" type="submit">Create</v-btn>
                            <v-btn color="error" @click="addCategory = false">Back</v-btn>
                        </VCol>
                    </VRow>
                </v-form>
            </v-card>
        </v-dialog>
        <v-card class="mb-5">
            <VRow>
                <VCol cols="6" class="text-start d-flex align-center gap-2 pa-5">
                    <span>Page {{ page }} of {{ totalPages }} - Total: {{ Categories && Categories.length }}</span>
                </VCol>
                <VCol cols="6" class="d-flex justify-end gap-3 align-center pa-5">
                    <div class="w-25">
                        <v-select :items="[5, 10, 15, 20]" v-model="itemsPerPage" density="comfortable" variant="underlined"
                            label="Item Per Page"></v-select>
                    </div>
                    <v-btn @click="addCategory = true"><v-icon>mdi-plus-circle</v-icon>&nbsp;Add</v-btn>
                </VCol>
            </VRow>
        </v-card>
        <VCard>
            <v-table class="rounded">
                <thead slot="head">
                    <tr>
                        <th>sr no</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Recurring</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, i in paginatedCategories">
                        <td>{{ item.index }}</td>
                        <td>{{ item.category_name }}</td>
                        <td>{{ item.description }}</td>
                        <td>{{ item.recurring ? 'Yes' : 'No' }}</td>
                        <td width="auto" class="px-1">
                            <v-btn color="none" elevation="0"
                                @click="deleteCategory(item._id)"><v-icon>mdi-delete</v-icon></v-btn>
                        </td>
                    </tr>
                    <tr v-if="!paginatedCategories.length > 0">
                        <td colspan="99" class="text-center"><v-icon class="me-2">mdi-alert</v-icon>No data available</td>
                    </tr>
                </tbody>
            </v-table>
        </VCard>
        <v-pagination class="mt-5" :length="totalPages" v-model="page"></v-pagination>
    </div>
</template>
  
<script setup>
import { inject } from 'vue';

const store = inject('store');
const Categories = computed(() => store.state.util.expenseCategory)
const addCategory = ref(false)
const model = ref({
    name: "",
    description: "",
    recurring: false,
    amount: "",
    pay_by: "",
    pay_to: "",
    note: "",
    payment_mode: null
})

const itemsPerPage = ref(10)
const paymentModes = computed(() => store.state.util.paymentMode)
const totalPages = computed(() => {
    return Categories.value ? Math.ceil(Categories.value.length / itemsPerPage.value) : 0;
});

const page = ref(1);

const paginatedCategories = computed(() => {
    if (!Categories.value) {
        return [];
    }

    const start = (page.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    Categories.value.forEach(({ }, i) => {
        Categories.value[i].index = i + 1
    });
    return Categories.value.slice(start, end);
});


const deleteCategory = async (id) => {
    try {
        store.dispatch('util/deleteExpenseCategory', id).then(async () => {
            await store.dispatch('util/fetchExpenseCategory')
        })
    } catch (error) {
        console.log(error, "error");
    }
}
const onSubmit = async () => {
    try {
        addCategory.value = false;
        store.dispatch('util/addExpenseCategory', model.value).then(async () => {
            await store.dispatch('util/fetchExpenseCategory')
        })
    } catch (error) {
        console.log(error, "Error fetching Categories");
    }
}
onMounted(async () => {
    await store.dispatch('util/fetchExpenseCategory')
    await store.dispatch('util/fetchAllPaymentMode')
})
</script>
  
  
  
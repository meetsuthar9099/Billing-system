<template>
    <div>
        <v-dialog v-model="addCurrency" :overlay="false" max-width="800px" transition="dialog-transition">
            <v-card class="pa-5">
                <v-card-title class="text-center mb-3"><strong>Add Currency</strong></v-card-title>
                <v-form @submit.prevent="onSubmit">
                    <VRow>
                        <VCol cols="6">
                            <v-text-field name="name" label="Name" v-model="model.name" />
                        </VCol>
                        <VCol cols="6">
                            <v-text-field name="currency" label="Currency" v-model="model.currency" />
                        </VCol>
                        <VCol cols="6">
                            <v-text-field name="code" label="Code" v-model="model.code" />
                        </VCol>
                        <VCol cols="6">
                            <v-text-field name="symbol" label="Symbol" v-model="model.symbol" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="12" class="d-flex justify-end gap-2">
                            <v-btn color="success" type="submit">Create</v-btn>
                            <v-btn color="error" @click="addCurrency = false">Back</v-btn>
                        </VCol>
                    </VRow>
                </v-form>
            </v-card>
        </v-dialog>
        <v-card class="mb-5">
            <VRow>
                <VCol cols="6" class="text-start d-flex align-center gap-2 pa-5">
                    <span>Page {{ page }} of {{ totalPages }} - Total: {{ currencies && currencies.length }}</span>
                </VCol>
                <VCol cols="6" class="d-flex justify-end gap-3 align-center pa-5">
                    <div class="w-25">
                        <v-select :items="[5, 10, 15, 20]" v-model="itemsPerPage" density="comfortable" variant="underlined"
                            label="Item Per Page"></v-select>
                    </div>
                    <v-btn @click="addCurrency = true"><v-icon>mdi-plus-circle</v-icon>&nbsp;Add</v-btn>
                </VCol>
            </VRow>
        </v-card>
        <VCard>
            <v-table class="rounded">
                <thead slot="head">
                    <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Currency</th>
                        <th>Code</th>
                        <th>Symbol</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, i in paginatedCurrencies">
                        <td>{{ item.index }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.currency }}</td>
                        <td>{{ item.code }}</td>
                        <td>{{ item.symbol }}</td>
                        <td class="px-1">
                            <v-btn color="none" elevation="0" @click="deleteCurrency(item._id)"><v-icon>mdi-delete</v-icon></v-btn>
                        </td>
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
const currencies = computed(() => store.state.util.currencies)
const addCurrency = ref(false)
const model = ref({
    name: "",
    currency: "",
    code: "",
    symbol: "",
})

const itemsPerPage = ref(10)

const totalPages = computed(() => {
    return currencies.value ? Math.ceil(currencies.value.length / itemsPerPage.value) : 0;
});

const page = ref(1);
console.log(currencies.value, "SDS");
const paginatedCurrencies = computed(() => {
    if (!currencies.value) {
        return [];
    }

    const start = (page.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    currencies.value.forEach(({ }, i) => {
        currencies.value[i].index = i + 1
    });
    return currencies.value.slice(start, end);
});

const makeDefault = async (id) => {
    try {
        store.dispatch('util/defaultCurrency', id).then(async () => {
            await store.dispatch('util/fetchCurrencies')
        })
    } catch (error) {
        console.log(error, "error");
    }
}

const deleteCurrency = async (id) => {
    try {
        store.dispatch('util/deleteCurrency', id).then(async () => {
            await store.dispatch('util/fetchCurrencies')
        })
    } catch (error) {
        console.log(error, "error");
    }
}
const onSubmit = async () => {
    try {
        addCurrency.value = false;
        store.dispatch('util/addCurrency', model.value).then(async () => {
            await store.dispatch('util/fetchCurrencies')
        })
    } catch (error) {
        console.log(error, "Error fetching currencies");
    }
}
onMounted(async () => {
    await store.dispatch('util/fetchCurrencies')
})
</script>
  
  
  
<template>
    <div>
        <v-dialog v-model="addCountry" :overlay="false" max-width="800px" transition="dialog-transition">
            <v-card class="pa-5">
                <v-card-title class="text-center mb-3"><strong>Add Country</strong></v-card-title>
                <v-form @submit.prevent="onSubmit">
                    <VRow>
                        <VCol cols="6">
                            <v-text-field name="name" label="Name" v-model="model.name" />
                        </VCol>
                        <VCol cols="6">
                            <v-text-field name="code" label="Code" v-model="model.code" />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol cols="12" class="d-flex justify-end gap-2">
                            <v-btn color="success" type="submit">Create</v-btn>
                            <v-btn color="error" @click="addCountry = false">Back</v-btn>
                        </VCol>
                    </VRow>
                </v-form>
            </v-card>
        </v-dialog>
        <v-card class="mb-5">
            <VRow>
                <VCol cols="6" class="text-start d-flex align-center gap-2 pa-5">
                    <span>Page {{ page }} of {{ totalPages }} - Total: {{ Countries && Countries.length }}</span>
                </VCol>
                <VCol cols="6" class="d-flex justify-end gap-3 align-center pa-5">
                    <div class="w-25">
                        <v-select :items="[5, 10, 15, 20]" v-model="itemsPerPage" density="comfortable" variant="underlined"
                            label="Item Per Page"></v-select>
                    </div>
                    <v-btn @click="addCountry = true"><v-icon>mdi-plus-circle</v-icon>&nbsp;Add</v-btn>
                </VCol>
            </VRow>
        </v-card>
        <VCard>
            <v-table class="rounded">
                <thead slot="head">
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in paginatedCountries">
                        <td>{{ item.name }}</td>
                        <td>{{ item.code }}</td>
                        <td class="d-flex gap-2 justify-center align-center">
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn :elevation="0" icon="mdi-dots-horizontal" color="none" v-bind="props"></v-btn>
                                </template>

                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title @click="deleteCountry(item._id)"><v-icon>mdi-delete</v-icon>
                                            Delete</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
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
const Countries = computed(() => store.state.util.countries)
const addCountry = ref(false)
const model = ref({
    name: "",
    code: ""
})

const itemsPerPage = ref(10)

const totalPages = computed(() => {
    return Countries.value ? Math.ceil(Countries.value.length / itemsPerPage.value) : 0;
});

const page = ref(1);
const paginatedCountries = computed(() => {
    if (!Countries.value) {
        return [];
    }

    const start = (page.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return Countries.value.slice(start, end);
});

const deleteCountry = async (id) => {
    try {
        store.dispatch('util/deleteCountry', id).then(async () => {
            await store.dispatch('util/fetchCountries')
        })
    } catch (error) {
        console.log(error, "error");
    }
}
const onSubmit = async () => {
    try {
        addCountry.value = false;
        store.dispatch('util/addCountry', model.value).then(async () => {
            await store.dispatch('util/fetchCountries')
        })
    } catch (error) {
        console.log(error, "Error fetching Countries");
    }
}
onMounted(async () => {
    await store.dispatch('util/fetchCountries')
})
</script>
  
  
  
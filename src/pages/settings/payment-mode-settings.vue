<template>
  <div>
    <v-dialog v-model="addpaymentMode" :overlay="false" max-width="800px" transition="dialog-transition">
      <v-card class="pa-5">
        <v-card-title class="text-center mb-3"><strong>Add Payment Mode</strong></v-card-title>
        <v-form @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="6">
              <v-text-field name="name" label="Key" v-model="model.value" />
            </VCol>
            <VCol cols="6">
              <v-text-field name="paymentMode" label="Label" v-model="model.name" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-end gap-2">
              <v-btn color="success" type="submit">Create</v-btn>
              <v-btn color="error" @click="addpaymentMode = false">Back</v-btn>
            </VCol>
          </VRow>
        </v-form>
      </v-card>
    </v-dialog>
    <v-card class="mb-5" elevation="2">
      <VRow>
        <VCol cols="6" class="text-start d-flex align-center gap-2 pa-5">
          <span>Page {{ page }} of {{ totalPages }} - Total: {{ paymentModes && paymentModes.length }}</span>
        </VCol>
        <VCol cols="6" class="d-flex justify-end gap-3 align-center pa-5">
          <div class="w-25">
            <v-select :items="[5, 10, 15, 20]" v-model="itemsPerPage" density="comfortable" variant="underlined"
              label="Item Per Page"></v-select>
          </div>
          <v-btn @click="addpaymentMode = true"><v-icon>mdi-plus-circle</v-icon>&nbsp;Add</v-btn>
        </VCol>
      </VRow>
    </v-card>
    <VCard elevation="0">
      <v-table class="rounded" >
        <thead slot="head">
          <tr>
            <th>sr no</th>
            <th>Key</th>
            <th>Label</th>
            <th class="ps-7">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item, i in paginatedpaymentModes">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.name }}</td>
            <td width="auto">
              <v-btn color="none" elevation="0" @click="deletePaymentMode(item._id)"><v-icon>mdi-delete</v-icon></v-btn>
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
const paymentModes = computed(() => store.state.util.paymentMode)
const addpaymentMode = ref(false)
const model = ref({
  value: "",
  name: "",
})

const itemsPerPage = ref(10)

const totalPages = computed(() => {
  return paymentModes.value ? Math.ceil(paymentModes.value.length / itemsPerPage.value) : 0;
});

const page = ref(1);
console.log(paymentModes.value, "SDS");
const paginatedpaymentModes = computed(() => {
  if (!paymentModes.value) {
    return [];
  }

  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  paymentModes.value.forEach(({},i) => {
    paymentModes.value[i].index = i + 1
  });
  return paymentModes.value.slice(start, end);
});


const deletePaymentMode = async (id) => {
  store.dispatch('util/deletePaymentMode', id).then(async () => {
    await store.dispatch('util/fetchAllPaymentMode')
  }).catch((err) => {
    console.log(err, "Errorororor");
  })
}
const onSubmit = () => {
  addpaymentMode.value = false;
  store.dispatch('util/addPaymentMode', model.value).then(async () => {
    await store.dispatch('util/fetchAllPaymentMode')
  }).catch((err) => {
    console.log(err, "Error fetching paymentModes");
  })
}
onMounted(async () => {
  await store.dispatch('util/fetchAllPaymentMode')
})
</script>



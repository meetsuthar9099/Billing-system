<template>
  <v-app>
    <v-row>
      <v-col cols="12" md="3" class="d-none d-md-block  listing-invoice">
        <v-card rounded width="100%" max-height="900" class="pa-3 overflow-auto h-100">
          <v-card class="pa-0 ma-0" v-for="(item, index) in invoices" :key="index + 'invoices'"
            :color="id == item._id ? 'primary' : ''" @click="changeInvoice(item._id)" link>
            <template #title>
              <v-row>
                <v-col cols="6">
                  <span>{{ item.customer.contact_name }}</span>
                  <p class="text-subtitle-2 ma-0">{{ item.invoice_number }}</p>
                  <div class="chip-color">
                    <VChip class="payment-status"
                      :color="item.status == 1 ? 'error' : item.status == 2 ? 'warning' : item.status == 4 ? 'error' : 'success'">
                      {{ item.payment_status == 1 ? 'UNPAID' : item.payment_status == 2 ?
                      'PARTIALLY PAID' : 'PAID' }}
                    </VChip>
                  </div>
                </v-col>
                <v-col cols="6" class="d-flex flex-column justify-center align-end">
                  <span>{{ item.currency[0]?.symbol }}&nbsp;{{ item.grand_total }}</span>
                  <h5>{{ moment(item.invoice_date).format('DD-MM-YYYY') }}</h5>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card width="100%" height="100%" max-height="900">
          <div class="position-absolute w-100 h-100 d-flex justify-center align-center" style="z-index: -1;">
            <v-progress-circular indeterminate :size="60" :width="10"></v-progress-circular>
          </div>
          <embed :src="url" v-show="!loading" width="100%" height="100%" zoom="100%" style="z-index:2;">
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup>
  import moment from "moment";
  import { inject, onMounted } from 'vue';
  import { useRoute, useRouter } from "vue-router";
  const store = inject("store");
  const baseUrl = inject("baseUrl");
  const route = useRoute()
  const router = useRouter()
  const id = computed(() => { return route.params.id })
  const url = ref(baseUrl + "/invoiceGenerate/" + id.value)
  const loading = ref(true)
  const changeInvoice = (newId) => {
    if (id.value !== newId) {
      loading.value = true;
      url.value = baseUrl + "/invoiceGenerate/" + newId + "#zoom=100"
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      router.push({ params: { id: newId } })
    }
  }
  const invoices = computed(() => store.state.invoices.items)

  onMounted(async () => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
    await store.dispatch("invoices/fetchAll");
  })
</script>
<style>
  .v-card-item {
    padding: 1rem 1.5rem !important;
  }

  .listing-invoice .v-slide-group__content button {
    display: flex;
    padding: 30px;
  }

  .listing-invoice ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  .listing-invoice ::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 10px;
  }

  /* Handle */
  .listing-invoice ::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 10px;
  }

  .chip-color .text-success {
    background-color: #4CAF50;
  }

  .chip-color .text-info {
    background-color: #2196F3;
  }

  .chip-color .text-warning {
    background-color: #FFA500;
  }

  .chip-color .text-error {
    background-color: #FF1744;
  }

  .chip-color .v-chip__content {
    color: #fefefe;
  }
</style>

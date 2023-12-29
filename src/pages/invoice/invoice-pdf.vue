<template>
    <v-app>
        <v-row>
            <v-col cols="12" md="3" class="d-none d-md-block">
                <v-card rounded width="100%" class="pa-3 overflow-auto h-100">
                    <v-card class="pa-0 ma-0" v-for="(item, index) in invoices" :key="index + 'invoices'"
                        :color="id == item._id ? 'primary' : ''" @click="changeInvoice(item._id)" link>
                        <template #title>
                            <v-row>
                                <v-col cols="6">
                                    <span>{{ item.customer.contact_name }}</span>
                                    <p class="text-subtitle-2 ma-0">{{ item.invoice_number }}</p>
                                    <div class="badge-pdf-align">
                                        <VBadge class="rounded-0"
                                            :color="item.status == 1 ? '#fef7d1' : item.status == 2 ? '#fef7d1' : '#c3ecd5'"
                                            :content="item.status == 1 ? 'DRAFT' : item.status == 2 ? 'SENT' : 'COMPLETED'">
                                        </VBadge>
                                    </div>
                                </v-col>
                                <v-col cols="6" class="d-flex flex-column justify-center align-end">
                                    <span>{{ item.currency[0].symbol }}&nbsp;{{ item.grand_total }}</span>
                                    <h5>{{ moment(item.invoice_date).format('DD-MM-YYYY') }}</h5>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card>
                </v-card>
            </v-col>
            <v-col cols="12" md="9">
                <v-card width="100%" height="100%">
                    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
                    <embed :src="url" v-show="!loading" width="100%" height="100%" zoom="100%">
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
const invoices = computed(() => { return store.state.invoices.items })

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

.badge-pdf-align .v-badge__badge {
    bottom: calc(100% - 5px) !important;
    left: calc(100% - 0px) !important;
}
</style>
<template>
    <div>
        <VCard class="px-8 pb-8 border-bottom h-screen">
            <VCardTitle class="mt-4 pa-0">
                <h3>Reports</h3>
            </VCardTitle>
            <div class="d-flex justify-space-between">
                <VTabs v-model="model.type">
                    <VTab value="sales">Sales</VTab>
                    <VTab value="profit">Profit & Loss</VTab>
                    <VTab value="expenses">Expenses</VTab>
                    <VTab value="taxes">Taxes</VTab>
                </VTabs>
                <v-btn class="align-self-center" color="primary" variant="outlined" @click="exportExcel"><v-icon
                        class="me-2">mdi-file-excel</v-icon>Export Excel</v-btn>
            </div>
            <VRow>
                <VCol cols="4">
                    <div class="pa-8 gap-2">
                        <VRow>
                            <VCol cols="12">
                                <VSelect density="comfortable" item-title="value" item-value="key"
                                    :items="selectedDateRange" label="Select Date Range" v-model="model.date_range">
                                </VSelect>
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol auto>
                                <VTextField density="comfortable" type="date" class="w-100" label="Date From"
                                    v-model="model.date_from">
                                </VTextField>
                            </VCol>
                            <VCol cols="1" class="d-flex justify-center align-center">
                                <h1>-</h1>
                            </VCol>
                            <VCol auto>
                                <VTextField density="comfortable" type="date" class="w-100" label="Date To"
                                    v-model="model.date_to">
                                </VTextField>
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol>
                                <v-btn variant="outlined" @click="changeValues">Update Report</v-btn>
                            </VCol>
                        </VRow>
                    </div>
                </VCol>
                <VCol cols="8">
                    <div class="h-100 pt-8">
                        <v-window v-model="model.type" class="w-100">
                            <v-window-item value="sales">
                                <v-card border class="overflow-x-hidden pa-5">
                                    <h2 class="text-center">Total Sales</h2>
                                    <div v-for="item in reports.customer">
                                        <h3 class="pa-1">{{ item.customerName }}</h3>
                                        <VRow class="px-3 mt-0 " v-for="i in item.invoices">
                                            <VCol cols="6" class="py-2"><span class="ms-4">{{ i.invoice_number }}</span>
                                            </VCol>
                                            <VCol cols="6" class="text-end py-2"><span> {{ i.currencyDetails.symbol }} {{
                                                i.grand_total }}</span></VCol>
                                        </VRow>
                                        <v-divider class="my-3"></v-divider>
                                        <VRow class="px-3">
                                            <VCol cols="12" class="text-end">{{ item.totalGrandTotal }}
                                            </VCol>
                                        </VRow>
                                    </div>

                                    <VRow class="pa-3">
                                        <VCol cols="6">
                                            <h3>Total Sales:</h3>
                                        </VCol>
                                        <VCol cols="6" class="text-end"><span v-for="i in total"><span>{{ i.symbol }} {{
                                            i.amount }}</span><br></span><span v-if="!total?.length">0</span></VCol>
                                    </VRow>
                                </v-card>
                            </v-window-item>
                            <v-window-item value="profit">
                                <v-card border class="overflow-x-hidden pa-5">
                                    <h2 class="text-center">Profit & Loss</h2>
                                    <VRow>
                                        <VCol cols="6">
                                            <span>Profit</span>
                                        </VCol>
                                        <VCol cols="6" class="text-end">
                                            <span>{{ reports.profit }}</span>
                                        </VCol>
                                    </VRow>
                                    <VRow>
                                        <VCol cols="6">
                                            <span>Expenses</span>
                                        </VCol>
                                        <VCol cols="6" class="text-end">
                                            <span>{{ reports.loss }}</span>
                                        </VCol>
                                    </VRow>
                                    <VRow>
                                        <VCol cols="6">
                                            <span>Taxes</span>
                                        </VCol>
                                        <VCol cols="6" class="text-end">
                                            <span>{{ reports.taxes }}</span>
                                        </VCol>
                                    </VRow>
                                    <v-divider class="my-3"></v-divider>
                                    <VRow>
                                        <VCol cols="6">
                                            <h3>Net Profit</h3>
                                        </VCol>
                                        <VCol cols="6" class="text-end">
                                            <span>{{ reports.total }}</span>
                                        </VCol>
                                    </VRow>
                                </v-card>
                            </v-window-item>
                            <v-window-item value="expenses">
                                <v-card border class="overflow-x-hidden pa-5">
                                    <h2 class="text-center">Expenses</h2>
                                    <VRow v-for="i in reports.expenses">
                                        <VCol cols="6"><span>{{ i.category_name }}</span></VCol>
                                        <VCol cols="6" class="text-end"><span>{{ i.amount }}</span></VCol>
                                    </VRow>
                                    <v-divider class="my-3"></v-divider>
                                    <VRow>
                                        <VCol cols="6">
                                            <h3>Total Expenses</h3>
                                        </VCol>
                                        <VCol cols="6" class="text-end"><span>{{ reports.total }}</span></VCol>
                                    </VRow>

                                </v-card>
                            </v-window-item>
                            <v-window-item value="taxes">
                                <v-card border class="overflow-x-hidden pa-5">
                                    <h2 class="text-center">Taxes</h2>
                                    <VRow>
                                        <VCol cols="6"><span>CGST</span></VCol>
                                        <VCol cols="6" class="text-end"><span>{{ reports.allTax?.cgst }}</span></VCol>
                                    </VRow>
                                    <VRow>
                                        <VCol cols="6"><span>SGST</span></VCol>
                                        <VCol cols="6" class="text-end"><span>{{ reports.allTax?.sgst }}</span></VCol>
                                    </VRow>
                                    <VRow>
                                        <VCol cols="6"><span>IGST</span></VCol>
                                        <VCol cols="6" class="text-end"><span>{{ reports.allTax?.igst }}</span></VCol>
                                    </VRow>
                                    <v-divider class="my-3"></v-divider>
                                    <VRow>
                                        <VCol cols="6">
                                            <h3>Total Taxes</h3>
                                        </VCol>
                                        <VCol cols="6" class="text-end"><span>{{ reports.totalGst }}</span></VCol>
                                    </VRow>
                                </v-card>
                            </v-window-item>
                        </v-window>
                    </div>
                </VCol>
            </VRow>
        </VCard>
    </div>
</template>
<script setup>
import { watch, inject } from 'vue'
import moment from 'moment';
const store = inject('store')
const selectedDateRange = computed(() => {
    return [
        { key: "today", value: "Today" },
        { key: "this_week", value: "This Week" },
        { key: "this_month", value: "This Month" },
        { key: "this_quarter", value: "This Quarter" },
        { key: "this_year", value: "This Year" },
        { key: "previous_week", value: "Previous Week" },
        { key: "previous_month", value: "Previous Month" },
        { key: "previous_quarter", value: "Previous Quarter" },
        { key: "previous_year", value: "Previous Year" },
    ]
})

const model = ref({
    type: "sales",
    date_range: "this_month",
    date_from: "",
    date_to: "",
})
const reports = computed(() => store.state.reports.data)
const total = computed(() => {
    return reports.value.total && Object.entries(reports.value.total).map(([currency, item]) => ({
        currency,
        amount: item.total,
        symbol: item.symbol
    }))
})
watchEffect(() => {
    if (model.value.date_range) {
        switch (model.value.date_range) {
            case "today":
                model.value.date_from = moment().startOf('day').format('YYYY-MM-DD')
                model.value.date_to = moment().endOf('day').format('YYYY-MM-DD')
                break;
            case "this_week":
                model.value.date_from = moment().startOf('week').format('YYYY-MM-DD')
                model.value.date_to = moment().endOf('week').format('YYYY-MM-DD')
                break;
            case "this_month":
                model.value.date_from = moment().startOf('month').format('YYYY-MM-DD')
                model.value.date_to = moment().endOf('month').format('YYYY-MM-DD')
                break;
            case "this_quarter":
                model.value.date_from = moment().startOf('quarter').format('YYYY-MM-DD')    
                model.value.date_to = moment().endOf('quarter').format('YYYY-MM-DD')
                break;
            case "this_year":
                model.value.date_from = moment().month() >= 3 ?
                    moment().startOf('year').add(3, 'months').format('YYYY-MM-DD') :
                    moment().subtract(1, 'year').startOf('year').add(3, 'months').format('YYYY-MM-DD');

                model.value.date_to = moment().month() >= 3 ?
                    moment().endOf('year').add(3, 'months').format('YYYY-MM-DD') :
                    moment().subtract(1, 'year').endOf('year').add(3, 'months').format('YYYY-MM-DD')

                break;
            case "previous_week":
                model.value.date_from = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD')
                model.value.date_to = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD')
                break;
            case "previous_month":
                model.value.date_from = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                model.value.date_to = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                break;
            case "previous_quarter":
                model.value.date_from = moment().subtract(1, 'quarter').startOf('quarter').format('YYYY-MM-DD')
                model.value.date_to = moment().subtract(1, 'quarter').endOf('quarter').format('YYYY-MM-DD')
                break;
            case "previous_year":
                model.value.date_from = moment().month() >= 3 ? moment().subtract(1, 'year').startOf('year').add(3, 'months').format('YYYY-MM-DD') : moment().subtract(2, 'years').startOf('year').add(3, 'months').format('YYYY-MM-DD');
                model.value.date_to = moment().month() >= 3 ? moment().subtract(1, 'year').endOf('year').add(3, 'months').format('YYYY-MM-DD') : moment().subtract(2, 'years').endOf('year').add(3, 'months').format('YYYY-MM-DD');
                break;
            default:
                break;
        }
    }
})
const changeValues = async ({ isExcel } = false) => {
    try {
        const dateFrom = model.value.date_from
        const dateTo = model.value.date_to
        const value = {
            type: model.value.type, dateFrom, dateTo, isExcel
        }
        await store.dispatch('reports/fetchData', value)
    } catch (error) {
        console.error(error.message);
    }
}
const exportExcel = () => {
    try {
        return changeValues({ isExcel: true })
    } catch (error) {
        console.error(error.message);
    }
}
watch(() => model.value.type, async () => {
    changeValues()
}, { immediate: true })
</script>

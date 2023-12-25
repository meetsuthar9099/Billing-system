<template>
    <div>
        <VCard class="px-8 border-bottom h-screen">
            <VCardTitle class="mt-4 pa-0">
                <h3>Reports</h3>
            </VCardTitle>
            <div>
                <VTabs v-model="model.type">
                    <VTab value="sales">Sales</VTab>
                    <VTab value="profit">Profit & Loss</VTab>
                    <VTab value="expenses">Expenses</VTab>
                    <VTab value="taxes">Taxes</VTab>
                </VTabs>
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
                        <VRow v-if="model.type == 'sales'">
                            <VCol cols="12">
                                <VSelect :items="reportType" item-title="value" item-value="key" density="comfortable" v-model="model.report_type"
                                    label="Report Type"></VSelect>
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol>
                                <v-btn variant="outlined">Update Report</v-btn>
                            </VCol>
                        </VRow>
                    </div>
                </VCol>

                <VCol cols="8">
                    <div class="h-screen">
                        <embed width="100%" height="100%" src="http://localhost:3000/reports" />
                    </div>
                </VCol>
            </VRow>
        </VCard>
    </div>
</template>
<script setup>
import moment from 'moment';
const reportType = computed(() => {
    return [
        { key: "customer", value: "By Customer" },
        { key: "item", value: "By Item" }
    ]
})
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
    date_range: "today",
    date_from: "",
    date_to: "",
    report_type: "customer"
})
watchEffect(() => {
    if (model.value.date_range) {
        console.log(model.value.date_range, "model.date_range");
        switch (model.value.date_range) {
            case "today":
                model.value.date_from = moment().format('YYYY-MM-DD')
                model.value.date_to = moment().format('YYYY-MM-DD')
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
                model.value.date_from = moment().startOf('year').format('YYYY-MM-DD')
                model.value.date_to = moment().endOf('year').format('YYYY-MM-DD')
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
                model.value.date_from = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
                model.value.date_to = moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
                break;
            default:
                break;
        }
    }
    if(model.value.type){
        store.dispatch('expenses/')
    }
})
</script>

<template>
  <v-card class="pa-4 d-flex align-center mb-6">
    <h3 class="w-50 d-md-block d-none">Dashboard Filter</h3>
    <VRow class="w-50">
      <VCol cols="12" md="3" class="d-flex justify-center align-center px-0">
        <VTextField density="compact" type="date" label="Date From" v-model="model.date_from">
        </VTextField>
      </VCol>
      <VCol cols="12" md="1" class="pa-0 d-md-flex justify-center align-center d-none">
        <h1>-</h1>
      </VCol>
      <VCol cols="12" md="3" class="d-flex justify-center align-center px-0">
        <VTextField density="compact" type="date" label="Date To" v-model="model.date_to"></VTextField>
      </VCol>
      <VCol cols="12" md="5" class="d-flex justify-center align-center">
        <VSelect class="w-100 px-2" density="compact" item-title="value" item-value="key" :items="selectedDateRange"
          label="Select Date Range" v-model="model.date_range">
        </VSelect>
      </VCol>
    </VRow>
  </v-card>
  <VRow>
    <VCol cols="12" sm="12">
      <VRow>
        <VCol cols="12" md="4" class="sales-card">
          <CardStatisticsVertical v-bind="{
            title: 'Sales',
            image: wallet,
            stats: totalSales ? totalSales : '0',
            change: 0,
          }" />
        </VCol>
        <VCol cols="12" md="4">
          <CardStatisticsVertical v-bind="{
            title: 'Payment recieved',
            image: chart,
            stats: '₹ ' + dashboardData?.totalIncome,
            change: parseFloat(dashboardData?.gainFromLastYear),
          }" />
        </VCol>
        <VCol cols="12" md="4">
          <CardStatisticsVertical v-bind="{
            title: 'Expenses',
            image: paypal,
            stats: '₹ ' + dashboardData?.totalExpense,
            change: parseFloat(dashboardData?.expenseFromLastYear),
          }" />
        </VCol>

        <!-- 👉 Sales -->

      </VRow>
    </VCol>

    <!-- 👉 Total Revenue -->

    <VCol cols="12" md="8" order="2" order-md="1">
      <AnalyticsTotalRevenue :monthlyIncomeArray="monthlyIncomeArray" :monthlyExpenseArray="monthlyExpenseArray" />
    </VCol>

    <VCol cols="12" sm="8" md="4" order="1" order-md="2">
      <VRow>
        <VCol cols="12" sm="12">
          <CardStatisticsVertical v-bind="{
            title: 'Receivables',
            image: card,
            stats: totalDueAmount ? totalDueAmount : '0',
            change: 0,
          }" />
        </VCol>
      </VRow>

      <VRow>
        <!-- 👉 Profit Report -->
        <VCol cols="12" sm="12">
          <AnalyticsProfitReport :dashboardData="dashboardData" :profileReportArray="profileReportArray" />
        </VCol>
      </VRow>
    </VCol>
    <!-- 👉 Order Statistics -->
    <!-- <VCol
    cols="12"
    md="4"
    sm="6"
    order="3"
  >
    <AnalyticsFinanceTabs :monthlyIncomeArray="monthlyIncomeArray" :monthlyExpenseArray="monthlyExpenseArray" />
  </VCol> -->
  </VRow>
</template>
<script setup>
import { inject, onMounted, watchEffect } from 'vue';
import moment from 'moment'
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue'
import AnalyticsFinanceTabs from '@/views/dashboard/AnalyticsFinanceTab.vue'
import AnalyticsOrderStatistics from '@/views/dashboard/AnalyticsOrderStatistics.vue'
import AnalyticsProfitReport from '@/views/dashboard/AnalyticsProfitReport.vue'
import AnalyticsTotalRevenue from '@/views/dashboard/AnalyticsTotalRevenue.vue'
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'
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
  date_range: "this_year",
  date_from: "",
  date_to: "",
})



// 👉 Images
import chart from '@images/cards/chart-success.png'
import card from '@images/cards/credit-card-primary.png'
import paypal from '@images/cards/paypal-error.png'
import wallet from '@images/cards/wallet-info.png'
const store = inject('store');
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
        model.value.date_from =
          moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD')
        model.value.date_to =
          moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD')
        break;
      case "previous_month":
        model.value.date_from =
          moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        model.value.date_to =
          moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        break;
      case "previous_quarter":
        model.value.date_from =
          moment().subtract(1, 'quarter').startOf('quarter').format('YYYY-MM-DD')
        model.value.date_to =
          moment().subtract(1, 'quarter').endOf('quarter').format('YYYY-MM-DD')
        break;
      case "previous_year":
        model.value.date_from = moment().month() >= 3 ?
          moment().subtract(1, 'year').startOf('year').add(3, 'months').format('YYYY-MM-DD') :
          moment().subtract(2, 'year').startOf('year').add(3, 'months').format('YYYY-MM-DD');
        model.value.date_to = moment().month() >= 3 ?
          moment().subtract(1, 'year').endOf('year').add(3, 'months').format('YYYY-MM-DD') :
          moment().subtract(2, 'year').endOf('year').add(3, 'months').format('YYYY-MM-DD');
        break;
      default:
        break;
    }
  }
})
const doSearch = async () => {
  await store.dispatch('dashboard/fetch', { date_from: model.value.date_from, date_to: model.value.date_to })
}
watchEffect(() => {
  if (model.value.date_from && model.value.date_to) {
    doSearch()
  }
})

const dashboardData = computed(() => {
  return store.state.dashboard.data;
});
const monthlyIncomeArray = computed(() => {
  return dashboardData.value?.monthlyIncomeArray;
});
const monthlyExpenseArray = computed(() => {
  return dashboardData.value?.monthlyExpensesArray;
});
console.log(monthlyExpenseArray.value, "monthlyExpenseArrayValue");
const profileReportArray = computed(() => {
  return dashboardData.value?.profileReportArray
    ;
});
const totalSales = computed(() => {
  return dashboardData.value?.totalSales && Object.entries(dashboardData.value?.totalSales).map(([currency, item]) => `${item.symbol} ${item.total}`).join('<br/>')
})
const totalDueAmount = computed(() => {
  return dashboardData.value?.totalDueAmount && Object.entries(dashboardData.value?.totalDueAmount).map(([currency, item]) => `${item.symbol} ${item.total}`).join('<br/>')
})


</script>
<style>
.sales-card:deep(.text-h5.text-no-wrap.mb-3) {
  white-space: break;
}
</style>
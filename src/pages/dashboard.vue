<template>
  <VRow>
    <!-- 👉 Congratulations -->
    <!-- <VCol
      cols="12"
      md="8"
    >
      <AnalyticsCongratulations />
    </VCol> -->

    <VCol cols="12" sm="12">
      <VRow>
        <VCol cols="12" md="4" class="sales-card">
          <CardStatisticsVertical v-bind="{
            title: 'Sales',
            image: wallet,
            stats: totalSales?totalSales:'0',
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
            stats:'₹ ' + dashboardData?.totalExpense ,
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
            stats: totalDueAmount?totalDueAmount:'0',
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
import { inject, onMounted } from 'vue';
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue'
import AnalyticsFinanceTabs from '@/views/dashboard/AnalyticsFinanceTab.vue'
import AnalyticsOrderStatistics from '@/views/dashboard/AnalyticsOrderStatistics.vue'
import AnalyticsProfitReport from '@/views/dashboard/AnalyticsProfitReport.vue'
import AnalyticsTotalRevenue from '@/views/dashboard/AnalyticsTotalRevenue.vue'
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'

// 👉 Images
import chart from '@images/cards/chart-success.png'
import card from '@images/cards/credit-card-primary.png'
import paypal from '@images/cards/paypal-error.png'
import wallet from '@images/cards/wallet-info.png'
const store = inject('store');

onMounted(async () => {
  await store.dispatch('dashboard/fetch')
});
const dashboardData = computed(() => {
  return store.state.dashboard.data;
});
const monthlyIncomeArray = computed( () => {
  return dashboardData.value?.monthlyIncomeArray;
});
const monthlyExpenseArray = computed(() => {
  return  dashboardData.value?.monthlyExpensesArray;
});
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
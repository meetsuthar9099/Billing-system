<script setup>
import VueApexCharts from 'vue3-apexcharts'
import moment from 'moment';
import {
  useDisplay,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'
const props = defineProps({
  profileReportArray: {
    type: Array,
  },
  dashboardData: {
    type: Object,
  },
})

const vuetifyTheme = useTheme()
const display = useDisplay()

const series = computed(() => [{
  data: props.profileReportArray
}
])

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 12,
        blur: 4,
        left: 0,
        enabled: true,
        opacity: 0.12,
        color: currentTheme.warning,
      },
    },
    tooltip: { enabled: false },
    colors: [`rgba(${hexToRgb(String(currentTheme.warning))}, 1)`],
    stroke: {
      width: 4,
      curve: 'smooth',
      lineCap: 'round',
    },
    grid: {
      show: false,
      padding: {
        top: -21,
        left: -5,
        bottom: -8,
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { labels: { show: false } },
    responsive: [
      {
        breakpoint: display.thresholds.value.lg,
        options: {
          chart: {
            height: 151,
            width: '100%',
          },
        },
      },
      {
        breakpoint: display.thresholds.value.md,
        options: {
          chart: {
            height: 131,
            width: '100%',
          },
        },
      },
    ],
  }
})
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between h-100">
      <div class="d-flex flex-column gap-y-4">
        <div>
          <h6 class="text-h6 text-no-wrap mb-1">
            Profile Report
          </h6>
          <VChip color="warning">
            {{ moment().year() }}
          </VChip>
        </div>

        <div>
          <div class="text-sm" :class="{
            'text-success': props.dashboardData?.profitFromLastYear > 0,
            'text-error': props.dashboardData?.profitFromLastYear < 0
          }">
          </div>

          <h5 class="text-h5">
            ₹ {{ props.dashboardData?.totalProfit }}
          </h5>
        </div>
      </div>

      <div class="h-100 d-flex align-center">
        <VueApexCharts type="line" :height="131" width="80%" :options="chartOptions" :series="series" />
      </div>
    </VCardText>
  </VCard>
</template>

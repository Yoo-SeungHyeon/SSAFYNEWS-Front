<script setup lang="ts">
import { defineProps, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
)

interface WeeklyData {
  date: string  // YYYY-MM-DD
  count: number
}

const props = defineProps<{
  data: WeeklyData[]
}>()

const chartData = computed(() => ({
  labels: props.data.map(d => d.date),
  datasets: [
    {
      label: '읽은 기사 수',
      data: props.data.map(d => d.count),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#4F46E5',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#374151',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#6B7280',
      },
    },
  },
}
</script>

<template>
  <div class="w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

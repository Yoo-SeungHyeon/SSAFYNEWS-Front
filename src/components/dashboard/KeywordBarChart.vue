<script setup lang="ts">
import { defineProps, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController)

interface KeywordData {
  keyword: string
  count: number
}

const props = defineProps<{
  data: KeywordData[]
}>()

const chartData = computed(() => ({
  labels: props.data.map(d => d.keyword),
  datasets: [
    {
      label: '등장 빈도',
      data: props.data.map(d => d.count),
      backgroundColor: '#4F46E5',
      borderRadius: 4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#374151',
        font: {
          size: 12,
        },
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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

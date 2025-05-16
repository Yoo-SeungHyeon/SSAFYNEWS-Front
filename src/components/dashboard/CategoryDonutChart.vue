<script setup lang="ts">
import { defineProps, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  DoughnutController,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import type { Plugin } from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(Title, Tooltip, ArcElement, DoughnutController)

interface CategoryData {
  category: string
  count: number
}

const props = defineProps<{
  data: CategoryData[]
}>()

// 색상 팔레트
const colors = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
  '#6366F1', '#8B5CF6', '#F472B6', '#34D399',
  '#FB923C', '#60A5FA', '#A78BFA', '#F87171',
  '#4ADE80', '#FCD34D', '#06B6D4', '#D946EF',
  '#DC2626', '#FCA5A5', '#7C3AED', '#14B8A6'
]

// 총 개수 계산
const totalCount = computed(() =>
  props.data.reduce((sum, d) => sum + d.count, 0)
)

// 도넛 차트 데이터
const chartData = computed(() => ({
  labels: props.data.map(d => d.category),
  datasets: [
    {
      data: props.data.map(d => d.count),
      backgroundColor: props.data.map((_, i) => colors[i % colors.length]),
      borderWidth: 1,
    },
  ],
}))

// 중앙 텍스트 플러그인
const centerTextPlugin: Plugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { width, height, ctx } = chart
    ctx.save()
    ctx.font = 'bold 16px sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`총 ${totalCount.value}건`, width / 2, height / 2)
    ctx.restore()
  }
}

// 옵션 설정
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    centerText: true,
  },
}
</script>

<template>
  <div class="h-[200px]">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
      :plugins="[centerTextPlugin]"
    />
  </div>
</template>

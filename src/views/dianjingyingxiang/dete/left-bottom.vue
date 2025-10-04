<template>
  <div class="chart-container">
    <div class="chart-tabs">
      <button v-for="(tab, index) in chartTypes" :key="index" :class="['tab-btn', { active: activeTab === index }]"
        @click="switchChart(index)">
        {{ tab.name }}
      </button>
    </div>
    <div ref="chartContainer" class="chart-wrapper"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ImageQualityChart',
  props: {
    chartData: {
      type: Object,
      required: true,
      validator(value) {
        return value.images && value.indicators && value.scores
      }
    }
  },
  data() {
    return {
      chart: null,
      activeTab: 0,
      chartTypes: [
        { name: '雷达图', type: 'radar' },
        { name: '柱状图', type: 'bar' },
        { name: '折线图', type: 'line' }
      ]
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    chartData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer, null, { renderer: 'canvas' })
      this.$refs.chartContainer.style.background = 'transparent'
      this.updateChart()
    },
    switchChart(index) {
      this.activeTab = index
      this.updateChart()
    },
    updateChart() {
      if (!this.chart || !this.chartData) return
      const { type } = this.chartTypes[this.activeTab]
      let option = {}
      const common = { backgroundColor: 'transparent', textStyle: { color: '#fff' } }
      switch (type) {
        case 'radar': option = Object.assign(common, this.getRadarOption()); break
        case 'bar': option = Object.assign(common, this.getBarOption()); break
        case 'line': option = Object.assign(common, this.getLineOption()); break
      }
      this.chart.setOption(option, true)
    },
    getRadarOption() {
      const { images, indicators, scores } = this.chartData
      return {
        title: { text: '图片画质评价雷达图', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        legend: { data: images, bottom: 4, textStyle: { color: '#fff', fontSize: 12 } },
        radar: { indicator: indicators.map(name => ({ name, max: 20 })), radius: '55%', center: ['50%', '55%'], splitLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } } },
        series: [{ type: 'radar', data: images.map((name, i) => ({ value: scores[i], name, areaStyle: { opacity: 0.2 }, lineStyle: { width: 1.5 } })) }],
        color: ['#4ECDC4', '#FF6B6B', '#45B7D1'],
      }
    },
    getBarOption() {
      const { images, indicators, scores } = this.chartData
      return {
        title: { text: '图片画质评价柱状图', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: images, bottom: 4, textStyle: { color: '#fff', fontSize: 12 } },
        grid: { left: '3%', right: '3%', bottom: '20%', containLabel: true },
        xAxis: { type: 'category', data: indicators, axisLabel: { rotate: 30, color: '#fff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } } },
        yAxis: { type: 'value', min: 0, max: 20, axisLabel: { color: '#fff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
        series: images.map((name, i) => ({ name, type: 'bar', data: scores[i], barWidth: '20%', itemStyle: { borderRadius: 3 } })),
        color: ['#4ECDC4', '#FF6B6B', '#45B7D1']
      }
    },
    getLineOption() {
      const { images, indicators, scores } = this.chartData
      return {
        title: { text: '图片画质评价折线图', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: images, bottom: 4, textStyle: { color: '#fff', fontSize: 12 } },
        grid: { left: '3%', right: '3%', bottom: '20%', containLabel: true },
        xAxis: { type: 'category', data: indicators, axisLabel: { rotate: 30, color: '#fff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } } },
        yAxis: { type: 'value', min: 0, max: 20, axisLabel: { color: '#fff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
        series: images.map((name, i) => ({ name, type: 'line', data: scores[i], smooth: true, symbolSize: 6, lineStyle: { width: 2 } })),
        color: ['#4ECDC4', '#FF6B6B', '#45B7D1']
      }
    },
    handleResize() { if (this.chart) this.chart.resize() }
  }
}
</script>

<style scoped>
.chart-container {
  background: transparent;
  /* border: 1px solid rgba(78, 205, 196, 0.5);
  border-radius: 6px;
  box-shadow: 0 0 12px rgba(78, 205, 196, 0.7); */
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  gap: 6px;
}

.tab-btn {
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  color: #fff;
}

.tab-btn.active {
  background: rgba(78, 205, 196, 0.2);
  border-color: #4ECDC4;
  color: #4ECDC4;
}

.tab-btn:hover {
  border-color: #4ECDC4;
  color: #4ECDC4;
}

.chart-wrapper {
  flex: 1;
  width: 100%;
  /* 限制最大高度以适应右上角小框 */
  max-height: 180px;
}
</style>

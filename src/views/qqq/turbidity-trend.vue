<template>
  <div class="trend-wrap">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'TurbidityTrend',
  props: {
    selectedPoint: {
      type: Object,
      default: null
    }
  },
  data() {
    return { chart: null };
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.chart) this.chart.dispose();
  },
  watch: {
    selectedPoint(n) {
      if (!n || !this.chart) return;
      const baseName = (n.value && n.value[2]) || n.name || '选中点位';
      const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      const data = hours.map(() => +(Math.random() * 8 + 2).toFixed(2));
      this.chart.setOption({
        xAxis: { data: hours },
        series: [{ name: baseName, data }]
      });
    }
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.chart);
      const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      const data = hours.map(() => +(Math.random() * 8 + 2).toFixed(2));
      const option = {
        backgroundColor: 'transparent',
        grid: { left: 30, right: 20, top: 30, bottom: 30 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: hours,
          axisLine: { lineStyle: { color: '#3e9aff' } },
          axisLabel: { color: '#9bd8ff' }
        },
        yAxis: {
          type: 'value',
          name: 'NTU',
          axisLine: { lineStyle: { color: '#3e9aff' } },
          splitLine: { lineStyle: { color: 'rgba(62,154,255,.15)' } },
          axisLabel: { color: '#9bd8ff' }
        },
        series: [{
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#00eaff' },
          itemStyle: { color: '#01aaff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0,234,255,.35)' },
              { offset: 1, color: 'rgba(0,234,255,0)' },
            ])
          },
          name: '全局',
          data
        }]
      };
      this.chart.setOption(option);
    },
    resize() {
      if (this.chart) this.chart.resize();
    }
  }
}
</script>

<style scoped>
.trend-wrap { height: 100%; }
.chart { width: 100%; height: 100%; }
</style>
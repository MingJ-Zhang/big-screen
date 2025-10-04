<template>
  <div class="chart-container">
    <div ref="chart" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    chartData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.updateChart();
      },
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart) return;

      const option = {
        animation: true,
        animationDuration: 2000,
        animationEasing: 'cubicOut',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 20, 40, 0.9)',
          borderColor: 'rgba(0, 245, 255, 0.8)',
          borderWidth: 2,
          textStyle: {
            color: '#00f5ff',
            fontSize: 14,
            fontWeight: 'bold',
          },
          padding: [10, 15],
          borderRadius: 8,
          shadowColor: 'rgba(0, 245, 255, 0.8)',
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        legend: {
          orient: 'vertical',
          right: '2%',
          top: '15%',
          bottom: '15%',
          data: this.chartData.map(item => item.area),
          textStyle: {
            color: '#00f5ff',
            fontSize: 16,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 245, 255, 0.8)',
            textShadowBlur: 10,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0,
          },
          itemWidth: 20,
          itemHeight: 12,
          itemGap: 20,
          backgroundColor: 'rgba(0, 20, 40, 0.6)',
          borderColor: 'rgba(0, 245, 255, 0.5)',
          borderWidth: 2,
          borderRadius: 8,
          padding: [15, 20, 15, 20],
          shadowColor: 'rgba(0, 245, 255, 0.8)',
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        radar: {
          shape: 'circle',
          indicator: [
            { name: '对比度值', max: 1 },
            { name: '亮区对比', max: 1 },
            { name: '暗区对比', max: 1 },
          ],
          axisName: {
            color: '#00f5ff',
            fontSize: 18,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 245, 255, 0.8)',
            textShadowBlur: 8,
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(0, 245, 255, 0.1)',
                'rgba(0, 245, 255, 0.15)',
                'rgba(0, 245, 255, 0.2)',
                'rgba(0, 245, 255, 0.25)',
                'rgba(0, 245, 255, 0.3)',
              ].reverse(),
              shadowColor: 'rgba(0, 245, 255, 0.5)',
              shadowBlur: 15,
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 245, 255, 0.6)',
              width: 2,
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 245, 255, 0.3)',
              width: 1,
              type: 'dashed',
            },
          },
          center: ['40%', '50%'],
          radius: '65%',
        },
        series: [
          {
            name: '对比度评估',
            type: 'radar',
            data: this.chartData.map((item, index) => ({
              value: [item.contrast, item.bright, item.dark],
              name: item.area,
              areaStyle: {
                color: [
                  'rgba(0, 245, 255, 0.3)',
                  'rgba(255, 107, 107, 0.3)',
                  'rgba(78, 205, 196, 0.3)',
                  'rgba(69, 183, 209, 0.3)',
                  'rgba(150, 206, 180, 0.3)',
                  'rgba(254, 202, 87, 0.3)',
                ][index % 6]
              },
              lineStyle: {
                width: 3,
                color: [
                  '#00f5ff',
                  '#ff6b6b',
                  '#4ecdc4',
                  '#45b7d1',
                  '#96ceb4',
                  '#feca57',
                ][index % 6]
              },
              symbol: 'circle',
              symbolSize: 10,
              symbolColor: '#ffffff',
            })),
            emphasis: {
              areaStyle: {
                shadowColor: 'rgba(0, 245, 255, 0.8)',
                shadowBlur: 20,
              },
              lineStyle: {
                width: 4,
                shadowColor: 'rgba(0, 245, 255, 0.8)',
                shadowBlur: 15,
              }
            }
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  
  padding: 20px;
  box-sizing: border-box;
}
</style>
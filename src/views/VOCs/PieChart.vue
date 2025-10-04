<template>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: ['chartData', 'color'],
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.updateChart();
      }
    }
  },
  mounted() {
    this.initChart();
    this.updateChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    },
    updateChart() {
      if (!this.chart) return;
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '状态总览',
            type: 'pie',
            radius: '50%',
            data: this.chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              color: '#fff'
            },
            color: this.color
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>
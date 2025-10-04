<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    chartData: Array,
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(newData) {
        this.updateChart(newData);
      },
    },
  },
  mounted() {
    this.initChart();
    this.updateChart(this.chartData);
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    },
    updateChart(data) {
      if (!this.chart || !data) return;

      // 仅显示最近8个时间点
      const sliced = data.slice(-8);
      const times = sliced.map((item) => item.time);
      // 为6个点位构建折线数据
      const seriesData = Array.from({ length: 6 }, (_, i) => sliced.map((item) => (item.values ? item.values[i] : null)));

      const colors = ['#3e9aff', '#ffae2e', '#ff4757', '#52c41a', '#9d6eff', '#64ffda'];
      const series = seriesData.map((arr, i) => ({
        name: `点位 ${i + 1}`,
        data: arr,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: colors[i],
          width: 2,
        },
        itemStyle: {
          color: colors[i],
        },
        // 多条折线不使用面积堆叠，避免遮挡
      }));

      const option = {
        backgroundColor: 'transparent',
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
          top: "20%",
        },
        legend: {
          top: '5%',
          textStyle: { color: '#e6f1ff' },
        },
        xAxis: {
          type: "category",
          data: times,
          axisLine: {
            lineStyle: {
              color: "#3d5e7d",
            },
          },
          axisLabel: {
            color: "#e6f1ff",
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          name: "浓度 (%)",
          nameTextStyle: {
            color: "#e6f1ff",
          },
          axisLine: {
            lineStyle: {
              color: "#3d5e7d",
            },
          },
          axisLabel: {
            color: "#e6f1ff",
          },
          splitLine: {
            lineStyle: {
              color: "#1e3a5f",
            },
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: 'rgba(0, 21, 41, 0.8)',
          borderColor: '#3d5e7d',
          textStyle: {
            color: '#e6f1ff',
          },
        },
        series,
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
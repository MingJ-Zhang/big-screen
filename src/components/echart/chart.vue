<template>
  <div ref="chart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'Chart',
  props: {
    options: {
      type: Object,
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
    options: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.updateChart();
    },
    updateChart() {
      if (this.chart) {
        this.chart.setOption(this.options);
      }
    },
  },
};
</script>
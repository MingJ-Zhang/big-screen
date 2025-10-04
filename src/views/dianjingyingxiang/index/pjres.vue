<template>
  <div id="rightTop" class="right-top-container">
    <div class="table-container">
      <table class="neon-table">
        <thead>
          <tr>
            <th>评价指标</th>
            <th>得分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataList" :key="index">
            <td>{{ item.metric }}</td>
            <td>{{ item.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="chart-container" ref="barChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'RightTop',
  data() {
    return {
      // dataList: [
      //   { metric: '指标一', score: 82 },
      //   { metric: '指标二', score: 75 },
      //   { metric: '指标三', score: 90 },
      //   { metric: '指标四', score: 68 },
      //   { metric: '指标五', score: 88 }
      // ],
      chart: null
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dataList: function (val) {
      this.initChart()
    }
  },
  mounted() {
    // this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.barChart);
      const option = {
        backgroundColor: 'transparent',
        xAxis: {
          type: 'category',
          data: this.dataList.map(item => item.metric),
          axisLine: { lineStyle: { color: '#4dd0e1' } },
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 50,
          axisLine: { lineStyle: { color: '#4dd0e1' } },
          splitLine: { lineStyle: { color: 'rgba(77,208,225,0.2)' } },
          axisLabel: { color: '#fff' }
        },
        series: [{
          data: this.dataList.map(item => item.score),
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00ffa3' },
              { offset: 1, color: '#dc1fff' }
            ])
          },
          barWidth: '40%'
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          textStyle: { color: '#fff' },
          backgroundColor: 'rgba(0,0,0,0.7)'
        }
      };
      this.chart.setOption(option);
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.right-top-container {
  height: 100%;
  display: flex;
  background: transparent;
  padding: 16px;
  // border-radius: 8px;
  // box-shadow: 0 0 20px rgba(0, 255, 163, 0.3);
}
.table-container {
  flex: 1;
  margin-right: 20px;
  overflow: hidden;
}
.neon-table {
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px 8px;
    text-align: center;
  }
  th {
    background: rgba(77, 208, 225, 0.2);
    color: #4dd0e1;
    font-size: 16px;
  }
  td {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font-size: 14px;
    transition: background 0.3s;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.chart-container {
  top: -30px;
  flex: 1;
  height: 300px;
}
</style>

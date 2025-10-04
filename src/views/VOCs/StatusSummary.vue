<template>
  <div class="status-summary">
    <pie-chart :chartData="chartData" :color="color"></pie-chart>
  </div>
</template>

<script>
import PieChart from './PieChart.vue';

export default {
  components: {
    PieChart
  },
  data() {
    return {
      chartData: [],
      color: ['#64ffda', '#ff4d4f', '#a9a9a9']
    };
  },
  mounted() {
    this.simulateData();
    setInterval(this.simulateData, 3000);
  },
  methods: {
    simulateData() {
      const normal = Math.floor(Math.random() * 100);
      const warning = Math.floor(Math.random() * 20);
      const offline = Math.floor(Math.random() * 5);
      this.chartData = [
        { value: normal, name: '正常' },
        { value: warning, name: '预警' },
        { value: offline, name: '离线' }
      ];
    }
  }
};
</script>

<style scoped>
.status-summary {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}
h3 {
  color: #e6f1ff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
}
</style>
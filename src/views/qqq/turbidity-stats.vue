<template>
  <div class="stats">
    <div class="card" v-for="(s, i) in stats" :key="i">
      <div class="label">{{ s.label }}</div>
      <div class="value">{{ s.value }}<span class="unit">{{ s.unit }}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TurbidityStats',
  props: {
    selectedPoint: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      stats: [
        { label: '平均浊度', value: 4.72, unit: ' NTU' },
        { label: '最高浊度', value: 13.2, unit: ' NTU' },
        { label: '最低浊度', value: 1.6, unit: ' NTU' },
        { label: '监测点数', value: 9, unit: ' 个' },
        { label: '中位数', value: 4.1, unit: ' NTU' },
        { label: '标准差', value: 2.3, unit: ' NTU' },
        { label: '异常次数(24h)', value: 6, unit: ' 次' },
        { label: '告警中的点位', value: 3, unit: ' 个' },
        { label: '方差', value: 5.29, unit: ' NTU²' },
        { label: '变异系数', value: '48.7%', unit: '' },
      ]
    };
  },
  watch: {
    selectedPoint(n) {
      if (!n) return;
      const mk = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
      const count = Math.floor(Math.random() * 6 + 6); // 6-11 个点位
      const avg = mk(3, 8);
      const max = mk(avg + 3, avg + 7);
      const min = mk(0.8, 2.5);
      const median = mk(3, 7);
      const std = mk(1, 3.5);
      const variance = +(std * std).toFixed(2);
      const cv = +(std / avg * 100).toFixed(1) + '%';
      const alarms24h = Math.floor(Math.random() * 10 + 2);
      const alarming = Math.floor(Math.random() * Math.min(5, count));
      this.stats = [
        { label: '平均浊度', value: avg, unit: ' NTU' },
        { label: '最高浊度', value: max, unit: ' NTU' },
        { label: '最低浊度', value: min, unit: ' NTU' },
        { label: '监测点数', value: count, unit: ' 个' },
        { label: '中位数', value: median, unit: ' NTU' },
        { label: '标准差', value: std, unit: ' NTU' },
        { label: '异常次数(24h)', value: alarms24h, unit: ' 次' },
        { label: '告警中的点位', value: alarming, unit: ' 个' },
        { label: '方差', value: variance, unit: ' NTU²' },
        { label: '变异系数', value: cv, unit: '' },
      ];
    }
  }
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.card {
  background: rgba(0,0,0,.2);
  border-radius: 8px;
  padding: 12px;
}
.label { color: #8aa0b6; font-size: 12px; }
.value { color: #00eaff; font-size: 20px; font-weight: 700; }
.unit { font-size: 12px; color: #9bd8ff; margin-left: 4px; }
</style>
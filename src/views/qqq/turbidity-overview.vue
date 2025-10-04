<template>
  <div class="overview">
    <div class="station" v-for="(s, i) in stations" :key="i">
      <div class="top">
        <div class="name">{{ s.name }}</div>
        <div class="status" :class="s.status">{{ s.statusText }}</div>
      </div>
      <div class="metrics">
        <div class="metric">
          <div class="label">当前浊度</div>
          <div class="value">{{ s.ntu }} NTU</div>
        </div>
        <div class="metric">
          <div class="label">变化率</div>
          <div class="value" :class="{ up: s.change > 0, down: s.change < 0 }">
            {{ s.change > 0 ? '+' : '' }}{{ s.change.toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TurbidityOverview',
  props: {
    selectedPoint: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      stations: [
        { name: '潮白河-点位A', ntu: 2.8, change: 0.7, status: 'normal', statusText: '正常' },
        { name: '大清河-点位B', ntu: 5.1, change: -0.3, status: 'normal', statusText: '正常' },
        { name: '凤港减河-点位C', ntu: 12.6, change: 1.9, status: 'warning', statusText: '预警' },
        { name: '安定镇-点位D', ntu: 1.9, change: 0.1, status: 'offline', statusText: '离线' },
      ],
    };
  },
  watch: {
    selectedPoint: {
      immediate: false,
      handler(n) {
        if (!n) return;
        const baseName = (n.value && n.value[2]) || n.name || '选中点位';
        const gen = () => +(Math.random() * 14 + 1.2).toFixed(1);
        const mkStatus = (v) => v >= 12 ? { s: 'warning', t: '预警' } : v <= 2 ? { s: 'offline', t: '离线' } : { s: 'normal', t: '正常' };
        const mkChange = () => +(Math.random() * 3 - 1.5).toFixed(2);
        const names = ['点位A', '点位B', '点位C', '点位D'];
        this.stations = names.map((suffix) => {
          const v = gen();
          const st = mkStatus(v);
          return { name: `${baseName}-${suffix}`, ntu: v, change: mkChange(), status: st.s, statusText: st.t };
        });
      }
    }
  }
};
</script>

<style scoped>
.overview {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.station {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 12px;
}
.top { display: flex; justify-content: space-between; align-items: center; }
.name { font-weight: 600; color: #9bd8ff; }
.status { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.status.normal { background: rgba(82,196,26,.2); color: #52c41a; }
.status.warning { background: rgba(255,174,46,.2); color: #ffae2e; }
.status.offline { background: rgba(255,71,87,.2); color: #ff4757; }
.metrics { display: flex; gap: 16px; margin-top: 10px; }
.metric { flex: 1; }
.label { font-size: 12px; color: #8aa0b6; }
.value { font-size: 16px; color: #e9f5ff; font-weight: 600; }
.value.up { color: #52c41a; }
.value.down { color: #ff4757; }
</style>
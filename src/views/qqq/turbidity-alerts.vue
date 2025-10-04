<template>
  <div class="alerts">
    <div v-for="(a, i) in alerts" :key="i" class="alert" :class="a.level">
      <div class="left">
        <span class="dot"></span>
        <span class="title">{{ a.title }}</span>
      </div>
      <div class="right">
        <span class="value">{{ a.value }} NTU</span>
        <span class="time">{{ a.time }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TurbidityAlerts',
  props: {
    selectedPoint: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      alerts: [
        { title: '潮白河-点位C超阈值', value: 13.2, time: '10:24', level: 'high' },
        { title: '大清河-点位B升高', value: 6.8, time: '09:55', level: 'medium' },
        { title: '香河县-点位A恢复正常', value: 2.9, time: '09:31', level: 'low' },
        { title: '武清区-点位D短时波动', value: 7.3, time: '09:20', level: 'medium' },
        { title: '安次区-点位E接近阈值', value: 9.8, time: '09:10', level: 'medium' },
        { title: '安定镇-点位F设备离线', value: 0.0, time: '08:58', level: 'low' },
        { title: '杨庄镇-点位G超阈值', value: 15.1, time: '08:45', level: 'high' },
        { title: '安平镇-点位H异常抖动', value: 11.4, time: '08:32', level: 'high' },
        // { title: '红杨路-点位I数据恢复', value: 3.2, time: '08:21', level: 'low' },
        // { title: '414乡道-点位J升高', value: 6.2, time: '08:10', level: 'medium' },
        // { title: '大堤路-点位K异常', value: 12.3, time: '07:58', level: 'high' },
        // { title: '右堤-点位L接近阈值', value: 9.5, time: '07:41', level: 'medium' },
      ]
    }
  },
  watch: {
    selectedPoint(n) {
      if (!n) return;
      const baseName = (n.value && n.value[2]) || n.name || '选中点位';
      // 去掉baseName的前三个字符
      const stationName = baseName.slice(3);
      const now = new Date();
      const mkVal = () => +(Math.random() * 10).toFixed(1);
      const mkLevel = (v) => v >= 12 ? 'high' : v >= 6 ? 'medium' : 'low';
      const mkTime = (i) => {
        const d = new Date(now.getTime() - i * 7 * 60 * 1000);
        const hh = `${d.getHours()}`.padStart(2, '0');
        const mm = `${d.getMinutes()}`.padStart(2, '0');
        return `${hh}:${mm}`;
      };
      const suffix = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      this.alerts = suffix.map((s, i) => {
        const v = mkVal();
        return { title: `${stationName}-点位${s}${v >= 12 ? '超阈值' : v >= 6 ? '升高' : '正常'}`,
          value: v, time: mkTime(i), level: mkLevel(v) };
      });
    }
  }
}
</script>

<style scoped>
.alerts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 90%;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.alerts::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
.alert {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0,0,0,.2); border-radius: 8px; padding: 10px 12px;
}
.left { display: flex; align-items: center; gap: 8px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.title { color: #e9f5ff; }
.right { display: flex; align-items: center; gap: 12px; }
.value { color: #ffae2e; font-weight: 600; }
.time { color: #8aa0b6; font-size: 12px; }
.alert.high .dot { background: #ff4757; }
.alert.medium .dot { background: #ffae2e; }
.alert.low .dot { background: #52c41a; }
</style>
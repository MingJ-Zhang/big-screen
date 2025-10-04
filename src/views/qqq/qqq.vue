<template>
  <div class="contents">
    <!-- 左侧：两个浊度相关面板 -->
  <div class="sidebar left">
      <ItemWrap class="panel" title="浊度实时概览">
        <TurbidityOverview :selected-point="amapVal" />
      </ItemWrap>
      <ItemWrap class="panel" title="浊度历史趋势">
        <TurbidityTrend :selected-point="amapVal" />
      </ItemWrap>
    </div>

    <!-- 中间：地图展示 -->
    <div class="center">
      <ItemWrap2 class="map-panel" title="浊度监测地图">
        <MapContainer @sendMsgAmap="sendMsgAmap" />
      </ItemWrap2>
    </div>

    <!-- 右侧：两个浊度相关面板 -->
  <div class="sidebar right">
      <ItemWrap class="panel" title="浊度阈值报警">
        <TurbidityAlerts :selected-point="amapVal" />
      </ItemWrap>
      <ItemWrap class="panel" title="统计概览">
        <TurbidityStats :selected-point="amapVal" />
      </ItemWrap>
    </div>
  </div>
</template>

<script>
import MapContainer from "./MapContainer.vue";
import TurbidityOverview from "./turbidity-overview.vue";
import TurbidityTrend from "./turbidity-trend.vue";
import TurbidityAlerts from "./turbidity-alerts.vue";
import TurbidityStats from "./turbidity-stats.vue";

export default {
  components: {
    MapContainer,
    TurbidityOverview,
    TurbidityTrend,
    TurbidityAlerts,
    TurbidityStats,
  },
  data() {
    return {
      amapVal: null,
    };
  },
  methods: {
    sendMsgAmap(val) {
      this.amapVal = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.contents {
  display: grid;
  grid-template-columns: 13fr 22fr 13fr;
  grid-gap: 12px;
  align-items: stretch;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel {
  height: 440px;
}

.map-panel {
  height: 900px;
}
</style>

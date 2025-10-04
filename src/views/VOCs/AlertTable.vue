<template>
  <div class="alert-table-container">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>点位</th>
            <th>浓度</th>
          </tr>
        </thead>
      </table>
      <div class="tbody-wrapper" ref="wrapper">
        <div class="scroll-content" :class="{ scrolling: isScrolling }" :style="animationStyle">
          <table>
            <tbody>
              <tr v-for="(alert, index) in alerts" :key="index">
                <td>{{ alert.time }}</td>
                <td>{{ alert.point }}</td>
                <td class="warning">{{ alert.concentration }}</td>
              </tr>
            </tbody>
          </table>
          <table v-if="isScrolling">
            <tbody>
              <tr v-for="(alert, index) in alerts" :key="'duplicate-' + index">
                <td>{{ alert.time }}</td>
                <td>{{ alert.point }}</td>
                <td class="warning">{{ alert.concentration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alerts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isScrolling: false,
      animationDuration: "10s",
    };
  },
  computed: {
    animationStyle() {
      return {
        "--scroll-duration": this.animationDuration,
      };
    },
  },
  mounted() {
    this.checkScrolling();
  },
  updated() {
    this.checkScrolling();
  },
  methods: {
    checkScrolling() {
      this.$nextTick(() => {
        const wrapper = this.$refs.wrapper;
        const content = this.$el.querySelector(".scroll-content > table");
        if (wrapper && content) {
          this.isScrolling = content.offsetHeight > wrapper.offsetHeight;
          if (this.isScrolling) {
            const duration = this.alerts.length * 2; // 2s per item
            this.animationDuration = `${duration}s`;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.alert-table-container {
  height: 100%;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}
.table-wrapper {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  background: linear-gradient(to bottom, #0f2241, #1e3a5f);
  color: #e6f1ff;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.tbody-wrapper {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}
.scroll-content.scrolling {
  animation: scroll-up var(--scroll-duration) linear infinite;
}
tbody td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #1e3a5f;
  font-size: 16px;
  color: #ccd6f6;
}
.warning {
  color: #ff4d4f;
  font-weight: bold;
  animation: flash 1s infinite;
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes scroll-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
</style>
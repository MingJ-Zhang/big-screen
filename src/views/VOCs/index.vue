<template>
  <div class="container">
    <div class="sidebar left-sidebar">
      <div class="control-section">
        <ItemWrap title="操作控制" :style="{ height: '100%' }">
          <OperationButtons
            :monitoring="monitoring"
            @start="startMonitoring"
            @stop="stopMonitoring"
          />
        </ItemWrap>
      </div>
      <div class="trend-section">
        <ItemWrap title="浓度变化趋势" :style="{ height: '100%' }">
          <ConcentrationChart :chartData="chartData" />
        </ItemWrap>
      </div>
    </div>
    <div class="main-content-wrapper">
      <div class="main-content">
        <div class="video-grid">
          <div
            v-for="(video, index) in videoSources"
            :key="index"
            class="video-item"
          >
            <img :src="video.src" :alt="'监控视频 ' + (index + 1)" />
            <div class="video-title"><span>监控视频 - 点位 {{ index + 1 }}</span></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import OperationButtons from "./OperationButtons.vue";
import ConcentrationChart from "./ConcentrationChart.vue";
import ItemWrap from "@/components/item-wrap/item-wrap.vue";

// Importing image assets
import imageFile1 from "@/assets/images/vocs/A001.png";
import imageFile2 from "@/assets/images/vocs/A002.png";
import imageFile3 from "@/assets/images/vocs/A003.png";
import imageFile4 from "@/assets/images/vocs/A004.png";
import imageFile5 from "@/assets/images/vocs/A005.png";
import imageFile6 from "@/assets/images/vocs/A006.png";

import imageFileB1 from "@/assets/images/vocs/B001.png";
import imageFileB2 from "@/assets/images/vocs/B002.png";
import imageFileB3 from "@/assets/images/vocs/B003.png";
import imageFileB4 from "@/assets/images/vocs/B004.png";
import imageFileB5 from "@/assets/images/vocs/B005.png";
import imageFileB6 from "@/assets/images/vocs/B006.png";

export default {
  components: {
    OperationButtons,
    ConcentrationChart,
    ItemWrap,
  },
  data() {
    return {
      monitoring: false,
      chartData: [],
      timer: null,
      videoSources: [
        { src: imageFile1 },
        { src: imageFile2 },
        { src: imageFile3 },
        { src: imageFile4 },
        { src: imageFile5 },
        { src: imageFile6 },
      ],
      imageSetA: [
        imageFile1,
        imageFile2,
        imageFile3,
        imageFile4,
        imageFile5,
        imageFile6,
      ],
      imageSetB: [
        imageFileB1,
        imageFileB2,
        imageFileB3,
        imageFileB4,
        imageFileB5,
        imageFileB6,
      ],
    };
  },
  methods: {
    startMonitoring() {
      if (this.monitoring) return;
      this.monitoring = true;
      this.updateVideoSources(this.imageSetB);
      this.startDataUpdates();
    },
    stopMonitoring() {
      this.monitoring = false;
      this.updateVideoSources(this.imageSetA);
      clearInterval(this.timer);
      this.chartData = [];
    },
    updateVideoSources(imageSet) {
      this.videoSources = imageSet.map((src) => ({ src }));
    },
    startDataUpdates() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.updateData();
      this.timer = setInterval(this.updateData, 1000);
    },
    updateData() {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      // 更新6个点位的浓度数据，并只保留最近8条
      const values = [
        this.getRandom(60, 90),
        this.getRandom(60, 90),
        this.getRandom(60, 90),
        this.getRandom(60, 90),
        this.getRandom(60, 90),
        this.getRandom(60, 90),
      ];
      this.chartData.push({ time, values });
      if (this.chartData.length > 8) {
        this.chartData.shift();
      }


    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
  mounted() {
    this.stopMonitoring();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: transparent;
  color: #e6f1ff;
  box-sizing: border-box;
}

.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Add gap between components */
  overflow: auto; /* Prevent children from overflowing */
}

/* 顶部操作区和底部趋势图分离布局，避免共享样式导致高度受限 */
.control-section {
  flex: 0 0 220px;
  height: 220px;
  min-height: 220px;
}

.trend-section {
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
  height: 95%;
}

.left-sidebar {
  margin-right: 20px;
}



.main-content-wrapper {
  flex: 3;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: visible;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.component-box {
  background-color: transparent;
  /* border: 1px solid #1e3a5f; */ /* Remove border */
  /* border-radius: 8px; */ /* Remove border-radius */
  flex: 1;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  height: 95%;
}

.video-item {
  border-radius: 10px;
  overflow: hidden;
  background: radial-gradient(120% 120% at 0% 0%, rgba(18, 32, 56, 0.9) 0%, rgba(11, 24, 46, 0.8) 60%, rgba(8, 18, 34, 0.7) 100%);
  position: relative;
  box-shadow: 0 2px 12px rgba(62, 154, 255, 0.15), inset 0 0 0 1px rgba(30, 58, 95, 0.6);
}

.video-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  border: 1px solid rgba(100, 255, 218, 0.18);
  box-shadow: inset 0 0 12px rgba(62, 154, 255, 0.18), 0 0 16px rgba(100, 255, 218, 0.12);
}

.video-item:hover::after {
  box-shadow: inset 0 0 18px rgba(62, 154, 255, 0.25), 0 0 24px rgba(100, 255, 218, 0.2);
}

.video-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(2, 10, 22, 0), rgba(2, 10, 22, 0.92));
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  color: #e6f1ff;
  padding: 10px 14px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.5px;
  border-top: 1px solid rgba(62, 154, 255, 0.35);
}

.video-title::before {
  content: "";
  position: absolute;
  left: 16px;
  top: -1px;
  width: 68px;
  height: 2px;
  background: linear-gradient(90deg, #3e9aff, #64ffda);
  opacity: 0.85;
}

.video-title::after {
  content: "";
  position: absolute;
  left: 16px;
  top: -1px;
  width: 4px;
  height: 10px;
  background: #3e9aff;
  filter: drop-shadow(0 0 6px #3e9aff);
}

.video-title span {
  position: relative;
  display: inline-block;
}

.video-title span::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  animation: title-shine 4s ease-in-out infinite;
}

@keyframes title-shine {
  0% {
    left: -120%;
  }
  60% {
    left: 120%;
  }
  100% {
    left: 120%;
  }
}
</style>

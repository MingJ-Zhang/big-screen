<template>
  <div class="algorithm-panel">
    <div class="panel-header">
      <div class="panel-title">
        <span class="title-icon">⚙</span>
        <span>算法控制</span>
      </div>
      <div class="panel-status" :class="{ processing: processing }">
        <div class="status-dot"></div>
        <span>{{ processing ? '处理中' : '待机' }}</span>
      </div>
    </div>
    
    <!-- 算法选择 -->
    <div class="algorithm-section">
      <div class="section-title">算法选择</div>
      <div class="algorithm-buttons">
        <button
          v-for="algo in algorithms"
          :key="algo.key"
          class="algo-btn"
          :class="{ active: currentAlgorithm === algo.key }"
          @click="selectAlgorithm(algo.key)"
        >
          <div class="algo-icon">{{ algo.icon }}</div>
          <div class="algo-name">{{ algo.name }}</div>
          <div class="algo-desc">{{ algo.desc }}</div>
        </button>
      </div>
    </div>

    <!-- 监控影像对比度自动优化 -->
    <div class="contrast-optimization-section">
      <div class="section-title">监控影像对比度自动优化</div>
      <div class="optimization-content">
        <div class="feature-item">
          <h4>动态范围扩展</h4>
          <p>自动调整图像的亮度和对比度，以适应不同的光照条件。</p>
        </div>
        <div class="feature-item">
          <h4>局部对比度增强</h4>
          <p>增强图像细节，使暗区和亮区的细节更加清晰。</p>
        </div>
        <div class="feature-item">
          <h4>噪声抑制</h4>
          <p>有效去除图像中的噪声，同时保留重要的图像细节。</p>
        </div>
        <div class="feature-item">
          <h4>色彩保真</h4>
          <p>在调整对比度的同时，保持图像的色彩真实性和自然度。</p>
        </div>
      </div>
      <div class="metrics-section">
        <div class="section-title">实时画质监控</div>
        <div class="metrics-chart-wrap">
          <echart :options="chartOptions" style="width: 100%; height: 100%;"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Echart from "@/components/echart/index.vue";
export default {
  name: 'AlgorithmPanel',
  props: {
    currentAlgorithm: {
      type: String,
      default: 'adaptive'
    },
    processing: {
      type: Boolean,
      default: true
    },
    progress: {
      type: Number,
      default: 0
    },
    metricsHistory: {
      type: Object,
      default: () => ({ timestamps: [], brightness: [], contrast: [], exposure: [], calibrationError: [], ssim: [] })
    }
  },
  data() {
    return {
      algorithms: [
        {
          key: 'clahe',
          name: 'CLAHE',
          icon: '📊',
          desc: '自适应直方图均衡'
        },
        {
          key: 'msr',
          name: 'MSR',
          icon: '🔭',
          desc: '多尺度Retinex'
        },
        {
          key: 'gan_enhance',
          name: 'GAN增强',
          icon: '✨',
          desc: '生成对抗网络'
        },
        {
          key: 'deep_contrast',
          name: '深度学习',
          icon: '🤖',
          desc: '端到端对比度校正'
        }
      ],
      parameters: {
        intensity: 75,
        sharpness: 60,
        defogRadius: 15,
        threshold: 128
      },
      chartOptions: {},
      liveTimer: null,
      maxPoints: 60,
      liveHistory: { timestamps: [], brightness: [], contrast: [], exposure: [], calibrationError: [], ssim: [] }
    };
  },
  components: { echart: Echart },
  watch: {
    metricsHistory: {
      handler() {
        this.updateChartOptions();
      },
      deep: true
    }
  },
  mounted() {
    // 初始化图表
    this.updateChartOptions();
    // 启动随时间变化的自动更新
    this.startLiveUpdate();
  },
  beforeDestroy() {
    this.stopLiveUpdate();
  },
  methods: {
    selectAlgorithm(algorithm) {
      this.$emit('algorithm-change', algorithm);
    },
    updateParameter(param, value) {
      this.$emit('parameter-change', { [param]: parseInt(value) });
    },
    toggleProcessing() {
      if (this.processing) {
        this.$emit('stop-processing');
      } else {
        this.$emit('start-processing');
      }
    },
    enableAutoMode() {
      this.$emit('auto-mode');
    },
    resetParameters() {
      this.parameters = {
        intensity: 75,
        sharpness: 60,
        defogRadius: 15,
        threshold: 128
      };
      this.$emit('reset');
    },
    startLiveUpdate() {
      if (this.liveTimer) return;
      this.liveTimer = setInterval(() => {
        const now = new Date();
        const ts = now.toLocaleTimeString('zh-CN', { hour12: false });
        const last = Math.max(this.liveHistory.timestamps.length - 1, 0);
        const rand = (min, max) => Math.random() * (max - min) + min;
        const clamp = (v) => Math.max(0, Math.min(100, v));
        const pushLimited = (arr, val) => { arr.push(val); if (arr.length > this.maxPoints) arr.shift(); };

        pushLimited(this.liveHistory.timestamps, ts);
        pushLimited(this.liveHistory.brightness, clamp((this.liveHistory.brightness[last] || 50) + rand(-3, 3)));
        pushLimited(this.liveHistory.contrast, clamp((this.liveHistory.contrast[last] || 60) + rand(-3, 3)));
        pushLimited(this.liveHistory.exposure, clamp((this.liveHistory.exposure[last] || 40) + rand(-2, 2)));
        pushLimited(this.liveHistory.calibrationError, clamp((this.liveHistory.calibrationError[last] || 20) + rand(-1.5, 1.5)));
        pushLimited(this.liveHistory.ssim, clamp((this.liveHistory.ssim[last] || 75) + rand(-2, 2)));
        this.updateChartOptions();
      }, 2000);
    },
    stopLiveUpdate() {
      if (this.liveTimer) {
        clearInterval(this.liveTimer);
        this.liveTimer = null;
      }
    },
    updateChartOptions() {
      const useLive = !(this.metricsHistory && (this.metricsHistory.timestamps || []).length);
      const source = useLive ? this.liveHistory : this.metricsHistory;
      const { timestamps = [], brightness = [], contrast = [], exposure = [], calibrationError = [], ssim = [] } = source || {};
      this.chartOptions = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['亮度', '对比度', '曝光补偿', '校准误差', 'SSIM'],
          textStyle: { color: '#aefcff' }
        },
        grid: { left: 40, right: 40, top: 20, bottom: 25 },
        xAxis: {
          type: 'category',
          data: timestamps,
          axisLine: { lineStyle: { color: 'rgba(0, 237, 237, 0.6)' } },
          axisLabel: { color: '#d7ffff', fontSize: 10 }
        },
        yAxis: [
          {
            type: 'value',
            name: '指标值',
            axisLine: { lineStyle: { color: 'rgba(0, 237, 237, 0.6)' } },
            axisLabel: { color: '#d7ffff' },
            splitLine: { lineStyle: { color: 'rgba(0, 237, 237, 0.15)' } }
          }
        ],
        series: [
          { name: '亮度', type: 'line', data: brightness, smooth: true, showSymbol: false },
          { name: '对比度', type: 'line', data: contrast, smooth: true, showSymbol: false },
          { name: '曝光补偿', type: 'line', data: exposure, smooth: true, showSymbol: false },
          { name: '校准误差', type: 'line', data: calibrationError, smooth: true, showSymbol: false },
          { name: 'SSIM', type: 'line', data: ssim, smooth: true, showSymbol: false }
        ],
        color: ['#4ECDC4', '#FF6B6B', '#45B7D1', '#FFD166', '#66CCFF'],
        animationDurationUpdate: 300,
        animationEasingUpdate: 'linear'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.algorithm-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  color: #d3d6dd;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
  
  .title-icon {
    font-size: 20px;
    animation: rotate 2s infinite linear;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.panel-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.3);
  font-size: 12px;
  
  &.processing .status-dot {
    background: #00ff00;
    animation: pulse 1s infinite;
  }
  
  &:not(.processing) .status-dot {
    background: #ff6b6b;
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.algorithm-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #00eaff;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #00eaff;
}

.algorithm-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.algo-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #d3d6dd;
  
  &:hover {
    background: rgba(0, 234, 255, 0.1);
    border-color: rgba(0, 234, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &.active {
    background: rgba(0, 234, 255, 0.2);
    border-color: #00eaff;
    box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
    
    .algo-name {
      color: #00eaff;
      font-weight: bold;
    }
  }
}

.algo-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.algo-name {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 3px;
}

.algo-desc {
  font-size: 10px;
  color: #9b9b9b;
}

.contrast-optimization-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.optimization-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.feature-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.feature-item h4 {
  font-size: 14px;
  color: #00eaff;
  margin-bottom: 10px;
}

.feature-item p {
  font-size: 12px;
  line-height: 1.6;
  color: #d3d6dd;
}

.parameter-section {
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
}

.metrics-section {
  margin-bottom: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.metrics-chart-wrap {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  flex: 1;
  display: flex;
}

.metrics-legend {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 10px;
  color: #cfefff;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.dot-brightness { background: #4ECDC4; }
.dot-contrast { background: #FF6B6B; }
.dot-exposure { background: #45B7D1; }
.dot-error { background: #FFD166; }
.dot-ssim { background: #66CCFF; }

.parameter-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 12px;
    color: #b8c5d1;
    font-weight: 500;
  }
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.param-slider {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #00eaff;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #00eaff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
  }
}

.param-value {
  font-size: 11px;
  color: #00eaff;
  font-weight: bold;
  min-width: 35px;
  text-align: right;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-bar {
  position: relative;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(0, 234, 255, 0.8) 0%,
    rgba(0, 114, 255, 0.8) 100%
  );
  border-radius: 10px;
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  
  &.primary {
    background: linear-gradient(135deg, #00eaff 0%, #007bff 100%);
    color: #ffffff;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 234, 255, 0.4);
    }
    
    &.processing {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
    }
  }
  
  &.secondary {
    background: rgba(0, 234, 255, 0.2);
    color: #00eaff;
    border: 1px solid rgba(0, 234, 255, 0.3);
    
    &:hover {
      background: rgba(0, 234, 255, 0.3);
      transform: translateY(-2px);
    }
  }
  
  &.tertiary {
    background: rgba(255, 255, 255, 0.1);
    color: #d3d6dd;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
  }
}

// 滚动条样式
.parameter-section::-webkit-scrollbar {
  width: 4px;
}

.parameter-section::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.parameter-section::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.3);
  border-radius: 2px;
  
  &:hover {
    background: rgba(0, 234, 255, 0.5);
  }
}
</style>
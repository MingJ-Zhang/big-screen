<template>
  <div class="status-bar">
    <div class="status-section system-info">
      <div class="info-item">
        <span class="info-label">系统时间:</span>
        <span class="info-value">{{ currentTime }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">运行时长:</span>
        <span class="info-value">{{ runtime }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">当前算法:</span>
        <span class="info-value algorithm">{{ currentAlgorithm }}</span>
      </div>
    </div>
    
    <div class="status-section performance-metrics">
      <div class="metric-item">
        <span class="metric-label">延迟:</span>
        <span class="metric-value" :class="getLatencyClass(latency)">
          {{ latency }}ms
        </span>
      </div>
      <div class="metric-item">
        <span class="metric-label">FPS:</span>
        <span class="metric-value" :class="getFPSClass(fps)">
          {{ fps }}
        </span>
      </div>
      <div class="metric-item">
        <span class="metric-label">GPU占用:</span>
        <div class="gpu-usage">
          <span class="metric-value">{{ gpuUsage }}%</span>
          <div class="usage-bar">
            <div class="usage-fill" :style="{ width: gpuUsage + '%' }" :class="getUsageClass(gpuUsage)"></div>
          </div>
        </div>
      </div>
      <div class="metric-item">
        <span class="metric-label">任务队列:</span>
        <span class="metric-value queue" :class="getQueueClass(queueLength)">
          {{ queueLength }}
        </span>
      </div>
    </div>
    
    <div class="status-section log-area">
      <div class="log-header">
        <span class="log-title">📋 系统日志</span>
        <button class="log-toggle" @click="toggleLogExpansion">
          <span v-if="!logExpanded">▼</span>
          <span v-else>▲</span>
        </button>
      </div>
      <div class="log-container" :class="{ expanded: logExpanded }">
        <div class="log-scroller" ref="logScroller">
          <div 
            v-for="(log, index) in logs" 
            :key="index"
            class="log-item"
            :class="getLogLevelClass(log.level || log.type)"
          >
            <span class="log-time">{{ log.timestamp || log.time }}</span>
            <span class="log-level" :class="log.level || log.type">[{{ log.level || log.type }}]</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="status-section status-indicators">
      <div class="indicator-item" :class="{ active: systemStatus === 'running' }">
        <div class="indicator-dot"></div>
        <span>系统运行</span>
      </div>
      <div class="indicator-item" :class="{ active: processingStatus === 'processing' }">
        <div class="indicator-dot"></div>
        <span>处理中</span>
      </div>
      <div class="indicator-item" :class="{ warning: alertCount > 0 }">
        <div class="indicator-dot"></div>
        <span>告警 ({{ alertCount }})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  props: {
    currentAlgorithm: {
      type: String,
      default: '自适应'
    },
    latency: {
      type: Number,
      default: 25
    },
    fps: {
      type: Number,
      default: 30
    },
    gpuUsage: {
      type: Number,
      default: 45
    },
    queueLength: {
      type: Number,
      default: 3
    },
    logs: {
      type: Array,
      default: () => []
    },
    systemStatus: {
      type: String,
      default: 'running'
    },
    processingStatus: {
      type: String,
      default: 'idle'
    },
    alertCount: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentTime: '',
      runtime: '',
      logExpanded: false,
      timeInterval: null,
      runtimeInterval: null
    };
  },
  mounted() {
    this.updateTime();
    this.updateRuntime();
    this.timeInterval = setInterval(this.updateTime, 1000);
    this.runtimeInterval = setInterval(this.updateRuntime, 1000);
  },
  beforeDestroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.runtimeInterval) clearInterval(this.runtimeInterval);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    updateRuntime() {
      const now = new Date();
      const diff = now - this.startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      this.runtime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    getLatencyClass(latency) {
      if (latency < 20) return 'good';
      if (latency < 50) return 'warning';
      return 'error';
    },
    getFPSClass(fps) {
      if (fps >= 25) return 'good';
      if (fps >= 15) return 'warning';
      return 'error';
    },
    getUsageClass(usage) {
      if (usage < 60) return 'good';
      if (usage < 80) return 'warning';
      return 'error';
    },
    getQueueClass(queue) {
      if (queue < 5) return 'good';
      if (queue < 10) return 'warning';
      return 'error';
    },
    getLogLevelClass(level) {
      return `log-${level}`;
    },
    toggleLogExpansion() {
      this.logExpanded = !this.logExpanded;
      if (this.logExpanded) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const scroller = this.$refs.logScroller;
      if (scroller) {
        scroller.scrollTop = scroller.scrollHeight;
      }
    }
  },
  watch: {
    logs: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.status-bar {
  height: 100%;
  display: flex;
  background: rgba(15, 25, 45, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 15px 20px;
  box-sizing: border-box;
  color: #d3d6dd;
  border: 1px solid rgba(0, 234, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.1);
}

.status-section {
  display: flex;
  align-items: center;
  gap: 20px;
  
  &:not(:last-child) {
    border-right: 1px solid rgba(0, 234, 255, 0.2);
    padding-right: 20px;
  }
  
  &:not(:first-child) {
    padding-left: 20px;
  }
}

.system-info {
  flex: 1;
  min-width: 200px;
}

.performance-metrics {
  flex: 1.5;
  min-width: 300px;
}

.log-area {
  flex: 2;
  min-width: 250px;
  flex-direction: column;
  align-items: stretch;
}

.status-indicators {
  flex: 1;
  min-width: 150px;
  flex-direction: column;
  gap: 10px;
}

.info-item,
.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.info-label,
.metric-label {
  color: #9b9b9b;
  font-weight: 500;
  white-space: nowrap;
}

.info-value,
.metric-value {
  color: #d3d6dd;
  font-weight: bold;
  
  &.algorithm {
    color: #00eaff;
    text-shadow: 0 0 5px rgba(0, 234, 255, 0.5);
  }
  
  &.good {
    color: #00ff00;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
  }
  
  &.warning {
    color: #ffaa00;
    text-shadow: 0 0 5px rgba(255, 170, 0, 0.3);
  }
  
  &.error {
    color: #ff4444;
    text-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
  
  &.queue {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    
    &.good {
      background: rgba(0, 255, 0, 0.1);
      border: 1px solid rgba(0, 255, 0, 0.3);
    }
    
    &.warning {
      background: rgba(255, 170, 0, 0.1);
      border: 1px solid rgba(255, 170, 0, 0.3);
    }
    
    &.error {
      background: rgba(255, 68, 68, 0.1);
      border: 1px solid rgba(255, 68, 68, 0.3);
    }
  }
}

.gpu-usage {
  display: flex;
  align-items: center;
  gap: 8px;
}

.usage-bar {
  width: 60px;
  height: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.usage-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
  
  &.good {
    background: linear-gradient(90deg, #00ff00 0%, #00cc00 100%);
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
  }
  
  &.warning {
    background: linear-gradient(90deg, #ffaa00 0%, #ff8800 100%);
    box-shadow: 0 0 5px rgba(255, 170, 0, 0.3);
  }
  
  &.error {
    background: linear-gradient(90deg, #ff4444 0%, #cc0000 100%);
    box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
  
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

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-title {
  font-size: 12px;
  font-weight: bold;
  color: #00eaff;
}

.log-toggle {
  background: none;
  border: none;
  color: #9b9b9b;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #00eaff;
    background: rgba(0, 234, 255, 0.1);
  }
}

.log-container {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &.expanded {
    height: 200px;
  }
  
  &:not(.expanded) {
    height: 60px;
  }
}

.log-scroller {
  height: 100%;
  overflow-y: auto;
  padding: 8px;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 10px;
  line-height: 1.4;
  margin-bottom: 4px;
  padding: 4px 6px;
  border-radius: 3px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(0, 234, 255, 0.05);
  }
  
  &.log-info {
    .log-level {
      color: #00eaff;
    }
  }
  
  &.log-success {
    .log-level {
      color: #00ff00;
    }
  }
  
  &.log-warning {
    .log-level {
      color: #ffaa00;
    }
  }
  
  &.log-error {
    .log-level {
      color: #ff4444;
    }
  }
}

.log-time {
  color: #9b9b9b;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
}

.log-level {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 9px;
}

.log-message {
  color: #d3d6dd;
  flex: 1;
  word-break: break-word;
}

.status-indicators {
  align-items: flex-start;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #9b9b9b;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &.active {
    color: #00eaff;
    background: rgba(0, 234, 255, 0.1);
    border: 1px solid rgba(0, 234, 255, 0.3);
    
    .indicator-dot {
      background: #00eaff;
      box-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
      animation: pulse 1.5s infinite;
    }
  }
  
  &.warning {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.1);
    border: 1px solid rgba(255, 170, 0, 0.3);
    
    .indicator-dot {
      background: #ffaa00;
      box-shadow: 0 0 8px rgba(255, 170, 0, 0.5);
      animation: pulse 1.5s infinite;
    }
  }
  
  &:not(.active):not(.warning) .indicator-dot {
    background: #666;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

// 滚动条样式
.log-scroller::-webkit-scrollbar {
  width: 3px;
}

.log-scroller::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.log-scroller::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.3);
  border-radius: 2px;
  
  &:hover {
    background: rgba(0, 234, 255, 0.5);
  }
}

// 响应式设计
@media (max-width: 1600px) {
  .status-bar {
    flex-direction: column;
    height: auto;
    gap: 15px;
  }
  
  .status-section {
    &:not(:last-child) {
      border-right: none;
      border-bottom: 1px solid rgba(0, 234, 255, 0.2);
      padding-right: 0;
      padding-bottom: 15px;
    }
    
    &:not(:first-child) {
      padding-left: 0;
      padding-top: 15px;
    }
  }
  
  .log-area {
    min-width: auto;
  }
}
</style>
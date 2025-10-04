<template>
  <div class="monitor-section">
    <div class="section-header">
      <div class="section-title">
        <span class="title-icon">📹</span>
        <span>实时监控</span>
      </div>
    </div>

    <!-- 第一排：原始监控画面 -->
    <div class="row-title">原始监控画面</div>
    <div class="monitor-grid">
      <div 
        v-for="(monitor, index) in monitors" 
        :key="`orig-${monitor.id}`"
        class="monitor-card"
        :class="{ 'active': monitor.active }"
      >
        <div class="monitor-header">
          <div class="monitor-info">
            <div class="site-name">{{ monitor.siteName || monitor.name }}</div>
            <div class="signal-status" :class="normalizeSignal(monitor.signalStatus)">
              <div class="status-dot"></div>
              <span>{{ getSignalText(normalizeSignal(monitor.signalStatus)) }}</span>
            </div>
          </div>
          <div class="monitor-meta">
            <div class="fps">{{ monitor.fps }} FPS</div>
            <div class="resolution">{{ monitor.resolution }}</div>
          </div>
        </div>
        
        <div class="monitor-content">
          <div class="video-container">
            <video 
              v-if="monitor.videoUrl"
              :src="monitor.videoUrl"
              autoplay 
              muted 
              loop
              class="monitor-video"
            ></video>
            <div v-else class="video-placeholder">
              <div class="placeholder-icon">📹</div>
              <div class="placeholder-text">{{ monitor.siteType }}</div>
            </div>
            
            <div class="video-overlay">
              <div class="overlay-info">
                <div class="timestamp">{{ monitor.timestamp }}</div>
                <div class="environment-mode" :class="monitor.environmentMode || monitor.environment">
                  {{ getEnvironmentText(monitor.environmentMode || monitor.environment) }}
                </div>
              </div>
            </div>
            
            <div class="video-controls">
              <button 
                class="control-btn screenshot"
                @click="captureSingle(index)"
                title="截图"
              >
                📸
              </button>
              <button 
                class="control-btn fullscreen"
                @click="toggleFullscreen(index)"
                title="全屏"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
        
        <div class="monitor-footer">
          <div class="monitor-stats">
            <div class="stat-item">
              <span class="stat-label">延迟:</span>
              <span class="stat-value">{{ monitor.latency }}ms</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">码率:</span>
              <span class="stat-value">{{ monitor.bitrate }}Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二排：去除雨雪雾画面 -->
    <div v-if="showProcessedRow" class="row-title processed">校准画面</div>
    <div v-if="showProcessedRow" class="monitor-grid">
      <div 
        v-for="(monitor, index) in monitors" 
        :key="`proc-${monitor.id}`"
        class="monitor-card processed"
      >
        <div class="monitor-header">
          <div class="monitor-info">
            <div class="site-name">{{ (monitor.siteName || monitor.name) + '（处理后）' }}</div>
            <div class="signal-status good">
              <div class="status-dot"></div>
              <span>信号良好</span>
            </div>
          </div>
          <div class="monitor-meta">
            <div class="fps">{{ monitor.fps }} FPS</div>
            <div class="resolution">{{ monitor.resolution }}</div>
          </div>
        </div>

        <div class="monitor-content">
          <div class="video-container">
            <video 
              v-if="monitor.videoUrl"
              :src="monitor.videoUrl"
              autoplay 
              muted 
              loop
              class="monitor-video processed-video"
            ></video>
            <div v-else class="video-placeholder">
              <div class="placeholder-icon">✨</div>
              <div class="placeholder-text">处理后</div>
            </div>

            <div class="video-overlay">
              <div class="overlay-info">
                <div class="timestamp">{{ monitor.timestamp }}</div>
                <div class="environment-mode normal">已去除雨雪雾</div>
              </div>
            </div>
          </div>
        </div>

        <div class="monitor-footer">
          <div class="monitor-stats">
            <div class="stat-item">
              <span class="stat-label">延迟:</span>
              <span class="stat-value">{{ monitor.latency || 12 }}ms</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">码率:</span>
              <span class="stat-value">{{ monitor.bitrate || 8 }}Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 全屏预览模态框 -->
    <div v-if="fullscreenMonitor" class="fullscreen-modal" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <div class="fullscreen-header">
          <div class="fullscreen-title">{{ fullscreenMonitor.siteName }}</div>
          <button class="close-btn" @click="closeFullscreen">✕</button>
        </div>
        <div class="fullscreen-video">
          <video 
            v-if="fullscreenMonitor.videoUrl"
            :src="fullscreenMonitor.videoUrl"
            autoplay 
            muted 
            loop
            class="fullscreen-monitor-video"
          ></video>
          <div v-else class="fullscreen-placeholder">
            <div class="fullscreen-placeholder-icon">📹</div>
            <div class="fullscreen-placeholder-text">{{ fullscreenMonitor.siteType }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonitorSection',
  props: {
    monitors: {
      type: Array,
      default: () => []
    },
    showProcessedRow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fullscreenMonitor: null
    };
  },
  methods: {
    normalizeSignal(status) {
      if (status === 'normal') return 'good';
      return status || 'good';
    },
    getSignalText(status) {
      const statusMap = {
        'good': '信号良好',
        'warning': '信号一般',
        'error': '信号异常'
      };
      return statusMap[status] || '未知状态';
    },
    getEnvironmentText(mode) {
      const modeMap = {
        'normal': '正常',
        'rain': '雨天',
        'fog': '雾天',
        'snow': '雪天'
      };
      return modeMap[mode] || '未知';
    },
    captureSingle(index) {
      const monitor = this.monitors[index];
      this.$emit('capture-screenshot', {
        id: monitor.id,
        siteName: monitor.siteName,
        timestamp: monitor.timestamp,
        type: 'single'
      });
      
      // 添加截图动画效果
      this.animateScreenshot(index);
    },
    captureAll() {
      this.$emit('capture-screenshot', {
        type: 'all',
        monitors: this.monitors.map(m => ({
          id: m.id,
          siteName: m.siteName,
          timestamp: m.timestamp
        }))
      });
      
      // 添加截图动画效果
      this.monitors.forEach((_, index) => {
        this.animateScreenshot(index);
      });
    },
    animateScreenshot(index) {
      const monitorElement = document.querySelectorAll('.monitor-card')[index];
      if (monitorElement) {
        monitorElement.classList.add('screenshot-flash');
        setTimeout(() => {
          monitorElement.classList.remove('screenshot-flash');
        }, 300);
      }
    },
    toggleFullscreen(index) {
      this.fullscreenMonitor = this.monitors[index];
    },
    closeFullscreen() {
      this.fullscreenMonitor = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor-section {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
  
  .title-icon {
    font-size: 20px;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.screenshot-btn {
  background: linear-gradient(135deg, #00eaff 0%, #007bff 100%);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 234, 255, 0.4);
  }
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
  overflow-y: auto;
}

.row-title {
  margin: 10px 0 5px;
  font-size: 14px;
  font-weight: bold;
  color: #00eaff;
  &.processed { color: #7dffcb; }
}

.monitor-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 234, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: rgba(0, 234, 255, 0.3);
    box-shadow: 0 0 20px rgba(0, 234, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #00eaff;
    box-shadow: 0 0 30px rgba(0, 234, 255, 0.3);
  }
  
  &.screenshot-flash {
    animation: screenshot-flash 0.3s ease;
  }
}

@keyframes screenshot-flash {
  0% { box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
  50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
  100% { box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);
}

.monitor-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.site-name {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
}

.signal-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  
  &.good .status-dot {
    background: #00ff00;
    box-shadow: 0 0 5px #00ff00;
  }
  
  &.warning .status-dot {
    background: #ffaa00;
    box-shadow: 0 0 5px #ffaa00;
  }
  
  &.error .status-dot {
    background: #ff4444;
    box-shadow: 0 0 5px #ff4444;
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.monitor-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.fps {
  font-size: 11px;
  color: #00eaff;
  font-weight: bold;
}

.resolution {
  font-size: 10px;
  color: #9b9b9b;
}

.monitor-content {
  position: relative;
  height: 200px;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.monitor-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.processed-video {
  filter: contrast(1.08) brightness(1.06) saturate(1.1);
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  
  .placeholder-icon {
    font-size: 48px;
    color: rgba(0, 234, 255, 0.3);
    margin-bottom: 10px;
  }
  
  .placeholder-text {
    font-size: 14px;
    color: rgba(0, 234, 255, 0.6);
  }
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  pointer-events: none;
}

.overlay-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 10px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 3px;
}

.environment-mode {
  font-size: 10px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 3px;
  
  &.rain { background: rgba(0, 114, 255, 0.6); }
  &.fog { background: rgba(128, 128, 128, 0.6); }
  &.snow { background: rgba(255, 255, 255, 0.6); color: #000; }
}

.video-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
}

.control-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 234, 255, 0.7);
    transform: scale(1.1);
  }
}

.monitor-footer {
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(0, 234, 255, 0.1);
}

.monitor-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
}

.stat-label {
  color: #9b9b9b;
}

.stat-value {
  color: #00eaff;
  font-weight: bold;
}

// 全屏模态框
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.fullscreen-content {
  width: 90%;
  height: 90%;
  background: rgba(15, 25, 45, 0.9);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 234, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 234, 255, 0.2);
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.fullscreen-title {
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
}

.fullscreen-video {
  height: calc(100% - 80px);
  padding: 20px;
}

.fullscreen-monitor-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.fullscreen-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  
  .fullscreen-placeholder-icon {
    font-size: 72px;
    color: rgba(0, 234, 255, 0.3);
    margin-bottom: 20px;
  }
  
  .fullscreen-placeholder-text {
    font-size: 18px;
    color: rgba(0, 234, 255, 0.6);
  }
}

// 响应式布局
@media (min-width: 1200px) {
  .monitor-grid {
    grid-template-columns: 1fr;
  }
}

/* 固定每排三个监控视频，避免换行到下一排 */
@media (min-width: 1600px) {
  .monitor-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

// 滚动条样式
.monitor-section::-webkit-scrollbar {
  width: 4px;
}

.monitor-section::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.monitor-section::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.3);
  border-radius: 2px;
  
  &:hover {
    background: rgba(0, 234, 255, 0.5);
  }
}
</style>
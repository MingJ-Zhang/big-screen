<template>
  <div class="header-bar">
    <div class="header-left">
      <div class="title-section">
        <div class="title-decoration"></div>
        <h1 class="system-title">监控影像光照自适应校准系统</h1>
        <div class="title-decoration"></div>
      </div>
    </div>
    
    <div class="header-center">
      <div class="weather-info">
        <div class="info-item">
          <div class="info-icon">⛅</div>
          <div class="info-content">
            <span class="info-label">天气</span>
            <span class="info-value">{{ weather || '—' }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">🌡</div>
          <div class="info-content">
            <span class="info-label">温度</span>
            <span class="info-value">{{ formatTemperature(temperature) }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">💧</div>
          <div class="info-content">
            <span class="info-label">湿度</span>
            <span class="info-value">{{ formatHumidity(humidity) }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">💡</div>
          <div class="info-content">
            <span class="info-label">光照强度</span>
            <span class="info-value">{{ formatLight(lightIntensity) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="header-right">
      <div class="current-time">
        <div class="time-display">{{ currentTime }}</div>
      </div>
      
      <div class="fullscreen-btn" @click="toggleFullscreen" title="全屏切换">
        <div class="fullscreen-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div class="system-status">
        <div class="status-indicator" :class="environmentMode"></div>
        <span class="status-text">{{ getModeText(environmentMode) }}</span>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="header-decoration">
      <div class="decoration-line left"></div>
      <div class="decoration-line right"></div>
      <div class="decoration-particles">
        <div class="particle" v-for="n in 8" :key="n"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    currentTime: {
      type: String,
      default: ''
    },
    environmentMode: {
      type: String,
      default: 'normal'
    },
    weather: {
      type: String,
      default: ''
    },
    temperature: {
      type: [String, Number],
      default: null
    },
    humidity: {
      type: [String, Number],
      default: null
    },
    lightIntensity: {
      type: [String, Number],
      default: null
    }
  },
  methods: {
    toggleFullscreen() {
      this.$emit('fullscreen');
    },
    getModeText(mode) {
      const modeTexts = {
        normal: '正常模式',
        rain: '雨天模式',
        fog: '雾天模式',
        snow: '雪天模式'
      };
      return modeTexts[mode] || '未知模式';
    },
    formatTemperature(val) {
      if (val === null || val === undefined || val === '') return '—';
      const num = Number(val);
      return isNaN(num) ? String(val) : `${num}℃`;
    },
    formatHumidity(val) {
      if (val === null || val === undefined || val === '') return '—';
      const num = Number(val);
      return isNaN(num) ? String(val) : `${num}%`;
    },
    formatLight(val) {
      if (val === null || val === undefined || val === '') return '—';
      const num = Number(val);
      // 使用 lx（勒克斯）作为光照强度单位
      return isNaN(num) ? String(val) : `${num} lx`;
    }
  }
};
</script>

<style lang="scss" scoped>
.header-bar {
  position: relative;
  height: 80px;
  background: linear-gradient(135deg, 
    rgba(0, 114, 255, 0.8) 0%, 
    rgba(0, 234, 255, 0.6) 25%,
    rgba(1, 170, 255, 0.8) 50%,
    rgba(0, 234, 255, 0.6) 75%,
    rgba(0, 114, 255, 0.8) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 4s ease-in-out infinite;
  border-radius: 12px;
  box-shadow: 
    0 4px 20px rgba(0, 234, 255, 0.3),
    0 0 40px rgba(0, 114, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  margin-bottom: 20px;
  overflow: hidden;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.header-left {
  flex: 1;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.system-title {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 
    0 0 10px rgba(0, 234, 255, 0.8),
    0 0 20px rgba(0, 114, 255, 0.6);
  letter-spacing: 2px;
  margin: 0;
}

.title-decoration {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(0, 234, 255, 0.8) 50%,
    transparent 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.weather-info {
  display: flex;
  gap: 18px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 234, 255, 0.1);
    transform: translateY(-2px);
  }
}

.info-icon {
  font-size: 24px;
  color: #00eaff;
  filter: drop-shadow(0 0 6px rgba(0, 234, 255, 0.5));
}

.info-content {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.info-label {
  font-size: 14px;
  color: #9b9b9b;
}

.info-value {
  font-size: 20px;
  color: #ffffff;
  font-weight: 600;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.current-time {
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.time-display {
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.5);
}

.time-label {
  font-size: 10px;
  color: #9b9b9b;
  margin-top: 2px;
}

.fullscreen-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #00eaff;
  
  &:hover {
    background: rgba(0, 234, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
  }
}

.fullscreen-icon {
  transition: all 0.3s ease;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 15px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: statusPulse 2s infinite;
  
  &.normal { background: #00ff00; }
  &.rain { background: #4a90e2; }
  &.fog { background: #9b9b9b; }
  &.snow { background: #e6f3ff; }
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 12px;
  color: #d3d6dd;
  font-weight: 500;
}

// 背景装饰
.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-line {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(0, 234, 255, 0.6) 50%,
    transparent 100%
  );
  top: 20px;
  
  &.left {
    left: -50px;
    transform: rotate(-45deg);
  }
  
  &.right {
    right: -50px;
    transform: rotate(45deg);
  }
}

.decoration-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(0, 234, 255, 0.6);
  border-radius: 50%;
  animation: floatParticle 6s infinite linear;
  
  @for $i from 1 through 8 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: random(6) * -1s;
      animation-duration: (random(4) + 4) * 1s;
    }
  }
}

@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0;
  }
}
</style>
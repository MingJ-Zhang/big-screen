<template>
  <div class="cyber-dashboard">
    <!-- 背景粒子效果 -->
    <div class="particles-bg">
      <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>
    
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    
    <!-- 主标题 -->
    <div class="main-title">
      <h1 class="title-text">
        <span class="title-line">建材工业(水泥)粉尘颗粒物智能监控系统</span>
        <!-- <span class="title-line">数据中心</span> -->
      </h1>
      <div class="title-subtitle">INTELLIGENT MONITORING DATA CENTER</div>
    </div>
    
    <!-- 系统卡片网格 -->
    <div class="systems-grid">
      <div 
        v-for="(system, index) in systems" 
        :key="system.id"
        class="system-card"
        :class="`card-${index + 1}`"
        @click="navigateToSystem(system.route)"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        <!-- 卡片背景效果 -->
        <div class="card-bg"></div>
        <div class="card-glow"></div>
        
        <!-- 卡片内容 -->
        <div class="card-content">
          <div class="card-icon">
            <i :class="system.icon"></i>
            <div class="icon-ring"></div>
          </div>
          
          <div class="card-info">
            <h3 class="card-title">{{ system.title }}</h3>
            <p class="card-desc">{{ system.description }}</p>
            <div class="card-status">
              <span class="status-dot"></span>
              <span class="status-text">系统运行正常</span>
            </div>
          </div>
          
          <!-- 数据可视化小图表 -->
          <div class="card-chart">
            <div class="chart-bars">
              <div v-for="j in 5" :key="j" class="chart-bar" :style="{ height: Math.random() * 60 + 20 + '%' }"></div>
            </div>
          </div>
        </div>
        
        <!-- 悬浮效果 -->
        <div class="card-hover-effect"></div>
      </div>
    </div>
    
    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-item">
        <span class="status-label">系统状态</span>
        <span class="status-value online">在线</span>
      </div>
      <div class="status-item">
        <span class="status-label">连接数</span>
        <span class="status-value">{{ connectionCount }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">最后更新</span>
        <span class="status-value">{{ lastUpdate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CyberDashboard',
  data() {
    return {
      connectionCount: 0,
      lastUpdate: '',
      systems: [
        { id: 1, title: '监控影像质量(噪声失真)评估', description: '自动评估画面噪声程度，量化失真影响。', route: '/zaosheng', icon: 'el-icon-data-analysis' },
        { id: 2, title: '监控影像质量(模糊失真)评估', description: '检测图像清晰度，评估模糊对识别影响。', route: null, icon: 'el-icon-picture' },
        { id: 3, title: '监控影像质量(压缩失真)评估', description: '分析压缩伪影与码率关系，给出质量评分。', route: null, icon: 'el-icon-s-operation' },
        { id: 4, title: '监控影像质量(亮度对比度)评估', description: '测量亮度与对比度偏差，建议优化参数。', route: null, icon: 'el-icon-s-grid' },
        { id: 5, title: '监控影像雨雾雪自动去除', description: '智能去除雨雾雪干扰，提升画面通透度。', route: null, icon: 'el-icon-magic-stick' },
        { id: 6, title: '监控影像光照自适应校准', description: '自适应补偿光照变化，稳定曝光与色彩。', route: null, icon: 'el-icon-s-tools' },
        { id: 7, title: '监控影像对比度自动优化', description: '自动增强局部与整体对比度，突出关键细节。', route: null, icon: 'el-icon-edit' },
        { id: 8, title: '粉尘有组织排放智能监测', description: '实时监测管道/设备排放粉尘浓度与状态。', route: null, icon: 'el-icon-monitor' },
        { id: 9, title: '粉尘有组织排放定位分割', description: '精准定位并分割排放区域，提取目标轮廓。', route: null, icon: 'el-icon-location' },
        { id: 10, title: '粉尘有组织排放浓度预测', description: '基于时序数据预测后续排放浓度趋势。', route: null, icon: 'el-icon-s-marketing' },
        { id: 11, title: '粉尘无组织排放浓度识别', description: '识别扩散粉尘区域并估算浓度水平。', route: null, icon: 'el-icon-data-board' },
        { id: 12, title: '粉尘无组织排放浓度预测', description: '预测无组织扩散浓度变化并提前预警。', route: null, icon: 'el-icon-aim' }
      ]
    }
  },
  mounted() {
    this.updateStatus()
    this.startStatusUpdate()
  },
  methods: {
    navigateToSystem(route) {
      if (route) {
        this.$router.push(route)
      }
    },
    getParticleStyle(index) {
      return {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 10 + 's',
        animationDuration: (Math.random() * 20 + 10) + 's'
      }
    },
    updateStatus() {
      this.connectionCount = Math.floor(Math.random() * 50) + 150
      this.lastUpdate = new Date().toLocaleTimeString()
    },
    startStatusUpdate() {
      setInterval(() => {
        this.updateStatus()
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.cyber-dashboard {
  position: relative;
  min-height: 100%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;
}

// 粒子背景
.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #00ffff;
  border-radius: 50%;
  animation: particleFloat 20s linear infinite;
  box-shadow: 0 0 6px #00ffff;
}

// 网格背景
.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  z-index: 1;
}

// 主标题
.main-title {
  text-align: center;
  margin-bottom: 3rem;
  z-index: 10;
  position: relative;
}

.title-text {
  font-size: 4rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.1;
  
  .title-line {
    display: block;
    background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: titleGradient 3s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.8));
  }
}

.title-subtitle {
  font-size: 1.2rem;
  color: #00ffff;
  letter-spacing: 0.3rem;
  margin-top: 1rem;
  opacity: 0.8;
  animation: subtitlePulse 2s ease-in-out infinite;
}

// 系统网格
.systems-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1500px;
  margin: 0 auto 3rem;
  z-index: 10;
  position: relative;
}

// 系统卡片
.system-card {
  position: relative;
  height: 200px;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  animation: cardSlideIn 0.8s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transform: translateY(50px);
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    
    .card-glow {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .card-hover-effect {
      opacity: 1;
    }
    
    .icon-ring {
      transform: scale(1.2) rotate(180deg);
    }
    
    .chart-bars .chart-bar {
      animation-play-state: running;
    }
  }
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(0, 255, 255, 0.1) 0%, 
    rgba(255, 0, 255, 0.1) 50%, 
    rgba(0, 255, 255, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.card-content {
  position: relative;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.card-icon {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  
  i {
    font-size: 2.5rem;
    color: #00ffff;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 0 10px #00ffff);
  }
}

.icon-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-top-color: #00ffff;
    border-radius: 50%;
    animation: iconRotate 3s linear infinite;
  }
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.card-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  animation: statusPulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px #00ff00;
}

.status-text {
  color: #00ff00;
}

.card-chart {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 60px;
  height: 30px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  height: 100%;
  gap: 3px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #00ffff, #ff00ff);
  border-radius: 1px;
  animation: chartPulse 2s ease-in-out infinite;
  animation-play-state: paused;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 100%);
  opacity: 0;
  transition: all 0.6s ease;
  pointer-events: none;
}

.system-card:hover .card-hover-effect {
  left: 100%;
  opacity: 1;
}

// 状态栏
.status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  z-index: 100;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.status-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.status-value {
  font-size: 1rem;
  font-weight: 600;
  color: #00ffff;
  
  &.online {
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
  }
}

// 动画
@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes titleGradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes subtitlePulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes cardSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes iconRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

@keyframes chartPulse {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .cyber-dashboard {
    padding: 1rem;
  }
  
  .title-text {
    font-size: 2.5rem;
  }
  
  .systems-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .system-card {
    height: 160px;
  }
  
  .status-bar {
    gap: 1rem;
  }
}
</style>

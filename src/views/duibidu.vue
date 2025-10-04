<template>
  <ScaleScreen :width="1920" :height="1080" class="scale-wrap" :selfAdaption="$store.state.setting.isScale">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <!-- 粒子背景效果 -->
        <div class="particles-background">
          <div class="particle" v-for="n in 50" :key="n"></div>
        </div>
        
        <!-- 光晕效果 -->
        <div class="glow-effects">
          <div class="glow-top-left"></div>
          <div class="glow-top-right"></div>
          <div class="glow-bottom-left"></div>
          <div class="glow-bottom-right"></div>
        </div>
        
        <!-- 顶部标题栏 -->
        <HeaderBar 
          :current-time="dateYear + ' ' + dateWeek + ' ' + dateDay"
          :environment-mode="environmentMode"
          @fullscreen="toggleFullscreen"
          @mode-change="handleModeChange"
        />
        
        <!-- 主要内容区域 - 五区布局 -->
        <div class="main-content">
          <!-- 左侧控制面板 -->
          <div class="left-panel">
            <AlgorithmPanel 
              :current-algorithm="currentAlgorithm"
              :processing="isProcessing"
              :progress="processingProgress"
              @algorithm-change="selectAlgorithm"
              @parameter-change="updateParameter"
              @start-processing="startProcessing"
              @stop-processing="stopProcessing"
              @auto-mode="autoMode"
              @reset="resetParameters"
            />
          </div>
          
          <!-- 中轴监控区 -->
          <div class="center-monitor">
            <MonitorSection 
              :monitors="monitors"
              :showProcessedRow="true"
              @capture-frame="captureFrame"
              @toggle-monitor-fullscreen="toggleMonitorFullscreen"
            />
          </div>
          
        </div>
        
        <!-- 底部状态栏 -->
        <!-- <StatusBar 
          :current-algorithm="systemStatus.currentAlgorithm"
          :latency="systemStatus.delay"
          :fps="systemStatus.fps"
          :gpu-usage="systemStatus.gpuUsage"
          :queue-length="systemStatus.queueLength"
          :logs="systemLogs"
          :system-status="'running'"
          :processing-status="isProcessing ? 'processing' : 'idle'"
          :alert-count="0"
          :start-time="startTime"
        /> -->
      </div>
    </div>
    <Setting ref="setting"/>
  </ScaleScreen>
</template>

<script>
import {formatTime} from "../utils/index.js";
import Setting from "./setting.vue";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";
import HeaderBar from "./duibidu/header-bar.vue";
import AlgorithmPanel from "./duibidu/algorithm-panel.vue";
import MonitorSection from "./duibidu/monitor-section.vue";
import message from '@/components/message/message'

export default {
  components: {
    Setting, 
    ScaleScreen, 
    HeaderBar,
    AlgorithmPanel,
    MonitorSection,
  },
  data() {
    return {
      flag: 1,
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      
      // 系统状态数据
      environmentMode: 'normal', // normal, rain, fog, snow
      currentAlgorithm: 'adaptive',
      isProcessing: false,
      processingProgress: 0,
      isFullscreen: false,
      
      // 算法列表
      algorithms: [
        { id: 'traditional', name: '传统算法', description: '基于图像处理技术' },
        { id: 'deep', name: '深度学习', description: '基于CNN网络' },
        { id: 'gan', name: 'GAN网络', description: '生成对抗网络' },
        { id: 'adaptive', name: '自适应算法', description: '智能环境适应' }
      ],
      
      // 参数设置
      parameters: {
        intensity: 75,
        sharpness: 60,
        defogRadius: 30,
        threshold: 45
      },
      
      // 监控数据
      monitors: [
        {
          id: 'highway',
          name: '监控点位1',
          signalStatus: 'normal',
          fps: 30,
          resolution: '1920x1080',
          timestamp: '14:23:45',
          environment: 'rain',
          videoUrl: require('@/assets/images/video.mp4')
        },
        {
          id: 'tunnel',
          name: '监控点位2',
          signalStatus: 'warning',
          fps: 25,
          resolution: '1280x720',
          timestamp: '14:23:42',
          environment: 'fog',
          videoUrl: require('@/assets/images/video.mp4')
        },
        {
          id: 'airport',
          name: '监控点位3',
          signalStatus: 'normal',
          fps: 60,
          resolution: '1920x1080',
          timestamp: '14:23:48',
          environment: 'snow',
          videoUrl: require('@/assets/images/video.mp4')
        }
      ],
      
      // 对比数据
      comparisons: [
        {
          id: 'original',
          title: '原始图像',
          originalImage: '/src/assets/images/original.jpg',
          processedImage: '/src/assets/images/original.jpg',
          detailImage: '/src/assets/images/detail.jpg',
          algorithm: '原始图像',
          processingTime: 0,
          psnr: 0,
          ssim: 1.0
        },
        {
          id: 'processed',
          title: '处理效果',
          originalImage: '/src/assets/images/original.jpg',
          processedImage: '/src/assets/images/processed.jpg',
          detailImage: '/src/assets/images/detail.jpg',
          algorithm: 'DeRain',
          processingTime: 18,
          psnr: 28.5,
          ssim: 0.92
        },
        {
          id: 'detail',
          title: '细节对比',
          originalImage: '/src/assets/images/original.jpg',
          processedImage: '/src/assets/images/processed.jpg',
          detailImage: '/src/assets/images/detail.jpg',
          algorithm: '细节增强',
          processingTime: 25,
          psnr: 29.2,
          ssim: 0.95
        }
      ],
      
      // 系统状态
      systemStatus: {
        runtime: '00:00:00',
        currentAlgorithm: 'DeRain',
        delay: 18,
        fps: 30,
        gpuUsage: 45,
        queueLength: 3
      },
      startTime: Date.now(), // 系统启动时间
      
      // 定时器
      dataSimulationTimer: null,
      processingTimer: null,
      performanceTimer: null,
      logTimer: null,
      
      // 性能指标
      performanceMetrics: {
        fps: 30,
        gpu: 45,
        memory: 67,
        temperature: 72
      },
      
      // 系统日志
      systemLogs: [
        { timestamp: '14:23:01', message: 'DeFog 执行 18ms，输出 1280×720', level: 'info' },
        { timestamp: '14:23:02', message: '检测到雾天模式，自动切换算法', level: 'info' },
        { timestamp: '14:23:03', message: '处理完成，PSNR: 28.5, SSIM: 0.92', level: 'info' },
        { timestamp: '14:23:04', message: '开始处理新帧，队列长度: 3', level: 'info' },
        { timestamp: '14:23:05', message: 'GPU 使用率: 45%，温度: 72°C', level: 'info' },
        { timestamp: '14:23:06', message: '系统运行正常，延迟: 18ms', level: 'info' },
        { timestamp: '14:23:07', message: '自动截图已保存到记录面板', level: 'info' },
        { timestamp: '14:23:08', message: '算法参数已优化，处理速度提升15%', level: 'info' },
        { timestamp: '14:23:09', message: '检测到雨天模式，启用DeRain算法', level: 'info' },
        { timestamp: '14:23:10', message: '处理队列优化，当前长度: 2', level: 'info' }
      ]
    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  computed: {},
  created() {
  },
  mounted() {
    this.timeFn();
    this.cancelLoading();
    this.startDataSimulation();
    this.startProcessingSimulation();
    this.startPerformanceSimulation();
    this.startLogSimulation();
  },
  beforeDestroy() {
    clearInterval(this.timing);
    clearInterval(this.dataSimulationTimer);
    this.stopAllSimulations();
  },
  methods: {
    // 时间更新
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), "HH: mm: ss");
        this.dateYear = formatTime(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    
    // 取消加载
    cancelLoading() {
      let timer = setTimeout(() => {
        this.loading = false;
        clearTimeout(timer);
      }, 500);
    },
    
    // 全屏切换
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    
    // 环境模式切换
    handleModeChange(mode) {
      this.environmentMode = mode;
      this.updateAlgorithmByMode(mode);
    },
    
    // 根据环境模式更新算法
    updateAlgorithmByMode(mode) {
      const modeAlgorithmMap = {
        rain: 'deep',
        fog: 'deep', 
        snow: 'deep',
        normal: 'adaptive'
      };
      this.currentAlgorithm = modeAlgorithmMap[mode] || 'adaptive';
    },
    
    // 选择算法
    selectAlgorithm(algorithm) {
      this.currentAlgorithm = algorithm;
      this.addLog(`算法切换至: ${algorithm}`);
      message.success({ text: `已切换算法：${algorithm}` });
    },
    
    // 更新参数
    updateParameter(param) {
      this.parameters = { ...this.parameters, ...param };
      this.addLog(`参数更新: ${JSON.stringify(param)}`);
      message.info({ text: '参数已更新' });
    },
    
    // 切换处理状态
    toggleProcessing() {
      this.isProcessing = !this.isProcessing;
      if (this.isProcessing) {
        this.startProcessingSimulation();
        this.addLog('开始处理视频流...');
        message.success({ text: '开始处理视频流' });
      } else {
        clearInterval(this.processingTimer);
        this.processingProgress = 0;
        this.addLog('处理已停止');
        message.warning({ text: '处理已停止' });
      }
    },
    
    // 自动模式
    autoMode() {
      this.addLog('自动模式已启用');
      message.info({ text: '自动模式已启用，正在检测环境' });
      // 模拟自动检测环境
      const modes = ['normal', 'rain', 'fog', 'snow'];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      this.environmentMode = randomMode;
      this.updateAlgorithmByMode(randomMode);
      message.success({ text: `环境：${randomMode}，算法已调整` });
    },
    
    // 重置参数
    resetParameters() {
      this.parameters = {
        intensity: 75,
        sharpness: 60,
        defogRadius: 30,
        threshold: 45
      };
      this.addLog('参数已重置为默认值');
      message.success({ text: '参数已重置为默认值' });
    },
    
    // 算法变更
    handleAlgorithmChange(algorithm) {
      this.currentAlgorithm = algorithm;
      this.addLog(`算法切换至: ${algorithm.toUpperCase()}`);
    },
    
    // 参数变更
    handleParameterChange(params) {
      this.addLog(`参数更新: ${JSON.stringify(params)}`);
    },
    
    // 开始处理
    startProcessing() {
      // 清理已有定时器
      clearInterval(this.processingTimer);
      this.isProcessing = true;
      this.processingProgress = 0;
      this.addLog('开始处理视频流...');
      message.success({ text: '开始处理视频流' });

      // 3s 内进度到 100%，然后隐藏进度条
      const duration = 3000; // 总时长 3s
      const interval = 100;  // 每 100ms 更新一次
      const step = 100 * (interval / duration); // 每次增加的百分比
      this.processingTimer = setInterval(() => {
        this.processingProgress = Math.min(100, this.processingProgress + step);
        if (this.processingProgress >= 100) {
          clearInterval(this.processingTimer);
          this.addLog('处理完成');
          message.success({ text: '处理完成' });
          // 略作延迟以便用户看到 100%
          setTimeout(() => {
            this.isProcessing = false;
            this.processingProgress = 0;
          }, 200);
        }
      }, interval);
    },
    
    // 停止处理
    stopProcessing() {
      clearInterval(this.processingTimer);
      this.isProcessing = false;
      this.processingProgress = 0;
      this.addLog('处理已停止');
      message.warning({ text: '处理已停止' });
    },
    
    // 启用自动模式
    enableAutoMode() {
      this.addLog('自动模式已启用');
      // 模拟自动检测环境
      const modes = ['normal', 'rain', 'fog', 'snow'];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      this.handleModeChange(randomMode);
    },
    
    // 重置参数
    resetParameters() {
      this.addLog('参数已重置为默认值');
      message.success({ text: '参数已重置为默认值' });
    },
    
    // 截图帧
    captureFrame(monitorId) {
      this.addLog(`截图已保存: ${monitorId}`);
      // 这里可以添加实际的截图逻辑
    },
    
    // 显示详情预览
    showDetailPreview(data) {
      this.addLog(`预览详情: ${data.algorithm}`);
    },
    
    // 切换监控全屏
    toggleMonitorFullscreen(monitorId) {
      this.addLog(`监控全屏切换: ${monitorId}`);
    },
    
    // 预览详情
    previewDetail(comparison) {
      this.addLog(`查看详情对比: ${comparison.algorithm}`);
    },
    
    // 处理模拟
    startProcessingSimulation() {
      if (this.isProcessing) {
        this.processingTimer = setInterval(() => {
          this.processingProgress += Math.random() * 8;
          if (this.processingProgress >= 100) {
            this.processingProgress = 0;
            this.addLog(`[${new Date().toLocaleTimeString()}] ${this.currentAlgorithm} 处理完成，耗时 ${Math.floor(Math.random() * 50 + 20)}ms`);
          }
        }, 300);
      }
    },
    
    // 添加日志
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.systemLogs.unshift({
        timestamp,
        message,
        type: Math.random() > 0.8 ? 'warning' : 'info'
      });
      
      if (this.systemLogs.length > 10) {
        this.systemLogs = this.systemLogs.slice(0, 10);
      }
    },
    
    // 性能监控模拟
    startPerformanceSimulation() {
      this.performanceTimer = setInterval(() => {
        // 模拟性能指标波动
        this.performanceMetrics.latency = Math.floor(Math.random() * 50) + 10;
        this.performanceMetrics.fps = Math.floor(Math.random() * 20) + 20;
        this.performanceMetrics.gpu = Math.floor(Math.random() * 40) + 30;
        this.performanceMetrics.queue = Math.floor(Math.random() * 5);
        
        // 更新系统状态信息
        this.systemStatus.runtime = this.formatRuntime(Date.now() - this.startTime);
        this.systemStatus.currentAlgorithm = this.currentAlgorithm;
        this.systemStatus.delay = this.performanceMetrics.latency;
        this.systemStatus.fps = this.performanceMetrics.fps;
        this.systemStatus.gpuUsage = this.performanceMetrics.gpu;
        this.systemStatus.queueLength = this.performanceMetrics.queue;
      }, 1000);
    },
    
    // 日志模拟
    startLogSimulation() {
      this.logTimer = setInterval(() => {
        const logs = [
          `${this.currentAlgorithm} 算法启动`,
          `检测到${this.environmentMode === 'rain' ? '雨天' : this.environmentMode === 'fog' ? '雾天' : '雪天'}模式`,
          `GPU利用率: ${this.performanceMetrics.gpu}%`,
          `处理延迟: ${this.performanceMetrics.latency}ms`,
          `任务队列: ${this.performanceMetrics.queue}个`,
          '系统运行正常',
          '网络连接稳定',
          '视频流输入正常'
        ];
        
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        this.addLog(`[${new Date().toLocaleTimeString()}] ${randomLog}`);
      }, 5000);
    },
    
    // 停止所有模拟
    stopAllSimulations() {
      clearInterval(this.dataSimulationTimer);
      clearInterval(this.processingTimer);
      clearInterval(this.performanceTimer);
      clearInterval(this.logTimer);
    },
    
    // 格式化运行时长
    formatRuntime(ms) {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
      } else {
        return `${seconds}s`;
      }
    },
    
    // 数据模拟
    startDataSimulation() {
      this.dataSimulationTimer = setInterval(() => {
        // 模拟性能指标变化
        this.performanceMetrics.fps = Math.floor(Math.random() * 15) + 20;
        this.performanceMetrics.gpu = Math.floor(Math.random() * 30) + 30;
        this.performanceMetrics.memory = Math.floor(Math.random() * 20) + 60;
        this.performanceMetrics.temperature = Math.floor(Math.random() * 15) + 65;
        
        // 更新系统状态
        this.systemStatus.fps = this.performanceMetrics.fps;
        this.systemStatus.gpuUsage = this.performanceMetrics.gpu;
        this.systemStatus.delay = Math.floor(Math.random() * 10) + 15;
        this.systemStatus.queueLength = Math.floor(Math.random() * 5) + 1;
        
        // 更新监控数据
        Object.keys(this.monitorData).forEach(key => {
          this.monitorData[key].fps = Math.floor(Math.random() * 15) + 20;
          this.monitorData[key].status = Math.random() > 0.9 ? 'warning' : 'online';
          if (Math.random() > 0.95) this.monitorData[key].status = 'offline';
        });
        
        // 随机更新对比数据
        this.comparisonData.processed.processingTime = Math.floor(Math.random() * 30) + 15;
        this.comparisonData.processed.psnr = (Math.random() * 8) + 22;
        this.comparisonData.detail.processingTime = Math.floor(Math.random() * 15) + 20;
        this.comparisonData.detail.psnr = (Math.random() * 4) + 27;
        
      }, 1500);
    },
    
    // 原有方法
    change(val) {
      console.log(val);
      this.flag = val
    },
    
    logout() {
      this.$router.push("/index")
    },
    
    showSetting() {
      this.$refs.setting.init();
    }
  },
};
</script>

<style lang="scss" scoped>
// 粒子动画
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes particle-move {
  0% { transform: translate(0, 0) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(var(--move-x), var(--move-y)) scale(1); opacity: 0; }
}

// 光晕动画
@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes border-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 234, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 234, 255, 0.6), 0 0 30px rgba(0, 234, 255, 0.3); }
}

// 粒子背景效果
.particles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  
  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(0, 234, 255, 0.6);
    border-radius: 50%;
    animation: particle-move 8s infinite linear;
    
    @for $i from 1 through 50 {
      &:nth-child(#{$i}) {
        --move-x: #{random(200) - 100}px;
        --move-y: #{random(200) - 100}px;

        animation-delay: #{random(8)}s;
        animation-duration: #{8 + random(4)}s;
      }
    }
  }
}

// 光晕效果
.glow-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  
  [class*="glow-"] {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 234, 255, 0.1) 0%, transparent 70%);
    animation: glow-pulse 4s infinite ease-in-out;
  }
  
  .glow-top-left {
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }
  
  .glow-top-right {
    top: -100px;
    right: -100px;
    animation-delay: 1s;
  }
  
  .glow-bottom-left {
    bottom: -100px;
    left: -100px;
    animation-delay: 2s;
  }
  
  .glow-bottom-right {
    bottom: -100px;
    right: -100px;
    animation-delay: 3s;
  }
}
</style>

<style lang="scss" scoped>
@import "./home.scss";

// 五区布局样式
.main-content {
  display: flex;
  height: calc(100% - 120px); // 减去顶部标题栏和底部状态栏高度
  gap: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}

.left-panel {
  width: 380px;
  background: rgba(15, 25, 45, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: border-glow 3s infinite ease-in-out;
  
  &:hover {
    border-color: rgba(0, 234, 255, 0.4);
    box-shadow: 0 0 30px rgba(0, 234, 255, 0.2);
  }
}

.center-monitor {
  flex: 1;
  background: rgba(15, 25, 45, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: border-glow 3s infinite ease-in-out;
  
  &:hover {
    border-color: rgba(0, 234, 255, 0.4);
    box-shadow: 0 0 30px rgba(0, 234, 255, 0.2);
  }
}

.right-comparison {
  width: 480px;
  background: rgba(15, 25, 45, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: border-glow 3s infinite ease-in-out;
  
  &:hover {
    border-color: rgba(0, 234, 255, 0.4);
    box-shadow: 0 0 30px rgba(0, 234, 255, 0.2);
  }
}

// 玻璃拟态效果增强
.glass-effect {
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 234, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

// 粒子动画背景
@keyframes particleFloat {
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(0, 234, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat 8s infinite linear;
  
  &:nth-child(2n) {
    background: rgba(0, 114, 255, 0.4);
    animation-duration: 12s;
    animation-delay: -2s;
  }
  
  &:nth-child(3n) {
    background: rgba(1, 170, 255, 0.5);
    animation-duration: 10s;
    animation-delay: -4s;
  }
}

// 光晕效果
.glow-effect {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      rgba(0, 234, 255, 0.3),
      rgba(0, 114, 255, 0.3),
      rgba(1, 170, 255, 0.3)
    );
    border-radius: inherit;
    z-index: -1;
    animation: glowPulse 3s ease-in-out infinite;
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.02);
  }
}

// 响应式调整
@media (max-width: 1920px) {
  .main-content {
    gap: 15px;
    padding: 0 15px;
  }
  
  .left-panel {
    width: 350px;
  }
  
  .right-comparison {
    width: 450px;
  }
}
</style>

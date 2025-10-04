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
    
    <!-- 参数调节 -->
    <div class="parameter-section">
      <div class="section-title">参数调节</div>
      <div class="parameter-controls">
        <div class="control-item">
          <label>处理强度</label>
          <div class="slider-control">
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="parameters.intensity"
              @input="updateParameter('intensity', $event.target.value)"
              class="param-slider"
            >
            <span class="param-value">{{ parameters.intensity }}%</span>
          </div>
        </div>
        
        <div class="control-item">
          <label>锐化程度</label>
          <div class="slider-control">
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="parameters.sharpness"
              @input="updateParameter('sharpness', $event.target.value)"
              class="param-slider"
            >
            <span class="param-value">{{ parameters.sharpness }}%</span>
          </div>
        </div>
        
        <div class="control-item">
          <label>去雾半径</label>
          <div class="slider-control">
            <input 
              type="range" 
              min="1" 
              max="50" 
              v-model="parameters.defogRadius"
              @input="updateParameter('defogRadius', $event.target.value)"
              class="param-slider"
            >
            <span class="param-value">{{ parameters.defogRadius }}</span>
          </div>
        </div>
        
        <div class="control-item">
          <label>阈值设置</label>
          <div class="slider-control">
            <input 
              type="range" 
              min="0" 
              max="255" 
              v-model="parameters.threshold"
              @input="updateParameter('threshold', $event.target.value)"
              class="param-slider"
            >
            <span class="param-value">{{ parameters.threshold }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="progress-section" v-if="processing">
      <div class="section-title">处理进度</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        <div class="progress-text">{{ Math.round(progress) }}%</div>
      </div>
    </div>
    
    <!-- 控制按钮 -->
    <div class="control-buttons">
      <button 
        class="control-btn primary"
        :class="{ processing: processing }"
        @click="toggleProcessing"
      >
        <span v-if="!processing">🚀 开始处理</span>
        <span v-else>⏸ 暂停处理</span>
      </button>
      
      <button class="control-btn secondary" @click="enableAutoMode">
        <span>🤖 一键自动</span>
      </button>
      
      <button class="control-btn tertiary" @click="resetParameters">
        <span>🔄 恢复默认</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlgorithmPanel',
  props: {
    currentAlgorithm: {
      type: String,
      default: 'adaptive'
    },
    processing: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      algorithms: [
        {
          key: 'traditional',
          name: '传统算法',
          icon: '🎯',
          desc: 'DCP/Guided'
        },
        {
          key: 'deep',
          name: '深度学习',
          icon: '🧠',
          desc: 'DeRain/DeFog/DeSnow'
        },
        {
          key: 'gan',
          name: 'GAN网络',
          icon: '🎨',
          desc: '生成对抗'
        },
        {
          key: 'adaptive',
          name: '自适应',
          icon: '🔧',
          desc: '智能优化'
        }
      ],
      parameters: {
        intensity: 75,
        sharpness: 60,
        defogRadius: 15,
        threshold: 128
      }
    };
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

.parameter-section {
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
}

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
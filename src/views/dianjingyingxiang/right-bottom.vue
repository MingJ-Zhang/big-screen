<template>
  <div class="distortion-evaluator">
    <!-- 自定义下拉菜单 -->
    <div class="custom-select-container">
      <div class="custom-select" @click="toggleDropdown">
        <span>{{ selected || '请选择评估类型' }}</span>
        <div class="select-arrow"></div>
      </div>
      
      <!-- 自定义下拉选项列表 -->
      <div class="custom-options" v-if="isOpen">
        <div class="custom-option" 
             v-for="type in distortionTypes" 
             :key="type" 
             @click="selectOption(type)"
             :class="{ 'option-selected': type === selected }">
          {{ type }}
        </div>
      </div>
    </div>

    <!-- 列表过渡：先淡出再淡入 -->
    <transition name="list" mode="out-in">
      <div class="button-list" :key="selected">
        <button v-for="algo in algorithms[selected] || []" :key="algo"
          :class="['algo-button', { selected: algo === selectedAlgo }]" @click="handleClick(algo)">
          {{ algo }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DistortionEvaluator',
  data() {
    return {
      selected: '',
      selectedAlgo: '',
      isOpen: false,
      distortionTypes: [
        '噪声失真评估',
        '模糊失真评估',
        '压缩失真评估',
        '亮度失真评估',
      ],
      algorithms: {
        '噪声失真评估': ['噪声失真评估算法1', '噪声失真评估算法2'],
        '模糊失真评估': ['模糊失真评估算法1', '模糊失真评估算法2'],
        '压缩失真评估': ['压缩失真评估算法1', '压缩失真评估算法2'],
        '亮度失真评估': ['亮度失真评估算法1', '亮度失真评估算法2'],
        '对比度评估': ['对比度评估算法1', '对比度评估算法2']
      }
    };
  },
  mounted() {
    // 点击外部关闭下拉菜单
    document.addEventListener('click', this.closeDropdown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown);
  },
  methods: {
    toggleDropdown(event) {
      event.stopPropagation();
      this.isOpen = !this.isOpen;
    },
    closeDropdown(event) {
      // 如果点击的不是下拉菜单内部元素，则关闭下拉菜单
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },
    selectOption(option) {
      this.selected = option;
      this.isOpen = false;
    },
    handleClick(algo) {
      this.selectedAlgo = algo;     // 记录当前选中算法
      this.$emit('sendMsg', 1); // 向外抛事件
    }
  }
};
</script>

<style scoped>
.distortion-evaluator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/* 动态渐变动画 */
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 自定义下拉菜单容器 */
.custom-select-container {
  position: relative;
  width: 80%;
  margin: 0 auto;
  z-index: 10;
}

/* 自定义下拉菜单触发器 */
.custom-select {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(45deg, #2af598, #009efd);
  background-size: 200% 200%;
  animation: gradientBG 8s ease infinite;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 10px #2af598, 0 0 20px #009efd;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 添加光效扫描线 */
.custom-select::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  animation: shine 4s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(30deg);
  }
  20%, 100% {
    transform: translateX(100%) rotate(30deg);
  }
}

.custom-select:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #2af598, 0 0 30px #009efd;
}

/* 下拉箭头 */
.select-arrow {
  position: absolute;
  right: 15px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffffff;
  transition: transform 0.3s ease;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(3px); opacity: 0.7; }
  100% { transform: translateY(0); opacity: 1; }
}

/* 下拉选项容器 */
.custom-options {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: linear-gradient(to bottom, #1a2a3a, #2d3a4a);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 0, 0, 0.2);
  z-index: 20;
  animation: glow 2s infinite alternate, slideDown 0.3s ease-out;
  border: 1px solid rgba(0, 255, 255, 0.2);
  transform-origin: top center;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* 下拉选项 */
.custom-option {
  padding: 12px 16px;
  color: #00ffff;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* 选项悬停时的扫描线效果 */
.custom-option::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 255, 255, 0.2), 
    transparent
  );
  transition: 0.5s;
}

.custom-option:hover::after {
  left: 100%;
}

.custom-option:last-child {
  border-bottom: none;
}

.custom-option:hover {
  background: linear-gradient(45deg, #2d3a4a, #3a4a5a);
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
  box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.2);
}

.option-selected {
  background: rgba(0, 255, 255, 0.2);
}

/* 发光动画 */
@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 0, 0, 0.2);
  }
  to {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 0, 0, 0.3);
  }
}

/* 列表过渡 */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

/* 按钮列表容器 */
.button-list {
  margin-top: 24px;
}

/* 算法按钮 */
.algo-button {
  display: block;
  width: 50%;        /* 调小按钮宽度 */
  max-width: 250px;
  margin: 12px auto; /* 居中按钮容器 */
  padding: 12px 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center; /* 按钮文本居中 */
  color: #ffffff;
  background: linear-gradient(45deg, #ff6b6b, #f06595, #cc5de8);
  background-size: 300% 300%;
  animation: gradientBG 6s ease infinite;
  border: none;
  border-radius: 10px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.6),
              0 0 20px rgba(204, 93, 232, 0.6);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.algo-button:hover {
  transform: scale(1.08);
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.8),
              0 0 30px rgba(204, 93, 232, 0.8);
}

/* 选中态发光效果 */
.algo-button.selected {
  border: 2px solid #ffffff;
  box-shadow: 0 0 20px #ffffff,
              0 0 30px rgba(204, 93, 232, 1);
}
</style>

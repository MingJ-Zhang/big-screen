<template>
  <div class="distortion-evaluator">
    <select v-model="selected" class="distortion-select" v-if="shouldShowSelect">
      <option disabled value="">请选择压缩噪声评估算法</option>
      <option v-for="type in distortionTypes" :key="type">{{ type }}</option>
    </select>

    <!-- 列表过渡：先淡出再淡入 -->
    <transition name="list" mode="out-in">
      <div class="button-list" :key="selected">
        <button v-for="algo in displayedAlgorithms" :key="algo"
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
      distortionTypes: [
        '压缩噪声评估',
      ],
      algorithms: {
        '压缩噪声评估': ['压缩噪声评估算法1', '压缩噪声评估算法2'],
      }
    };
  },
  computed: {
    shouldShowSelect() {
      return this.distortionTypes.length > 1;
    },
    displayedAlgorithms() {
      if (!this.shouldShowSelect && this.distortionTypes.length === 1) {
        return this.algorithms[this.distortionTypes[0]] || [];
      }
      return this.algorithms[this.selected] || [];
    }
  },
  methods: {
    handleClick(algo) {
      this.selectedAlgo = algo;     // 记录当前选中算法
      this.$emit('sendMsg', 1);; // 向外抛事件
    }
  },
  created() {
    if (!this.shouldShowSelect && this.distortionTypes.length === 1) {
      this.selected = this.distortionTypes[0];
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

/* 下拉框样式 */
.distortion-select {
  width: 80%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;           /* 文本居中 */
  background: linear-gradient(45deg, #2af598, #009efd);
  background-size: 200% 200%;
  animation: gradientBG 8s ease infinite;
  color: #ffffff;               /* 改为白色，增强对比 */
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 10px #2af598, 0 0 20px #009efd;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
}

.distortion-select option {
  color: #333333; /* 下拉选项文字颜色 */
}

.distortion-select:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #2af598, 0 0 30px #009efd;
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

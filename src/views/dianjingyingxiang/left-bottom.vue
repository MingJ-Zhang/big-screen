<template>
  <div class="system-gauge-container">
    <div class="gauge-card">
      <div class="gauge-header">
        <!-- <div class="gauge-title">系统监控</div> -->
        <!-- <div class="gauge-refresh" @click="refreshData">
          <i class="icon-refresh"></i>
        </div> -->
      </div>
      <div class="gauge-container" ref="cpuGauge"></div>
      <div class="gauge-info">
        <div class="gauge-value">{{ cpuVal }}%</div>
        <div class="gauge-label">CPU 占用率</div>
      </div>
      <!-- <div class="gauge-stats">
        <div class="stat-item">
          <div class="stat-label">平均</div>
          <div class="stat-value">{{ cpuAvg }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">峰值</div>
          <div class="stat-value">{{ cpuPeak }}%</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SystemGauge',
  data() {
    return {
      cpuVal: 25,
      cpuPeak: 25,
      cpuAvg: 21,
      cpuHistory: [],
      cpuChart: null,
      updateTimer: null,
      historyLength: 10
    };
  },
  mounted() {
    this.initCpuChart();
    this.updateTimer = setInterval(this.updateData, 2000);
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    clearInterval(this.updateTimer);
    window.removeEventListener('resize', this.onResize);
    this.cpuChart && this.cpuChart.dispose();
  },
  methods: {
    onResize() {
      this.cpuChart && this.cpuChart.resize();
    },
    refreshData() {
      // 添加数据刷新动画效果
      const refreshIcon = this.$el.querySelector('.icon-refresh');
      refreshIcon.style.transition = 'transform 0.5s ease-in-out';
      refreshIcon.style.transform = 'rotate(360deg)';
      
      // 立即更新数据
      this.updateData();
      
      // 重置动画
      setTimeout(() => {
        refreshIcon.style.transition = 'none';
        refreshIcon.style.transform = 'rotate(0deg)';
        setTimeout(() => {
          refreshIcon.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      }, 500);
    },
    updateData() {
      // 生成更加真实的CPU使用率数据
      const newCpuVal = this.generateRealisticValue(this.cpuVal, 5, 15, 90);
      
      // 更新历史数据
      this.updateHistory(newCpuVal);
      
      // 设置当前值
      this.cpuVal = newCpuVal;
      
      // 更新图表
      this.updateCpuChart();
    },
    generateRealisticValue(currentValue, maxChange, min, max) {
      // 生成一个比较真实的值变化，避免剧烈波动
      const change = (Math.random() * maxChange * 2) - maxChange;
      let newValue = currentValue + change;
      
      // 确保值在合理范围内
      newValue = Math.max(min, Math.min(max, newValue));
      
      return Math.round(newValue);
    },
    updateHistory(cpuVal) {
      // 更新历史数据
      this.cpuHistory.push(cpuVal);
      
      // 限制历史数据长度
      if (this.cpuHistory.length > this.historyLength) {
        this.cpuHistory.shift();
      }
      
      // 计算峰值和平均值
      this.cpuPeak = Math.max(...this.cpuHistory);
      this.cpuAvg = Math.round(this.cpuHistory.reduce((sum, val) => sum + val, 0) / this.cpuHistory.length);
    },
    initCpuChart() {
      this.cpuChart = echarts.init(this.$refs.cpuGauge);
      const option = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '90%',
            pointer: {
              show: true,
              length: '70%',
              width: 4,
              itemStyle: {
                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
                  {offset: 0, color: '#36CFC9'},
                  {offset: 1, color: '#1890FF'}
                ]}
              }
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
                  {offset: 0, color: '#36CFC9'},
                  {offset: 1, color: '#1890FF'}
                ]}
              }
            },
            axisLine: {
              lineStyle: {
                width: 12,
                color: [
                  [0.3, 'rgba(54, 207, 201, 0.2)'],
                  [0.7, 'rgba(54, 207, 201, 0.4)'],
                  [1, 'rgba(54, 207, 201, 0.1)']
                ]
              }
            },
            splitLine: {
              show: true,
              distance: -5,
              length: 10,
              lineStyle: {
                width: 2,
                color: 'rgba(255, 255, 255, 0.3)'
              }
            },
            axisTick: {
              show: true,
              splitNumber: 4,
              lineStyle: {
                width: 1,
                color: 'rgba(255, 255, 255, 0.2)'
              },
              length: 5
            },
            axisLabel: {
              show: true,
              color: 'rgba(255, 255, 255, 0.6)',
              distance: -15,
              fontSize: 12
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 10,
              itemStyle: {
                color: '#1890FF',
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
              }
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: this.cpuVal
              }
            ]
          }
        ]
      };
      this.cpuChart.setOption(option);
    },
    updateCpuChart() {
      this.cpuChart.setOption({
        series: [
          {
            data: [
              {
                value: this.cpuVal
              }
            ]
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.system-gauge-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  margin: 20px;
  padding: 16px;
  box-sizing: border-box;
}

.gauge-card {
  margin-top: 70px;
  position: relative;
  width: 100%;
  height: 320px;
  // border-radius: 16px;
  background: transparent;
  // backdrop-filter: blur(10px);
  // box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  // border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.gauge-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 10px;
}

.gauge-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.gauge-refresh {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .icon-refresh {
    width: 16px;
    height: 16px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(255,255,255,0.7)'%3E%3Cpath d='M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z'/%3E%3C/svg%3E") no-repeat center;
  }
}

.gauge-container {
  width: 220px;
  height: 160px;
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}

.gauge-info {
  position: relative;
  text-align: center;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-value {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #36CFC9 0%, #1890FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(24, 144, 255, 0.3);
  line-height: 1.1;
}

.gauge-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 5px;
}

.gauge-stats {
  position: absolute;
  bottom: 25px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
  z-index: 3;
}

.stat-item {
  text-align: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-width: 80px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 3px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 768px) {
  .gauge-card {
    width: 240px;
    height: 280px;
  }

  .gauge-container {
    width: 180px;
    height: 140px;
  }

  .gauge-value {
    font-size: 36px;
  }
}
</style>
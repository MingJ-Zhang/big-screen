<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'

export default {
  name: 'LeftTop3D',
  data() {
    return {
      chart: null,
      userOverview: {
        alarmNum: 0,
        offlineNum: 0,
        onlineNum: 0,
        totalNum: 0,
      },
      pageflag: true,
      timer: null,
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    this.clearData()
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    clearData() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    getData() {
      this.pageflag = true
      // 模拟数据获取
      setTimeout(() => {
        this.userOverview = {
          totalNum: Math.floor(Math.random() * 1000) + 500,
          onlineNum: Math.floor(Math.random() * 800) + 300,
          offlineNum: Math.floor(Math.random() * 100) + 20,
          alarmNum: Math.floor(Math.random() * 50) + 10,
        }
        this.updateChart()
        this.switper()
      }, 500)
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer)
      this.updateChart()
    },
    updateChart() {
      if (!this.chart) return

      const data = [
        {
          name: '总设备数',
          value: this.userOverview.totalNum,
          color: '#00fdfa',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00fdfa' },
              { offset: 1, color: '#0066cc' }
            ])
          }
        },
        {
          name: '在线数',
          value: this.userOverview.onlineNum,
          color: '#07f7a8',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#07f7a8' },
              { offset: 1, color: '#00aa55' }
            ])
          }
        },
        {
          name: '掉线数',
          value: this.userOverview.offlineNum,
          color: '#e3b337',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#e3b337' },
              { offset: 1, color: '#cc7700' }
            ])
          }
        },
        {
          name: '预警次数',
          value: this.userOverview.alarmNum,
          color: '#f5023d',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#f5023d' },
              { offset: 1, color: '#cc0033' }
            ])
          }
        }
      ]

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 20, 40, 0.8)',
          borderColor: '#00f5ff',
          borderWidth: 1,
          textStyle: {
            color: '#00f5ff',
            fontSize: 14,
            fontWeight: 'bold'
          },
          formatter: function(params) {
            return `<div style="padding: 8px;">
              <div style="color: ${params.data.color}; font-size: 16px; font-weight: bold;">${params.data.name}</div>
              <div style="color: #fff; margin-top: 5px;">数值: ${params.data.value}</div>
            </div>`
          }
        },
        xAxis3D: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: {
            color: '#00f5ff',
            fontSize: 12,
            fontWeight: 'bold'
          },
          axisLine: {
            lineStyle: {
              color: '#00f5ff',
              width: 2
            }
          },
          axisTick: {
            lineStyle: {
              color: '#00f5ff'
            }
          }
        },
        yAxis3D: {
          type: 'value',
          axisLabel: {
            color: '#00f5ff',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: '#00f5ff',
              width: 2
            }
          },
          axisTick: {
            lineStyle: {
              color: '#00f5ff'
            }
          }
        },
        zAxis3D: {
          type: 'value',
          axisLabel: {
            color: '#00f5ff',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: '#00f5ff',
              width: 2
            }
          },
          axisTick: {
            lineStyle: {
              color: '#00f5ff'
            }
          }
        },
        grid3D: {
          boxWidth: 180,
          boxDepth: 70,
          boxHeight: 100,
          viewControl: {
            projection: 'perspective',
            autoRotate: true,
            autoRotateSpeed: 8,
            distance: 200,
            alpha: 25,
            beta: 40,
            minDistance: 100,
            maxDistance: 400
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true,
              shadowQuality: 'high',
              alpha: 30,
              beta: 40
            },
            ambient: {
              intensity: 0.3
            }
          },
          environment: '#001122',
          postEffect: {
            enable: true,
            bloom: {
              enable: true,
              intensity: 0.1
            },
            SSAO: {
              enable: true,
              quality: 'medium',
              radius: 2
            }
          }
        },
        series: [{
          type: 'bar3D',
          data: data.map((item, index) => ({
            value: [index, item.value, 0],
            itemStyle: {
              color: item.itemStyle.color
            },
            label: {
              show: true,
              distance: 5,
              formatter: function(params) {
                return `{value|${params.data[1]}}{unit|台}`
              },
              rich: {
                value: {
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textShadowColor: '#000',
                  textShadowBlur: 3
                },
                unit: {
                  color: '#ccc',
                  fontSize: 12,
                  padding: [0, 0, 0, 5]
                }
              }
            }
          })),
          shading: 'lambert',
          label: {
            show: true,
            distance: 5,
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            itemStyle: {
              color: '#ffff00'
            }
          },
          animationDuration: 2000,
          animationEasing: 'cubicOut',
          animationDelay: function(idx) {
            return idx * 200
          }
        }]
      }

      this.chart.setOption(option, true)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    switper() {
      if (this.timer) return
      let looper = () => {
        this.getData()
      }
      this.timer = setInterval(looper, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 75%;
  min-height: 250px;
  background: linear-gradient(135deg, rgba(0, 30, 60, 0.8) 0%, rgba(0, 60, 120, 0.6) 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 245, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #00f5ff 50%, transparent 100%);
    animation: scanline 3s linear infinite;
    pointer-events: none;
  }
}

@keyframes scanline {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
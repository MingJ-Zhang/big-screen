<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'

export default {
  name: 'LeftTop3DPie',
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
          name: '在线设备',
          value: this.userOverview.onlineNum,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#07f7a8' },
              { offset: 1, color: '#00aa55' }
            ])
          }
        },
        {
          name: '离线设备',
          value: this.userOverview.offlineNum,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#e3b337' },
              { offset: 1, color: '#cc7700' }
            ])
          }
        },
        {
          name: '预警次数',
          value: this.userOverview.alarmNum,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#f5023d' },
              { offset: 1, color: '#cc0033' }
            ])
          }
        }
      ]

      const total = this.userOverview.totalNum

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
            const percent = ((params.value / total) * 100).toFixed(1)
            return `<div style="padding: 8px;">
              <div style="color: ${params.color}; font-size: 16px; font-weight: bold;">${params.name}</div>
              <div style="color: #fff; margin-top: 5px;">数量: ${params.value}</div>
              <div style="color: #fff;">占比: ${percent}%</div>
            </div>`
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
          textStyle: {
            color: '#00f5ff',
            fontSize: 12,
            fontWeight: 'bold'
          },
          icon: 'circle',
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 15,
          formatter: function(name) {
            const item = data.find(d => d.name === name)
            const percent = ((item.value / total) * 100).toFixed(1)
            return `${name}  ${percent}%`
          }
        },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['60%', '55%'],
            roseType: 'radius',
            label: {
              show: true,
              position: 'outside',
              formatter: function(params) {
                const percent = ((params.value / total) * 100).toFixed(1)
                return `{name|${params.name}}\n{value|${params.value}}\n{percent|${percent}%}`
              },
              rich: {
                name: {
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold',
                  padding: [0, 0, 5, 0]
                },
                value: {
                  color: '#00f5ff',
                  fontSize: 16,
                  fontWeight: 'bold',
                  padding: [2, 0, 2, 0]
                },
                percent: {
                  color: '#ccc',
                  fontSize: 10,
                  padding: [2, 0, 0, 0]
                }
              }
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 5,
              smooth: false,
              lineStyle: {
                color: '#00f5ff',
                width: 1,
                type: 'solid'
              }
            },
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            itemStyle: {
              borderRadius: 8,
              borderColor: '#001122',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          },
          {
            name: '内环装饰',
            type: 'pie',
            radius: ['20%', '28%'],
            center: ['60%', '55%'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1,
                itemStyle: {
                  color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                    { offset: 0, color: 'rgba(0, 245, 255, 0.8)' },
                    { offset: 1, color: 'rgba(0, 245, 255, 0.2)' }
                  ])
                }
              }
            ],
            silent: true,
            animation: false
          },
          {
            name: '中心文字',
            type: 'pie',
            radius: ['0%', '18%'],
            center: ['60%', '55%'],
            label: {
              show: true,
              position: 'center',
              formatter: function() {
                return `{total|总设备}\n{value|${total}}\n{unit|台}`
              },
              rich: {
                total: {
                  color: '#ccc',
                  fontSize: 14,
                  padding: [0, 0, 5, 0]
                },
                value: {
                  color: '#00f5ff',
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: [5, 0, 5, 0]
                },
                unit: {
                  color: '#ccc',
                  fontSize: 12,
                  padding: [5, 0, 0, 0]
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1,
                itemStyle: {
                  color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                    { offset: 0, color: 'rgba(0, 30, 60, 0.8)' },
                    { offset: 1, color: 'rgba(0, 60, 120, 0.6)' }
                  ])
                }
              }
            ],
            silent: true,
            animation: false
          }
        ],
        // 3D效果增强
        graphic: [
          {
            type: 'group',
            left: '60%',
            top: '55%',
            children: [
              {
                type: 'circle',
                shape: {
                  cx: 0,
                  cy: 0,
                  r: 80
                },
                style: {
                  fill: 'transparent',
                  stroke: 'rgba(0, 245, 255, 0.3)',
                  lineWidth: 1,
                  lineDash: [5, 5]
                },
                rotation: 0,
                animation: true,
                animationDuration: 2000,
                animationEasing: 'linear',
                animationDelay: 0,
                animationLoop: true,
                onframe: function(frame) {
                  this.rotation = (frame.time / 1000) * Math.PI / 2;
                }
              }
            ]
          }
        ]
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
  height: 70%;
  min-height: 250px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(0, 30, 60, 0.8) 0%, rgba(0, 60, 120, 0.6) 100%);
  border-radius: 8px;
  
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
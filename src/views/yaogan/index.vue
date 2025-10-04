<template>
  <div id="app" class="dashboard">
    <!-- 顶部标题 -->
    <div class="header-title">
      <h1>遥感综合预警系统</h1>
    </div>

    <!-- 第一排：饼图 + 雷达图 -->
    <div class="row top-row">
      <div class="chart-box" ref="pieChart"></div>
      <div class="chart-box" ref="radarChart"></div>
    </div>

    <!-- 第二排：折线图 -->
    <div class="row bottom-row">
      <div class="chart-box" ref="lineChart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "App",
  data() {
    return {
      pieChart: null,
      radarChart: null,
      lineChart: null,
      dataTimer: null
    };
  },
  mounted() {
    this.initPieChart();
    this.initRadarChart();
    this.initLineChart();
    this.startDataAnimation();
  },
  beforeDestroy() {
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
  },
  methods: {
    // 饼图
    initPieChart() {
      this.pieChart = echarts.init(this.$refs.pieChart);
      const option = {
        title: {
          text: '数据占比',
          left: 'center',
          textStyle: { 
            color: '#00eaff', 
            fontSize: 20,
            fontWeight: 'bold',
            textShadowColor: '#00eaff',
            textShadowBlur: 10
          }
        },
        tooltip: { 
          trigger: 'item',
          backgroundColor: 'rgba(0, 10, 30, 0.9)',
          borderColor: '#00eaff',
          borderWidth: 1,
          textStyle: { color: '#fff' },
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          textStyle: { 
            color: '#00eaff',
            fontSize: 18, // Increased font size
            rich: {
              name: { color: '#fff' },
              value: { color: '#00eaff', fontWeight: 'bold' }
            }
          },
          itemWidth: 18, // Adjusted item width
          itemHeight: 18, // Adjusted item height
          itemGap: 20 // Adjusted item gap
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: ['40%', '75%'],
            center: ['50%', '45%'],
            roseType: 'radius',
            data: [
              { 
                value: 40, 
                name: '遥感数据A',
                itemStyle: { color: '#00eaff' }
              },
              { 
                value: 30, 
                name: '遥感数据B',
                itemStyle: { color: '#00ff88' }
              },
              { 
                value: 20, 
                name: '遥感数据C',
                itemStyle: { color: '#ff6b35' }
              },
              { 
                value: 10, 
                name: '其他',
                itemStyle: { color: '#ffd700' }
              }
            ],
            label: { 
              color: '#00eaff',
              fontSize: 18, // Increased font size
              formatter: '{b}\n{d}%',
              textShadowBlur: 5, // Added text shadow
              textShadowColor: '#000' // Added text shadow
            },
            labelLine: { 
              lineStyle: { 
                color: 'rgba(0, 234, 255, 0.6)',
                width: 1
              }
            },
            itemStyle: {
              borderColor: '#001a33',
              borderWidth: 2,
              shadowBlur: 15,
              shadowColor: 'rgba(0, 234, 255, 0.5)'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 234, 255, 0.8)'
              }
            }
          }
        ]
      };
      this.pieChart.setOption(option);
      window.addEventListener('resize', this.pieChart.resize);
    },

    // 雷达图
    initRadarChart() {
      this.radarChart = echarts.init(this.$refs.radarChart);
      const option = {
        title: {
          text: '能力评估',
          left: 'center',
          textStyle: { 
            color: '#00eaff', 
            fontSize: 20,
            fontWeight: 'bold',
            textShadowColor: '#00eaff',
            textShadowBlur: 10
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 10, 30, 0.9)',
          borderColor: '#00eaff',
          borderWidth: 1,
          textStyle: { color: '#fff' }
        },
        radar: {
          indicator: [
            { name: '宏观环境', max: 100 },
            { name: '在线监测', max: 100 },
            { name: '安全管理', max: 100 },
            { name: '固有风险', max: 100 },
            { name: '应急能力', max: 100 }
          ],
          center: ['50%', '55%'],
          radius: '65%',
          splitNumber: 4,
          axisLine: { 
            lineStyle: { 
              color: 'rgba(0, 234, 255, 0.6)',
              width: 1
            } 
          },
          splitLine: { 
            lineStyle: { 
              color: [
                'rgba(0, 234, 255, 0.3)',
                'rgba(0, 234, 255, 0.2)',
                'rgba(0, 234, 255, 0.1)',
                'rgba(0, 234, 255, 0.05)'
              ],
              width: 1
            } 
          },
          splitArea: { 
            areaStyle: { 
              color: [
                'rgba(0, 234, 255, 0.1)',
                'rgba(0, 234, 255, 0.05)',
                'rgba(0, 234, 255, 0.02)',
                'rgba(0, 234, 255, 0.01)'
              ]
            } 
          },
          name: { 
            textStyle: { 
              color: '#00eaff',
              fontSize: 18, // Further increased font size
              fontWeight: 'bold',
              textShadowBlur: 5, // Added text shadow
              textShadowColor: 'rgba(0, 0, 0, 0.5)' // Added text shadow
            } 
          }
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: [85, 78, 92, 68, 95],
                name: '综合评估',
                areaStyle: { 
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0, 234, 255, 0.4)' },
                    { offset: 1, color: 'rgba(0, 234, 255, 0.1)' }
                  ])
                },
                lineStyle: { 
                  color: '#00eaff',
                  width: 3,
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 234, 255, 0.5)'
                },
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: { 
                  color: '#00eaff',
                  borderColor: '#fff',
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: '#00eaff'
                }
              }
            ]
          }
        ]
      };
      this.radarChart.setOption(option);
      window.addEventListener('resize', this.radarChart.resize);
    },

    // 折线图
    initLineChart() {
      this.lineChart = echarts.init(this.$refs.lineChart);
      const option = {
        title: {
          text: '监测数据变化趋势',
          left: 'center',
          textStyle: { 
            color: '#00eaff', 
            fontSize: 20,
            fontWeight: 'bold',
            textShadowColor: '#00eaff',
            textShadowBlur: 10
          }
        },
        tooltip: { 
          trigger: 'axis',
          backgroundColor: 'rgba(0, 10, 30, 0.9)',
          borderColor: '#00eaff',
          borderWidth: 1,
          textStyle: { color: '#fff' },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#00eaff',
              width: 2,
              type: 'dashed'
            }
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: { 
            lineStyle: { 
              color: '#00eaff',
              width: 2
            } 
          },
          axisLabel: { 
            color: '#00eaff',
            fontSize: 18, // 字体变大一点
            fontWeight: 'bold'
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#00eaff'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '监测值',
          nameTextStyle: {
            color: '#00eaff',
            fontSize: 18, // 字号调整为18
            fontWeight: 'bold'
          },
          axisLine: { 
            lineStyle: { 
              color: '#00eaff',
              width: 2
            } 
          },
          
          splitLine: { 
            lineStyle: { 
              color: [
                'rgba(0, 234, 255, 0.1)',
                'rgba(0, 234, 255, 0.05)',
                'rgba(0, 234, 255, 0.02)',
                'rgba(0, 234, 255, 0.01)'
              ],
              type: 'dashed'
            } 
          },
          axisLabel: { 
            color: '#00eaff',
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        series: [
          {
            name: '监测值',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 180, 210, 165, 195, 225, 240],
            smooth: true,
            smoothMonotone: 'x',
            lineStyle: { 
              color: '#00eaff',
              width: 3,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 234, 255, 0.5)'
            },
            itemStyle: { 
              color: '#00eaff',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: '#00eaff'
            },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 234, 255, 0.6)' },
                { offset: 0.5, color: 'rgba(0, 234, 255, 0.3)' },
                { offset: 1, color: 'rgba(0, 234, 255, 0.05)' }
              ])
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 15,
                shadowColor: '#00eaff',
                borderColor: '#00eaff',
                borderWidth: 3
              }
            }
          }
        ]
      };
      this.lineChart.setOption(option);
      window.addEventListener('resize', this.lineChart.resize);
    },

    // 开始数据动画
    startDataAnimation() {
      this.dataTimer = setInterval(() => {
        this.updatePieChartData();
        this.updateRadarChartData();
        this.updateLineChartData();
      }, 3000);
    },

    // 更新饼图数据
    updatePieChartData() {
      if (!this.pieChart) return;
      
      const newData = [
        { value: Math.floor(Math.random() * 50) + 20, name: '遥感数据A', itemStyle: { color: '#00eaff' }},
        { value: Math.floor(Math.random() * 40) + 15, name: '遥感数据B', itemStyle: { color: '#00ff88' }},
        { value: Math.floor(Math.random() * 30) + 10, name: '遥感数据C', itemStyle: { color: '#ff6b35' }},
        { value: Math.floor(Math.random() * 20) + 5, name: '其他', itemStyle: { color: '#ffd700' }}
      ];
      
      this.pieChart.setOption({
        series: [{
          data: newData
        }]
      });
    },

    // 更新雷达图数据
    updateRadarChartData() {
      if (!this.radarChart) return;
      
      const newValue = [
        Math.floor(Math.random() * 30) + 70,  // 70-100
        Math.floor(Math.random() * 30) + 60,  // 60-90
        Math.floor(Math.random() * 20) + 75,  // 75-95
        Math.floor(Math.random() * 40) + 40,  // 40-80
        Math.floor(Math.random() * 25) + 70   // 70-95
      ];
      
      this.radarChart.setOption({
        series: [{
          data: [{
            value: newValue,
            name: '综合评估'
          }]
        }]
      });
    },

    // 更新折线图数据
    updateLineChartData() {
      if (!this.lineChart) return;
      
      const newData = Array.from({length: 12}, () => Math.floor(Math.random() * 150) + 80);
      
      this.lineChart.setOption({
        series: [{
          data: newData
        }]
      });
    }
  }
};
</script>

<style scoped>
.dashboard {
  width: 98%;
  height: auto;
  margin: 0 auto;
}

.header-title {
  text-align: center;
  margin-bottom: 10px;
}

.header-title h1 {
  font-size: 36px;
  color: #00eaff;
  text-shadow: 0 0 15px #00eaff;
  letter-spacing: 4px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 500px
}

.top-row {
  flex: 1;
}

.bottom-row {
  flex: 1;
}

.chart-box {
  flex: 1;
  margin: 10px;
  min-height: 00px;
  background: rgba(0, 0, 0, 0.1);
  /* border: 1px solid rgba(0, 234, 255, 0.3); 
  border-radius: 8px; */
}
</style>

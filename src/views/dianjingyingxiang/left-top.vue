<template>
    <Echart id="leftCenter" :options="options" class="left_center_inner" v-if="pageflag" ref="charts" />
    <Reacquire v-else @onclick="getData" style="line-height:200px">
      重新获取
    </Reacquire>
  </template>
  
  <script>
  import { currentGET } from 'api/modules'
  export default {
    data() {
      return {
        options: {},
        countUserNumData: {
          lockNum: 0,
          onlineNum: 0,
          offlineNum: 0,
          totalNum: 0
        },
        pageflag: true,
        timer: null
      };
    },
    created() {
      this.getData()
    },
    mounted() {
    },
    beforeDestroy() {
      this.clearData()
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
        // this.pageflag = false
  
        currentGET('big1').then(res => {
          //只打印一次
          if (!this.timer) {
            console.log("设备总览", res);
          }
          if (res.success) {
            this.countUserNumData = res.data
            this.$nextTick(() => {
              this.init()
            })
            // 开始轮询
            this.switper()
          } else {
            this.pageflag = false
            this.$Message({
              text: res.msg,
              type: 'warning'
            })
          }
        })
      },
      //轮询
      switper() {
        if (this.timer) {
          return
        }
        let looper = () => {
          this.getData()
        };
        this.timer = setInterval(looper, this.$store.state.setting.echartsAutoTime);
        let myChart = this.$refs.charts.chart
        myChart.on('mouseover', () => {
          this.clearData()
        });
        myChart.on('mouseout', () => {
          this.timer = setInterval(looper, this.$store.state.setting.echartsAutoTime);
        });
      },
      init() {
        const total = this.countUserNumData.totalNum;
        const lockNum = this.countUserNumData.lockNum;
        const onlineNum = this.countUserNumData.onlineNum;
        const offlineNum = this.countUserNumData.offlineNum;
  
        // 科技感配色方案
        const colors = [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#FFB200' },
              { offset: 1, color: '#FF5733' }
            ]
          },
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00DDFF' },
              { offset: 1, color: '#0072FF' }
            ]
          },
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00E676' },
              { offset: 1, color: '#00B248' }
            ]
          }
        ];
  
        // 中心圆圈数据
        const centerCircleData = [{
          value: total,
          name: '总数',
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(29, 36, 60, 0.8)' },
                { offset: 0.7, color: 'rgba(23, 35, 60, 0.8)' },
                { offset: 1, color: 'rgba(10, 18, 32, 0.8)' }
              ]
            }
          }
        }];
  
        this.options = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(10, 20, 50, 0.85)',
            borderColor: 'rgba(32, 186, 238, 0.2)',
            borderWidth: 1,
            textStyle: {
              color: '#fff',
              fontSize: 12
            },
            formatter: params => {
              return `${params.name}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>数量：${params.value} (${params.percent}%)`
            }
          },
  
          // 第一个饼图 - 主环形图
          series: [
            {
              name: '设备概况',
              type: 'pie',
              radius: ['38%', '60%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: 'rgba(10, 20, 50, 0.9)',
                borderWidth: 2,
                borderRadius: 6,
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                formatter: '{b}\n{c} ({d}%)',
                fontSize: 14,
                fontWeight: 'bold',
                color: '#fff',
                textShadowBlur: 2,
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textBorderWidth: 0
              },
              labelLine: {
                show: true,
                length: 15,
                length2: 25,
                lineStyle: {
                  width: 1,
                  type: 'solid',
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: 'rgba(255, 255, 255, 0.3)' },
                      { offset: 1, color: 'rgba(255, 255, 255, 0.6)' }
                    ]
                  }
                }
              },
              data: [
                {
                  value: lockNum,
                  name: '锁定用户',
                  itemStyle: { color: colors[0] }
                },
                {
                  value: onlineNum,
                  name: '在线用户',
                  itemStyle: { color: colors[2] }
                },
                {
                  value: offlineNum,
                  name: '离线用户',
                  itemStyle: { color: colors[1] }
                }
              ],
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: idx => idx * 200
            },
  
            // 内部小圆环 - 装饰效果
            {
              name: '内环装饰',
              type: 'pie',
              silent: true,
              z: 1,
              zlevel: 0,
              radius: ['32%', '38%'],
              center: ['50%', '50%'],
              label: { show: false },
              labelLine: { show: false },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(25, 100, 150, 0.7)' },
                    { offset: 1, color: 'rgba(25, 100, 150, 0.3)' }
                  ]
                }
              },
              data: centerCircleData
            },
  
            // 外部装饰光圈 - 发光轨道
            {
              name: '外环光圈',
              type: 'pie',
              silent: true,
              z: 0,
              zlevel: 0,
              radius: ['60%', '61%'],
              center: ['50%', '50%'],
              hoverAnimation: false,
              clockwise: true,
              label: { show: false },
              labelLine: { show: false },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(32, 186, 238, 0.3)' },
                    { offset: 1, color: 'rgba(32, 186, 238, 0.8)' }
                  ]
                },
                shadowBlur: 20,
                shadowColor: 'rgba(32, 186, 238, 0.5)',
              },
              data: [{ value: 100 }]
            },
  
            // 最中心的圆圈显示总数
            {
              name: '总数显示',
              type: 'pie',
              silent: true,
              z: 2,
              radius: ['0%', '32%'],
              center: ['50%', '50%'],
              label: {
                show: true,
                position: 'center',
                formatter: () => {
                  return `{totalNum|${total}}\n{totalText|总数}`;
                },
                rich: {
                  totalNum: {
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    padding: [5, 0]
                  },
                  totalText: {
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: [5, 0]
                  }
                }
              },
              labelLine: { show: false },
              data: centerCircleData
            }
          ]
        };
      }
    }
  };
  </script>
  
  <style lang='scss' scoped>
  .left_center_inner {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 10px rgba(32, 186, 238, 0.3));
    transition: all 0.3s ease;
  
    &:hover {
      filter: drop-shadow(0 0 15px rgba(32, 186, 238, 0.5));
    }
  }
  </style>
<!--
 * @Author: daidai
 * @Date: 2022-03-01 09:43:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-09 11:40:22
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-bottom.vue
-->
<template>
  <div
    v-if="pageflag"
    class="left_boottom_wrap beautify-scroll-def"
    :class="{ 'overflow-y-auto': !sbtxSwiperFlag }"
  >
    <!-- 指标图表区域：展示分数与SSIM -->
    <div class="metrics-chart-container">
      <echart id="metrics-chart" :height="'220px'" :width="'100%'" :options="chartOptions" />
    </div>
    
  </div>
</template>

<script>
import { currentGET } from "api";
import vueSeamlessScroll from "vue-seamless-scroll"; // vue2引入方式
import Kong from "../../components/kong.vue";
import Echart from "@/components/echart/index.vue";
export default {
  components: { vueSeamlessScroll, Kong, echart: Echart },
  data() {
    return {
      list: [],
      pageflag: true,
      components: vueSeamlessScroll,
      chartOptions: {},
      defaultOption: {
        ...this.$store.state.setting.defaultOption,
        singleHeight: 240,
        limitMoveNum: 5, 
        step: 0,
      },
    };
  },
  computed: {
    sbtxSwiperFlag() {
      let sbtxSwiper = this.$store.state.setting.sbtxSwiper;
      if (sbtxSwiper) {
        this.components = vueSeamlessScroll;
      } else {
        this.components = Kong;
      }
      return sbtxSwiper;
    },
    metricsAlgoIndex() {
      return this.$store.state.setting.metricsAlgoIndex;
    },
    metricsData() {
      return this.$store.state.setting.metricsData || [];
    }
  },
  created() {
    
  },

  mounted() {
    this.getData();
    this.buildChartFromStore();
  },
  methods: {
    // 使用 store 中的数据构建图表（与表格数值保持一致）
    buildChartFromStore() {
      const categories = this.metricsData.length
        ? this.metricsData.map(r => r.point)
        : Array.from({ length: 6 }, (_, i) => `监控点${i + 1}`);
      const sseqs = this.metricsData.length ? this.metricsData.map(r => Number(r.sseq)) : [];
      const niqes = this.metricsData.length ? this.metricsData.map(r => Number(r.niqe)) : [];

      this.chartOptions = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['SSEQ', 'NIQE'],
          textStyle: { color: '#aefcff' }
        },
        grid: { left: 40, right: 60, top: 40, bottom: 30 },
        xAxis: {
          type: 'category',
          data: categories,
          axisLine: { lineStyle: { color: 'rgba(0, 237, 237, 0.6)' } },
          axisLabel: { color: '#d7ffff' }
        },
        yAxis: [
          {
            type: 'value',
            name: 'SSEQ',
            min: 30,
            max: 100,
            axisLine: { lineStyle: { color: 'rgba(0, 237, 237, 0.6)' } },
            axisLabel: { color: '#d7ffff' },
            splitLine: { lineStyle: { color: 'rgba(0, 237, 237, 0.15)' } }
          },
          {
            type: 'value',
            name: 'NIQE',
            min: 2,
            max: 12,
            position: 'right',
            axisLine: { lineStyle: { color: 'rgba(0, 123, 255, 0.6)' } },
            axisTick: { show: true },
            axisLabel: {
              color: '#d7ffff',
              margin: 12,
              formatter: (value) => Number(value).toFixed(1)
            },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            name: 'SSEQ',
            type: 'bar',
            data: sseqs,
            yAxisIndex: 0,
            itemStyle: { color: '#00eded' }
          },
          {
            name: 'NIQE',
            type: 'line',
            data: niqes,
            yAxisIndex: 1,
            smooth: true,
            lineStyle: { color: '#ffb86b' },
            itemStyle: { color: '#ffb86b' }
          }
        ]
      };
    },
    addressHandle(item) {
      let name = item.provinceName;
      if (item.cityName) {
        name += "/" + item.cityName;
        if (item.countyName) {
          name += "/" + item.countyName;
        }
      }
      return name;
    },
    getData() {
      this.pageflag = true;
      // this.pageflag =false
      currentGET("big3", { limitNum: 20 }).then((res) => {
        console.log("设备提醒", res);
        if (res.success) {
          this.countUserNumData = res.data;
          this.list = res.data.list;
          let timer = setTimeout(() => {
            clearTimeout(timer);
            this.defaultOption.step =
              this.$store.state.setting.defaultOption.step;
          }, this.$store.state.setting.defaultOption.waitTime);
        } else {
          this.pageflag = false;
          this.$Message({
            text: res.msg,
            type: "warning",
          });
        }
      });
    },
  },
  watch: {
    // 当表格生成的新数据写入 store 时，图表同步刷新
    metricsData() {
      this.buildChartFromStore();
    }
  }
};
</script>
<style lang='scss' scoped>
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.metrics-chart-container {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 6px;
  border: 1px solid rgba(0, 237, 237, 0.35);
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 237, 237, 0.15);
}

.doudong {
  //  vertical-align:middle;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;

  .left_boottom_item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 14px;
    margin: 10px 0;
    .orderNum {
      margin: 0 16px 0 -20px;
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      color: #fff;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: $primary-color;
        font-size: 15px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #e6a23c;
        font-size: 15px;
      }
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 380px;
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("../../assets/img/zuo_xuxian.png");
        bottom: -10px;
        left: -2%;
        background-size: cover;
      }
      .addresswrap {
        width: 100%;
        display: flex;
        margin-top: 8px;
      }
    }

    .wangguan {
      color: #1890ff;
      font-weight: 900;
      font-size: 15px;
      width: 80px;
      flex-shrink: 0;
    }


    .time {
      font-size: 12px;
      // color: rgba(211, 210, 210,.8);
      color: #fff;
    }

    .address {
      font-size: 12px;
      cursor: pointer;
      // @include text-overflow(1);
    }

    .types {
      width: 30px;
      flex-shrink: 0;
    }

    .typeRed {
      color: #fc1a1a;
    }

    .typeGreen {
      color: #29fc29;
    }
  }
}
</style>
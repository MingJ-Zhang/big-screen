<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <button
          class="switch-btn"
          :class="{ active: mode === 'brightness' }"
          @click="setMode('brightness')"
        >亮度评估</button>
        <button
          class="switch-btn"
          :class="{ active: mode === 'contrast' }"
          @click="setMode('contrast')"
        >对比度评估</button>
      </div>
      <ItemWrap class="contetn_left-center contetn_lr-item" :title="mode === 'brightness' ? '评估算法（亮度）' : '评估算法（对比度）'">
        <template v-if="mode === 'brightness'">
          <LeftCenter2 @sendMsg="sendMsg" />
        </template>
        <template v-else>
          <div class="contrast-center">
            <div class="contrast-desc">对比度评估：关注亮暗区域差异与边缘清晰度</div>
            <table class="contrast-table">
              <thead>
                <tr>
                  <th>区域</th>
                  <th>对比度值</th>
                  <th>亮区对比</th>
                  <th>暗区对比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in contrastTableData" :key="idx">
                  <td>{{ row.area }}</td>
                  <td>{{ row.contrast }}</td>
                  <td>{{ row.bright }}</td>
                  <td>{{ row.dark }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </ItemWrap>
      <!-- <ItemWrap  v-if="mode === 'contrast'" class="contetn_lr-item" title="对比度图表">
        <contrast-chart :chartData="contrastTableData" />
      </ItemWrap> -->
      <ItemWrap class="contetn_left-top contetn_lr-item" :title="mode === 'brightness' ? '指标展示（亮度）' : '指标展示（对比度）'">
        <template v-if="mode === 'brightness'">
          <LeftBottom />
        </template>
        <template v-else>
          <contrast-chart :chartData="contrastTableData" />
        </template>
      </ItemWrap>

    </div>
    <div class="contetn_right">
      <ItemWrap2 title="监控点位">
        <Right1 />
      </ItemWrap2>
    </div>
  </div>
</template>

<script>
import { recover } from "api/modules";
import imageFile1 from '@/assets/images/011.png';
import imageFile2 from '@/assets/images/031.png';
import imageFile3 from '@/assets/images/051.png';
import LeftTop from "./left-top.vue";
import LeftCenter2 from "./left-center2.vue";
// import Right from "./recover/right.vue"
import Right1 from "./right1.vue"
import LeftBottom from "./left-bottom.vue";
import contrastChart from "./contrast-chart.vue";
export default {
  components: {
    LeftTop,
    LeftCenter2,
    Right1,
    LeftBottom,
    contrastChart
  },
  data() {
    return {
      denoisedImages: [],
      mode: 'brightness',
      contrastTableData: [
        { area: '区域A', contrast: 0.78, bright: 0.85, dark: 0.70 },
        { area: '区域B', contrast: 0.64, bright: 0.72, dark: 0.58 },
        { area: '区域C', contrast: 0.81, bright: 0.88, dark: 0.74 },
        { area: '区域D', contrast: 0.59, bright: 0.66, dark: 0.52 },
        { area: '区域E', contrast: 0.73, bright: 0.80, dark: 0.66 },
        { area: '区域F', contrast: 0.69, bright: 0.76, dark: 0.61 }
      ]
    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() { },

  mounted() {

  },
  methods: {
    setMode(m) {
      this.mode = m;
    },
    async sendMsg(value) {
      try {
        this.$refs.right1.startLoading()
        const formData = new FormData();

        // 将每个图片文件转换为 Blob 并添加到 FormData
        const images = [
          { file: imageFile1, name: '011.png' },
          { file: imageFile2, name: '031.png' },
          { file: imageFile3, name: '051.png' },
        ];

        for (let i = 0; i < images.length; i++) {
          const response = await fetch(images[i].file);
          const blob = await response.blob();
          formData.append(`image${i + 1}`, blob, images[i].name);
        }

        // 发送 POST 请求到 Flask 后端
        const response = await recover('/denoise/' + value, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.denoised_images) {
          this.denoisedImages = response.denoised_images;
        } else {
          alert('图片上传失败');
        }
        this.$refs.right1.endLoading()
      } catch (error) {
        console.error('上传图片出错:', error);
        alert('上传过程中发生错误');
      }
    }
  },
  computed: {
    contrastSummary() {
      const bAvg = (this.contrastTableData.reduce((s, r) => s + r.bright, 0) / this.contrastTableData.length).toFixed(2);
      const dAvg = (this.contrastTableData.reduce((s, r) => s + r.dark, 0) / this.contrastTableData.length).toFixed(2);
      const gAvg = (this.contrastTableData.reduce((s, r) => s + r.contrast, 0) / this.contrastTableData.length).toFixed(2);
      return { brightAvg: bAvg, darkAvg: dAvg, global: gAvg };
    }
  }
};
</script>
<style lang="scss" scoped>
// 内容
.contents {
  .contetn_left {
    width: 540px;
    box-sizing: border-box;
    // padding: 16px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
  }

  .contetn_lr-item {
    height: 400px;
  }

  .contetn_right {
    width: 1280px;
  }

  .pagetab {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
    justify-content: center;
  }

  .switch-btn {
    padding: 10px 20px;
    border: 1px solid #0a5050;
    border-radius: 5px;
    color: #00f7f6;
    background: linear-gradient(180deg, rgba(0, 237, 237, 0.1), rgba(0, 123, 255, 0.1));
    cursor: pointer;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 0 5px #00f7f6;
  }

  .switch-btn:hover {
    background: linear-gradient(180deg, rgba(0, 237, 237, 0.2), rgba(0, 123, 255, 0.2));
    box-shadow: 0 0 15px rgba(0, 237, 237, 0.5);
  }

  .switch-btn.active {
    background: linear-gradient(180deg, rgba(0, 237, 237, 0.3), rgba(0, 123, 255, 0.3));
    box-shadow: 0 0 25px rgba(0, 237, 237, 0.7), inset 0 0 10px rgba(0, 237, 237, 0.5);
    color: #fff;
    border-color: #00f7f6;
  }

  .contrast-center {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .contrast-desc {
    color: #aefcff;
    text-align: center;
    letter-spacing: 2px;
  }

  .contrast-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 6px 16px rgba(0, 237, 237, 0.20);

    th,
    td {
      border: 1px solid rgba(0, 237, 237, 0.35);
      padding: 8px 6px;
      text-align: center;
      color: #d7ffff;
      font-size: 14px;
      line-height: 1.4;
    }

    thead th {
      background: linear-gradient(180deg, rgba(0, 237, 237, 0.25), rgba(0, 123, 255, 0.25));
      color: #aefcff;
      letter-spacing: 2px;
      font-weight: 600;
    }

    tbody tr:nth-child(odd) {
      background: rgba(0, 237, 237, 0.08);
    }

    tbody tr:hover {
      background: rgba(0, 123, 255, 0.15);
      transition: background 0.2s ease-in-out;
    }
  }

  .contrast-bottom {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    align-items: start;
  }

  .metric-card {
    padding: 10px 12px;
    border: 1px solid rgba(0, 237, 237, 0.35);
    border-radius: 10px;
    color: #d7ffff;
    background: rgba(0, 237, 237, 0.08);
    box-shadow: 0 6px 16px rgba(0, 237, 237, 0.20);
  }

  .metric-num {
    color: #00eded;
    font-weight: 600;
    margin-left: 4px;
  }

  .metric-note {
    grid-column: 1 / -1;
    color: #aefcff;
    font-size: 12px;
    opacity: 0.8;
    text-align: right;
  }
}

@keyframes rotating {
  0% {
    -webkit-transform: rotate(0) scale(1);
    transform: rotate(0) scale(1);
  }

  50% {
    -webkit-transform: rotate(180deg) scale(1.1);
    transform: rotate(180deg) scale(1.1);
  }

  100% {
    -webkit-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
  }
}
</style>

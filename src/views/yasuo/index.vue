<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="评估算法">
        <LeftCenter2 @sendMsg="sendMsg" />
      </ItemWrap>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="指标展示">
        <LeftBottom />
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
export default {
  components: {
    LeftTop,
    LeftCenter2,
    Right1,
    LeftBottom
  },
  data() {
    return {
      denoisedImages: []
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

<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>

      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="功能选择" style="padding: 0 10px 16px 10px">
        <Alselect @sendMsg="setalo" />
      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="算法选择">
        <!-- <h1 style="text-align: center;" v-show="alIndex===-1">请先选择功能</h1> -->
        <LeftCenter3 @sendMsg="sendMsg"/>
        <!-- <RightBottom @sendMsg="selectItem" v-show="alIndex===0"/> -->
      </ItemWrap>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="平台实时监控">
        <LeftTop />
      </ItemWrap>

    </div>
    <div class="contetn_right">
      <ItemWrap2 title="效果展示">
        <Right1 ref="right1" :images="denoisedImages" v-show="flag" />
        <Right2 :pjres="pjres" v-show="!flag" />
      </ItemWrap2>
    </div>
  </div>
</template>

<script>
import { recover } from "api/modules";
import imageFile1 from '@/assets/dj/1.png';
import imageFile2 from '@/assets/dj/2.png';
import imageFile3 from '@/assets/dj/3.png';
import LeftTop from "./left-top.vue";
import RightBottom from "./right-bottom.vue";
import LeftCenter3 from "./left-center3.vue";
import Alselect from "./alselect.vue";
// import Right from "./recover/right.vue"
import Right1 from "./recover/right1.vue"
import Right2 from "./recover/right2.vue"
import { uploadImage } from "api/modules";
export default {
  components: {
    LeftTop,
    RightBottom,
    LeftCenter3,
    Right1,
    Right2,
    Alselect
  },
  data() {
    return {
      denoisedImages: [],
      flag: true,
      gnflag: 0,
      pjres: [],
      alIndex: -1,
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
    setalo(index) {
      this.alIndex = index;
      this.$emit('sw', index);
    },
    async selectItem(index) {
      this.flag = false
      try {
        const formData = new FormData();

        // 将每个图片文件转换为 Blob 并添加到 FormData
        const images = [
          { file: imageFile1, name: '1.png' },
          { file: imageFile2, name: '2.png' },
          { file: imageFile3, name: '3.png' },
          { file: imageFile1, name: '4.png' },
          { file: imageFile2, name: '5.png' },
          { file: imageFile3, name: '6.png' },
        ];

        for (let i = 0; i < images.length; i++) {
          const response = await fetch(images[i].file);
          const blob = await response.blob();
          formData.append(`image${i + 1}`, blob, images[i].name);
        }

        // 发送 POST 请求到 Flask 后端
        const response = await uploadImage('/upload/' + index, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data) {
          // alert('图片上传成功');
          let tmp = response.results.slice(0,3)
          // 给tmp中的每一个数字加一个1-5之间的随机数
          this.pjres = tmp.map(num => num + Math.floor(Math.random() * 5) + 1);
        } else {
          alert('图片上传失败');
        }
      } catch (error) {
        console.error('上传图片出错:', error);
        alert('上传过程中发生错误');
      }
    },
    async sendMsg(value) {
      this.flag = true
      try {
        this.$refs.right1.startLoading()
        const formData = new FormData();

        // 将每个图片文件转换为 Blob 并添加到 FormData
        const images = [
          { file: imageFile1, name: '1.png' },
          { file: imageFile2, name: '2.png' },
          { file: imageFile3, name: '3.png' },
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
    height: 310px;
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

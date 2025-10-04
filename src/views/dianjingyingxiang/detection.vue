<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="功能选择">
        <LeftTop @sendMsg="setalo" />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="图像 1">
        <Jiankong :imgUrl="imageUrl1" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="评价结果（图像 1）">
        <Jiankong :imgUrl="im1" />
      </ItemWrap2>
    </div>
    <div class="contetn_center">
      <ItemWrap class="contetn_left-center contetn_lr-item" title="算法选择">
        <RightBottom @sendMsg="selectItem" />
      </ItemWrap>
      <ItemWrap2 class="contetn_center-center contetn_lr-item" title="图像2 ">
        <Jiankong :imgUrl="imageUrl2" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_center-bottom contetn_lr-item" title="评价结果（图像 2）">
        <Jiankong :imgUrl="im2" />
      </ItemWrap2>
      <!-- <CenterMap class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="安装计划">
        <CenterBottom />
      </ItemWrap> -->
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="评价得分" style="padding: 0 10px 16px 10px">
        <LeftBottom :chart-data="qualityData" />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="图像 3">
        <Jiankong :imgUrl="imageUrl3" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-bottom contetn_lr-item" title="评价结果（图像 3）">
        <Jiankong :imgUrl="im3" />
      </ItemWrap2>
      <!-- <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="报警排名(TOP8)"
        style="padding: 0 10px 16px 10px"
      >
        <RightCenter />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="数据统计图 ">
        <RightBottom />
      </ItemWrap> -->
    </div>
  </div>
</template>

<script>
import imageFile1 from '@/assets/dj2/1.png';
import imageFile2 from '@/assets/dj2/2.png';
import imageFile3 from '@/assets/dj2/3.png';
import imageFile1a from '@/assets/dj2/1a.jpg';
import imageFile2a from '@/assets/dj2/2a.jpg';
import imageFile3a from '@/assets/dj2/3a.jpg';
import LeftTop from "./dete/lefttop.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./dete/left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./dete/right-bottom.vue";
import Jiankong from "./dete/detImg.vue";
import LeftCenter2 from "./left-center2.vue";
import Pjres from './index/pjres.vue';

export default {
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    CenterMap,
    RightTop,
    RightCenter,
    RightBottom,
    CenterBottom,
    Jiankong,
    LeftCenter2,
    Pjres
  },
  data() {
    return {
      imageUrl1: imageFile1,
      imageUrl2: imageFile2,
      imageUrl3: imageFile3,
      imageUrl1a: imageFile1a,
      imageUrl2a: imageFile2a,
      imageUrl3a: imageFile3a,
      im1: null,
      im2: null,
      im3: null,
      dataList1: [],
      dataList2: [],
      dataList3: [],
      qualityData: {
        images: ['图像1', '图像2', '图像3'],
        indicators: ['清晰度', '色彩还原', '噪点控制', '对比度', '整体质量'],
        scores: [
          // [85, 78, 92, 88, 86], // 图像A的各项得分
          // [92, 85, 88, 90, 89], // 图像B的各项得分
          // [78, 88, 85, 82, 83]  // 图像C的各项得分
        ]
      }
    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() { },

  mounted() { },
  methods: {
    setalo(index) {
      this.$emit('sw', index);
    },
    // 生成 min 到 max 之间保留 decimals 位小数的随机数
    getRandomScore(min = 10, max = 20, decimals = 1) {
      const num = Math.random() * (max - min) + min;
      return Number(num.toFixed(decimals));
    },

    selectItem() {
      this.im1 = this.imageUrl1a
      this.im2 = this.imageUrl2a
      this.im3 = this.imageUrl3a

      const numImages = this.qualityData.images.length;
      const numIndicators = this.qualityData.indicators.length;
      this.qualityData.scores = Array.from({ length: numImages }, () =>
        Array.from({ length: numIndicators }, () =>
          (Math.random() * 10 + 10).toFixed(1)
        )
      );
    }
  },
};
</script>
<style lang="scss" scoped>
// 内容
.contents {

  .contetn_left,
  .contetn_right {
    width: 540px;
    box-sizing: border-box;
    // padding: 16px 0;
  }

  .contetn_center {
    width: 540px;
  }

  //左右两侧 三个块
  .contetn_lr-item {
    height: 310px;
  }

  .contetn_center_top {
    width: 100%;
  }

  // 中间
  .contetn_center {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .contetn_center-bottom {
    height: 315px;
  }

  //左边 右边 结构一样
  .contetn_left,
  .contetn_right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
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

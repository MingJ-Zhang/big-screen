<!--
 * @Author: daidai
 * @Date: 2022-03-04 09:23:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-07 11:05:02
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\index.vue
-->
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
        <Pjres :dataList="dataList1" />
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
        <Pjres :dataList="dataList2" />
      </ItemWrap2>
      <!-- <CenterMap class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="安装计划">
        <CenterBottom />
      </ItemWrap> -->
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="资源利用率" style="padding: 0 10px 16px 10px">
        <LeftBottom />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="图像 3">
        <Jiankong :imgUrl="imageUrl3" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-bottom contetn_lr-item" title="评价结果（图像 3）">
        <Pjres :dataList="dataList3" />
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
import imageFile1 from '@/assets/dj/1.png';
import imageFile2 from '@/assets/dj/2.png';
import imageFile3 from '@/assets/dj/3.png';
import LeftTop from "./index/lefttop.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
import Jiankong from "./detImg.vue";
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
      dataList1: [],
      dataList2: [],
      dataList3: []
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
    const metrics = ['指标一', '指标二', '指标三', '指标四', '指标五'];

    // 通用生成函数
    const makeList = () => 
      metrics.map(metric => ({
        metric,
        score: this.getRandomScore(10, 20, 1)
      }));

    this.dataList1 = makeList();
    this.dataList2 = makeList();
    this.dataList3 = makeList();
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

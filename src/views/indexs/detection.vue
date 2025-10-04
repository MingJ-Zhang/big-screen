<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
        <LeftTop />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="监控视频-点位 1">
        <Jiankong :flag="flag" :imgUrl="imageUrl1" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="监控视频-点位 2">
        <Jiankong :flag="flag" :imgUrl="imageUrl2" />
      </ItemWrap2>
    </div>
    <div class="contetn_center">
      <ItemWrap class="contetn_left-center contetn_lr-item" title="定位检测">
        <LeftCenter5 @detection="detection" @detectionStop="detectionStop" />
      </ItemWrap>
      <ItemWrap2 class="contetn_center-center contetn_lr-item" title="监控视频-点位 3">
        <Jiankong :flag="flag" :imgUrl="imageUrl3" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_center-bottom contetn_lr-item" title="监控视频-点位 4">
        <Jiankong :flag="flag" :imgUrl="imageUrl4" />
      </ItemWrap2>
      <!-- <CenterMap class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="安装计划">
        <CenterBottom />
      </ItemWrap> -->
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="占个位置" style="padding: 0 10px 16px 10px">
        <LeftCenter />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="监控视频-点位 5">
        <Jiankong :flag="flag" :imgUrl="imageUrl5" />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-bottom contetn_lr-item" title="监控视频-点位 6">
        <Jiankong :flag="flag" :imgUrl="imageUrl6" />
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
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
import Jiankong from "./detImg.vue";
import LeftCenter5 from "./left-center5.vue";
import imageFile1 from "@/assets/images/011.png"
import imageFile2 from "@/assets/images/021.png"
import imageFile3 from "@/assets/images/031.png"
import imageFile4 from "@/assets/images/041.png"
import imageFile5 from "@/assets/images/051.png"
import imageFile6 from "@/assets/images/061.png"
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
    LeftCenter5,
  },
  data() {
    return {
      flag: 1,
      imageUrl1: imageFile1,
      imageUrl2: imageFile2,
      imageUrl3: imageFile3,
      imageUrl4: imageFile4,
      imageUrl5: imageFile5,
      imageUrl6: imageFile6
    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() {},

  mounted() {},
  methods: {
    detection(results) {
      this.imageUrl1 = "data:image/png;base64," + results[0].base64
      this.imageUrl2 = "data:image/png;base64," + results[1].base64
      this.imageUrl3 = "data:image/png;base64," + results[2].base64
      this.imageUrl4 = "data:image/png;base64," + results[3].base64
      this.imageUrl5 = "data:image/png;base64," + results[4].base64
      this.imageUrl6 = "data:image/png;base64," + results[5].base64
    },
    detectionStop(index) {
      // 恢复图片的 url
      this.imageUrl1 = imageFile1
      this.imageUrl2 = imageFile2
      this.imageUrl3 = imageFile3
      this.imageUrl4 = imageFile4
      this.imageUrl5 = imageFile5
      this.imageUrl6 = imageFile6
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

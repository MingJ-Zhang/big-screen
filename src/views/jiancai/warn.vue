<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="预警排名">
        <RightCenter />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="监控视频-点位 1">
        <Jiankong />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="监控视频-点位 2">
        <Jiankong />
      </ItemWrap2>
    </div>
    <div class="contetn_center">
      <ItemWrap class="contetn_left-center contetn_lr-item" title="超标预警">
        <LeftCenter4 />
      </ItemWrap>
      <ItemWrap2 class="contetn_center-center contetn_lr-item" title="监控视频-点位 3">
        <Jiankong />
      </ItemWrap2>
      <ItemWrap2 class="contetn_center-bottom contetn_lr-item" title="监控视频-点位 4">
        <Jiankong />
      </ItemWrap2>
      <!-- <CenterMap class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="安装计划">
        <CenterBottom />
      </ItemWrap> -->
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="预警次数" style="padding: 0 10px 16px 10px">
        <RightTop />
      </ItemWrap>
      <ItemWrap2 class="contetn_left-center contetn_lr-item" title="监控视频-点位 5">
        <Jiankong />
      </ItemWrap2>
      <ItemWrap2 class="contetn_left-bottom contetn_lr-item" title="监控视频-点位 6">
        <Jiankong />
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
import Jiankong from "./jiankong.vue";
import LeftCenter4 from "./left-center4.vue";

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
    LeftCenter4,
  },
  data() {
    return {};
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() {},

  mounted() {},
  methods: {},
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

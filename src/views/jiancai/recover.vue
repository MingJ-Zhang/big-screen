<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
        <LeftTop />
      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="复原增强">
        <LeftCenter3 />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="数据统计图" style="padding: 0 10px 16px 10px">
        <RightBottom />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap2 title="效果展示">
        <Right />
      </ItemWrap2>
    </div>
  </div>
</template>

<script>
import LeftTop from "./left-top.vue";
import RightBottom from "./right-bottom.vue";
import LeftCenter3 from "./left-center3.vue";
import Right from "./recover/right.vue"

export default {
  components: {
    LeftTop,
    RightBottom,
    LeftCenter3,
    Right
  },
  data() {
    return {};
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() { },

  mounted() { },
  methods: {},
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

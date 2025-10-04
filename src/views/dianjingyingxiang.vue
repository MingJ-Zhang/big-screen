<template>
  <!-- <div id="index" ref="appRef" class="index_home" :class="{ pageisScale: isScale }"> -->
  <ScaleScreen :width="1920" :height="1080" class="scale-wrap" :selfAdaption="$store.state.setting.isScale">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <!-- 头部 s -->
        <div class="d-flex jc-center title_wrap">
          <div class="zuojuxing"></div>
          <div class="youjuxing"></div>
          <div class="guang"></div>
          <!-- <div class="btn1" :class="{ active: flag === 1 }" @click="change(1)">画质评价</div>
          <div class="btn2" :class="{ active: flag === 2 }" @click="change(2)">复原增强</div>
          <div class="btn3" :class="{ active: flag === 3 }" @click="change(3)">定位检测</div>
          <div class="btn4" :class="{ active: flag === 4 }" @click="change(4)">超标预警</div> -->
          <div class="d-flex jc-center">
            <div class="title">
              <span class="title-text" data-text="电镜影像可视化平台">电镜影像可视化平台</span>
            </div>
          </div>
          <div class="timers">
            {{ dateYear }} {{ dateWeek }} {{ dateDay }}
            <!-- <i
              class="blq-icon-shezhi02"
              style="margin-left: 10px"
              @click="showSetting"
            ></i> -->
            <div style="cursor: pointer; margin-left: 20px" @click="logout"><i class="el-icon-user"></i>用户管理</div>
            <div style="cursor: pointer; margin-left: 10px" @click="logout"><i class="el-icon-switch-button"></i>退出
            </div>
          </div>
        </div>
        <!-- 头部 e-->
        <!-- 内容  s-->
        <!-- <router-view></router-view> -->
        <Index @sw="sw" v-if="flag == 1" />
        <Recover @sw="sw" v-if="flag == 2 " />
        <Detection @sw="sw" v-if="flag == 3" />
        <Warn v-if="flag == 4" />
        <!-- 内容 e -->
      </div>
    </div>
    <Setting ref="setting" />
  </ScaleScreen>
  <!-- </div> -->
</template>

<script>
import {formatTime} from "../utils/index.js";
import Setting from "./setting.vue";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";
import Index from "./dianjingyingxiang/index.vue";
import Recover from "./dianjingyingxiang/recover.vue";
import Detection from "./dianjingyingxiang/detection.vue";
import Warn from "./dianjingyingxiang/warn.vue";

export default {
  components: {Detection, Setting, ScaleScreen, Index, Recover, Warn},
  data() {
    return {
      flag: 1,
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  computed: {},
  created() {
  },
  mounted() {
    this.timeFn();
    this.cancelLoading();
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  methods: {
    change(val) {
      console.log(val);

      this.flag = val
    },
    sw(index){
      console.log("🚀 ~ sw ~ index:", index)
      this.flag = index + 1
    },
    logout() {
      this.$router.push("/index")
    },
    showSetting() {
      this.$refs.setting.init();
    },
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), "HH: mm: ss");
        this.dateYear = formatTime(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    cancelLoading() {
      let timer = setTimeout(() => {
        this.loading = false;
        clearTimeout(timer);
      }, 500);
    },
  },
};
</script>

<style lang="scss">
@import "./home4.scss";
</style>

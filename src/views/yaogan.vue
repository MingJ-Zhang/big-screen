<template>
    <!-- <div id="index" ref="appRef" class="index_home" :class="{ pageisScale: isScale }"> -->
    <ScaleScreen :width="1920" :height="1080" class="scale-wrap" :selfAdaption="$store.state.setting.isScale">
        <div class="bg">
            <dv-loading v-if="loading">Loading...</dv-loading>
                <Detection v-if="flag == 3" />
        </div>
        <Setting ref="setting" />
    </ScaleScreen>
    <!-- </div> -->
</template>

<script>
import { formatTime } from "../utils/index.js";
import Setting from "./setting.vue";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";
import Detection from "./yaogan/index.vue";


export default {
    components: { Detection, Setting, ScaleScreen },
    data() {
        return {
            flag: 3,
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

<style lang="scss" scoped>
@import "./home5.scss";
</style>

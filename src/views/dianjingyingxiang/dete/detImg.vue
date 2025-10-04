
<template>
    <div id="rightTop">
        <el-image v-if="imgUrl" :src="imgUrl" fit="fit" style="width: 510px;height: 255px;" />
        <div v-else style="text-align: center;">请选择算法</div>        
    </div>
</template>

<script>
import { currentGET } from "api/modules";
import { graphic } from "echarts"
// import test from "@/assets/images/test.png"
// import videoFile from "@/assets/images/video.mp4"
import videoFile1 from "@/assets/images/video1.mp4"
import imageFile from "@/assets/images/021.png"
export default {
    data() {
        return {
            pageflag: true,
            // imgUrl: test,
            // videoUrl: videoFile,
            // imgUrl: imageFile
        };
    },
    props: {
        flag: {
            type: Number,
            default: 1
        },
        imgUrl: {
            type: String,
        }
    },
    watch: {
        flag: function (val) {
            if (val === 0) {
                this.videoUrl = videoFile1
            } else {
                this.videoUrl = videoFile
            }
        }
    },
    created() {

    },

    mounted() {
    },
    beforeDestroy() {
    },
    methods: {

    },
};
</script>
<style lang='scss' scoped>
.right_top_inner {
    margin-top: -8px;
}
</style>
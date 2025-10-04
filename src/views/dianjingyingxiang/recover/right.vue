<template>
    <div>
        <el-row class="right">
            <!-- 左侧列 -->
            <el-col :span="12">
                <ItemWrap6 v-for="index in 3" :key="index" class="right_item" :title="'监控视频-点位 ' + (index) + '（增强前）'">
                    <video :src="videoUrl" autoplay muted loop class="video-player"></video>
                </ItemWrap6>
            </el-col>

            <!-- 右侧列 -->
            <el-col :span="12">
                <ItemWrap8 v-for="index in 3" :key="index" class="right_item" :title="'监控视频-点位 ' + (index) + '（增强后）'">
                    <video :src="videoUrl" autoplay muted loop class="video-player"></video>
                </ItemWrap8>
            </el-col>
        </el-row>

        <!-- 炫酷特效 -->
        <div class="enhancement-effect"></div>
    </div>
</template>

<script>
import videoFile from '@/assets/images/video.mp4';
export default {
    data() {
        return {
            videoUrl: videoFile
        };
    },
};
</script>

<style scoped lang="scss">
.right_item{
    height: 310px;
    width: 540px;
}
.video-player{
    width: 100%;
    height: 90%;
}
.right{
    margin-left: 40px;
}
</style>

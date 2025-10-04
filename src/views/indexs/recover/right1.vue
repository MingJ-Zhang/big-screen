<template>
    <div>
        <el-row class="right">
            <!-- 左侧列 -->
            <el-col :span="12">
                <ItemWrap6 :key="1" class="right_item" :title="'监控视频-点位 ' + (1) + '（增强前）'">
                    <el-image :src="imageUrl1" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
                <ItemWrap6 :key="2" class="right_item" :title="'监控视频-点位 ' + (2) + '（增强前）'">
                    <el-image :src="imageUrl2" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
                <ItemWrap6 :key="3" class="right_item" :title="'监控视频-点位 ' + (3) + '（增强前）'">
                    <el-image :src="imageUrl3" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
            </el-col>
            <el-col :span="12">
                <ItemWrap8 v-for="(item, index) in items" :key="item.id" class="right_item"
                    :title="`监控视频-点位 ${item.id}（增强后）`">
                    <dv-loading v-if="loading">Loading...</dv-loading>
                    <span v-else-if="!loading && !getImage(index)">请先选择算法</span>
                    <el-image v-else :src="`data:image/png;base64,${getImage(index)}`" fit="fit"
                        style="width: 510px; height: 255px;" />
                </ItemWrap8>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// import videoFile from '@/assets/images/video.mp4';
import imageFile1 from '@/assets/images/011.png';
import imageFile2 from '@/assets/images/031.png';
import imageFile3 from '@/assets/images/051.png';
import imageFile4 from '@/assets/images/014.png';
import imageFile5 from '@/assets/images/034.png';
import imageFile6 from '@/assets/images/054.png';
import { loading } from '@jiaminghi/data-view';
export default {
    props: {
        images: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            items: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
            ],
            loading: false,
            // videoUrl: videoFile
            imageUrl1: imageFile1,
            imageUrl2: imageFile2,
            imageUrl3: imageFile3,
            imageUrl4: imageFile4,
            imageUrl5: imageFile5,
            imageUrl6: imageFile6,
        };
    },
    methods: {
        startLoading() {
            this.images = []
            this.loading = true
        },
        endLoading() {
            this.loading = false
        },

        getImage(index) {
            return this.images && this.images.length > index ? this.images[index] : null;
        },
    }
};
</script>

<style scoped lang="scss">
.right_item {
    height: 310px;
    width: 540px;
}

.video-player {
    width: 100%;
    height: 90%;
}

.right {
    margin-left: 40px;
}
</style>

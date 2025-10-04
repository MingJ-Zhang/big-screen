<template>
    <div>
        <el-row class="right">
            <!-- 左侧列 -->
            <el-col :span="12">
                <ItemWrap6 :key="1" class="right_item" :title="'监控点位 ' + (1)">
                    <el-image :src="imageUrl1" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
                <ItemWrap6 :key="2" class="right_item" :title="'监控点位 ' + (2)">
                    <el-image :src="imageUrl2" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
                <ItemWrap6 :key="3" class="right_item" :title="'监控点位 ' + (3)">
                    <el-image :src="imageUrl3" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
            </el-col>
            <el-col :span="12">
                <ItemWrap6 :key="4" class="right_item" :title="'监控点位 ' + (4)">
                    <el-image :src="imageUrl4" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
                <ItemWrap6 :key="5" class="right_item" :title="'监控点位 ' + (5)">
                    <el-image :src="imageUrl5" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
                <ItemWrap6 :key="6" class="right_item" :title="'监控点位 ' + (6)">
                    <el-image :src="imageUrl6" fit="fit" style="width: 510px;height: 255px;" />
                </ItemWrap6>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// import videoFile from '@/assets/images/video.mp4';
import imageFile1 from '@/assets/images/zaosheng/1.png';
import imageFile2 from '@/assets/images/zaosheng/2.png';
import imageFile3 from '@/assets/images/zaosheng/3.png';
import imageFile4 from '@/assets/images/zaosheng/4.png';
import imageFile5 from '@/assets/images/zaosheng/5.png';
import imageFile6 from '@/assets/images/zaosheng/6.png';
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

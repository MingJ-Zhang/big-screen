<template>
    <div class="mapwrap">
        <!-- 左侧按钮部分 -->
        <div v-for="(item, index) in items" :key="index" :class="['iq', { active: index === activeIndex }]"
            :style="{ top: item.top + 'px' }" @click="selectItem(index)">
            {{ item.text }}
        </div>


        <div class="table-container" v-show="activeIndex === 1">
            <el-card class="custom-card">
                <div slot="header" style="text-align: center;font-weight: bold;color: white;">功能介绍</div>
                <div class="card-content">
                    此类算法算法专为电镜影像质量评估而研发，通过多尺度特征提取与注意力机制相结合，能够精准量化图像中的噪声、模糊及对比度退化程度。轻量化深度回归网络，可实时生成反映图像视觉质量的评分，并针对不同缺陷类型自适应调整评估策略，帮助工程师快速识别显微图像中的关键质量问题。
                </div>
            </el-card>
        </div>

        <div class="table-container" v-show="activeIndex === 0">
            <el-card class="custom-card">
                <div slot="header" style="text-align: center;font-weight: bold;color: white;">功能介绍</div>
                <div class="card-content">
                    此类算法专为电镜影像质量优化而设计，能够在保留样品边缘与微观纹理等关键特征的同时，显著提升整体画质。基于先进的轻量级神经网络架构，它能快速、高效地复原与增强退化图像，实现细节精细化恢复，并具备良好的实时性与部署灵活性，。
                </div>
            </el-card>
        </div>

        <div class="table-container" v-show="activeIndex === 2">
            <el-card class="custom-card">
                <div slot="header" style="text-align: center;font-weight: bold;color: white;">功能介绍</div>
                <div class="card-content">
                    此类算法专为压缩噪声评估而设计，能够在保留图像结构与细节特征的同时，精准识别并量化诸如块效应、振铃与色带等压缩伪影。基于先进的轻量级神经网络与自然场景统计模型融合架构，它可快速、高效地对失真图像进行多尺度质量分析，并具备优秀的实时性与跨平台部署灵活性，充分满足工业现场的应用需求。
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [
                { text: '画质评价', top: 14 },
                { text: '复原增强', top: 98 },
                { text: '压缩噪声', top: 184 },
                // { text: '增强算法4', top: 194 },
            ],
            tableDataSets: [],
            tableData: [],
            activeIndex: 2, // 当前激活的按钮索引
        };
    },
    methods: {
        // 选择按钮时更新表格数据
        selectItem(index) {
            this.activeIndex = index; // 设置当前点击的按钮为激活状态
            this.$emit("sendMsg", index)
        },
    },
    created() {
        // 初始化表格数据为第一个按钮的数据
        this.tableData = this.tableDataSets[0];
    },
};
</script>

<style lang="scss" scoped>
.custom-card {
    background-color: transparent;
    /* 背景透明 */
    border: 1px solid #007bff;
    /* 边框蓝色 */
    box-shadow: none;
    /* 移除默认阴影 */
}

.card-content {
    font-weight: 900;
    letter-spacing: 2px;
    background: linear-gradient(92deg,
            #0072ff 0%,
            #00eaff 48.8525390625%,
            #01aaff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.mapwrap {
    position: relative;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: flex;

    .iq {
        position: absolute;
        right: 350px;
        width: 150px;
        height: 58px;
        border: 1px solid #00eded;
        border-radius: 10px;
        color: #00f7f6;
        text-align: center;
        line-height: 56px;
        letter-spacing: 6px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5), 0 0 6px rgba(0, 237, 237, 0.4);
        transition: box-shadow 0.3s ease;
    }

    /* 添加激活时的光晕效果 */
    .iq.active {
        box-shadow: 0 0 10px 5px rgba(0, 123, 255, 0.7),
            0 0 15px 8px rgba(0, 123, 255, 0.5);
    }

    .table-container {
        margin-left: auto;
        margin-right: 10px;
        width: 300px;

        table {
            width: 100%;
            border-collapse: collapse;

            th,
            td {
                border: 1px solid rgba(0, 237, 237, 0.5);
                padding: 8px;
                text-align: center;
            }

            // th {
            //     background-color: #f5f5f5;
            // }
        }
    }
}
</style>

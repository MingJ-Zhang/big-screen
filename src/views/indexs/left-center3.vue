<template>
  <div class="mapwrap">
    <!-- 左侧按钮部分 -->
    <div v-for="(item, index) in items" :key="index" :class="['iq', { active: index === activeIndex }]"
      :style="{ top: item.top + 'px' }" @click="selectItem(index)">
      {{ item.text }}
    </div>

    <!-- 右侧表格部分 -->
    <div class="table-container">
      <el-card class="custom-card">
        <div slot="header" style="text-align: center;font-weight: bold;color: white;">算法介绍</div>
        <div class="card-content">
          此类算法专为工业烟气影像增强设计，能够高效保留影像中的烟气边缘和纹理等区域特性。<br /><br />
          此类算法采用先进的轻量级神经网络，具有实现快速、有效地复原和增强受损图像，提升图像质量、优化细节恢复的能力，可以适应实际工业应用需求。
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
        { text: '增强算法1', top: 0 },
        { text: '增强算法2', top: 64 },
        { text: '增强算法3', top: 134 },
        { text: '增强算法4', top: 194 },
      ],
      tableDataSets: [],
      tableData: [],
      activeIndex: -1, // 当前激活的按钮索引
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
    height: 28px;
    border: 1px solid #00eded;
    border-radius: 10px;
    color: #00f7f6;
    text-align: center;
    line-height: 26px;
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

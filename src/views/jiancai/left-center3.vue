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
          这里是算法介绍内容，可以是表格、图表或者其他形式的数据展示。<br />
          这里是算法介绍内容，可以是表格、图表或者其他形式的数据展示。<br />
          这里是算法介绍内容，可以是表格、图表或者其他形式的数据展示。<br />
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
        { text: 'HH-IE1', top: 0 },
        { text: 'HH-IE2', top: 64 },
        { text: 'HH-IE3', top: 134 },
        { text: 'HH-IE4', top: 194 },
      ],
      tableDataSets: [
        [
          { point: '监控点1', score: 85 },
          { point: '监控点2', score: 90 },
          { point: '监控点3', score: 78 },
          { point: '监控点4', score: 92 },
          { point: '监控点5', score: 88 },
          { point: '监控点6', score: 95 },
        ],
        [
          { point: '监控点1', score: 80 },
          { point: '监控点2', score: 85 },
          { point: '监控点3', score: 88 },
          { point: '监控点4', score: 90 },
          { point: '监控点5', score: 87 },
          { point: '监控点6', score: 93 },
        ],
        [
          { point: '监控点1', score: 75 },
          { point: '监控点2', score: 82 },
          { point: '监控点3', score: 79 },
          { point: '监控点4', score: 85 },
          { point: '监控点5', score: 80 },
          { point: '监控点6', score: 88 },
        ],
        [
          { point: '监控点1', score: 90 },
          { point: '监控点2', score: 92 },
          { point: '监控点3', score: 89 },
          { point: '监控点4', score: 94 },
          { point: '监控点5', score: 91 },
          { point: '监控点6', score: 95 },
        ],
      ],
      tableData: [],
      activeIndex: 0, // 当前激活的按钮索引
    };
  },
  methods: {
    // 选择按钮时更新表格数据
    selectItem(index) {
      this.activeIndex = index; // 设置当前点击的按钮为激活状态
      this.tableData = this.tableDataSets[index];
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

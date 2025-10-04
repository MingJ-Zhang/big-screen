<template>
  <div class="mapwrap">
    <!-- 左侧按钮部分 -->
    <div v-for="(item, index) in items" :key="index" :class="['iq', { active: index === activeIndex }]"
      :style="{ top: item.top + 'px' }" @click="selectItem(index)">
      {{ item.text }}
    </div>

    <!-- 右侧表格部分 -->
    <div class="table-container">
      <div v-if="activeIndex === 0" style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <!-- <div>正在进行火焰定位</div> -->
        <dv-decoration-12 style="width: 200px;height: 200px;" />
      </div>
      <table v-else-if="activeIndex === 1">
        <thead>
          <tr>
            <th>监控点位</th>
            <th>烟气浓度</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{ 'flash-background': parseFloat(row.score) > 70 }" v-for="(row, idx) in tableData" :key="idx">
            <td style="color: #f3f3f3;">{{ row.point }}</td>
            <td style="color: #f3f3f3;">{{ row.score }}</td>
          </tr>
        </tbody>
      </table>
      <!--显示预警已停止 -->
      <div v-else>已停止监控，请点击功能按钮以开始</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { text: '火焰定位', top: 0 },
        { text: '烟雾检测', top: 74 },
        { text: '停   止', top: 144 },
      ],
      tableDataSets: [
        [
          { point: '监控点1', score: '71%' },
          { point: '监控点2', score: '0' },
          { point: '监控点3', score: '0' },
          { point: '监控点4', score: '78%' },
          { point: '监控点5', score: '80%' },
          { point: '监控点6', score: '0' },
        ],
      ],
      tableData: [],
      activeIndex: 2, // 修改为 0
      timer: null,
    };
  },
  methods: {
    selectItem(index) {
      this.activeIndex = index;
      this.$emit("detection", index)
      // 当点击“结束”按钮时，停止定时器
      if (index === 2 || index === 0) {
        clearInterval(this.timer);
      } else {
        // 点击“开始”按钮时，启动定时器
        this.startWarning();
      }
    },
    getRandom(max, min) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    startWarning() {
      // 如果已经有定时器，先清除
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        const randomData = [
          { point: '监控点1', score: this.getRandom(60, 90) + '%' },
          { point: '监控点2', score: this.getRandom(60, 90) + '%' },
          { point: '监控点3', score: this.getRandom(60, 90) + '%' },
          { point: '监控点4', score: this.getRandom(60, 90) + '%' },
          { point: '监控点5', score: this.getRandom(60, 90) + '%' },
          { point: '监控点6', score: this.getRandom(60, 90) + '%' },
        ];
        this.$set(this.tableDataSets, 0, randomData);
        if (this.activeIndex === 1) {
          this.tableData = randomData;
        }
      }, 5000);
    },
  },
  created() {
    this.tableData = this.tableDataSets[0];
  },
  mounted() {
    // 初始时启动定时器
    this.startWarning();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
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
    height: 40px;
    border: 1px solid #00eded;
    border-radius: 200px;
    color: #00f7f6;
    font-size: 20px;
    text-align: center;
    line-height: 40px;
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

  @keyframes flashBackground {

    0%,
    100% {
      background-color: transparent;
    }

    50% {
      background-color: #b05b24;
      /* 可以调整为其他亮色 */
    }
  }

  .flash-background td {
    animation: flashBackground 1.5s infinite;
  }
}
</style>

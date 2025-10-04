<template>
  <div class="mapwrap">

    <!-- <div v-for="(item, index) in items" :key="index" :class="['iq', { active: index === activeIndex }]"
      :style="{ top: item.top + 'px' }" @click="selectItem(index)">
      {{ item.text }}
    </div> -->
    <h2 style="width: 100%; text-align: center;">{{ posName }}</h2>
    <!-- 右侧表格部分 -->
    <div class="table-container">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <table v-if="activeIndex != -1 && !loading">
        <thead>
          <tr>
            <th>算法</th>
            <th>浊度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in tableData" :key="idx">
            <td>{{ row.point }}</td>
            <td>{{ row.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { loading } from "@jiaminghi/data-view";
export default {
  props: {
    val: {
      // 对象
      type: Object,
      default: () => {
      }
    },
    amapValue: {
      // 对象
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    val: function (n, o) {
      console.log("new", n)
      console.log("old", o)
      this.posName = n.data.value[2]
    },
    amapValue: function (n, o) {
      console.log("new", n)
      console.log("old", o)
      this.posName = n.value[2]
    },
  },
  data() {
    return {
      loading: false,
      posName: '',
      tableDataSets: [
        [
          { point: '算法1', score: 85 },
          { point: '算法2', score: 90 },
          { point: '算法3', score: 78 },
          { point: '算法4', score: 92 },
        ],
      ],
      tableData: [],
      activeIndex: 0, // 当前激活的按钮索引
    };
  },
  methods: {

  },
  created() {
    // 初始化表格数据为第一个按钮的数据
    this.tableData = this.tableDataSets[0];
  },
};
</script>

<style lang="scss" scoped>
.mapwrap {
  position: relative;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  /* 原来是 display: flex，默认水平排列 */
  /* display: flex; */
  /* 如果还是想用 flex，可以加上方向为 column */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 如果想让内容在水平方向居中 */

  .iq {
    /* 删掉绝对定位，改用常规排版 */
    /* position: absolute; */
    /* right: 350px; */
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

    /* 多个 .iq 元素上下间距 */
    margin-bottom: 10px;
  }

  /* 添加激活时的光晕效果 */
  .iq.active {
    box-shadow: 0 0 10px 5px rgba(0, 123, 255, 0.7),
      0 0 15px 8px rgba(0, 123, 255, 0.5);
  }

  .table-container {
    /* 让表格在上下顺序中展示 */
    width: 100%;
    margin-top: 30px;
    /* 如果表格想单独居中，可视情况添加对齐属性 */
    /* margin-left: auto; */
    /* margin-right: auto; */

    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        border: 1px solid rgba(0, 237, 237, 0.5);
        padding: 8px;
        text-align: center;
      }
    }
  }
}
</style>

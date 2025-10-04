<template>
  <div class="mapwrap">
    <!-- 左侧按钮部分 -->
    <div v-for="(item, index) in items" :key="index" :class="['iq', { active: index === activeIndex }]"
      :style="{ top: item.top + 'px' }" @click="selectItem(index)">
      {{ item.text }}
    </div>

    <!-- 右侧表格部分 -->
    <div class="table-container">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <table v-if="activeIndex != -1 && !loading">
        <thead>
          <tr>
            <th>监控点位</th>
            <th>NIQE</th>
            <th>SSEQ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in tableData" :key="idx">
            <td>{{ row.point }}</td>
            <td>{{ row.niqe }}</td>
            <td>{{ row.sseq }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      items: [
        { text: '评估算法1', top: 10 },
        { text: '评估算法2', top: 75 },
        { text: '评估算法3', top: 140 },
        { text: '评估算法4', top: 205 },
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
      activeIndex: -1, // 当前激活的按钮索引
    };
  },
  methods: {
    // 选择按钮时更新表格数据
    async selectItem(index) {
      // 设置当前点击的按钮为激活状态并显示加载动画
      this.activeIndex = index;
      // 同步当前算法索引到全局，供图表联动
      this.$store.commit('setting/setMetricsAlgoIndex', index);
      this.loading = true;

      try {
        // 模拟 NIQE（越低越好）与 SSEQ（0-100，越高越好）
        // 为贴近真实，不同算法 index 影响基线：index 越大质量越差（NIQE↑、SSEQ↓）
        const pointsCount = 6;
        const tmp = [];

        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

        for (let i = 0; i < pointsCount; i++) {
          const niqeBase = 3 + index * 1.6; // 约 2-12，越高越差
          const sseqBase = 88 - index * 10; // 约 30-95，越高越好

          const niqe = clamp(niqeBase + (Math.random() * 2.4 - 1.2), 2, 12);
          const sseq = clamp(sseqBase + (Math.random() * 10 - 5), 30, 95);

          tmp.push({
            point: '监控点' + (i + 1),
            niqe: niqe.toFixed(2),
            sseq: Math.round(sseq)
          });
        }

        // 模拟延迟以展示加载效果
        await new Promise((r) => setTimeout(r, 500));

        this.tableData = tmp;
        // 将生成的结果写入全局 store，供图表读取保持一致
        this.$store.commit('setting/setMetricsData', tmp);
        this.loading = false;
      } catch (error) {
        console.error('模拟评估出错:', error);
        this.loading = false;
      }
    },
  },
  created() {
    // 初始化为第一个算法的模拟结果
    this.selectItem(0);
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
    right: 380px;
    width: 130px;
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
    width: 360px;

    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 16px rgba(0, 237, 237, 0.20);

      th,
      td {
        border: 1px solid rgba(0, 237, 237, 0.35);
        padding: 10px 8px;
        text-align: center;
        color: #d7ffff;
      }

      thead th {
        background: linear-gradient(180deg, rgba(0, 237, 237, 0.25), rgba(0, 123, 255, 0.25));
        color: #aefcff;
        letter-spacing: 2px;
      }

      tbody tr:nth-child(odd) {
        background: rgba(0, 237, 237, 0.08);
      }

      tbody tr:hover {
        background: rgba(0, 123, 255, 0.15);
        transition: background 0.2s ease-in-out;
      }
    }
  }
}
</style>

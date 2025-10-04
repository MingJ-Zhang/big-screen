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
            <th>分数</th>
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
import { uploadImage } from "api/modules";
import imageFile1 from "@/assets/images/011.png"
import imageFile2 from "@/assets/images/021.png"
import imageFile3 from "@/assets/images/031.png"
import imageFile4 from "@/assets/images/041.png"
import imageFile5 from "@/assets/images/051.png"
import imageFile6 from "@/assets/images/061.png"
import { loading } from "@jiaminghi/data-view";
export default {
  data() {
    return {
      loading:false,
      items: [
        { text: '无参考算法1', top: 10 },
        { text: '无参考算法2', top: 75 },
        { text: '无参考算法3', top: 140 },
        { text: '无参考算法4', top: 205 },
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
      this.activeIndex = index; // 设置当前点击的按钮为激活状态
      this.loading = true
      try {
        const formData = new FormData();

        // 将每个图片文件转换为 Blob 并添加到 FormData
        const images = [
          { file: imageFile1, name: '011.png' },
          { file: imageFile2, name: '021.png' },
          { file: imageFile3, name: '031.png' },
          { file: imageFile4, name: '041.png' },
          { file: imageFile5, name: '051.png' },
          { file: imageFile6, name: '061.png' },
        ];

        for (let i = 0; i < images.length; i++) {
          const response = await fetch(images[i].file);
          const blob = await response.blob();
          formData.append(`image${i + 1}`, blob, images[i].name);
        }

        // 发送 POST 请求到 Flask 后端
        const response = await uploadImage('/upload/'+ index, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data) {
          // alert('图片上传成功');
          
          let tmp = []
          for (let i = 0; i < response.results.length; i++){
            tmp.push({ point: '监控点' + (i + 1), score: response.results[i] })
          }
          console.log(tmp)
          this.tableData = tmp
          this.loading = false
        } else {
          alert('图片上传失败');
        }
      } catch (error) {
        console.error('上传图片出错:', error);
        alert('上传过程中发生错误');
      }
    },
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
      // background-color: #f5f5f5;
      // }
    }
  }
}
</style>

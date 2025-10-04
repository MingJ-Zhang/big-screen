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
import { flame,smoke } from "api/modules";
import imageFile1 from "@/assets/images/011.png"
import imageFile2 from "@/assets/images/021.png"
import imageFile3 from "@/assets/images/031.png"
import imageFile4 from "@/assets/images/041.png"
import imageFile5 from "@/assets/images/051.png"
import imageFile6 from "@/assets/images/061.png"
export default {
  data() {
    return {
      items: [
        { text: '火焰定位', top: 0 },
        { text: '烟气检测', top: 90 },
        { text: '停    止', top: 180 },
      ],
      tableDataSets: [
        [
          { point: '监控点1', score: '无' },
          { point: '监控点2', score: '有 (20%)' },
          { point: '监控点3', score: '无' },
          { point: '监控点4', score: '有 (80%)' },
          { point: '监控点5', score: '有 (80%)' },
          { point: '监控点6', score: '有 (60%)' },
        ],
      ],
      tableData: [],
      activeIndex: 2, // 修改为 0
      timer: null,
    };
  },
  methods: {
    async selectItem(index) {
      this.activeIndex = index;
      if (index === 0) {
        // this.$emit("detection", index)
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

          // 发送 POST 请求到 后端
          const response = await flame('/flame/' + index, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data) {
            this.$emit("detection", response.data)
          } else {
            alert('图片上传失败');
          }
        } catch (error) {
          console.error('上传图片出错:', error);
          alert('上传过程中发生错误');
        }
      } else if (index === 1) {
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
            const blob = await responsßße.blob();
            formData.append(`image${i + 1}`, blob, images[i].name);
          }

          // 发送 POST 请求到  后端
          const response = await flame('/smoke/' + index, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data) {
            this.$emit("detection", response.data)
          } else {
            alert('图片上传失败');
          }
        } catch (error) {
          console.error('上传图片出错:', error);
          alert('上传过程中发生错误');
        }
      } else {
        this.$emit("detectionStop", index)
      }
      // // 当点击“结束”按钮时，停止定时器
      // if (index === 2 || index === 0) {
      //   clearInterval(this.timer);
      // } else {
      //   // 点击“开始”按钮时，启动定时器
      //   this.startWarning();
      // }
    },
  },
  created() {
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

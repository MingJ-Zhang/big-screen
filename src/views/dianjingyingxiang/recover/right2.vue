<template>
    <div>
      <el-row class="right">
        <!-- 左侧列：原图展示 -->
        <el-col :span="12">
          <ItemWrap6 :key="1" class="right_item1" title="图像 1">
            <el-image :src="imageUrl1" fit="cover" class="img-display" />
          </ItemWrap6>
          <ItemWrap6 :key="2" class="right_item1" title="图像 2">
            <el-image :src="imageUrl2" fit="cover" class="img-display" />
          </ItemWrap6>
          <ItemWrap6 :key="3" class="right_item1" title="图像 3">
            <el-image :src="imageUrl3" fit="cover" class="img-display" />
          </ItemWrap6>
        </el-col>
  
        <!-- 右侧列：分数展示 -->
        <el-col :span="12">
          <ItemWrap8
            v-for="(item, index) in items"
            :key="item.id"
            class="right_item tech-item"
            :title="`图像 ${item.id}（得分）`"
          >
            <dv-loading v-if="loading">Loading...</dv-loading>
            <span v-else-if="!loading && pjres[index] == null">请先选择算法</span>
            <div v-else class="score-display">
              {{ pjres[index].toFixed(1) }}
            </div>
          </ItemWrap8>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import imageFile1 from '@/assets/dj/1.png';
  import imageFile2 from '@/assets/dj/2.png';
  import imageFile3 from '@/assets/dj/3.png';
  import { loading } from '@jiaminghi/data-view';
  
  export default {
    name: 'ImageScorePanel',
    props: {
      images: {
        type: Array,
        default: () => []
      },
      pjres:{
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        items: [
          { id: 1 },
          { id: 2 },
          { id: 3 }
        ],
        loading: false,
        // 固定得分（保留一位小数）
        scores: [10.1, 20.2, 21.3],
        imageUrl1: imageFile1,
        imageUrl2: imageFile2,
        imageUrl3: imageFile3
      };
    },
    methods: {
      startLoading() {
        this.images = [];
        this.loading = true;
      },
      endLoading() {
        this.loading = false;
      },
      getImage(index) {
        return this.images.length > index ? this.images[index] : null;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .right {
    margin-left: 40px;
    .right_item {
      margin-bottom: 20px;
      width: 540px;
      height: 310px;
      background: #0e0f12;
      border: 1px solid #1a1c23;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 150, 255, 0.2);
      overflow: hidden;
  
      .el-card__header {
        background: #11131a;
        color: #39f;
        font-weight: bold;
      }
    }
    .right_item1 {
      margin-bottom: 20px;
      width: 540px;
      height: 310px;
      // background: #0e0f12;
      border: 1px solid #1a1c23;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 150, 255, 0.2);
      overflow: hidden;
  
      .el-card__header {
        background: #11131a;
        color: #39f;
        font-weight: bold;
      }
    }
  
    .img-display {
      width: 510px;
      height: 255px;
      display: block;
      margin: 0 auto;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0, 150, 255, 0.3);
    }
  
    .tech-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .score-display {
      width: 510px;
      height: 255px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      color: #39f;
      background: linear-gradient(135deg, rgba(0,20,40,0.6), rgba(0,0,0,0.6));
      border-radius: 4px;
      text-shadow: 0 0 6px rgba(57, 255, 255, 0.8);
    }
  }
  </style>
  
<template>
  <div class="comparison-panel">
    <div class="panel-header">
      <div class="panel-title">
        <span class="title-icon">🔍</span>
        <span>效果对比</span>
      </div>
      <div class="comparison-stats">
        <div class="stat-item">
          <span class="stat-label">平均处理时间:</span>
          <span class="stat-value">{{ averageProcessingTime }}ms</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均PSNR:</span>
          <span class="stat-value">{{ averagePSNR }}dB</span>
        </div>
      </div>
    </div>
    
    <div class="comparison-grid">
      <div 
        v-for="(comparison, index) in comparisons" 
        :key="comparison.id"
        class="comparison-card"
        :class="{ 'processing': comparison.processing }"
      >
        <div class="card-header">
          <div class="comparison-title">{{ comparison.title }}</div>
          <div class="processing-indicator" v-if="comparison.processing">
            <div class="spinner"></div>
            <span>处理中...</span>
          </div>
        </div>
        
        <div class="comparison-content">
          <!-- 原始图像 -->
          <div class="image-section original">
            <div class="section-label">原始图像</div>
            <div class="image-container" @click="openPreview(comparison, 'original')">
              <img 
                v-if="comparison.originalImage" 
                :src="comparison.originalImage" 
                class="comparison-image"
                alt="原始图像"
              >
              <div v-else class="image-placeholder">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">原始图像</div>
              </div>
              <div class="image-overlay">
                <div class="overlay-text">点击查看</div>
              </div>
            </div>
          </div>
          
          <!-- 处理后图像 -->
          <div class="image-section processed">
            <div class="section-label">处理后</div>
            <div class="image-container" @click="openPreview(comparison, 'processed')">
              <img 
                v-if="comparison.processedImage" 
                :src="comparison.processedImage" 
                class="comparison-image"
                alt="处理后图像"
              >
              <div v-else class="image-placeholder processed">
                <div class="placeholder-icon">✨</div>
                <div class="placeholder-text">处理中...</div>
              </div>
              <div class="image-overlay">
                <div class="overlay-text">点击查看</div>
              </div>
            </div>
          </div>
          
          <!-- 细节对比 -->
          <div class="image-section detail">
            <div class="section-label">细节对比</div>
            <div class="image-container" @click="openPreview(comparison, 'detail')">
              <div class="detail-comparison">
                <div class="detail-left">
                  <img 
                    v-if="comparison.originalImage" 
                    :src="comparison.originalImage" 
                    class="detail-image"
                    alt="原始细节"
                  >
                  <div v-else class="detail-placeholder">原</div>
                </div>
                <div class="detail-divider"></div>
                <div class="detail-right">
                  <img 
                    v-if="comparison.processedImage" 
                    :src="comparison.processedImage" 
                    class="detail-image"
                    alt="处理细节"
                  >
                  <div v-else class="detail-placeholder processed">处</div>
                </div>
              </div>
              <div class="image-overlay">
                <div class="overlay-text">滑动对比</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="algorithm-info">
            <div class="info-item">
              <span class="info-label">算法:</span>
              <span class="info-value">{{ comparison.algorithm }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">处理时间:</span>
              <span class="info-value">{{ comparison.processingTime }}ms</span>
            </div>
          </div>
          
          <div class="quality-metrics">
            <div class="metric-item">
              <span class="metric-label">PSNR:</span>
              <span class="metric-value">{{ comparison.psnr }}dB</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">SSIM:</span>
              <span class="metric-value">{{ comparison.ssim }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 预览模态框 -->
    <div v-if="previewData" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <div class="preview-title">{{ previewData.title }}</div>
          <div class="preview-controls">
            <button 
              class="preview-btn" 
              @click="toggleComparisonMode"
              v-if="previewData.mode === 'detail'"
            >
              {{ comparisonMode === 'side' ? '滑动对比' : '并排对比' }}
            </button>
            <button class="close-btn" @click="closePreview">✕</button>
          </div>
        </div>
        
        <div class="preview-body">
          <!-- 单图预览 -->
          <div v-if="previewData.mode !== 'detail'" class="single-preview">
            <img 
              v-if="previewData.image" 
              :src="previewData.image" 
              class="preview-image"
              alt="预览图像"
            >
            <div v-else class="preview-placeholder">
              <div class="preview-placeholder-icon">🖼️</div>
              <div class="preview-placeholder-text">{{ previewData.placeholder }}</div>
            </div>
          </div>
          
          <!-- 细节对比预览 -->
          <div v-else-if="previewData.mode === 'detail'" class="detail-preview">
            <div v-if="comparisonMode === 'side'" class="side-by-side">
              <div class="side-image">
                <img 
                  v-if="previewData.originalImage" 
                  :src="previewData.originalImage" 
                  class="side-image-content"
                  alt="原始图像"
                >
                <div v-else class="side-placeholder">原始图像</div>
                <div class="side-label">原始</div>
              </div>
              <div class="side-image">
                <img 
                  v-if="previewData.processedImage" 
                  :src="previewData.processedImage" 
                  class="side-image-content"
                  alt="处理后图像"
                >
                <div v-else class="side-placeholder processed">处理后</div>
                <div class="side-label">处理后</div>
              </div>
            </div>
            
            <div v-else class="slider-comparison">
              <div class="slider-container">
                <img 
                  v-if="previewData.originalImage" 
                  :src="previewData.originalImage" 
                  class="slider-image"
                  alt="原始图像"
                >
                <div v-else class="slider-placeholder">原始图像</div>
                
                <div class="slider-overlay" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
                  <img 
                    v-if="previewData.processedImage" 
                    :src="previewData.processedImage" 
                    class="slider-image"
                    alt="处理后图像"
                  >
                  <div v-else class="slider-placeholder processed">处理后</div>
                </div>
                
                <div class="slider-handle" :style="{ left: sliderPosition + '%' }">
                  <div class="slider-line"></div>
                  <div class="slider-button"></div>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  v-model="sliderPosition"
                  class="slider-input"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComparisonPanel',
  props: {
    comparisons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      previewData: null,
      comparisonMode: 'side', // 'side' or 'slider'
      sliderPosition: 50
    };
  },
  computed: {
    averageProcessingTime() {
      if (!this.comparisons.length) return 0;
      const total = this.comparisons.reduce((sum, comp) => sum + comp.processingTime, 0);
      return Math.round(total / this.comparisons.length);
    },
    averagePSNR() {
      if (!this.comparisons.length) return 0;
      const total = this.comparisons.reduce((sum, comp) => sum + parseFloat(comp.psnr), 0);
      return (total / this.comparisons.length).toFixed(1);
    }
  },
  methods: {
    openPreview(comparison, mode) {
      this.previewData = {
        title: `${comparison.title} - ${this.getModeText(mode)}`,
        mode: mode,
        image: mode === 'original' ? comparison.originalImage : comparison.processedImage,
        originalImage: comparison.originalImage,
        processedImage: comparison.processedImage,
        placeholder: this.getPlaceholderText(mode)
      };
    },
    closePreview() {
      this.previewData = null;
    },
    toggleComparisonMode() {
      this.comparisonMode = this.comparisonMode === 'side' ? 'slider' : 'side';
    },
    getModeText(mode) {
      const modeMap = {
        'original': '原始图像',
        'processed': '处理后图像',
        'detail': '细节对比'
      };
      return modeMap[mode] || '预览';
    },
    getPlaceholderText(mode) {
      const placeholderMap = {
        'original': '原始图像占位符',
        'processed': '处理后图像占位符'
      };
      return placeholderMap[mode] || '图像占位符';
    }
  }
};
</script>

<style lang="scss" scoped>
.comparison-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  color: #d3d6dd;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
  
  .title-icon {
    font-size: 20px;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.comparison-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: #9b9b9b;
}

.stat-value {
  font-size: 12px;
  color: #00eaff;
  font-weight: bold;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
}

.comparison-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 234, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(0, 234, 255, 0.3);
    box-shadow: 0 0 20px rgba(0, 234, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.processing {
    border-color: rgba(255, 170, 0, 0.5);
    box-shadow: 0 0 20px rgba(255, 170, 0, 0.2);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);
}

.comparison-title {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
}

.processing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #ffaa00;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 170, 0, 0.3);
  border-top: 2px solid #ffaa00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.comparison-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 15px;
}

.image-section {
  position: relative;
}

.section-label {
  font-size: 11px;
  color: #9b9b9b;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 500;
}

.image-container {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 234, 255, 0.2);
  }
  
  &:hover .image-overlay {
    opacity: 1;
  }
}

.comparison-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  
  &.processed {
    background: linear-gradient(135deg, #2e1a2e 0%, #3e1621 100%);
  }
  
  .placeholder-icon {
    font-size: 24px;
    color: rgba(0, 234, 255, 0.3);
    margin-bottom: 5px;
  }
  
  .placeholder-text {
    font-size: 10px;
    color: rgba(0, 234, 255, 0.6);
    text-align: center;
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-text {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.detail-comparison {
  display: flex;
  height: 100%;
  position: relative;
}

.detail-left,
.detail-right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.detail-divider {
  width: 2px;
  background: rgba(0, 234, 255, 0.5);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-left: 6px solid rgba(0, 234, 255, 0.5);
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: rgba(0, 234, 255, 0.6);
  font-size: 14px;
  font-weight: bold;
  
  &.processed {
    background: linear-gradient(135deg, #2e1a2e 0%, #3e1621 100%);
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(0, 234, 255, 0.1);
}

.algorithm-info,
.quality-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item,
.metric-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
}

.info-label,
.metric-label {
  color: #9b9b9b;
}

.info-value,
.metric-value {
  color: #00eaff;
  font-weight: bold;
}

// 预览模态框
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.preview-content {
  width: 90%;
  height: 90%;
  background: rgba(15, 25, 45, 0.9);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 234, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 234, 255, 0.2);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.preview-title {
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-btn {
  background: rgba(0, 234, 255, 0.2);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 6px;
  padding: 8px 16px;
  color: #00eaff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 234, 255, 0.3);
    transform: translateY(-2px);
  }
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
}

.preview-body {
  height: calc(100% - 80px);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.single-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: rgba(0, 234, 255, 0.6);
}

.preview-placeholder-icon {
  font-size: 72px;
}

.preview-placeholder-text {
  font-size: 18px;
}

.detail-preview {
  width: 100%;
  height: 100%;
}

.side-by-side {
  display: flex;
  gap: 20px;
  height: 100%;
}

.side-image {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.side-image-content {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.side-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: rgba(0, 234, 255, 0.6);
  font-size: 16px;
  font-weight: bold;
  
  &.processed {
    background: linear-gradient(135deg, #2e1a2e 0%, #3e1621 100%);
  }
}

.side-label {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.slider-comparison {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 600px;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.slider-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: rgba(0, 234, 255, 0.6);
  font-size: 18px;
  font-weight: bold;
  
  &.processed {
    background: linear-gradient(135deg, #2e1a2e 0%, #3e1621 100%);
  }
}

.slider-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
}

.slider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #00eaff;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
}

.slider-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #00eaff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
  
  &::before {
    left: 12px;
    border-right: 8px solid #ffffff;
  }
  
  &::after {
    right: 12px;
    border-left: 8px solid #ffffff;
  }
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
}

// 滚动条样式
.comparison-grid::-webkit-scrollbar {
  width: 4px;
}

.comparison-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.comparison-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.3);
  border-radius: 2px;
  
  &:hover {
    background: rgba(0, 234, 255, 0.5);
  }
}
</style>
<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <span class="close-button" @click="$emit('close')">&times;</span>
      <h3>火焰识别</h3>
      <div class="image-container">
        <img :src="image" alt="Recognition Image" />
        <div v-if="loading" class="loading-spinner"></div>
      </div>
      <button @click="$emit('recognize')" :disabled="loading" class="recognize-button">
        {{ loading ? '识别中...' : '开始识别' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: linear-gradient(180deg, rgba(10, 40, 100, 0.9), rgba(10, 20, 50, 0.9));
  border: 1px solid #1890ff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 30px rgba(24, 144, 255, 0.7);
  width: 50vw;
  max-width: 800px;
  text-align: center;
  color: #fff;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}

.image-container {
  position: relative;
  margin: 20px 0;
}

.image-container img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 5px;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.recognize-button {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.recognize-button:hover:not(:disabled) {
  background-color: #40a9ff;
}

.recognize-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}
</style>
<template>
  <div class="key-data-object">
    <div class="data-item">
      <div class="icon-container">
        <i class="fas fa-building"></i>
      </div>
      <div class="data-text">
        <p>企业总数</p>
        <span>1,234</span>
      </div>
    </div>
    <div class="data-item">
      <div class="icon-container">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="data-text">
        <p>风险总数</p>
        <span>56</span>
      </div>
    </div>
    <div class="data-item">
      <div class="icon-container">
        <i class="fas fa-tools"></i>
      </div>
      <div class="data-text">
        <p>设备总数</p>
        <span>789</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyDataObject',
};
</script>

<style scoped>
.key-data-object {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  color: #fff;
}

.data-item {
  display: flex;
  align-items: center;
}

.icon-container {
  font-size: 24px;
  margin-right: 10px;
  color: #ff8c00;
}

.data-text p {
  margin: 0;
  font-size: 14px;
  color: #ccc;
}

.data-text span {
  font-size: 20px;
  font-weight: bold;
}
</style>
<template>
  <div class="op-buttons">
    <button @click="$emit('start')" :class="{ active: monitoring }">
      浓度监测
    </button>
    <button @click="$emit('stop')" :class="{ active: !monitoring }">
      停止
    </button>
  </div>
</template>

<script>
export default {
  props: {
    monitoring: Boolean,
  },
};
</script>

<style scoped>
.op-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px;
}
button {
  background: linear-gradient(90deg, #0f2241, #2a92d2, #0f2241);
  border: none;
  color: #e6f1ff;
  padding: 15px 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  border-radius: 8px;
  width: 80%;
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: all 0.4s ease;
}

button:hover::before {
  left: 100%;
}

button.active {
  background: linear-gradient(90deg, #2a92d2, #64ffda, #2a92d2);
  color: #0f2241;
  box-shadow: 0 0 20px #64ffda;
}
</style>
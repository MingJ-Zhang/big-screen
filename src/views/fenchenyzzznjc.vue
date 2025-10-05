<template>
  <ScaleScreen :width="1920" :height="1080" class="scale-wrap" :selfAdaption="$store.state.setting.isScale">
    
    <Setting ref="setting"/>
  </ScaleScreen>
</template>

<script>
import Setting from "./setting.vue";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";

export default {
  components: {
    Setting, 
    ScaleScreen, 

  },
  data() {
    return {
      
    };
  },
}
</script>

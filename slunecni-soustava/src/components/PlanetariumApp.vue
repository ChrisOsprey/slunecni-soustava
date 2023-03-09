<template>

<div>
  <canvas></canvas>
</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SlunecniSoustava } from '../BabylonSoubory/SlunecniSoustava/slunecni-soustava';

export default defineComponent({
  name: 'PlanetariumApp',
  mounted(){
    const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
    new SlunecniSoustava(canvas!);
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 100%;
  height: 100%;
  touch-action: none;

}
</style>

<template>
  <PlanetariumApp />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlanetariumApp from './components/PlanetariumApp.vue';

export default defineComponent({
  name: 'App',
  components: {
    PlanetariumApp
}
});
</script>

<style>
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>

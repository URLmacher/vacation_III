<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { assertNotNullOrUndefined } from '@/utils/assert'
  import { Game } from './game/game'

  const canvas = ref<HTMLCanvasElement | null>(null)
  const collisionCanvas = ref<HTMLCanvasElement | null>(null)
  let game: Game | null = null

  onMounted((): void => {
    assertNotNullOrUndefined(canvas.value, 'canvas cannot be null or undefined')
    assertNotNullOrUndefined(collisionCanvas.value, 'collisionCanvas cannot be null or undefined')
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    collisionCanvas.value.width = window.innerWidth
    collisionCanvas.value.height = window.innerHeight

    game = new Game(canvas.value, collisionCanvas.value)
  })

  const startGame = (): void => {
    game?.animate()
  }
</script>

<template>
  <div class="wrapper">
    <canvas class="canvas" ref="collisionCanvas"></canvas>
    <canvas class="canvas" ref="canvas"></canvas>
    <div class="menu">
      <button @click="startGame">Start</button>
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    height: 90%;
    width: 100%;
    /* background-color: blue; */
  }

  .menu {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
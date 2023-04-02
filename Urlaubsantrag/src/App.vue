<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { assertNotNullOrUndefined } from '@/utils/assert'
  import { Game } from './game/game'

  const canvas = ref<HTMLCanvasElement | null>(null)
  let game: Game | null = null
  let gameStarted = ref<boolean>(false)

  onMounted((): void => {
    assertNotNullOrUndefined(canvas.value, 'canvas cannot be null or undefined')
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight

    game = new Game(canvas.value)
  })

  const startGame = (): void => {
    gameStarted.value = true
    game?.start()
  }

  const stopGame = (): void => {
    gameStarted.value = false
    game?.stop()
  }
</script>

<template>
  <div class="wrapper">
    <canvas class="canvas" ref="canvas"></canvas>
    <div class="menu">
      <button v-if="!gameStarted" @click="startGame">Start</button>
      <button v-else @click="stopGame">Stop</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: url('./assets/images/crosshairs.png'), crosshair;
  }


  .menu {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    height: 10%;
    width: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

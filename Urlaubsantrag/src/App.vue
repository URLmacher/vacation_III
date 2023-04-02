<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { assertNotNullOrUndefined } from '@/utils/assert'
  import DialogOverlay from '@/components/DialogOverlay.vue'
  import { Game } from './game/game'
  import { texts } from './data/texts'

  const canvas = ref<HTMLCanvasElement | null>(null)
  const showMenu = ref<boolean>(true)
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
    showMenu.value = false
  }

  const stopGame = (): void => {
    gameStarted.value = false
    game?.stop()
  }
</script>

<template>
  <main class="vacation">
    <canvas
      class="vacation__canvas"
      :class="{ 'vacation__canvas--game-started': gameStarted }"
      ref="canvas"
    ></canvas>
    <DialogOverlay :open="showMenu">
      <h1 class="vacation__title">{{ texts.vacationTitle }}</h1>
      <h3 class="vacation__sub-title">{{ texts.vacationYear }}</h3>

      <button v-if="!gameStarted" @click="startGame">{{ texts.btnText }}</button>
      <button v-else @click="stopGame">Stop</button>
    </DialogOverlay>
  </main>
</template>

<style scoped lang="scss">
  .vacation {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background: url('./assets/images/BG.png');
    background-size: cover;

    &__canvas {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      &--game-started {
        cursor: url('./assets/images/crosshairs.png'), crosshair;
      }
    }

    &__title {
      color: var(--color-violet);
      background: -webkit-linear-gradient(var(--color-violet), var(--color-violet-alt));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &__sub-title {
      color: var(--color-blue);
      margin-bottom: 50px;
      font-size: 56px;
      animation: tilt-shaking 0.8s infinite;
    }
  }
</style>

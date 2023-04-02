<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { assertNotNullOrUndefined } from '@/utils/assert'
  import DialogOverlay from '@/components/DialogOverlay.vue'
  import FireWork from '@/components/FireWork.vue'
  import { Game, GAME_OVER } from './game/game'
  import { texts } from './data/texts'

  let game: Game | null = null
  const canvas = ref<HTMLCanvasElement | null>(null)
  const gameStarted = ref<boolean>(false)
  const newGamePlus = ref<boolean>(false)

  onMounted((): void => {
    assertNotNullOrUndefined(canvas.value, 'canvas cannot be null or undefined')
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight

    game = new Game(canvas.value)
    window.addEventListener(GAME_OVER, () => handleStopGame())
  })

  const startGame = (): void => {
    gameStarted.value = true
    game?.start()
  }

  const handleStopGame = (): void => {
    gameStarted.value = false
    newGamePlus.value = true
  }

  onBeforeUnmount((): void => {
    window.removeEventListener(GAME_OVER, () => handleStopGame())
    game?.stop()
  })
</script>

<template>
  <main class="vacation">
    <canvas
      class="vacation__canvas"
      :class="{ 'vacation__canvas--game-started': gameStarted }"
      ref="canvas"
    ></canvas>
    <DialogOverlay :open="!gameStarted">
      <h1 class="vacation__title">{{ texts.vacationTitle }}</h1>
      <h3 class="vacation__sub-title">{{ texts.vacationYear }}</h3>
      <div v-if="newGamePlus" class="vacation__confirmed">
        <FireWork />
        <p class="vacation__confirmed-text">{{ texts.allConfirmed }}</p>
      </div>
      <button @click="startGame">{{ newGamePlus ? texts.btnTextRoundTwo : texts.btnText }}</button>
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

    &__confirmed {
      height: 150px;
      width: 150px;
      border-radius: 50%;
      background-color: var(--color-green);
      border: 2px solid var(--color-text);
      position: absolute;
      left: 50%;
      top: -105px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    &__confirmed-text {
      color: var(--color-pink);
      font-size: 26px;
    }
  }
</style>

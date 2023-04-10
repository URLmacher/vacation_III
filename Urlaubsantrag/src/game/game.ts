import { Score } from './score'
import { Target } from './target'
import { Explosion } from './explosion'
import { dates } from '../data/dates'
import audioUrl from '../assets/audio/peng.mp3'

export const GAME_OVER = 'game-over'

export class Game {
  private ctx: CanvasRenderingContext2D | null
  private canvas: HTMLCanvasElement

  private targets: Target[] = []
  private explosions: Explosion[] = []
  private score: Score | null = null
  private sound: HTMLAudioElement
  private clickHandler = (e: MouseEvent) => this.handleClick(e)

  private maxTargets: number = dates.length
  private targetsLeft: number = this.maxTargets
  private lastAnimatonTime: number = 0
  private timeToNextAnimation: number = 0
  private animationInterval: number = 500
  private gameStarted: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.score = this.ctx ? new Score(this.ctx, this.maxTargets) : null
    this.sound = new Audio()
    this.sound.src = audioUrl
    this.sound.volume = 0.2
  }

  public start(): void {
    if (!this.ctx) return
    this.targets = []
    this.explosions = []
    this.targetsLeft = this.maxTargets
    this.gameStarted = true

    window.addEventListener('click', this.clickHandler)
    this.animate()
  }

  public stop(): void {
    this.score?.reset()
    this.gameStarted = false
    this.targets = []
    this.clearCanvas()
    window.removeEventListener('click', this.clickHandler)

    const event = new Event(GAME_OVER)
    window.dispatchEvent(event)
  }

  public animate(timestamp: number = 0): void {
    if (!this.ctx) return
    this.clearCanvas()

    const deltaTime = timestamp - this.lastAnimatonTime
    this.lastAnimatonTime = timestamp
    this.timeToNextAnimation += deltaTime

    if (this.timeToNextAnimation > this.animationInterval && this.targetsLeft) {
      this.targets.push(new Target(this.canvas, this.ctx, dates[this.targetsLeft - 1]))
      this.targetsLeft--
      this.timeToNextAnimation = 0
      this.targets.sort((a, b) => a.width - b.width)
    }
    this.score?.draw()
    const gameParts: (Target | Explosion)[] = [...this.targets, ...this.explosions]
    for (const part of gameParts) {
      part.update(deltaTime)
      part.draw()
    }

    this.targets = this.targets.filter((part) => !part.markedForDeletion)
    this.explosions = this.explosions.filter((part) => !part.markedForDeletion)

    if (this.score?.points === this.maxTargets) {
      this.stop()
    } else {
      requestAnimationFrame((timestamp: number) => this.animate(timestamp))
    }
  }

  private clearCanvas(): void {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private playSound(): void {
    if (!this.gameStarted) return
    if (this.sound.paused) {
      this.sound.play()
    } else {
      this.sound.pause()
      this.sound.currentTime = 0
      this.sound.play()
    }
  }

  private handleClick(e: MouseEvent): void {
    this.playSound()
    this.targets.forEach((part: Target) => {
      if (part.detectHit(e.x, e.y) && this.ctx) {
        this.score?.increment()
        this.explosions.push(new Explosion(this.ctx, part.x, part.y, part.width))
      }
    })
  }
}

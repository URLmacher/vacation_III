import { Score } from './score'
import { Target } from './target'
import { Explosion } from './explosion'

export const GAME_OVER = 'game-over'

export class Game {
  private ctx: CanvasRenderingContext2D | null
  private canvas: HTMLCanvasElement

  private targets: Target[] = []
  private explosions: Explosion[] = []
  private score: Score | null = null
  private clickHandler = (e: MouseEvent) => this.handleClick(e)

  private maxTargets: number = 10
  private targetsLeft: number = this.maxTargets
  private lastAnimatonTime: number = 0
  private timeToNextAnimation: number = 0
  private animationInterval: number = 500

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.score = this.ctx ? new Score(this.ctx) : null
  }

  public start(): void {
    if (!this.ctx) return
    this.targets = []
    this.explosions = []
    this.targetsLeft = this.maxTargets

    window.addEventListener('click', this.clickHandler)
    this.animate()
  }

  public stop(): void {
    this.score?.reset()
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
      this.targets.push(new Target(this.canvas, this.ctx))
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

  private handleClick(e: MouseEvent): void {
    this.targets.forEach((part: Target) => {
      if (part.detectHit(e.x, e.y) && this.ctx) {
        this.score?.increment()
        this.explosions.push(new Explosion(this.ctx, part.x, part.y, part.width))
      }
    })
  }
}

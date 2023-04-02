import { Score } from './score'
import { Target } from './target'
import { Explosion } from './explosion'

export class Game {
  private ctx: CanvasRenderingContext2D | null
  private canvas: HTMLCanvasElement

  private targetsLeft: number = 10
  private targets: Target[] = []
  private explosions: Explosion[] = []
  private score: Score | null = null
  private lastAnimatonTime: number = 0
  private timeToNextAnimation: number = 0
  private animationInterval: number = 500

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
  }

  public start(): void {
    if (!this.ctx) return
    this.score = new Score(this.ctx)
    this.targets = []
    this.explosions = []
    this.targetsLeft = 10

    window.addEventListener('click', (e) => this.handleClick(e))
    this.animate()
  }

  public stop(): void {
    this.score = null
    this.targets = []
    this.clearCanvas()
    window.removeEventListener('click', (e) => this.handleClick(e))
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
    if (this.score) {
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

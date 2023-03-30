import { Score } from './score'
import { Target } from './target'
import { Explosion } from './explosion'

export class Game {
  private ctx: CanvasRenderingContext2D | null
  private collisionCtx: CanvasRenderingContext2D | null
  private canvas: HTMLCanvasElement
  private collisionCanvas: HTMLCanvasElement

  private maxTargets: number = 10
  private targets: Target[] = []
  private explosions: Explosion[] = []
  private score: Score | null = null
  private lastAnimatonTime: number = 0
  private timeToNextAnimation: number = 0
  private animationInterval: number = 500

  constructor(canvas: HTMLCanvasElement, collisionCanvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.collisionCanvas = collisionCanvas
    this.ctx = this.canvas.getContext('2d')
    this.collisionCtx = collisionCanvas.getContext('2d')

    if (this.ctx) {
      this.score = new Score(this.ctx)
    }

    window.addEventListener('click', (e) => {
      const detectPixelColor = this.collisionCtx?.getImageData(e.x, e.y, 1, 1)
      const pc = detectPixelColor?.data
      this.targets.forEach((part: Target) => {
        if (
          part.randomColors[0] === pc?.[0] &&
          part.randomColors[1] === pc?.[1] &&
          part.randomColors[2] === pc?.[2] &&
          this.ctx
        ) {
          part.markedForDeletion = true
          this.score?.increment()
          this.explosions.push(new Explosion(this.ctx, part.x, part.y, part.width))
        }
      })
    })
  }

  public animate(timestamp: number = 0): void {
    if (!this.ctx || !this.collisionCtx) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.collisionCtx.clearRect(0, 0, this.collisionCanvas.width, this.collisionCanvas.height)

    const deltaTime = timestamp - this.lastAnimatonTime
    this.lastAnimatonTime = timestamp
    this.timeToNextAnimation += deltaTime

    if (this.timeToNextAnimation > this.animationInterval && this.maxTargets) {
      this.targets.push(new Target(this.canvas, this.ctx, this.collisionCtx))
      this.maxTargets--
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
    requestAnimationFrame((timestamp: number) => this.animate(timestamp))
  }
}

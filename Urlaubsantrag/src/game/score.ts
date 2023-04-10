import { texts } from '../data/texts'

export class Score {
  public points: number = 0
  private maxPoints: number
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D, maxPoints: number) {
    this.ctx = ctx
    this.ctx.font = '50px Jumpman-1m20'
    this.maxPoints = maxPoints
  }

  public draw(): void {
    const text = `${texts.confirmed} ${this.points}/${this.maxPoints}`
    this.ctx.fillStyle = '#9b5de5'
    this.ctx.fillText(text, 50, 75)
    this.ctx.fillStyle = '#00bbf9'
    this.ctx.fillText(text, 50, 72)
  }

  public increment(): void {
    this.points++
  }

  public reset(): void {
    this.points = 0
  }
}

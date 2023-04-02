export class Score {
  private ctx: CanvasRenderingContext2D
  private points: number = 0

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.ctx.font = '50px Jumpman-1m20'
  }

  public draw(): void {
    this.ctx.fillStyle = '#9b5de5'
    this.ctx.fillText(`Score: ${this.points}`, 50, 75)
    this.ctx.fillStyle = '#00bbf9'
    this.ctx.fillText(`Score: ${this.points}`, 50, 72)
  }

  public increment(): void {
    this.points++
  }
}

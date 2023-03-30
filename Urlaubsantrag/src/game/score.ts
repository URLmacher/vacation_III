export class Score {
  private ctx: CanvasRenderingContext2D
  private points: number = 0

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.ctx.font = '50px Impact'
  }

  public draw(): void {
    this.ctx.fillStyle = 'black'
    this.ctx.fillText(`Score: ${this.points}`, 50, 75)
    this.ctx.fillStyle = 'white'
    this.ctx.fillText(`Score: ${this.points}`, 55, 80)
  }

  public increment(): void {
    this.points++
  }
}

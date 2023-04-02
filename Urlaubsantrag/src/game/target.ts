import imgUrl from '../assets/sprites/target.png'

export class Target {
  public markedForDeletion: boolean = false
  public x: number = 0
  public y: number = 0
  public width: number = 270

  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  private height: number = 194
  private directionX: number = 0
  private directionY: number = 0

  private image: HTMLImageElement
  private spriteWidth: number = this.width
  private spriteHeight: number = this.height
  private frame: number = 0
  private maxFrame: number = 9
  private timeToNextAnimation: number = 0
  private animationInterval: number = Math.random() * 50 + 50

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) {
    this.ctx = ctx
    this.canvas = canvas
    this.x = this.canvas.width
    this.y = Math.random() * (this.canvas.height - this.height)
    this.directionX = Math.random() * 5 + 3
    this.directionY = Math.random() * 5 - 2.5

    this.image = new Image()
    this.image.src = imgUrl

    const sizeModifier = Math.random() * 0.6 + 0.4
    this.width = this.spriteWidth * sizeModifier
    this.height = this.spriteHeight * sizeModifier

  }

  public update(deltaTime: number): void {
    if (this.y < 0 || this.y > this.canvas.height - this.height) {
      this.directionY = this.directionY * -1
    }
    this.x -= this.directionX
    this.y += this.directionY
    if (this.x < 0 - this.width) {
      this.x = this.canvas.width
    }

    this.timeToNextAnimation += deltaTime
    if (this.timeToNextAnimation > this.animationInterval) {
      if (this.frame > this.maxFrame) {
        this.frame = 0
      } else {
        this.frame++
      }
      this.timeToNextAnimation = 0
    }
  }

  public draw(): void {
    this.ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  public detectHit(x: number, y: number): boolean {
    if (y > this.y && y < this.y + this.height && x > this.x && x < this.x + this.width) {
      this.markedForDeletion = true
      return true
    }
    return false
  }
}

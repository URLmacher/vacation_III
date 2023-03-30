import imgUrl from '../assets/sprites/raven.png'

export class Target {
  public markedForDeletion: boolean = false
  public x: number = 0
  public y: number = 0
  public width: number = 271
  public randomColors: number[]

  private ctx: CanvasRenderingContext2D
  private collisionCtx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  private height: number = 194
  private directionX: number = 0
  private directionY: number = 0

  private image: HTMLImageElement
  private spriteWidth: number = this.width
  private spriteHeight: number = this.height
  private frame: number = 0
  private maxFrame: number = 4
  private timeToNextAnimation: number = 0
  private animationInterval: number = Math.random() * 50 + 50
  private color: string

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    collisionCtx: CanvasRenderingContext2D
  ) {
    this.ctx = ctx
    this.collisionCtx = collisionCtx
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

    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ]
    this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`
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
    this.collisionCtx.fillStyle = this.color
    this.collisionCtx.fillRect(this.x, this.y, this.width, this.height)
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
}

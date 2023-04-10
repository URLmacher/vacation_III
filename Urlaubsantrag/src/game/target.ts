import { formatMonth, formatDate } from '@/utils/helpers'
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
  private date: string
  private frame: number = 0
  private maxFrame: number = 9
  private timeToNextAnimation: number = 0
  private animationInterval: number = Math.random() * 50 + 50

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, date: string) {
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
    this.date = date
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

    const monthShort = formatMonth(this.date).substring(0, 3)
    this.ctx.fillStyle = '#9b5de5'
    const textFontSize = Math.ceil(this.height / 4)
    this.ctx.font = `${textFontSize}px Jumpman-1m20`

    const monthShortWidth = this.ctx.measureText(monthShort).width
    const monthShortX = Math.round(this.x + (this.width / 2.2 - monthShortWidth / 2))
    const monthShortY = this.y + this.height / 2.8 + textFontSize
    this.ctx.fillText(monthShort, monthShortX, monthShortY, this.spriteWidth)

    this.ctx.fillStyle = '#00bbf9'
    const dateText = formatDate(this.date)
    const dateTextWidth = this.ctx.measureText(dateText).width
    const dateTextX = Math.round(this.x + (this.width / 2.2 - dateTextWidth / 2))
    const dateTextY = this.y + this.height / 2.7
    this.ctx.fillText(dateText, dateTextX, dateTextY, this.spriteWidth)
  }

  public detectHit(x: number, y: number): boolean {
    if (y > this.y && y < this.y + this.height && x > this.x && x < this.x + this.width) {
      this.markedForDeletion = true
      return true
    }
    return false
  }
}

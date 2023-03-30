import imgUrl from '../assets/sprites/boom.png'
import audioUrl from '../assets/audio/boom.wav'

export class Explosion {
  public markedForDeletion = false
  
  private ctx: CanvasRenderingContext2D
  private sound: HTMLAudioElement
  private image: HTMLImageElement
  private spriteWidth: number = 200
  private spriteHeight: number = 179
  private x: number
  private y: number
  private size: number
  private frame: number = 0
  private maxFrame: number = 5
  private timeToNextAnimation: number = 0
  private animationInterval: number = 200

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.size = size

    this.image = new Image()
    this.image.src = imgUrl
    this.sound = new Audio()
    this.sound.src = audioUrl
  }

  public update(deltatime: number): void {
    if (this.frame === 0) {
      this.sound.play()
    }

    this.timeToNextAnimation += deltatime
    if (this.timeToNextAnimation > this.animationInterval) {
      this.frame++
      this.timeToNextAnimation = 0
      if (this.frame > this.maxFrame) {
        this.markedForDeletion = true
      }
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
      this.y - this.size * 0.25,
      this.size,
      this.size
    )
  }
}

import { Sprite, Container, Texture } from "pixi.js";

export class Reel extends Container {
  private symbols: Sprite[] = [];
  private symbolHeight: number;
  private textures: Texture[];
  private speed: number = 20;
  private isSpinning: boolean = false;
  private positionShift: number = 0;

  constructor(textures: Texture[], symbolHeight: number = 150) {
    super();
    this.textures = textures;
    this.symbolHeight = symbolHeight;

    this.createSymbols();
  }

  private createSymbols() {
    for (let i = 0; i < 4; i++) {
      const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
      const symbol = Sprite.from(texture);
      symbol.y = i * this.symbolHeight;
      symbol.anchor.set(0.5);
      this.symbols.push(symbol);
      this.addChild(symbol);
    }
  }

  start() {
    this.isSpinning = true;
    this.speed = 40 + Math.random() * 10;
  }

  stop() {
    this.isSpinning = false;
  }

  update(delta: number) {
    if (!this.isSpinning) return;
    this.positionShift += this.speed * delta;

    if (this.positionShift >= this.symbolHeight) {
      this.positionShift = 0;
      const last = this.symbols.pop()!;
      last.texture = this.textures[Math.floor(Math.random() * this.textures.length)];
      last.y = -this.symbolHeight;
      this.symbols.unshift(last);
    }

    for (let i = 0; i < this.symbols.length; i++) {
      this.symbols[i].y = i * this.symbolHeight + this.positionShift;
    }
  }
}

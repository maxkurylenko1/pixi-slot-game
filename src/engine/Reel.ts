import { Sprite, Container, Texture } from "pixi.js";

export class Reel extends Container {
  private symbols: Sprite[] = [];
  private readonly textures: Texture[];
  private readonly symbolHeight: number = 150; // фиксированное расстояние между символами
  private speed = 6;
  private isSpinning = false;
  private positionShift = 0;

  constructor(textures: Texture[]) {
    super();
    this.textures = textures;
    this.createSymbols();
  }

  private createSymbols() {
    for (let i = 0; i < 3; i++) {
      const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
      const symbol = new Sprite(texture);
      symbol.anchor.set(0.5);
      symbol.scale.set(0.3);
      symbol.x = 0;
      symbol.y = i * this.symbolHeight;
      this.addChild(symbol);
      this.symbols.push(symbol);
    }
  }

  start() {
    this.isSpinning = true;
    this.positionShift = 0;
    this.speed = 6 + Math.random() * 2;
  }

  stop() {
    this.isSpinning = false;
  }

  update(delta: number) {
    if (isNaN(this.positionShift)) {
      console.error("❌ positionShift NaN", this.positionShift);
    }
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

    console.log({
      pos: this.symbols.map((s) => s.y.toFixed(1)),
      visible: this.symbols.map((s) => s.visible),
      parent: this.parent?.constructor.name,
      globalY: this.getGlobalPosition().y.toFixed(1),
    });
  }
}

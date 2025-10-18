import { Sprite, Container, Texture } from "pixi.js";

type ReelState = "idle" | "spinning" | "stopping";

export class Reel extends Container {
  private symbols: Sprite[] = [];
  private readonly textures: Texture[];
  private speed = 0;
  private acceleration = 0.6;
  private deceleration = 1.4;
  private maxSpeed = 45;
  private offset = 0;
  private state: ReelState = "idle";
  private symbolWidth: number;
  private symbolHeight: number;
  private visibleRows: number;
  private horizontalPadding: number; // НОВОЕ: отступ слева/справа от символа
  private verticalPadding: number; // НОВОЕ: отступ сверху/снизу от символа

  constructor(
    textures: Texture[],
    symbolWidth: number,
    symbolHeight: number,
    visibleRows: number,
    horizontalPadding: number = 0, // НОВОЕ: padding по горизонтали
    verticalPadding: number = 0 // НОВОЕ: padding по вертикали
  ) {
    super();
    this.textures = textures;
    this.symbolWidth = symbolWidth;
    this.symbolHeight = symbolHeight;
    this.horizontalPadding = horizontalPadding; // НОВОЕ
    this.verticalPadding = verticalPadding; // НОВОЕ
    this.visibleRows = visibleRows;
    this.createSymbols();
  }

  private createSymbols() {
    for (let i = 0; i < this.visibleRows + 1; i++) {
      const texture = this.getRandomTexture();
      const symbol = new Sprite(texture);

      // ИЗМЕНЕНО: размер символа теперь меньше на величину padding * 2
      symbol.width = this.symbolWidth - this.horizontalPadding * 2;
      symbol.height = this.symbolHeight - this.horizontalPadding * 2;

      // ИЗМЕНЕНО: центрируем символ с учётом padding
      symbol.x = this.horizontalPadding;
      symbol.y = i * this.symbolHeight + this.horizontalPadding;

      this.addChild(symbol);
      this.symbols.push(symbol);
    }
  }

  private getRandomTexture() {
    return this.textures[Math.floor(Math.random() * this.textures.length)];
  }

  start() {
    if (this.state === "spinning") return;
    this.state = "spinning";
    this.speed = this.symbolHeight * 0.4;
  }

  stop() {
    if (this.state !== "spinning") return;
    this.state = "stopping";
  }

  update(delta: number) {
    if (this.state === "idle") return;

    // Разгон
    if (this.state === "spinning" && this.speed < this.maxSpeed) {
      this.speed += this.acceleration * delta;
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    }

    // Замедление
    if (this.state === "stopping") {
      this.speed -= this.deceleration * delta;
      if (this.speed <= 0) {
        this.speed = 0;
        this.state = "idle";
        this.alignToGrid();
        return;
      }
    }

    // Двигаем символы
    this.offset += this.speed * delta;

    if (this.offset >= this.symbolHeight) {
      this.offset -= this.symbolHeight;
      const bottom = this.symbols.pop()!;
      bottom.texture = this.getRandomTexture();
      bottom.y = this.symbols[0].y - this.symbolHeight;
      this.symbols.unshift(bottom);
    }

    for (let i = 0; i < this.symbols.length; i++) {
      // ИЗМЕНЕНО: позиция по Y с учётом padding
      this.symbols[i].y =
        i * this.symbolHeight + this.offset - this.symbolHeight + this.horizontalPadding;
    }
  }

  private alignToGrid() {
    const offset = this.offset % this.symbolHeight;
    const correction = offset > this.symbolHeight / 2 ? this.symbolHeight - offset : -offset;
    this.offset += correction;

    for (let i = 0; i < this.symbols.length; i++) {
      this.symbols[i].y =
        i * this.symbolHeight + this.offset - this.symbolHeight + this.horizontalPadding;
    }
  }
}

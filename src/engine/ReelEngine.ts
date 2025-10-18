import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Reel } from "./Reel";

export class ReelEngine extends Container {
  private reels: Reel[] = [];
  private isSpinning = false;
  private isStopping = false;

  private readonly textures: Texture[];

  private symbolSize: number;
  private reelSpacing: number = 0; // ИЗМЕНЕНО: spacing в пикселях, а не ratio
  private horizontalPadding: number = 5;
  private verticalPadding: number = 0; // НОВОЕ: вертикальный padding

  private totalWidth: number;
  private totalHeight: number;

  private readonly reelCount: number;
  private readonly visibleRows: number;

  constructor(
    textures: Texture[],
    baseWidth: number,
    baseHeight: number,
    reelCount: number,
    visibleRows: number
  ) {
    super();

    this.reelCount = reelCount;
    this.visibleRows = visibleRows;

    // ИСПРАВЛЕНО: сначала вычисляем symbolSize БЕЗ spacing
    const maxSymbolWidth = baseWidth / this.reelCount;
    const maxSymbolHeight = baseHeight / (this.visibleRows + 1);
    this.symbolSize = Math.min(maxSymbolWidth, maxSymbolHeight);

    // ИСПРАВЛЕНО: теперь считаем правильные размеры
    this.totalWidth = this.reelCount * this.symbolSize + (this.reelCount - 1) * this.reelSpacing;
    this.totalHeight = this.visibleRows * this.symbolSize;

    const gameSize = document.createElement("div");
    gameSize.appendChild(
      document.createTextNode(
        `Game: width - ${this.totalWidth.toFixed(2)} / height - ${this.totalHeight.toFixed(2)}`
      )
    );
    gameSize.style.cssText =
      "position:fixed;top:100px;left:8px;color:white;background:#0006;padding:4px 8px;font-family:monospace;border-radius:4px";
    document.body.appendChild(gameSize);

    this.textures = textures;

    this.createReels();
  }

  private createReels() {
    // создаём маску
    const mask = new Graphics().rect(0, 0, this.totalWidth, this.totalHeight).fill(0xffffff);
    this.addChild(mask);
    this.mask = mask;

    // создаём каждый рил
    for (let i = 0; i < this.reelCount; i++) {
      const reel = new Reel(
        this.textures,
        this.symbolSize,
        this.symbolSize,
        this.visibleRows,
        this.horizontalPadding,
        this.verticalPadding
      );

      // ИСПРАВЛЕНО: позиция рила с учётом spacing
      reel.x = i * (this.symbolSize + this.reelSpacing);
      reel.y = 0;

      const bg = new Sprite(Assets.get("reelBg"));
      bg.width = this.symbolSize;
      bg.height = this.symbolSize * this.visibleRows;
      bg.x = 0;
      bg.y = 0;
      reel.addChildAt(bg, 0);

      this.reels.push(reel);
      this.addChild(reel);
    }
  }

  start() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.isStopping = false;

    this.reels.forEach((reel) => reel.start());
  }

  stop() {
    if (this.isStopping || !this.isSpinning) return;
    this.isStopping = true;

    this.reels.forEach((reel, i) => {
      setTimeout(() => {
        reel.stop();
        if (i === this.reels.length - 1) {
          this.isSpinning = false;
          this.isStopping = false;
        }
      }, i * 400);
    });
  }

  update(delta: number) {
    this.reels.forEach((reel) => reel.update(delta));
  }

  // Геттеры для правильных размеров
  getActualWidth(): number {
    return this.totalWidth;
  }

  getActualHeight(): number {
    return this.totalHeight;
  }

  getReelWidth(): number {
    return this.symbolSize;
  }

  getReelSpacing(): number {
    return this.reelSpacing;
  }

  // НОВОЕ: получить X-позицию конкретного рила
  getReelXPosition(reelIndex: number): number {
    return reelIndex * (this.symbolSize + this.reelSpacing);
  }
}

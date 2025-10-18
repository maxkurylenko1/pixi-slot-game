import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Reel } from "./Reel";

export class ReelEngine extends Container {
  private reels: Reel[] = [];
  private isSpinning = false;
  private isStopping = false;

  private readonly textures: Texture[];

  private symbolSize: number;
  private spacingRatio: number = 0;

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

    this.symbolSize = Math.min(
      baseWidth / (this.reelCount + this.spacingRatio * (this.reelCount - 1)),
      baseHeight / (this.visibleRows + 1)
    );

    this.totalWidth = this.reelCount * this.symbolSize + (this.reelCount - 1) * this.spacingRatio;
    this.totalHeight = this.visibleRows * this.symbolSize;

    const gameSize = document.createElement("div");
    gameSize.appendChild(
      document.createTextNode(`Game: width - ${this.totalWidth} / height - ${this.totalHeight}`)
    );
    gameSize.style.cssText =
      "position:fixed;top:100px;left:8px;color:white;background:#0006;padding:4px 8px;font-family:monospace;border-radius:4px";
    document.body.appendChild(gameSize);

    this.textures = textures;

    this.createReels();
  }

  private createReels() {
    const spacing = this.symbolSize * this.spacingRatio;

    // создаём маску
    const mask = new Graphics().rect(0, 0, this.totalWidth, this.totalHeight).fill(0xffffff);
    this.addChild(mask);
    this.mask = mask;

    // создаём каждый рил
    let reelDividerSpace = 1;
    for (let i = 0; i < this.reelCount; i++) {
      const reel = new Reel(this.textures, this.symbolSize, this.symbolSize, this.visibleRows);
      reel.width = this.symbolSize;
      reel.x = i * (this.symbolSize + spacing);
      reel.y = 0;

      const bg = new Sprite(Assets.get("reelBg"));
      bg.width = this.symbolSize; // залезает чуть за границу spacing
      bg.height = this.symbolSize * this.visibleRows;
      bg.x = 0; // чтобы визуально перекрыть щель
      bg.y = 0;
      reel.addChildAt(bg, 0); // под символами

      this.reels.push(reel);
      this.addChild(reel);

      if (i < this.reelCount - 1) {
        reelDividerSpace += 3;
      }
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
}

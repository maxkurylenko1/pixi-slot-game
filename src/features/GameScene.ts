import { Container, Assets, Sprite, Graphics, Text } from "pixi.js";
import { ReelEngine } from "../engine/ReelEngine";
import { EventBus } from "../app/EventBus";

export class GameScene extends Container {
  private bgLayer!: Container;
  private reelLayer!: Container;
  private uiLayer!: Container;
  private reels!: ReelEngine;
  private spinButton!: Graphics;
  private spinText!: Text;
  private isSpinning = false;
  private readonly reelCount = 5;
  private readonly visibleRows = 3;
  private readonly baseWidth = window.innerWidth;
  private readonly baseHeight = window.innerHeight - 100;

  constructor() {
    super();
    this.init();
  }

  async init() {
    // === LAYERS ===
    this.bgLayer = new Container();
    this.reelLayer = new Container();
    this.uiLayer = new Container();
    this.addChild(this.bgLayer, this.reelLayer, this.uiLayer);

    // === BACKGROUND ===
    const bg = new Sprite(Assets.get("bg"));
    bg.anchor.set(0.5);
    bg.x = window.innerWidth / 2;
    bg.y = window.innerHeight / 2;
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
    this.bgLayer.addChild(bg);

    // === TEXTURES ===
    const atlas = Assets.get("atlas");
    await atlas.parse();

    const textures = [
      atlas.textures["plum.png"],
      atlas.textures["seven.png"],
      atlas.textures["onion.png"],
      atlas.textures["orange.png"],
      atlas.textures["grape.png"],
      atlas.textures["cherry.png"],
      atlas.textures["banana.png"],
    ];

    // === REELS ===
    this.reels = new ReelEngine(
      textures,
      this.baseWidth,
      this.baseHeight,
      this.reelCount,
      this.visibleRows
    );
    this.reels.x = (window.innerWidth - this.reels.width) / 2;
    this.reels.y = (window.innerHeight - this.reels.height - 100) / 2;
    this.reelLayer.addChild(this.reels);

    // === BACKGROUND BORDER ===
    // ИЗМЕНЕНО: используем геттеры для получения реальных размеров
    const actualWidth = this.reels.getActualWidth();
    const actualHeight = this.reels.getActualHeight();

    const base = new Graphics()
      .rect(this.reels.x, this.reels.y, actualWidth, actualHeight)
      .stroke({ width: 5, color: 0xffcc33 });
    this.reelLayer.addChild(base);

    // === DIVIDERS ===
    // ИСПРАВЛЕНО: используем метод getReelXPosition для точного позиционирования
    for (let i = 1; i < this.reelCount; i++) {
      const xPos = this.reels.x + this.reels.getReelXPosition(i);

      const line = new Graphics()
        .moveTo(xPos, this.reels.y)
        .lineTo(xPos, this.reels.y + actualHeight)
        .stroke({ width: 4, color: 0xffd24c, alpha: 1 });
      this.reelLayer.addChild(line);
    }

    // === BUTTONS ===
    this.spinButton = new Graphics()
      .roundRect(0, 0, 160, 80, 20)
      .fill(0xffd24c)
      .stroke({ width: 4, color: 0x3b1c00 });
    this.spinButton.x = window.innerWidth / 2 - 80;
    this.spinButton.y = window.innerHeight / 2 + 220;

    this.spinText = new Text({
      text: "SPIN",
      style: { fill: 0x3b1c00, fontSize: 22, fontWeight: "bold" },
    });
    this.spinText.anchor.set(0.5);
    this.spinText.x = 80;
    this.spinText.y = 40;

    this.spinButton.addChild(this.spinText);
    this.uiLayer.addChild(this.spinButton);

    this.spinButton.eventMode = "static";
    this.spinButton.cursor = "pointer";
    this.spinButton.on("pointerdown", () => this.handleSpin());
    this.uiLayer.addChild(this.spinButton);

    // === EVENTS ===
    EventBus.on("spinStart", () => this.onSpinStart());
    EventBus.on("spinStop", () => this.onSpinStop());
  }

  private handleSpin() {
    if (this.isSpinning) {
      EventBus.emit("spinStop", undefined);
    } else {
      EventBus.emit("spinStart", undefined);
    }
  }

  private onSpinStart() {
    this.isSpinning = true;
    this.reels.start();

    this.spinText.text = "SPINNING...";
    this.spinButton.tint = 0xcccccc;
    this.spinButton.cursor = "not-allowed";
    setTimeout(() => {
      this.onSpinStop();
    }, 1000);
  }

  private onSpinStop() {
    this.reels.stop();
    setTimeout(() => {
      this.isSpinning = false;
      this.spinText.text = "SPIN";
      this.spinButton.tint = 0xffffff;
      this.spinButton.cursor = "pointer";
      this.spinText.scale.set(1);
      this.spinText.alpha = 1;
    }, 2500);
  }

  update(delta: number) {
    if (this.reels) this.reels.update(delta);
  }
}

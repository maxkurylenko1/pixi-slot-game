import { Container, Assets, Sprite, Graphics, Text } from "pixi.js";
import { ReelEngine } from "../engine/ReelEngine";
import { EventBus } from "../app/EventBus";

export class GameScene extends Container {
  private bgLayer!: Container;
  private reelLayer!: Container;
  private uiLayer!: Container;
  private reelsBox!: Container;

  private reels!: ReelEngine;
  private bg!: Sprite;

  constructor() {
    super();
    this.init();
  }

  async init() {
    this.bgLayer = new Container();
    this.reelLayer = new Container();
    this.reelsBox = new Container();
    this.uiLayer = new Container();

    this.addChild(this.bgLayer, this.reelLayer, this.reelsBox, this.uiLayer);

    this.bg = new Sprite(Assets.get("bg"));
    this.bg.anchor.set(0.5);
    this.bg.x = window.innerWidth / 2;
    this.bg.y = window.innerHeight / 2;
    this.bg.width = window.innerWidth;
    this.bg.height = window.innerHeight;
    this.bgLayer.addChild(this.bg);

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

    this.reels = new ReelEngine(textures);
    const g = new Graphics();
    this.reelsBox.addChild(g);
    this.reelLayer.addChild(this.reels);

    this.reels.x = window.innerWidth / 2 - (128 * 5) / 2.5;
    this.reels.y = window.innerHeight / 2 - 260;

    this.uiLayer.addChild(
      this.createButton("SPIN", window.innerWidth / 2 - 200, window.innerHeight / 2 + 250, () =>
        EventBus.emit("spinStart", undefined)
      )
    );
    this.uiLayer.addChild(
      this.createButton("STOP", window.innerWidth / 2 + 60, window.innerHeight / 2 + 250, () =>
        EventBus.emit("spinStop", undefined)
      )
    );

    EventBus.on("spinStart", () => this.reels.start());
    EventBus.on("spinStop", () => this.reels.stop());
  }

  createButton(label: string, x: number, y: number, onClick: () => void) {
    const btn = new Graphics().roundRect(0, 0, 150, 80, 20).fill(0x38e5e5).stroke({ width: 3 });
    const txt = new Text({ text: label, style: { fill: 0x000000, fontSize: 20 } });
    txt.anchor.set(0.5);
    txt.x = 75;
    txt.y = 40;
    btn.addChild(txt);

    btn.eventMode = "static"; // Pixi v8+
    btn.cursor = "pointer";
    btn.on("pointerdown", onClick);
    btn.x = x;
    btn.y = y;

    return btn;
  }

  update(delta: number) {
    if (this.reels) this.reels.update(delta);
  }
}

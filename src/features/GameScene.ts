import { Container, Graphics, Text } from "pixi.js";

export class GameScene extends Container {
  constructor() {
    super();
    const g = new Graphics()
      .rect(-100, -100, 200, 200)
      .fill(0x00ff99)
      .stroke({ width: 4, color: 0xffffff });
    this.addChild(g);

    const text = new Text("Game Scene", { fill: "white" });
    text.anchor.set(0.5);
    this.addChild(text);
  }
}

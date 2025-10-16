import { Container, Texture } from "pixi.js";
import { Reel } from "./Reel";

export class ReelEngine extends Container {
  private reels: Reel[] = [];
  private isSpinning: boolean = false;

  constructor(textures: Texture[]) {
    super();

    const spacing = 130;
    for (let i = 0; i < 5; i++) {
      const reel = new Reel(textures);
      reel.x = i * spacing;
      this.reels.push(reel);
      this.addChild(reel);
    }
  }

  start() {
    this.isSpinning = true;
    this.reels.forEach((reel) => reel.start());
    console.log("🎰 start", this.children.length, this.reels.length);
  }

  stop() {
    this.isSpinning = false;
    this.reels.forEach((reel) => reel.stop());
  }

  update(delta: number) {
    if (!this.isSpinning) return;
    this.reels.forEach((reel) => reel.update(delta));
  }
}

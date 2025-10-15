import { Container, Text } from "pixi.js";
import { SceneManager } from "../app/SceneManager";
import { loadAssets } from "../app/Loader";

export class BootScene extends Container {
  private sceneManager: SceneManager;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
    this.init();
  }

  async init() {
    const loadingText = new Text({ text: "Loading...", style: { fill: "white" } });
    loadingText.anchor.set(0.5);
    this.addChild(loadingText);

    await loadAssets();

    // через 1 сек переключаемся на GameScene
    setTimeout(() => {
      this.sceneManager.changeScene("GameScene");
    }, 1000);
  }
}

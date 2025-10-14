import { Container } from "pixi.js";
import { BootScene } from "../features/BootScene";
import { GameScene } from "../features/GameScene";

export type SceneName = "BootScene" | "GameScene";

export class SceneManager {
  private root: Container;
  private currentScene?: Container;

  constructor(root: Container) {
    this.root = root;
  }

  changeScene(sceneName: SceneName) {
    if (this.currentScene) {
      this.root.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true });
    }

    switch (sceneName) {
      case "BootScene":
        this.currentScene = new BootScene(this);
        break;
      case "GameScene":
        this.currentScene = new GameScene();
        break;
    }

    this.root.addChild(this.currentScene);
  }
}

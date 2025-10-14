import { Application, Container, Ticker } from "pixi.js";
import { SceneManager } from "./SceneManager";

export class AppShell {
  public app: Application;
  public root: Container;
  public sceneManager: SceneManager;

  constructor() {
    this.app = new Application();
    this.root = new Container();
    this.sceneManager = new SceneManager(this.root);

    // добавляем канвас в DOM
    document.body.appendChild(this.app.canvas);
    this.app.stage.addChild(this.root);

    // настройка канваса
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // FPS overlay
    this.addFPSCounter();

    // запускаем Boot сцену
    this.sceneManager.changeScene("BootScene");

    // запускаем тикер
    this.app.ticker.add(() => this.update());
  }

  private addFPSCounter() {
    const fpsEl = document.createElement("div");
    fpsEl.style.cssText =
      "position:fixed;top:8px;left:8px;color:white;background:#0006;padding:4px 8px;font-family:monospace;border-radius:4px";
    document.body.appendChild(fpsEl);

    this.app.ticker.add(() => {
      fpsEl.textContent = `${Math.round(Ticker.shared.FPS)} FPS`;
    });
  }

  private resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.app.renderer.resize(width, height);
    this.root.position.set(width / 2, height / 2);
  }

  private update() {
    // update logic if needed
  }
}

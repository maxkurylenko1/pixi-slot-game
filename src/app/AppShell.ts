import { Application, Container, Ticker } from "pixi.js";
import { SceneManager } from "./SceneManager";

export class AppShell {
  public app!: Application;
  public root!: Container;
  public sceneManager!: SceneManager;

  constructor() {
    this.init();
  }

  private async init() {
    // Инициализация приложения асинхронно
    this.app = new Application();

    await this.app.init({
      background: "#000000",
      resizeTo: window,
      antialias: true,
    });

    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.body.appendChild(this.app.canvas);

    this.root = new Container();
    this.app.stage.addChild(this.root);

    this.sceneManager = new SceneManager(this.root);

    this.addFPSCounter();

    window.addEventListener("resize", () => this.resize());
    this.resize();

    this.sceneManager.changeScene("BootScene");
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

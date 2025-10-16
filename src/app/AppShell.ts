import { Application, Container, Ticker } from "pixi.js";
import { SceneManager } from "./SceneManager";

export class AppShell {
  public app!: Application;
  public root!: Container;
  public sceneManager!: SceneManager;

  constructor() {
    this.start();
  }

  private async init() {
    this.app = new Application();

    await this.app.init({
      antialias: true,
      resolution: window.devicePixelRatio,
      backgroundColor: "0x000",
      // autoDensity: true,
    });

    this.app.start();

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
    this.update();

    console.log("✅ App initialized and ticker started");
  }

  private async start() {
    await this.init();
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

    // Устанавливаем логический размер сцены
    this.app.renderer.resize(width, height);

    // Подгоняем canvas к экрану (без автоDensity)
    const canvas = this.app.canvas;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    console.log("📐 resize:", width, height, "DPR:", window.devicePixelRatio);
  }

  private update() {
    this.app.ticker.add(({ deltaTime }) => {
      if (this.sceneManager.currentScene && "update" in this.sceneManager.currentScene) {
        (this.sceneManager.currentScene as any).update(deltaTime);
      }
    });
  }
}

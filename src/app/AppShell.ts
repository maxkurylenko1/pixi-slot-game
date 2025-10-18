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
    this.app = new Application();

    await this.app.init({
      antialias: true,
      resolution: window.devicePixelRatio,
      resizeTo: window,
      backgroundColor: "0x000",
      autoDensity: true,
    });

    this.app.start();

    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.body.appendChild(this.app.canvas);

    this.root = new Container();
    this.app.stage.addChild(this.root);

    this.sceneManager = new SceneManager(this.root);

    this.addFPSCounter();

    // window.addEventListener("resize", () => this.resize());
    // this.resize();

    this.sceneManager.changeScene("BootScene");
    this.update();

    console.log("✅ App initialized and ticker started");
  }

  private addFPSCounter() {
    const fpsEl = document.createElement("div");
    fpsEl.style.cssText =
      "position:fixed;top:8px;left:8px;color:white;background:#0006;padding:4px 8px;font-family:monospace;border-radius:4px";
    const windowSize = document.createElement("div");
    windowSize.appendChild(
      document.createTextNode(
        `Window: width - ${window.innerWidth} / height - ${window.innerHeight}`
      )
    );
    windowSize.style.cssText =
      "position:fixed;top:50px;left:8px;color:white;background:#0006;padding:4px 8px;font-family:monospace;border-radius:4px";
    document.body.appendChild(fpsEl);
    document.body.appendChild(windowSize);

    this.app.ticker.add(() => {
      fpsEl.textContent = `${Math.round(Ticker.shared.FPS)} FPS`;
    });
  }

  private update() {
    this.app.ticker.add(({ deltaTime }) => {
      if (this.sceneManager.currentScene && "update" in this.sceneManager.currentScene) {
        (this.sceneManager.currentScene as any).update(deltaTime);
      }
    });
  }
}

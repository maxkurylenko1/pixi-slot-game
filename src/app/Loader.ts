import { Assets } from "pixi.js";

export async function loadAssets() {
  const manifest = {
    bundles: [
      {
        name: "core",
        assets: {
          symbol1: "assets/symbols/symbol1.png",
          bg: "assets/ui/bg.jpg",
        },
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle("core");
}

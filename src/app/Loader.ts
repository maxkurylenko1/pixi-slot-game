import { Assets } from "pixi.js";

export async function loadAssets() {
  const manifest = {
    bundles: [
      {
        name: "core",
        assets: [
          {
            alias: "atlas",
            src: "/assets/symbols/fruits.json",
          },
          {
            alias: "bg",
            src: "/assets/ui/bg.png",
          },
          {
            alias: "reelBg",
            src: "/assets/ui/reelBg.png",
          },
        ],
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle("core");
}

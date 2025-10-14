import banana from "../assets/symbols/banana.png";
import bg from "../assets/ui/bg.jpg";
import { Assets } from "pixi.js";

export async function loadAssets() {
  const manifest = {
    bundles: [
      {
        name: "core",
        assets: {
          banana,
          bg,
        },
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle("core");
}

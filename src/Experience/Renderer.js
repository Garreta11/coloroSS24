import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass.js";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();

    let pixelRatio = window.devicePixelRatio;
    this.AA = true;
    if (pixelRatio > 1) {
      this.AA = false;
    }
  }

  setInstance() {
    this.instance = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio * 0.7);
    this.instance.outputEncoding = THREE.sRGBEncoding;
    // this.instance.shadowMap.enabled = true;
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio * 0.7);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}

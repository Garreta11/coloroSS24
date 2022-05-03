import * as THREE from "three";

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Sounds from "./World/Sounds";
import Physics from "./World/Physics";
import Resources from "./Utils/Resources";
import Debug from "./Utils/Debug";
import sources from "./sources";
import Mouse from "./Utils/Mouse";
import StatsShow from "./Utils/Stats";
import Scroll from "./Utils/Scroll";
import GlobalFunctions from "./Utils/GlobalFunctions";

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;
    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.globalFunctions = new GlobalFunctions();
    // this.stats = new StatsShow();
    this.sizes = new Sizes();
    this.mouse = new Mouse();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#FFFFFF");

    this.camera = new Camera();
    this.resources = new Resources(sources);

    this.renderer = new Renderer();
    this.physics = new Physics();
    this.world = new World();

    this.sounds = new Sounds();
    this.scroll = new Scroll();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}

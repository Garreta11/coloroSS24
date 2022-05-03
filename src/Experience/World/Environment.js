import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.world = this.experience.world;
    this.mouse = this.experience.mouse;
    this.global = this.experience.globalFunctions;

    this.mouseCoords = new THREE.Vector2();

    // Setup
    this.setAmbientLight();
    this.setDirectionalLight();
    this.setPointLightRed();
    this.setPointLightBlue();
    this.setPointLightBlue1();
    this.setPointLightBlue2();
    this.setPointLightBlue3();
    this.setPointLightNutshell();

    this.mouse.on("mouseMove", () => {
      this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
      this.movePointLightNutshell();
    });
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.visible = true;
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.normalBias = 1;
    this.directionalLight.position.set(0, 0, 0);

    let t = new THREE.Object3D();
    t.translateX(0);
    t.translateY(0);
    t.translateZ(-20);
    this.directionalLight.target = t;

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);
  }

  setPointLightRed() {
    this.pointLightRed = new THREE.PointLight(0xffffff, 0.1, 0);
    this.pointLightRed.position.set(13.2, 2, 0);
    this.pointLightRed.castShadow = true;
    this.pointLightRed.shadow.darkness = 0.5;
    this.pointLightRed.shadow.camera.vsible = true;
    this.scene.add(this.pointLightRed);
  }

  setPointLightBlue() {
    this.pointLightBlue = new THREE.PointLight(0xffffff, 0, 0);
    this.pointLightBlue.position.set(5.4, -5, 10);
    this.pointLightBlue.castShadow = true;
    this.pointLightBlue.shadow.darkness = 1;
    this.scene.add(this.pointLightBlue);
  }

  setPointLightBlue1() {
    this.pointLightBlue1 = new THREE.PointLight(0xffffff, 0.1, 0);
    this.pointLightBlue1.position.set(0, -10, 0);
    this.pointLightBlue1.castShadow = true;
    this.pointLightBlue1.shadow.darkness = 1;
    this.scene.add(this.pointLightBlue1);
  }

  setPointLightBlue2() {
    this.pointLightBlue2 = new THREE.PointLight(0xffffff, 0.1, 0);
    this.pointLightBlue2.position.set(2, -10, 0);
    this.pointLightBlue2.castShadow = true;
    this.pointLightBlue2.shadow.darkness = 1;
    this.scene.add(this.pointLightBlue2);
  }

  setPointLightBlue3() {
    this.pointLightBlue3 = new THREE.PointLight(0xffffff, 0.01, 0);
    this.pointLightBlue3.position.set(1.61, -11, 0);
    this.pointLightBlue3.castShadow = true;
    this.pointLightBlue3.shadow.darkness = 1;
    this.scene.add(this.pointLightBlue3);
  }

  setPointLightNutshell() {
    this.pointLightNutshell = new THREE.PointLight(0x8d5234, 0, 0);
    this.pointLightNutshell.position.set(1.8, -11, -40);
    this.pointLightNutshell.shadow.mapSize.set(2048, 2048);
    this.pointLightNutshell.castShadow = true;
    this.pointLightNutshell.shadow.darkness = 5;
    this.pointLightNutshell.shadow.camera.visible = false;
    this.scene.add(this.pointLightNutshell);
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.0;
    this.environmentMap.texture = this.resources.items.blueCeilingEnvMap;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
    // this.scene.environment = this.environmentMap.texture;
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);
  }

  movePointLightNutshell() {
    var posX = this.global.map(this.mouseCoords.x, -1, 1, -2, 5.6);
    var posZ = this.global.map(this.mouseCoords.y, -1, 1, -40, -51);

    this.pointLightNutshell.position.x = posX;
    this.pointLightNutshell.position.z = posZ;
  }
}

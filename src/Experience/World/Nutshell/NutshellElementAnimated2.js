import * as THREE from "three";
import gsap from "gsap";
import Experience from "../../Experience";

import EventEmitter from "../../Utils/EventEmitter";

export default class NutshellElementAnimated2 extends EventEmitter {
  constructor(model, pos, size, rotation) {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.mouse = this.experience.mouse;
    this.global = this.experience.globalFunctions;
    this.pos = pos;
    this.size = size;
    this.rotation = rotation;
    this.resource = model;

    this.mouseCoords = new THREE.Vector2();

    this.oldAnimationMixerTime = -1;

    this.setModel();
    this.setAnimation();

    this.mouse.on("mouseMove", () => {
      this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
      this.moveAnimation();
      this.trigger("nutshellmove");
    });
  }
  setModel() {
    this.model = this.resource;

    this.model.scale.set(this.size.x, this.size.y, this.size.z);
    this.model.position.x = this.pos.x;
    this.model.position.y = this.pos.y;
    this.model.position.z = this.pos.z;

    this.model.rotation.x = this.rotation.x;
    this.model.rotation.y = this.rotation.y;
    this.model.rotation.z = this.rotation.z;

    this.scene.add(this.model);

    this.model.visible = false;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.side = THREE.DoubleSide;
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#1f0b05"),
          emissive: new THREE.Color("#000000"),
          roughness: 1.0,
          metalness: 0.0,
          side: THREE.DoubleSide,
        });
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.resource);
    this.animation.action = this.animation.mixer.clipAction(
      this.model.animations[0]
    );
    this.animation.action.play();
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);
  }

  moveAnimation() {
    var inc = this.global.map(this.mouseCoords.x, -1, 1, 0, 3);

    gsap.to(this.animation.mixer, { time: inc, duration: 1 });
  }

  update() {
    this.animation.mixer.setTime(this.animation.mixer.time);

    if (this.oldAnimationMixerTime == this.animation.mixer.time) {
      this.trigger("nutshellstop");
    }

    this.oldAnimationMixerTime = this.animation.mixer.time;
  }
}

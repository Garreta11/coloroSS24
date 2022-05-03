import * as THREE from "three";
import gsap from "gsap";
import Experience from "../../Experience";

export default class RedSphereStatic {
  constructor(model, size, pos) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.mouse = this.experience.mouse;
    this.time = this.experience.time;
    this.global = this.experience.globalFunctions;

    this.pos = pos;
    this.size = size;

    this.resource = model;

    this.mouseCoords = new THREE.Vector2();

    this.randMove = Math.random() * (0.05 + 0.02) - 0.02;
    this.randMoveVertical = Math.random() * 100;
    this.randRotation = this.global.map(Math.random(), 0, 1, -0.01, 0.01);

    this.setModel();

    this.mouse.on("mouseMove", () => {
      this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
      this.mouseMove();
    });
  }

  setModel() {
    this.model = this.resource;

    this.model.scale.set(this.size.x, this.size.y, this.size.z);

    this.model.position.x = this.pos.x;
    this.model.position.y = this.pos.y;
    this.model.position.z = this.pos.z;

    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#920707"),
          emissive: new THREE.Color("#590303"),
          transmission: 0.65,
          roughness: 0.312,
          metalness: 0.0,
          reflectivity: 0.5,
        });
      }
    });
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);
  }

  mouseMove() {
    var posX = this.global.map(
      this.mouseCoords.x,
      -1,
      1,
      this.pos.x - this.randMove,
      this.pos.x + this.randMove
    );

    gsap.to(this.model.position, {
      x: posX,
      duration: 1,
    });
  }

  update() {
    this.model.position.y +=
      -Math.sin(this.time.elapsed / 600 + this.randMoveVertical) * 0.0003 +
      Math.sin(this.time.elapsed / 400 + this.randMoveVertical) * 0.00001;

    this.model.rotation.y += this.randRotation;
  }
}

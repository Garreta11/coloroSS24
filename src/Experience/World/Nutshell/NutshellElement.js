import * as THREE from "three";
import Experience from "../../Experience";

export default class NutshellElement {
  constructor(model, pos, size, rotation) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.pos = pos;
    this.size = size;
    this.rotation = rotation;

    this.resource = model;

    this.setModel();
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
}

import * as THREE from "three";
import Experience from "../../Experience";

export default class LimeElement {
  constructor(model, size, pos, text) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.mouse = this.experience.mouse;
    this.time = this.experience.time;
    this.global = this.experience.globalFunctions;

    this.resource = model;

    this.size = size;
    this.pos = pos;

    this.text = text;

    if (this.text != null) this.setTexture();
    this.setModel();
  }

  setTexture() {
    this.textures = {};
    this.textures.color = this.text;
    this.textures.color.encoding = THREE.sRGBEncoding;
  }

  setModel() {
    this.model = this.resource;

    this.model.scale.set(this.size.x, this.size.y, this.size.z);
    this.model.position.x = this.pos.x;
    this.model.position.y = this.pos.y;
    this.model.position.z = this.pos.z;

    this.model.visible = true;

    this.scene.add(this.model);

    if (this.text != null) {
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            roughness: 0.0,
            metalness: 0.0,
          });
        }
      });
    } else {
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#964f2f"),
            emissive: new THREE.Color("#000000"),
            roughness: 0.312,
            metalness: 0.0,
          });
        }
      });
    }
  }

  update() {
    this.model.rotation.z += 0.01;
  }
}

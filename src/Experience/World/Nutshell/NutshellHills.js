import * as THREE from "three";
import Experience from "../../Experience";

export default class NutshellHills {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.nutshellHills;

    this.setTextures();
    this.setModel();
  }

  setTextures() {
    this.textures = {};
    this.textures.color = this.resources.items.nutshellmap;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.minFilter = THREE.LinearFilter;
    this.textures.color.maxFilter = THREE.LinearFilter;
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;
  }

  setModel() {
    this.model = this.resource;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.position.x = 0;
    this.model.position.y = -13.5;
    this.model.position.z = -51;
    this.model.rotateY(THREE.MathUtils.degToRad(-90));
    this.scene.add(this.model);
    this.model.visible = false;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: this.textures.color,
          metalness: 0,
          roughness: 1.0,
        });
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }
}

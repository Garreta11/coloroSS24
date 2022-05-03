import * as THREE from "three";
import Experience from "../../Experience";

export default class BlueCeiling {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.blueCeiling;

    this.setTextures();
    this.setModel();
  }

  setTextures() {
    this.textures = {};
    this.textures.envmap = this.resources.items.blucDoorEnvMap;
    this.textures.envmap.encoding = THREE.sRGBEncoding;
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.rotateY(THREE.MathUtils.degToRad(-45));
    this.model.visible = true;
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.side = THREE.DoubleSide;
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#FFFFFF"),
          emissive: new THREE.Color("#000000"),
          envMap: this.textures.envmap,
          roughness: 0,
          metalness: 1.0,
        });
      }
    });
  }
}

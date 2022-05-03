import * as THREE from "three";
import Experience from "../../Experience";

export default class LimeScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.limeScene;

    this.setTextures();
    this.setModel();
  }

  setTextures() {
    this.textures = {};
    this.textures.envmap = this.resources.items.limeSceneEnvMap;
    this.textures.envmap.encoding = THREE.sRGBEncoding;
    this.textures.envmap.minFilter = THREE.LinearFilter;
    this.textures.envmap.maxFilter = THREE.LinearFilter;
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.visible = true;
    this.model.rotateY(THREE.MathUtils.degToRad(-45));
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.side = THREE.DoubleSide;
        child.material = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          color: new THREE.Color("#FFFFFF"),
          envMap: this.textures.envmap,
          emissive: new THREE.Color("#000000"),
          roughness: 0.0,
          metalness: 1.0,
        });
        child.material.needsUpdate = true;
      }
    });
  }
}

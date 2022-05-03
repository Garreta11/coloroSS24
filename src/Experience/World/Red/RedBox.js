import * as THREE from "three";
import Experience from "../../Experience";

export default class RedBox {
  constructor(sources) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.redBox;

    this.setModel();
  }

  setModel() {
    // this.model = this.resource.scene;
    this.model = this.resource;
    this.model.scale.set(0.0015, 0.0015, 0.0015);
    this.model.position.x = 13.3;
    this.model.position.y = 1;
    this.model.position.z = 0.8;
    this.model.rotateY(THREE.MathUtils.degToRad(-90));
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#920707",
          emissive: "#590303",
          metalness: 0,
          roughness: 0.312,
        });
      }
    });
  }

  update() {
    this.animation.mixer.update(this.time.delta);
  }
}

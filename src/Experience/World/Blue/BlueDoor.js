import * as THREE from "three";
import Experience from "../../Experience";

export default class BlueDoor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.resource = this.resources.items.blueDoor;

    this.setTextures();
    this.setModel();
    this.setAnimation();
  }

  setTextures() {
    this.textures = {};
    this.textures.envmap = this.resources.items.blucDoorEnvMap;
    this.textures.envmap.encoding = THREE.sRGBEncoding;
  }

  setModel() {
    this.model = this.resource;

    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.rotateY(THREE.MathUtils.degToRad(-45));
    this.model.position.x = 0;
    this.model.position.y = 1;
    this.model.position.z = 0;

    this.model.visible = true;

    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
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

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(
      this.model.animations[0]
    );
    this.animation.action.play();
  }

  update() {
    // this.animation.mixer.update(this.time.elapsed / 1000);
    this.animation.mixer.setTime(this.animation.mixer.time);
  }
}

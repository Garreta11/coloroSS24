import * as THREE from "three";
import Experience from "../../Experience";

export default class BlueBox {
  constructor(sources) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Setup
    this.resource = this.resources.items.blueBox;

    this.setTextures();
    this.setModel();
  }

  setTextures() {
    this.textures = {};
    this.textures.color = this.resources.items.colormapBlue;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.rotateY(THREE.MathUtils.degToRad(-45));
    this.model.visible = true;
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          map: this.textures.color,
          roughness: 1,
        });
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.action.play();
  }
}

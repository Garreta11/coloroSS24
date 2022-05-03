import * as THREE from "three";
import Experience from "../../Experience";

import EventEmitter from "../../Utils/EventEmitter";

import vertexLime from "../../../shaders/lime/vertex.glsl";
import fragmentLime from "../../../shaders/lime/fragment.glsl";

export default class LimeSphere extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.mouse = this.experience.mouse;
    this.time = this.experience.time;

    this.mouseCoords = new THREE.Vector2(0, 0);

    this.contactSphere = false;
    this.oldContactSphere = true;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();

    this.createRaycaster();
    this.setRaycastMesh();

    this.mouse.on("mouseMove", (event) => {
      this.setMouse();
    });
  }

  setGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
  }

  setTextures() {
    this.textures = {};
    this.textures.matcap = this.resources.items.limeMatcap1;
    this.textures.matcap1 = this.resources.items.limeMatcap;
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMatcap: { value: this.textures.matcap },
        uMatcap1: { value: this.textures.matcap1 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        resolution: { value: new THREE.Vector4() },
      },
      transparent: true,
      vertexShader: vertexLime,
      fragmentShader: fragmentLime,
    });

    this.imageAspect = 1;
    let a1, a2;
    if (this.sizes.height / this.sizes.width > this.imageAspect) {
      a1 = (this.sizes.width / this.sizes.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (this.sizes.height / this.sizes.width) * this.imageAspect;
    }

    this.material.uniforms.resolution.x = this.sizes.width;
    this.material.uniforms.resolution.y = this.sizes.height;
    this.material.uniforms.resolution.z = a1;
    this.material.uniforms.resolution.w = a2;
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateY(THREE.MathUtils.degToRad(40));
    this.mesh.scale.set(0.3, 0.3, 0.3);
    this.mesh.position.x = 6.9;
    this.mesh.position.y = 1;
    this.mesh.position.z = 8.2;
    this.mesh.visible = true;
    this.scene.add(this.mesh);
  }

  createRaycaster() {
    this.raycaster = new THREE.Raycaster();
  }

  setRaycastMesh() {
    this.geometryRay = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    this.meshRay = new THREE.Mesh(
      this.geometryRay,
      new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false })
    );

    this.meshRay.position.x = 6.9;
    this.meshRay.position.y = 1;
    this.meshRay.position.z = 8.2;
    this.meshRay.scale.x = 0.3;
    this.meshRay.scale.y = 0.3;
    this.meshRay.scale.z = 0.3;
    this.scene.add(this.meshRay);
  }

  setMouse() {
    this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);

    this.raycaster.setFromCamera(this.mouseCoords, this.camera.instance);
    const intersect = this.raycaster.intersectObject(this.meshRay);
    if (intersect.length) {
      this.material.uniforms.uMouse.value = this.mouseCoords;
      if (this.mouseCoords.x > -0.25 && this.mouseCoords.x < 0.25) {
        if (this.mouseCoords.y > -0.25 && this.mouseCoords.y < 0.25) {
          this.contactSphere = true;
          this.trigger("limemove");
        } else {
          this.contactSphere = false;
          this.trigger("limeleave");
        }
      } else {
        this.contactSphere = false;
        this.trigger("limeleave");
      }

      if (this.oldContactSphere != this.contactSphere) {
        if (this.contactSphere === true) {
          document.getElementById("prompts").style.opacity = 0;
          this.trigger("limemerge");
        } else {
          document.getElementById("prompts").style.opacity = 0;
          this.trigger("limeunmerge");
        }
      }

      this.oldContactSphere = this.contactSphere;
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed;
  }
}

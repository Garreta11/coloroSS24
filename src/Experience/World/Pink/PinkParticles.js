import * as THREE from "three";
import gsap from "gsap";
import Experience from "../../Experience";

export default class PinkParticles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.global = this.experience.globalFunctions;
    this.mouse = this.experience.mouse;

    this.mouseCoords = new THREE.Vector2();

    this.NUM_PARTICLES = 32;

    this.pinkparticles = [];
    this.pinkparticlesX = [];
    this.pinkparticlesY = [];
    this.pinkparticleRandMove = [];

    this.pinkpearlsNoBlur = [1, 9, 25];
    this.pinkpearlsBlur = [
      2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 26, 27, 28,
    ];
    this.pinkpearlsLotBlur = [29, 30, 31, 32];

    for (var i = 1; i <= this.NUM_PARTICLES; i++) {
      this.resources.items["particle" + i].encoding = THREE.sRGBEncoding;
      if (this.pinkpearlsNoBlur.includes(i)) {
        this.geometry = new THREE.PlaneGeometry(0.01, 0.01);
        this.material = new THREE.MeshStandardMaterial({
          map: this.resources.items["particle" + i],
          transparent: true,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // this.mesh.position.x = this.global.randomFromInterval(-2, 3);
        this.mesh.position.x = this.global.randomFromInterval(0.7, 1.3);
        this.pinkparticlesX.push(this.mesh.position.x);
        this.mesh.position.y = this.global.randomFromInterval(-12, -15);
        this.pinkparticlesY.push(this.mesh.position.y);

        this.val = this.global.map(Math.random(), 0, 1, -0.01, 0.01);
        this.pinkparticleRandMove.push(this.val);

        this.mesh.position.z = -53;
        this.mesh.receiveShadow = true;
        this.pinkparticles.push(this.mesh);
        this.mesh.visible = true;
        this.scene.add(this.mesh);
      } else if (this.pinkpearlsBlur.includes(i)) {
        this.geometry = new THREE.PlaneGeometry(0.05, 0.05);
        this.material = new THREE.MeshStandardMaterial({
          map: this.resources.items["particle" + i],
          transparent: true,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.global.randomFromInterval(0.7, 1.3);
        this.pinkparticlesX.push(this.mesh.position.x);

        this.val = this.global.map(Math.random(), 0, 1, -0.5, 0.5);
        this.pinkparticleRandMove.push(this.val);

        this.mesh.position.y = this.global.randomFromInterval(-12, -15);
        this.pinkparticlesY.push(this.mesh.position.y);
        this.mesh.position.z = -53;
        this.mesh.receiveShadow = true;
        this.mesh.visible = true;
        this.pinkparticles.push(this.mesh);
        this.scene.add(this.mesh);
      } else {
        this.geometry = new THREE.PlaneGeometry(0.5, 0.5);
        this.material = new THREE.MeshStandardMaterial({
          map: this.resources.items["particle" + i],
          transparent: true,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.global.randomFromInterval(0.7, 1.3);
        this.pinkparticlesX.push(this.mesh.position.x);
        this.mesh.position.y = this.global.randomFromInterval(-12, -15);
        this.pinkparticlesY.push(this.mesh.position.y);

        this.val = this.global.map(Math.random(), 0, 1, -1, 1);
        this.pinkparticleRandMove.push(this.val);

        this.mesh.position.z = -53;
        this.mesh.receiveShadow = true;
        this.mesh.visible = true;
        this.pinkparticles.push(this.mesh);
        this.scene.add(this.mesh);
      }
    }

    this.mouse.on("mouseMove", () => {
      this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
      this.moveParticlesMouse();
    });
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);
  }

  moveParticlesMouse() {
    for (var i = 0; i < this.pinkparticles.length; i++) {
      if (this.pinkpearlsNoBlur.includes(i)) {
        var posX = this.global.map(
          this.mouseCoords.x,
          -1,
          1,
          this.pinkparticlesX[i] - this.pinkparticleRandMove[i],
          this.pinkparticlesX[i] + this.pinkparticleRandMove[i]
        );

        var posY = this.global.map(
          this.mouseCoords.y,
          -1,
          1,
          this.pinkparticlesY[i] - this.pinkparticleRandMove[i],
          this.pinkparticlesY[i] + this.pinkparticleRandMove[i]
        );

        gsap.to(this.pinkparticles[i].position, {
          x: posX,
          y: posY,
          duration: 1,
        });
      } else if (this.pinkpearlsBlur.includes(i)) {
        var posX = this.global.map(
          this.mouseCoords.x,
          -1,
          1,
          this.pinkparticlesX[i] - this.pinkparticleRandMove[i],
          this.pinkparticlesX[i] + this.pinkparticleRandMove[i]
        );

        var posY = this.global.map(
          this.mouseCoords.y,
          -1,
          1,
          this.pinkparticlesY[i] - this.pinkparticleRandMove[i],
          this.pinkparticlesY[i] + this.pinkparticleRandMove[i]
        );

        gsap.to(this.pinkparticles[i].position, {
          x: posX,
          y: posY,
          duration: 1,
        });
      } else {
        var posX = this.global.map(
          this.mouseCoords.x,
          -1,
          1,
          this.pinkparticlesX[i] - this.pinkparticleRandMove[i],
          this.pinkparticlesX[i] + this.pinkparticleRandMove[i]
        );

        var posY = this.global.map(
          this.mouseCoords.y,
          -1,
          1,
          this.pinkparticlesY[i] - this.pinkparticleRandMove[i],
          this.pinkparticlesY[i] + this.pinkparticleRandMove[i]
        );

        gsap.to(this.pinkparticles[i].position, {
          x: posX,
          y: posY,
          duration: 1,
        });
      }
    }
  }
}

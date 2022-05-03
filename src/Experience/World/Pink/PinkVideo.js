import * as THREE from "three";
import Experience from "../../Experience";

export default class PinkVideo {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.keyColorObject = new THREE.Color("#00ff02");

    this.setVideoTexture();
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setVideoTexture() {
    const video = document.getElementById("pinkvideo");
    video.load();
    this.texture = new THREE.VideoTexture(video);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBFormat;
    this.texture.needsUpdate = true;
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(16, 9);
  }

  setMaterial() {
    this.videoMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          type: "t",
          value: this.texture,
        },
        color: {
          type: "c",
          value: this.keyColorObject,
        },
      },
      vertexShader:
        "varying mediump vec2 vUv;\n" +
        "void main(void)\n" +
        "{\n" +
        "vUv = uv;\n" +
        "mediump vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
        "gl_Position = projectionMatrix * mvPosition;\n" +
        "}",
      fragmentShader:
        "uniform mediump sampler2D texture;\n" +
        "uniform mediump vec3 color;\n" +
        "varying mediump vec2 vUv;\n" +
        "void main(void)\n" +
        "{\n" +
        "  mediump vec3 tColor = texture2D( texture, vUv ).rgb;\n" +
        "  mediump float a = (length(tColor - color) - 0.85) * 15.0;\n" +
        "  gl_FragColor = vec4(tColor, a);\n" +
        "}",
      transparent: true,
    });
    this.videoMaterial.needsUpdate = true;
    this.videoMaterial.side = THREE.DoubleSide;
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.videoMaterial);
    this.mesh.scale.set(0.1, 0.1, 0.1);
    this.mesh.position.x = 1.7;
    this.mesh.position.y = -13.01;
    this.mesh.position.z = -53;
    this.mesh.receiveShadow = false;
    this.mesh.visible = true;
    this.scene.add(this.mesh);
  }

  update() {}
}

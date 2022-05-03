import * as THREE from "three";
import gsap from "gsap";
import Experience from "../../Experience";
import EventEmitter from "../../Utils/EventEmitter";

export default class RedSphere extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.mouse = this.experience.mouse;
    this.time = this.experience.time;
    this.globalFunctions = this.experience.globalFunctions;

    this.mouseCoords = new THREE.Vector2(0, 0);

    this.lastTime = -1;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();

    this.setTouchTarget();
    this.setRaycaster();

    this.mouse.on("mouseMove", () => {
      this.onMouseMove();
    });

    this.mouse.on("mousedown", () => {
      this.onMouseDown();
    });

    this.mouse.on("mouseup", () => {
      this.onMouseUp();
    });
  }

  setGeometry() {
    this.geometry = new THREE.SphereBufferGeometry(0.3, 256, 256);
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#920707"),
      emissive: new THREE.Color("#590303"),
      transmission: 0.5,
      roughness: 0.312,
      metalness: 0.0,
      reflectivity: 0.5,
    });

    this.depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });

    this.customUniforms = {
      uTime: { value: 6 },
      uMousePosition: { value: new THREE.Vector2(0.4, 4) },
    };

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime;
      shader.uniforms.uMousePosition = this.customUniforms.uMousePosition;

      // <common>
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform float uTime;
            uniform vec2 uMousePosition;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

            //	Classic Perlin 3D Noise 
            //	by Stefan Gustavson
            //
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

            float cnoise(vec3 P){
            vec3 Pi0 = floor(P); // Integer part for indexing
            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P); // Fractional part for interpolation
            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
            return 2.2 * n_xyz;
            }

            float distored_pos(vec3 p) {
              float n = cnoise(p*uMousePosition.y + vec3(uTime)/10.0);
              return n;
            }

            vec3 orthogonal(vec3 n) {
            return normalize(
                abs(n.x)>abs(n.z) ? vec3(-n.y, n.x, 0) : vec3(0., -n.z, n.y)
            );
            }
        `
      );

      // <beginnormal_vertex>
      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
            #include <beginnormal_vertex>

            vec3 displacedpositionN = objectNormal + objectNormal * distored_pos(objectNormal) * uMousePosition.x;

            vec3 tangentN = orthogonal(objectNormal);
            vec3 bitangentN = normalize(cross(tangentN, objectNormal));

            vec3 neighbour1N = objectNormal + tangentN * 0.0001;
            vec3 neighbour2N = objectNormal + bitangentN * 0.0001;

            vec3 displaceN1N = neighbour1N + objectNormal * distored_pos(neighbour1N) * uMousePosition.x;
            vec3 displaceN2N = neighbour2N + objectNormal * distored_pos(neighbour2N) * uMousePosition.x;
            
            vec3 displacedTangentN = displaceN1N - displaceN2N;
            vec3 displacedBitangentN = displaceN2N - displacedpositionN;

            vec3 displacedNormalN = normalize(cross(displacedTangentN, displacedBitangentN));

            // vNormal = -displacedNormalN;

            // objectNormal = -displacedNormalN;
        `
      );

      // <begin_vertex>
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
            #include <begin_vertex>

            vec3 displacedposition = transformed + normal * distored_pos(transformed) * uMousePosition.x;

            vec3 tangent = orthogonal(normal);
            vec3 bitangent = normalize(cross(tangent, normal));

            vec3 neighbour1 = transformed + tangent * 0.0001;
            vec3 neighbour2 = transformed + bitangent * 0.0001;

            vec3 displaceN1 = neighbour1 + normal * distored_pos(neighbour1) * uMousePosition.x;
            vec3 displaceN2 = neighbour2 + normal * distored_pos(neighbour2) * uMousePosition.x;
            
            vec3 displacedTangent = displaceN1 - displaceN2;
            vec3 displacedBitangent = displaceN2 - displacedposition;

            vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));

            vNormal = -displacedNormal;
            transformed = displacedposition;

            `
      );
    };

    this.depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime;
      shader.uniforms.uMousePosition = this.customUniforms.uMousePosition;
      // <common>
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform float uTime;
            uniform vec2 uMousePosition;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

            //	Classic Perlin 3D Noise 
            //	by Stefan Gustavson
            //
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

            float cnoise(vec3 P){
            vec3 Pi0 = floor(P); // Integer part for indexing
            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P); // Fractional part for interpolation
            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
            return 2.2 * n_xyz;
            }

            float distored_pos(vec3 p) {
              float n = cnoise(p*uMousePosition.y + vec3(uTime)/10.0);
              return n;
            }

            vec3 orthogonal(vec3 n) {
            return normalize(
                abs(n.x)>abs(n.z) ? vec3(-n.y, n.x, 0) : vec3(0., -n.z, n.y)
            );
            }
        `
      );
      // <begin_vertex>
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
            #include <begin_vertex>

            vec3 displacedposition = transformed + normal * distored_pos(transformed) * uMousePosition.x;

            vec3 tangent = orthogonal(normal);
            vec3 bitangent = normalize(cross(tangent, normal));

            vec3 neighbour1 = transformed + tangent * 0.0001;
            vec3 neighbour2 = transformed + bitangent * 0.0001;

            vec3 displaceN1 = neighbour1 + normal * distored_pos(neighbour1) * uMousePosition.x;
            vec3 displaceN2 = neighbour2 + normal * distored_pos(neighbour2) * uMousePosition.x;
            
            vec3 displacedTangent = displaceN1 - displaceN2;
            vec3 displacedBitangent = displaceN2 - displacedposition;

            vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));

            // vNormal = -displacedNormal;
            transformed = displacedposition;

            `
      );
    };
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.customDepthMaterial = this.depthMaterial;
    this.mesh.scale.set(0.25, 0.25, 0.25);
    this.mesh.position.x = 13.3;
    this.mesh.position.y = 0.955;
    this.mesh.position.z = 1.7;
    this.scene.add(this.mesh);
  }

  setTouchTarget() {
    this.touchTarget = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshBasicMaterial()
    );
  }

  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);
  }

  onMouseMove() {
    this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
    if (!this.isDragging) return;
    this.raycaster.setFromCamera(this.mouseCoords, this.camera.instance);
    const intersect = this.raycaster.intersectObject(this.touchTarget);
    if (intersect.length) {
      const target = intersect[0].point;
      this.customUniforms.uMousePosition.value.x = this.globalFunctions.map(
        Math.abs(this.mouseCoords.x),
        0,
        1,
        0.4,
        0.5
      );
      this.customUniforms.uMousePosition.value.y = this.globalFunctions.map(
        Math.abs(this.mouseCoords.y),
        0,
        1,
        4,
        5
      );
      this.mesh.rotation.y = THREE.Math.degToRad(
        this.globalFunctions.map(this.mouseCoords.x, -1, 1, -20, 20)
      );

      this.mesh.rotation.x = THREE.Math.degToRad(
        this.globalFunctions.map(this.mouseCoords.y, -1, 1, 20, -20)
      );

      this.trigger("redstrech");
    }
  }

  onMouseDown() {
    this.raycaster.setFromCamera(this.mouseCoords, this.camera.instance);
    const intersect = this.raycaster.intersectObject(this.mesh);
    if (intersect.length) {
      document.getElementById("prompts").style.opacity = 0;
      this.isDragging = true;
      const startPosition = intersect[0].point;
      this.trigger("redgrab");
    }
  }

  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.releasedMouse = this.mouseCoords;

    gsap.to(this.customUniforms.uMousePosition.value, {
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      x: 0.4,
      y: 4,
    });

    gsap.to(this.mesh.rotation, {
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      x: 0,
      y: 0,
      z: 0,
    });

    this.trigger("redrelease");
  }

  update() {
    this.mesh.position.y +=
      Math.sin(this.time.elapsed / 500) * 0.0005 +
      Math.sin(this.time.elapsed / 400) * 0.00001;
  }
}

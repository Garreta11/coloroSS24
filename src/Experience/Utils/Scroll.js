import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import gsap from "gsap";
import EventEmitter from "./EventEmitter";
import Experience from "../Experience";

export default class Scroll extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.world = this.experience.world;
    this.scene = this.experience.scene;
    this.sounds = this.experience.sounds;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.global = this.experience.globalFunctions;

    this.video = document.getElementById("pinkvideo");

    this.imgs = [];

    this.intervalRewind;

    this.directionscroll = true;
    this.cantouchdown = true;

    this.scrollY = window.scrollY;
    this.resources.on("ready", () => {
      var items = this.resources.items;
      for (const item in items) {
        if (item.includes("cloth")) {
          this.imgs.push(items[item]);
        }
      }

      this.setScrollTrigger(this.world);
    });

    var timeout;

    window.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
      document.getElementById("scrolltodiscover").style.opacity = 0;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        document.getElementById("scrolltodiscover").style.opacity = 1;
      }, 5000);

      this.trigger("scroll");
    });

    window.addEventListener("touchmove", () => {
      this.scrollY = window.scrollY;
      document.getElementById("scrolltodiscover").style.opacity = 0;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        document.getElementById("scrolltodiscover").style.opacity = 1;
      }, 5000);

      this.trigger("scroll");
    });

    // Touch UP
    document.getElementById("scrollup").addEventListener("touchstart", (e) => {
      document.getElementById("scrollup").style.opacity = 1;
      if (this.cantouchdown) {
        window.scrollBy(0, -window.innerHeight / 2);
      }
    });

    document.getElementById("scrollup").addEventListener("touchend", (e) => {
      document.getElementById("scrollup").style.opacity = 0.25;
    });

    // Touch DOWN
    document
      .getElementById("scrolldown")
      .addEventListener("touchstart", (e) => {
        document.getElementById("scrolldown").style.opacity = 1;
        if (this.cantouchdown) {
          window.scrollBy(0, window.innerHeight / 2);
        }
      });

    document.getElementById("scrolldown").addEventListener("touchend", (e) => {
      document.getElementById("scrolldown").style.opacity = 0.25;
    });
  }

  setScrollTrigger(world) {
    gsap.registerPlugin(ScrollTrigger);

    this.desktopAnimation = () => {
      this.section = 0;
      this.tl = gsap.timeline({
        default: {
          duration: 1,
          ease: "power2.inOut",
        },
        scrollTrigger: {
          trigger: ".page",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            this.directionscroll = self.direction;
          },
        },
      });

      /**
       * New section
       */

      // camera 1 - 2
      this.tl.to(
        this.camera.instance.position,
        {
          x: 13.3,
          y: 1,
          z: 3.5,
          onStart: () => {
            // this.world.limeScene.model.visible = true;
          },
          onReverseComplete: () => {
            // this.world.limeScene.model.visible = false;
          },
        },
        this.section
      );

      this.section++;

      /**
       * New section
       */

      this.tl.to(
        "#wheelcolor",
        {
          rotation: 180,
          onStart: () => {
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#E74B4C"); // RED
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#E74B4C"); // RED
          },
          onReverseComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Radiant Red";
            document.getElementById("colorcode").innerText = "011 - 50 - 32";

            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#E74B4C"); // RED
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#E74B4C"); // RED
          },
          onComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Cyber Lime";
            document.getElementById("colorcode").innerText = "051 - 76 - 36";
          },
        },
        this.section
      );

      // camera 2 - 3 (pos)
      this.tl.to(
        this.camera.instance.position,
        { x: 7, y: 1, z: 8.4 },
        this.section
      );

      // camera 2 - 3 (rot)
      this.tl.to(
        this.camera.instance.rotation,
        {
          y: 30 * THREE.Math.DEG2RAD,
          onComplete: () => {
            document.getElementById("prompts").style.opacity = 1;
            if (this.sizes.width > 800) {
              document.getElementById("prompt").innerText = "Point & play";
            } else {
              document.getElementById("prompt").innerText = "Move around";
            }
          },
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.red,
        {
          volume: 0,
        },
        this.section
      );
      this.tl.to(
        this.sounds.sounds.lime,
        {
          volume: 1,
        },
        this.section
      );

      /**
       * New section
       */

      this.section++;

      this.tl.to(
        this.world.environment.pointLightBlue,
        { intensity: 0.5 },
        this.section
      );

      // camera 3 - 4 (pos)
      this.tl.to(
        this.camera.instance.position,
        {
          x: 1.7,
          y: -10.2,
          z: 8.4,
          onStart: () => {
            this.world.scene.background = new THREE.Color("#5C7792");
          },
          onComplete: () => {
            document.getElementById("prompts").style.opacity = 1;
            if (this.sizes.width > 800) {
              document.getElementById("prompt").innerText = "Touch the floor";
            } else {
              document.getElementById("prompt").innerText = "Touch floor";
            }
          },
        },
        this.section
      );

      // camera 3 - 4 (rot)
      this.tl.to(
        this.camera.instance.rotation,
        { y: 0 * THREE.Math.DEG2RAD },
        this.section
      );

      this.tl.to(
        "#wheelcolor",
        {
          rotation: 360,
          onStart: () => {
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#5C7792"); // BLUE
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#5C7792"); // BLUE
          },
          onReverseComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Cyber Lime";
            document.getElementById("colorcode").innerText = "051 - 76 - 36";
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#E74B4C"); // RED
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#E74B4C"); // RED
          },
          onComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Elemental Blue";
            document.getElementById("colorcode").innerText = "117 - 47 - 13";
          },
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.lime,
        {
          volume: 0,
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.limeHover,
        {
          volume: 0,
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.blue,
        {
          volume: 1,
        },
        this.section
      );

      // Directional Light
      this.tl.to(
        this.world.environment.directionalLight,
        {
          intensity: 0.76,
        },
        this.section
      );
      this.tl.to(
        this.world.environment.directionalLight.position,
        {
          x: -3,
          y: -13,
          z: -9,
        },
        this.section
      );

      // Point Light Blue
      this.tl.to(
        this.world.environment.pointLightBlue,
        {
          intensity: 0.93,
        },
        this.section
      );
      this.tl.to(
        this.world.environment.pointLightBlue.position,
        {
          x: 13,
          y: 16,
          z: -30,
        },
        this.section
      );

      // Point Light Blue 1
      this.tl.to(
        this.world.environment.pointLightBlue1,
        {
          intensity: -0.43,
        },
        this.section
      );
      this.tl.to(
        this.world.environment.pointLightBlue1.position,
        {
          x: 6,
          y: -10,
          z: -45,
        },
        this.section
      );

      // Point Light Blue 2
      this.tl.to(
        this.world.environment.pointLightBlue2,
        {
          intensity: 1.16,
        },
        this.section
      );
      this.tl.to(
        this.world.environment.pointLightBlue2.position,
        {
          x: -6.2,
          y: -12,
          z: -23,
        },
        this.section
      );

      /**
       * New section
       */
      this.section++;

      // camera 4 - 5
      this.tl
        .to(
          this.camera.instance.position,
          {
            x: 1.7,
            y: -13,
            z: -50.5,
            onUpdate: () => {
              if (this.tl.progress() > 0.58) {
                this.resources.items.pinkBg.encoding = THREE.sRGBEncoding;
                this.world.scene.background = this.resources.items.pinkBg;
              } else {
                this.world.scene.background = new THREE.Color("#5C7792");
              }
            },
            onComplete: () => {
              if (this.sounds.sounds.bluemove.playing()) {
                this.sounds.sounds.bluemove.stop();
              }
              document.getElementById("prompts").style.opacity = 1;
              if (this.sizes.width > 800) {
                document.getElementById("prompt").innerText =
                  "Move around the screen";
              } else {
                document.getElementById("prompt").innerText = "Move around";
              }

              setTimeout(() => {
                document.getElementById("prompts").style.opacity = 0;
              }, 5000);
              document.documentElement.style.overflowY = "hidden";
              this.cantouchdown = false;
              this.video.play();
              var approxTime = 0;
              this.movescroll = true;
              this.video.addEventListener("timeupdate", () => {
                if (this.directionscroll > 0) {
                  var currentTime = Math.floor(this.video.currentTime);
                  if (currentTime !== approxTime) {
                    approxTime = currentTime;
                    if (approxTime == 8) {
                      if (!this.sounds.sounds.pinkFlaps.playing()) {
                        this.sounds.sounds.pinkFlaps.play();
                      }
                    }
                    if (approxTime === 10) {
                      document.documentElement.style.overflowY = "auto";
                      this.cantouchdown = true;
                      this.world.resources.items.nutshellCubeMap.encoding =
                        THREE.sRGBEncoding;
                      this.scene.background =
                        this.world.resources.items.nutshellCubeMap;
                      this.world.nutshellElement1.model.visible = true;
                      this.world.nutshellElement2.model.visible = true;
                      this.world.nutshellElement3.model.visible = true;
                      this.world.nutshellElement4.model.visible = true;
                      this.world.nutshellElement5.model.visible = true;
                      this.world.nutshellElement6.model.visible = true;
                      this.world.nutshellHills.model.visible = true;
                      this.world.nutshellClouds.meshCloud1.visible = true;
                      this.world.nutshellClouds.meshCloud2.visible = true;
                      this.world.nutshellClouds.meshCloud3.visible = true;
                      this.world.nutshellClouds.meshCloud4.visible = true;
                      this.world.nutshellClouds.meshCloud5.visible = true;
                      this.world.nutshellClouds.meshCloud6.visible = true;

                      this.world.environment.pointLightNutshell.intensity = 1.0;

                      for (
                        var i = 0;
                        i < this.world.pinkParticles.NUM_PARTICLES;
                        i++
                      ) {
                        this.world.pinkParticles.pinkparticles[
                          i
                        ].visible = false;
                      }
                    }
                  }

                  if (currentTime == Math.floor(this.video.duration)) {
                    if (this.movescroll) {
                      window.scrollBy(0, window.innerHeight * 1.5);
                      this.movescroll = false;
                    }
                  }
                } else {
                  var currentTime = Math.floor(this.video.currentTime);
                  if (currentTime !== approxTime) {
                    approxTime = currentTime;
                    if (approxTime <= 9) {
                      if (this.movescroll) {
                        this.scene.background = this.resources.items.pinkBg;
                        window.scrollBy(0, -window.innerHeight * 1.5);
                        for (
                          var i = 0;
                          i < this.world.pinkParticles.NUM_PARTICLES;
                          i++
                        ) {
                          this.world.pinkParticles.pinkparticles[
                            i
                          ].visible = true;
                        }
                        this.world.nutshellHills.model.visible = false;
                        this.world.nutshellElement1.model.visible = false;
                        this.world.nutshellElement2.model.visible = false;
                        this.world.nutshellElement3.model.visible = false;
                        this.world.nutshellElement4.model.visible = false;
                        this.world.nutshellElement5.model.visible = false;
                        this.world.nutshellElement6.model.visible = false;
                        this.world.nutshellClouds.meshCloud1.visible = false;
                        this.world.nutshellClouds.meshCloud2.visible = false;
                        this.world.nutshellClouds.meshCloud3.visible = false;
                        this.world.nutshellClouds.meshCloud4.visible = false;
                        this.world.nutshellClouds.meshCloud5.visible = false;
                        this.world.nutshellClouds.meshCloud6.visible = false;

                        this.world.environment.pointLightNutshell.intensity = 0.0;

                        document.documentElement.style.overflowY = "auto";
                        this.cantouchdown = true;

                        this.video.currentTime = 0;
                        this.movescroll = false;
                      }
                    }
                  }
                }
              });
            },
          },
          this.section
        )
        .call(() => {
          this.movescroll = true;
        });

      this.tl.to(
        this.world.environment.directionalLight,
        {
          intensity: 1,
        },
        this.section
      );

      this.tl.to(
        this.world.environment.directionalLight.position,
        {
          x: 0,
          y: 0,
          z: 0,
        },
        this.section
      );

      this.tl.to(
        this.world.pinkVideo.mesh.position,
        {
          z: -51.6,
        },
        this.section
      );

      for (var i = 0; i < this.world.pinkParticles.NUM_PARTICLES - 1; i++) {
        if (this.world.pinkParticles.pinkpearlsNoBlur.includes(i)) {
          this.tl.to(
            this.world.pinkParticles.pinkparticles[i].position,
            {
              z: -51.9,
            },
            this.section
          );
        } else if (this.world.pinkParticles.pinkpearlsBlur.includes(i)) {
          this.tl.to(
            this.world.pinkParticles.pinkparticles[i].position,
            {
              z: -51.7,
            },
            this.section
          );
        } else {
          this.tl.to(
            this.world.pinkParticles.pinkparticles[i].position,
            {
              z: -51.5,
            },
            this.section
          );
        }
      }

      this.tl.to(
        this.world.environment.pointLightBlue,
        { intensity: 0 },
        this.section
      );

      this.tl.to(
        this.world.environment.pointLightBlue1,
        { intensity: 0 },
        this.section
      );

      this.tl.to(
        this.world.environment.pointLightBlue2,
        { intensity: 0 },
        this.section
      );

      this.tl.to(
        this.world.environment.pointLightBlue3,
        { intensity: 0 },
        this.section
      );

      this.tl.to(
        this.world.blueDoor.animation.mixer,
        { time: 9.99 },
        this.section
      );

      this.tl.to(
        "#wheelcolor",
        {
          rotation: 540,
          onStart: () => {
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#DEA1C2"); // PINK
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#DEA1C2"); // PINK
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#5C7792"); // BLUE
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#5C7792"); // BLUE
          },
          onReverseComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Elemental Blue";
            document.getElementById("colorcode").innerText = "117 - 47 - 13";
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#C8CE2E"); // LIME
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#5C7792"); // BLUE
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#5C7792"); // BLUE
          },
          onComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Fondant Pink";
            document.getElementById("colorcode").innerText = "147 - 70 -20";
          },
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.blue,
        {
          volume: 0,
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.pink,
        {
          volume: 1,
        },
        this.section
      );

      /**
       * New section
       */
      this.section++;

      this.tl.to(
        this.camera.instance.position,
        {
          x: 1.7,
          y: -13,
          z: -52,
          onReverseComplete: () => {
            this.video.currentTime = this.video.duration;
            this.rewind(0.5);
            this.directionscroll = false;
            this.movescroll = true;
            if (!this.sounds.sounds.pinkFlaps.playing()) {
              this.sounds.sounds.pinkFlaps.play();
            }
            document.documentElement.style.overflowY = "hidden";
            this.cantouchdown = false;
          },
          onComplete: () => {
            document.getElementById("prompts").style.opacity = 1;
            if (this.sizes.width > 800) {
              document.getElementById("prompt").innerText =
                "Move left to right";
            } else {
              document.getElementById("prompt").innerText =
                "Swipe left to right";
            }
            setTimeout(() => {
              document.getElementById("prompts").style.opacity = 0;
            }, 5000);
          },
        },
        this.section
      );

      this.tl.to(
        "#wheelcolor",
        {
          rotation: 720,
          onStart: () => {
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#DEA1C2"); // PINK
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#DEA1C2"); // PINK
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#8D5234"); // BROWN
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#8D5234"); // BROWN
          },
          onReverseComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Fondant Pink";
            document.getElementById("colorcode").innerText = "147 - 70 - 20";
            document
              .getElementById("wheelcolor0")
              .setAttribute("stop-color", "#DEA1C2"); // PINK
            document
              .getElementById("wheelcolor1")
              .setAttribute("stop-color", "#DEA1C2"); // PINK
            document
              .getElementById("wheelcolor2")
              .setAttribute("stop-color", "#5C7792"); // BLUE
            document
              .getElementById("wheelcolor3")
              .setAttribute("stop-color", "#5C7792"); // BLUE
          },
          onComplete: () => {
            document.getElementById("colorinfo").style.opacity = 1;
            document.getElementById("colorname").innerText = "Nutshell";
            document.getElementById("colorcode").innerText = "024 - 37 - 20";
          },
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.pink,
        {
          volume: 0,
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.nutshellGrow,
        {
          volume: 10.0,
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.nutshell,
        {
          volume: 2,
        },
        this.section
      );

      /**
       * New section
       */
      this.section++;

      this.tl.to(
        this.camera.instance.rotation,
        {
          x: 45 * THREE.Math.DEG2RAD,
          onComplete: () => {
            document.documentElement.style.overflowY = "hidden";
            this.cantouchdown = false;
            document.getElementsByClassName("showcta")[0].style.opacity = 1;
            document.getElementsByClassName("showcta")[0].style.zIndex = 2;
            document.getElementById("wheelcolor").style.opacity = 0;
            document.getElementById("colorinfo").style.opacity = 0;
            document.getElementById("scrollbtnsmobile").style.opacity = 0;
            document.getElementById("scrollbtnsmobile").style.zIndex = 0;
            document.getElementById("scrolltodiscover").style.display = "none";
          },
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.nutshellGrow,
        {
          volume: 0.0,
        },
        this.section
      );

      this.tl.to(
        this.sounds.sounds.nutshell,
        {
          volume: 0,
        },
        this.section
      );
    };

    ScrollTrigger.matchMedia({
      "(prefers-reduced-motion: no-preference)": this.desktopAnimation,
    });
  }

  rewind(rewindSpeed) {
    clearInterval(this.intervalRewind);
    var startSystemTime = new Date().getTime();
    var startVideoTime = this.video.currentTime;

    this.intervalRewind = setInterval(() => {
      this.video.playbackRate = 1.0;
      if (this.video.currentTime <= 0) {
        console.log("stop rewind");
        clearInterval(this.intervalRewind);
        this.video.currentTime = 0;
        this.video.pause();
        document.documentElement.style.overflowY = "auto";
        this.cantouchdown = true;
      } else {
        var elapsed = new Date().getTime() - startSystemTime;
        this.video.currentTime = Math.max(
          startVideoTime - (elapsed * rewindSpeed) / 1000.0,
          0
        );
        // this.video.currentTime += -0.05;
      }
    }, 120);
  }
}

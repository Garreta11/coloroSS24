import { Howl, Howler } from "howler";
import Experience from "../Experience";

// Atmos
import redAtmos from "../../audio/red/red.wav";
import limeAtmos from "../../audio/lime/lime.mp3";
import blueAtmos from "../../audio/blue/blue.wav";
import pinkAtmos from "../../audio/pink/pink.mp3";
import nutshellAtmos from "../../audio/nutshell/nutshell.mp3";

// Interactions red
import redGrab from "../../audio/red/redGrab.mp3";
import redRelease from "../../audio/red/redRelease.mp3";
import redStrech from "../../audio/red/redStrech.mp3";

// Interaction lime
import limeHover from "../../audio/lime/limeHover.mp3";
import limeMerge from "../../audio/lime/limemerge.mp3";
import limeUnmerge from "../../audio/lime/limeunmerge.mp3";

// Interaction blue
import blueStart from "../../audio/blue/wavestart.mp3";
import blueMove from "../../audio/blue/wavemove.mp3";
import blueDoor from "../../audio/blue/door.mp3";

// Interaction pink
import pinkFlaps from "../../audio/pink/flaps.mp3";

// Interaction nutshell
import nutshellGrow from "../../audio/nutshell/grow.mp3";

export default class Sounds {
  constructor() {
    this.experience = new Experience();

    this.mouse = this.experience.mouse;
    this.resources = this.experience.resources;

    this.sounds = {};

    this.setMasterVolume();
    this.setAtmosSounds();
    this.setInteractionSounds();
    this.setMute();

    this.mouse.on("mousedown", () => {
      this.setRed();
      this.setLime();
      this.setBlue();
      this.setPink();
      this.setNutshell();
    });

    this.resources.on("ready", () => {
      // RED
      this.experience.world.redSphere.on("redgrab", () => {
        this.sounds.redDown.play();
      });
      this.experience.world.redSphere.on("redrelease", () => {
        this.sounds.redRelease.play();
        this.sounds.redStrech.stop();
      });
      this.experience.world.redSphere.on("redstrech", () => {
        if (!this.sounds.redStrech.playing()) {
          this.sounds.redStrech.play();
        }
      });

      // LIME
      this.experience.world.limeSphere.on("limemove", () => {
        if (!this.sounds.limeHover.playing()) {
          this.sounds.limeHover.play();
        }
      });
      this.experience.world.limeSphere.on("limeleave", () => {
        if (this.sounds.limeHover.playing()) {
          this.sounds.limeHover.stop();
        }
      });
      this.experience.world.limeSphere.on("limemerge", () => {
        this.sounds.limemerge.play();
      });
      this.experience.world.limeSphere.on("limeunmerge", () => {
        this.sounds.limeunmerge.play();
      });

      // Blue
      this.experience.world.water2.on("bluestarts", () => {
        if (!this.sounds.bluestart.playing()) {
          this.sounds.bluestart.play();
        }
      });
      this.experience.world.water2.on("bluemove", () => {
        if (!this.sounds.bluemove.playing()) {
          this.sounds.bluemove.play();
        }
      });
      this.experience.world.water2.on("bluestop", () => {
        if (this.sounds.bluemove.playing()) {
          this.sounds.bluemove.stop();
        }
      });

      // Nutshell
      this.experience.world.nutshellElement6.on("nutshellmove", () => {
        if (!this.sounds.nutshellGrow.playing()) {
          this.sounds.nutshellGrow.play();
        }
      });
      this.experience.world.nutshellElement6.on("nutshellstop", () => {
        if (this.sounds.nutshellGrow.playing()) {
          this.sounds.nutshellGrow.stop();
        }
      });
    });
  }

  setMasterVolume() {
    this.masterVolume = 1.0;
    Howler.volume(this.masterVolume);
    window.requestAnimationFrame(() => {
      Howler.volume(this.masterVolume);
    });
  }

  setAtmosSounds() {
    this.sounds.red = new Howl({
      src: [redAtmos],
      loop: true,
      volume: 0,
    });
    this.sounds.lime = new Howl({
      src: [limeAtmos],
      loop: true,
      volume: 0,
    });
    this.sounds.blue = new Howl({
      src: [blueAtmos],
      loop: true,
      volume: 0,
    });
    this.sounds.pink = new Howl({
      src: [pinkAtmos],
      loop: true,
      volume: 0,
    });
    this.sounds.nutshell = new Howl({
      src: [nutshellAtmos],
      loop: true,
      volume: 0,
    });
  }

  setInteractionSounds() {
    // Red
    this.sounds.redDown = new Howl({
      src: [redGrab],
      loop: false,
      volume: 2.0,
    });
    this.sounds.redRelease = new Howl({
      src: [redRelease],
      loop: false,
      volume: 2.0,
    });
    this.sounds.redStrech = new Howl({
      src: [redStrech],
      loop: true,
      volume: 2.0,
    });

    // Lime
    this.sounds.limeHover = new Howl({
      src: [limeHover],
      loop: true,
      volume: 2.0,
    });
    this.sounds.limemerge = new Howl({
      src: [limeMerge],
      loop: false,
      volume: 2.0,
    });
    this.sounds.limeunmerge = new Howl({
      src: [limeUnmerge],
      loop: false,
      volume: 2.0,
    });

    // Blue
    this.sounds.bluestart = new Howl({
      src: [blueStart],
      loop: false,
      volume: 2.0,
    });
    this.sounds.bluemove = new Howl({
      src: [blueMove],
      loop: true,
      volume: 2.0,
    });
    this.sounds.bluedoor = new Howl({
      src: [blueDoor],
      loop: false,
      volume: 2.0,
    });

    // Pink
    this.sounds.pinkFlaps = new Howl({
      src: [pinkFlaps],
      loop: false,
      volume: 2.0,
    });

    // Nutshell
    this.sounds.nutshellGrow = new Howl({
      src: [nutshellGrow],
      loop: true,
      volume: 0.0,
    });
  }

  setMute() {
    this.muted = typeof this.debug !== "undefined";
    Howler.mute(this.muted);

    // M Key
    window.addEventListener("keydown", (_event) => {
      if (_event.key === "m") {
        this.muted = !this.muted;
        Howler.mute(this.muted);
      }
    });
  }

  setRed() {
    if (!this.sounds.red.playing()) {
      this.sounds.red.play();
    }
  }

  setLime() {
    if (!this.sounds.lime.playing()) {
      this.sounds.lime.play();
    }
  }

  setBlue() {
    if (!this.sounds.blue.playing()) {
      this.sounds.blue.play();
    }
  }

  setPink() {
    if (!this.sounds.pink.playing()) {
      this.sounds.pink.play();
    }
  }

  setNutshell() {
    if (!this.sounds.nutshell.playing()) {
      this.sounds.nutshell.play();
    }
  }
}

import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 1);

    // Resize event
    window.addEventListener("resize", () => {
      if (window.innerWidth != this.width) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 1);

        this.trigger("resize");
        this.detectDirectionScreen();
      }
    });

    this.changeMobileTexts();
    this.detectDirectionScreen();
  }

  changeMobileTexts() {
    if (this.width <= 800) {
      document.getElementById("scrolltodiscover").firstElementChild.innerHTML =
        "Use the arrows to discover";
    }
  }

  detectDirectionScreen() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.getElementsByClassName("turndevice")[0].style.display = "flex";
      setTimeout(() => {
        document.getElementsByClassName("turndevice")[0].style.opacity = 0;
        document.getElementsByClassName("turndevice")[0].style.visibility =
          "hidden";
      }, 8000);
    }
  }
}

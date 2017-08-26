/* global AFRAME */

AFRAME.registerComponent("initializer", {
  init: function() {
    const scene = this.el;
    const head = document.querySelector("#headObj");
    head.setAttribute("plane-collider", {
      objects: ".collidable"
    });

    scene.setAttribute("snake-controller", { head });
    scene.setAttribute("wasd-save", true);

    scene.addEventListener("bad-collision", () => {
      scene.pause();
      const sky = document.querySelector("#sky");
      sky.setAttribute("color", "red");
    });

    scene.addEventListener("gobbled-apple", () => {
      // remove apple
      if (event.detail.classList.contains("apple")) {
        event.detail.parentNode.removeChild(event.detail);
      }
      // add body
      scene.emit("add-body", null);
      // TODO: check if won
    });
  }
});

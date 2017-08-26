/* global AFRAME */

AFRAME.registerComponent("initializer", {
  init: function() {
    const scene = this.el;
    const head = document.querySelector("#headObj");
    const textOutput = document.querySelector("#textOutput");

    // Let scene settle before checking collisions
    window.setTimeout(() => {
      head.setAttribute("plane-collider", true);
    }, 1000);

    scene.setAttribute("snake-controller", { head });
    scene.setAttribute("wasd-save", true);

    scene.addEventListener("bad-collision", () => {
      textOutput.innerText = "Died!";
      scene.pause();
      const sky = document.querySelector("#sky");
      sky.setAttribute("color", "red");
    });

    scene.addEventListener("gobbled-apple", () => {
      if (scene.isPlaying) {
        // display message
        textOutput.innerText = "Gobbled an apple!";
        setTimeout(() => (textOutput.innerText = ""), 1000);
        // remove apple
        if (event.detail.el.classList.contains("apple")) {
          event.detail.el.parentNode.removeChild(event.detail.el);
        }
        // add body
        scene.emit("add-body", null);
        // TODO: check if won
      }
    });
  }
});

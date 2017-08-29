/* global AFRAME */
// TODO add cue stick
// TODO keep balls from overlapping
// TODO level select

AFRAME.registerComponent("initializer", {
  init: function() {
    let score = 0;
    const scene = this.el;
    const head = document.querySelector("#headObj");
    const textOutput = document.querySelector("#textOutput");
    const scoreOutput = document.querySelector("#scoreOutput");

    // Let scene settle before checking collisions
    window.setTimeout(() => {
      head.setAttribute("plane-collider", true);
    }, 1000);

    scene.setAttribute("snake-controller", { head });
    scene.setAttribute("wasd-save", true);

    scene.addEventListener("bad-collision", () => {
      textOutput.innerText = "Died!";
      scene.pause(); // TODO stop snake but don't stop scene
      const sky = document.querySelector("#sky");
      sky.setAttribute("color", "red");
    });

    scene.addEventListener("gobbled-apple", () => {
      if (scene.isPlaying) {
        // display message
        textOutput.innerText = "Picked up a cue!";
        setTimeout(() => (textOutput.innerText = ""), 1000);
        // remove apple
        if (event.detail.el.classList.contains("apple")) {
          event.detail.el.parentNode.removeChild(event.detail.el);
        }
        // update score
        scoreOutput.innerText = ++score;
      }
    });
  }
});

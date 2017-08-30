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
      const sky = document.querySelector("#sky");
      sky.setAttribute("color", "red");
      scene.setAttribute("fog", "type: exponential; color: #AAA; density: .00");
    });

    scene.addEventListener("gobbled-apple", () => {
      if (scene.isPlaying) {
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

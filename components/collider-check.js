/* global AFRAME */

AFRAME.registerComponent("collider-check", {
  schema: {
    textOutput: { type: "selector" }
  },

  init: function() {
    this.hitApple = this.hitApple.bind(this);
    this.hitObstacle = this.hitObstacle.bind(this);

    this.el.sceneEl.addEventListener("raycaster-intersected", e => {
      if (e.target.classList.contains("apple")) {
        this.hitApple(e);
      } else {
        this.hitObstacle(e);
      }
    });
  },

  hitApple: function(e) {
    this.el.emit("gobbled-apple", e.target);
    this.data.textOutput.innerText = "Gobbled an apple!";
    setTimeout(() => (this.data.textOutput.innerText = ""), 1000);
  },

  hitObstacle: function(e) {
    this.el.emit("bad-collision", e.target);
    this.data.textOutput.innerText = "Died!";
  }
});

AFRAME.registerComponent("collider-check", {
  schema: {
    textOutput: { type: "selector" }
  },

  init: function() {
    this.el.sceneEl.addEventListener("raycaster-intersected", () => {
      this.data.textOutput.innerText = "Collision!";
      setTimeout(() => (this.data.textOutput.innerText = ""), 1000);
    });
  }
});

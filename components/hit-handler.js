/* global AFRAME */

AFRAME.registerComponent("hit-handler", {
  schema: {
    emitEvent: { default: "hit" }
  },

  init: function() {
    this.onHit = this.onHit.bind(this);

    this.el.addEventListener("hit", evt => {
      this.onHit();
    });
  },

  onHit: function() {
    console.log("collision: " + this.data.emitEvent);
  }
});

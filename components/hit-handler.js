/* global AFRAME */

AFRAME.registerComponent("hit-handler", {
  schema: {
    emitEvent: { default: "hit" }
  },

  init: function() {
    this.onHit = this.onHit.bind(this);

    this.el.addEventListener("stateadded", evt => {
      if (evt.detail.state === "collided") {
        this.onHit();
      }
    });
  },

  onHit: function() {
    console.log("collision: " + this.data.emitEvent);
    this.el.emit(this.data.emitEvent, { el: this.el });
  }
});

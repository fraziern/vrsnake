/* global AFRAME */

AFRAME.registerComponent("grow-add", {
  init: function() {
    this.el.setAttribute("scale", "0 0 0");
  },
  tick: function(time, timeDelta) {
    const timeFactor = timeDelta / 1000;
    const scale = this.el.getAttribute("scale");
    const newScale = scale.x + timeFactor;
    if (newScale < 1) {
      this.el.setAttribute("scale", { x: newScale, y: newScale, z: newScale });
    } else {
      this.el.setAttribute("scale", "1 1 1");
      this.el.removeAttribute("grow-add");
    }
  }
});

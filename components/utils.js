/* global AFRAME */

AFRAME.registerComponent("random-position-entities", {
  schema: {
    mixin: { default: "" },
    num: { default: 15 },
    classList: { default: "" },
    min: { default: { x: -20, y: -20, z: -20 }, type: "vec3" },
    max: { default: { x: 20, y: 20, z: 20 }, type: "vec3" },
    step: { default: 2.5, type: "number" },
    fixedY: { type: "number" }
  },

  init: function() {
    // generate random positions
    const positions = this.getRandomUniquePositions();
    // exclude origin

    // Create entities with supplied mixin.
    for (var i = 0; i < this.data.num; i++) {
      var entity = document.createElement("a-entity");
      entity.setAttribute("mixin", this.data.mixin);
      entity.setAttribute("class", this.data.mixin + " " + this.data.classList);
      entity.setAttribute("position", positions[i]);
      this.el.appendChild(entity);
    }
  },

  getRandomUniquePositions() {
    const getRandomCoordString = () => {
      var max = this.data.max;
      var min = this.data.min;
      var step = this.data.step;
      var y =
        this.data.fixedY !== undefined
          ? this.data.fixedY
          : Math.floor(Math.random() * ((max.y - min.y) / step)) * step + min.y;
      var x =
        Math.floor(Math.random() * ((max.x - min.x) / step)) * step + min.x;
      var z =
        Math.floor(Math.random() * ((max.z - min.z) / step)) * step + min.z;
      return `${x} ${y} ${z}`;
    };

    let positionStrings = [];
    for (let i = 0; i < this.data.num; i++) {
      let newPosition = "";
      let done = false;
      while (!done) {
        newPosition = getRandomCoordString();
        if (!positionStrings.includes(newPosition)) {
          done = true;
        }
      }
      positionStrings.push(newPosition);
    }
    return positionStrings;
  }
});

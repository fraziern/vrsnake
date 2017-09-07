/* global AFRAME */
const getRandomCoordString = (max, min, step, fixedY) => {
  var y =
    fixedY !== undefined
      ? fixedY
      : Math.floor(Math.random() * ((max.y - min.y) / step)) * step + min.y;
  var x = Math.floor(Math.random() * ((max.x - min.x) / step)) * step + min.x;
  var z = Math.floor(Math.random() * ((max.z - min.z) / step)) * step + min.z;
  return `${x} ${y} ${z}`;
};

AFRAME.registerComponent("random-position", {
  schema: {
    min: { default: { x: -20, y: 1.25, z: -20 }, type: "vec3" },
    max: { default: { x: 20, y: 1.25, z: 20 }, type: "vec3" },
    step: { default: 2.5, type: "number" },
    fixedY: { type: "number" }
  },

  init: function() {
    const data = this.data;
    const rnd = getRandomCoordString(
      data.max,
      data.min,
      data.step,
      data.fixedY
    );
    this.el.setAttribute("position", rnd);
  }
});

AFRAME.registerComponent("random-position-entities", {
  schema: {
    mixin: { default: "" },
    num: { default: 15 },
    classList: { default: "" },
    min: { default: { x: -20, y: 1.25, z: -20 }, type: "vec3" },
    max: { default: { x: 20, y: 1.25, z: 20 }, type: "vec3" },
    step: { default: 2.5, type: "number" },
    fixedY: { type: "number" },
    protectedArea: { default: "0 1.25 0" }
  },

  init: function() {
    // generate random positions
    let positions = this.getRandomUniquePositions();
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
    const data = this.data;

    const inProtectedArea = coordsString => {
      // keep random balls away from protected area (i.e. snake's start)
      const coordsArr = coordsString.split(" ").map(el => Number(el));
      const protected = data.protectedArea.split(" ").map(el => Number(el));
      const step = data.step;
      return (
        coordsArr[0] >= protected[0] - step &&
        coordsArr[0] <= protected[0] + step &&
        coordsArr[1] >= protected[1] - step &&
        coordsArr[1] <= protected[1] + step &&
        coordsArr[2] >= protected[2] - step &&
        coordsArr[2] <= protected[2] + step
      );
    };

    let positionStrings = [];
    for (let i = 0; i < data.num; i++) {
      let newPosition = "";
      let done = false;
      while (!done) {
        newPosition = getRandomCoordString(
          data.max,
          data.min,
          data.step,
          data.fixedY
        );
        if (
          !positionStrings.includes(newPosition) &&
          !inProtectedArea(newPosition)
        ) {
          done = true;
        }
      }
      positionStrings.push(newPosition);
    }
    return positionStrings;
  }
});

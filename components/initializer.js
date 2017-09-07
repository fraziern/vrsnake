/* global AFRAME */
// TODO add cue stick
// TODO keep balls from overlapping
// TODO level select

AFRAME.registerComponent("initializer", {
  init: function() {
    this.score = 0;
    const scene = this.el;
    const head = document.querySelector("#headObj");

    head.setAttribute("plane-collider", true);

    scene.setAttribute("snake-controller", { head });
    scene.setAttribute("wasd-relative", true); // depends on snake-controller

    scene.addEventListener("bad-collision", () => {
      const sky = document.querySelector("#sky");
      sky.setAttribute("color", "red");
      scene.setAttribute("fog", "type: exponential; color: #AAA; density: .00");
    });

    scene.addEventListener("gobbled-apple", this.handleGobble.bind(this));
  },

  handleGobble(e) {
    const bonusScore = 14;
    const scoreOutput = document.querySelector("#scoreOutput");
    if (this.el.isPlaying) {
      // remove apple
      if (e.detail.el.classList.contains("apple")) {
        e.detail.el.parentNode.removeChild(e.detail.el);
      }
      // update score - use css hack to trigger animation
      scoreOutput.innerText = ++this.score;
      scoreOutput.classList.remove("score-animation");
      void scoreOutput.offsetWidth;
      scoreOutput.classList.add("score-animation");
      // add apple if we're in bonus
      if (this.score >= bonusScore) {
        var entity = document.createElement("a-entity");
        entity.setAttribute("mixin", "apple");
        entity.setAttribute("class", "apple collidable");
        entity.setAttribute("random-position", "fixedY: 1.25");
        this.el.sceneEl.appendChild(entity);
      }
    }
  }
});

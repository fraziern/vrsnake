/* global AFRAME */
const DELAYMIN = 400;
const SPEEDUP = 50;
const DELAYMAX = 1200;
const FOLLOWMIN = 0.5;
const FOLLOWMAX = 4;
const BONUSSCORE = 14;

AFRAME.registerComponent("initializer", {
  init: function() {
    this.score = 0;
    const scene = this.el;
    const head = document.querySelector("#headObj");

    head.setAttribute("plane-collider", true);

    scene.speed = DELAYMAX;
    scene.setAttribute("snake-controller", { head });
    scene.setAttribute("wasd-relative", true); // depends on snake-controller

    scene.addEventListener("bad-collision", () => {
      const sky = document.querySelector("#sky");
      sky.setAttribute("color", "red");
      scene.setAttribute("fog", "type: exponential; color: #AAA; density: .00");
      const camera = document.querySelector("#camera");
      camera.removeAttribute("follow");
    });

    scene.addEventListener("gobbled-apple", this.handleGobble.bind(this));
  },

  handleGobble(evt) {
    function removeApple(e) {
      if (e.detail.el.classList.contains("apple")) {
        e.detail.el.parentNode.removeChild(e.detail.el);
      }
    }

    function incrementScore(score) {
      score += 1;
      const scoreOutput = document.querySelector("#scoreOutput");
      scoreOutput.innerText = score;
      scoreOutput.classList.remove("score-animation");
      void scoreOutput.offsetWidth; // use css hack to trigger animation
      scoreOutput.classList.add("score-animation");
      return score;
    }

    function addApple(scene) {
      var entity = document.createElement("a-entity");
      entity.setAttribute("mixin", "apple");
      entity.setAttribute("class", "apple collidable");
      entity.setAttribute("random-position", "fixedY: 1.25");
      scene.appendChild(entity);
    }

    function updateCameraSpeed(speed) {
      const camera = document.querySelector("#camera");
      const oldRange = DELAYMIN - DELAYMAX; // change follow inversely to delay
      const newRange = FOLLOWMAX - FOLLOWMIN;
      const newSpeed = (speed - DELAYMAX) * newRange / oldRange + FOLLOWMIN;
      camera.setAttribute("follow", "speed", newSpeed);
    }

    if (this.el.isPlaying) {
      // remove apple
      removeApple(evt);

      // update score
      this.score = incrementScore(this.score);

      // add apple to scene if we're in bonus
      if (this.score >= BONUSSCORE) {
        addApple(this.el.sceneEl);
      }

      // speed up game
      this.el.speed -= SPEEDUP;
      if (this.el.speed < DELAYMIN) this.el.speed = DELAYMIN;

      // speed up camera
      updateCameraSpeed(this.el.speed);
    }
  }
});

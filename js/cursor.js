let pageState = null;

var cursor = {
  delay: 8,
  _x: 0,
  _y: 0,
  endX: window.innerWidth / 2,
  endY: window.innerHeight / 2,
  cursorVisible: true,
  cursorEnlarged: false,
  cursorSwatch: false,
  cursorAnchor: false,
  $dot: document.querySelector(".cursor-dot"),
  $outline: document.querySelector(".cursor-dot-outline"),
  // $wrapper: document.querySelector(".wrapper"),

  init: function () {
    // Set up element sizes
    this.dotSize = this.$dot.offsetWidth;
    this.outlineSize = this.$outline.offsetWidth;

    this.setupEventListeners();
    this.animateDotOutline();
  },

  //     updateCursor: function(e) {
  //         var self = this;

  //         console.log(e)

  //         // Show the cursor
  //         self.cursorVisible = true;
  //         self.toggleCursorVisibility();

  //         // Position the dot
  //         self.endX = e.pageX;
  //         self.endY = e.pageY;
  //         self.$dot.style.top = self.endY + 'px';
  //         self.$dot.style.left = self.endX + 'px';
  //     },

  setupEventListeners: function () {
    var self = this;

    // Anchor hovering
    document.querySelectorAll("a, .swatch").forEach(function (el) {
      el.addEventListener("mouseover", function () {
        self.cursorEnlarged = true;
        self.toggleCursorSize();
      });
      el.addEventListener("mouseout", function () {
        self.cursorEnlarged = false;
        self.toggleCursorSize();
      });
    });

    // Swatch sticking
    // document
    //   .querySelector(".swatch")
    //   .addEventListener("mouseover", function () {
    //     self.cursorSwatch = true;
    //     self.toggleCursorSwatch();
    //   });
    // document.querySelector(".swatch").addEventListener("mouseout", function () {
    //   self.cursorSwatch = false;
    //   self.toggleCursorSwatch();
    // });

    // Anchor sticking
    document.querySelectorAll(".capture").forEach((a) => {
      a.addEventListener("mouseover", function (e) {
        console.log(e.target.getBoundingClientRect());
        self.cursorAnchor = true;
        self.toggleCursorAnchor(e.target.getBoundingClientRect(), e.target.id);
      });
      a.addEventListener("mouseout", function () {
        self.cursorAnchor = false;
        self.toggleCursorAnchor();
      });
    });

    // Click events
    document.addEventListener("mousedown", function () {
      self.cursorEnlarged = true;
      self.toggleCursorSize();
    });
    document.addEventListener("mouseup", function () {
      self.cursorEnlarged = false;
      self.toggleCursorSize();
    });

    document.addEventListener("mousemove", function (e) {
      // Show the cursor
      self.cursorVisible = true;
      self.toggleCursorVisibility();

      // Position the dot
      if (!self.cursorSwatch && !self.cursorAnchor) {
        self.endX = e.pageX;
        self.endY = e.pageY;
        self.$dot.style.top = self.endY + "px";
        self.$dot.style.left = self.endX + "px";
      }
    });

    // Hide/show cursor
    document.addEventListener("mouseenter", function (e) {
      self.cursorVisible = true;
      self.toggleCursorVisibility();
      self.$dot.style.opacity = 1;
      self.$outline.style.opacity = 1;
    });

    document.addEventListener("mouseleave", function (e) {
      self.cursorVisible = true;
      self.toggleCursorVisibility();
      self.$dot.style.opacity = 0;
      self.$outline.style.opacity = 0;
    });
  },

  animateDotOutline: function () {
    var self = this;

    if (!self.cursorSwatch && !self.cursorAnchor) {
      self._x += (self.endX - self._x) / self.delay;
      self._y += (self.endY - self._y) / self.delay;
      self.$outline.style.top = self._y + "px";
      self.$outline.style.left = self._x + "px";
    }

    requestAnimationFrame(this.animateDotOutline.bind(self));
  },

  toggleCursorSize: function () {
    var self = this;

    if (self.cursorEnlarged) {
      self.$dot.style.borderColor = "black";
      self.$dot.style.transform = "translate(-50%, -50%) scale(2.5)";
      if (!self.cursorSwatch && !self.cursorAnchor) {
        self.$outline.style.transform = "translate(-50%, -50%) scale(1.4)";
      } else {
        self.$outline.style.transform = "translate(-50%, -50%) scale(1.8)";
      }
    } else {
      self.$dot.style.transform = "translate(-50%, -50%) scale(1)";
      self.$dot.style.borderColor = "transparent";
      self.$outline.style.transform = "translate(-50%, -50%) scale(1)";
    }
  },

  toggleCursorVisibility: function () {
    var self = this;

    if (self.cursorVisible) {
      self.$dot.style.opacity = 1;
      self.$outline.style.opacity = 1;
    } else {
      self.$dot.style.opacity = 0.5;
      self.$outline.style.opacity = 0.5;
    }
  },

  // toggleCursorSwatch: function () {
  //   var self = this;

  //   if (self.cursorSwatch) {
  //     self.$dot.style.top = "calc(2vw + 2px)";
  //     self.$dot.style.left = "calc(2vw + 2px)";
  //     self.$dot.style.transition = "all 0.2s ease-in-out";
  //     self.$outline.style.top = "calc(2vw + 2px)";
  //     self.$outline.style.left = "calc(2vw + 2px)";
  //   } else {
  //     self.$dot.style.transition =
  //       "opacity 0.3s ease-in-out, transform 0.1s ease-in-out, border-color 0.3s ease-in-out";
  //   }
  // },

  toggleCursorAnchor: function (e, id) {
    var self = this;
    console.log(e);

    if (self.cursorAnchor && id !== pageState) {
      self.$dot.style.top = `calc(${e.top - e.height / 2}px + 1rem)`;
      self.$dot.style.left = `${e.x + e.width / 2}px`;
      self.$dot.style.transition = "all 0.2s ease-in-out";
      self.$outline.style.top = `${e.y - e.height / 2}px`;
      self.$outline.style.left = `${e.x + e.width / 2}px`;
      self.$outline.style.backgroundColor = "#ffffff44";
      self.$outline.style.border = "2px solid #000";
      self.$outline.style.width = `${e.width * 1.1}px`;
      self.$outline.style.height = "3vw";
      self.$outline.style.borderRadius = "3px";
      self.$outline.style.transform = "translate(-50%, -50%)";
    } else {
      self.$dot.style.transition =
        "opacity 0.3s ease-in-out, transform 0.1s ease-in-out, border-color 0.3s ease-in-out";
      self.$outline.style.width = "1.5rem";
      self.$outline.style.height = "1.5rem";
      self.$outline.style.backgroundColor = "#ffffff88";
      self.$outline.style.border = "none";
      self.$outline.style.borderRadius = "50%";
    }
  },
};

cursor.init();

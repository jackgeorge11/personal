var transitions = {
  pageState: undefined,
  $wrapper: document.querySelector(".wrapper"),
  $nav: document.querySelector("nav"),
  $colorSwap: document.querySelector(".colorSwap"),
  directions: {
    home: {
      trans: ["0vh", "10%"],
    },
    projects: {
      trans: ["-100vh", "30%"],
    },
    contact: {
      trans: ["-200vh", "40%"],
    },
    arr: ["home", "projects", "contact"],
  },
  transitionDisabled: false,

  init: function () {
    window.onload = () => {
      const path = window.location.pathname.substring(
        1,
        window.location.pathname.length
      );
      this.pageState = path ? path : "home";
    };

    this.setupEventListeners();
  },

  setupEventListeners: function () {
    var self = this;

    document
      .querySelector("html")
      .addEventListener("wheel", async function (e) {
        var delta = e.wheelDelta || -e.detail;

        if (
          !self.transitionDisabled &&
          e.deltaY > 25 &&
          self.pageState !== "contact"
        ) {
          self.transitionDisabled = true;
          let idx = self.directions.arr.findIndex((e) => e === self.pageState);
          self.handleTransition(self.directions.arr[idx + 1]);
          await self.sleep(1500);
          self.transitionDisabled = false;
        } else if (
          !self.transitionDisabled &&
          delta > 0 &&
          self.pageState !== "home"
        ) {
          self.transitionDisabled = true;
          let idx = self.directions.arr.findIndex((e) => e === self.pageState);
          self.handleTransition(self.directions.arr[idx - 1]);
          await self.sleep(1500);
          self.transitionDisabled = false;
        }
      });
  },

  sleep: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  handleTransition: function (dir) {
    console.log("executing", this.pageState, dir);
    if (this.pageState && this.pageState !== dir) {
      this.$wrapper.style.top = this.directions[dir].trans[0];
      this.$nav.style.top = this.directions[dir].trans[1];
      this.$colorSwap.style.bottom = this.directions[dir].trans[1];
      this.pageState = dir;
    }
  },
};

transitions.init();

// let pageState;
// const $wrapper = document.querySelector(".wrapper");
// const $nav = document.querySelector("nav");
// const directions = {
//   home: {
//     trans: ["0vh", "10%"],
//   },
//   projects: {
//     trans: ["100vh", "35%"],
//   },
//   contact: {
//     trans: ["2000vh", "40%"],
//   },
//   arr: ["home", "contact", "projects"],
// };
// let transitionDisabled = false;

// const sleep = (ms) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

// const handleTransition = (dir) => {
//   console.log("executing", pageState, dir);
//   if (pageState && pageState !== dir) {
//     $wrapper.style.transform = `translateY(${directions[dir].trans[0]})`;
//     $nav.style.top = directions[dir].trans[1];
//     pageState = dir;
//   }
// };

// window.onload = () => {
//   const path = window.location.pathname.substring(
//     1,
//     window.location.pathname.length
//   );
//   pageState = path ? path : "home";
//   handleTransition(pageState);
// };

// document.querySelector("html").addEventListener("wheel", async function (e) {
//   var delta = e.wheelDelta || -e.detail;
//   console.log(transitionDisabled, pageState);

//   if (!transitionDisabled && pageState) {
//     transitionDisabled = true;
//     if (e.deltaY > 10 && pageState !== "contact") {
//       let idx = directions.arr.findIndex((e) => e === pageState);
//       console.log(idx);
//       handleTransition(directions.arr[idx + 1]);
//     } else if (delta > 0 && pageState !== "home") {
//       let idx = directions.arr.findIndex((e) => e === pageState);
//       console.log(idx);
//       handleTransition(directions.arr[idx - 1]);
//     }
//     await sleep(900);
//     transitionDisabled = false;
//   }
// });

// document.querySelectorAll(".false-link").forEach((a) => {
//   a.addEventListener("click", (e) => {
//     e.preventDefault();
//     const toward = e.target.id;
//     if (pageState !== toward) {
//       pageState = toward;
//       window.history.pushState("", "", pageState === "home" ? "/" : pageState);
//       handleTransition(pageState);
//     }
//   });
// });

// // const handleTransition = async (p) => {
// //   $wrapper.classList.add(`fade-out`);
// //   await sleep(300);
// //   $wrapper.className = `wrapper ${p}`;

// //   // const pages = ["home", "projects", "about", "contact"];
// //   // const i = pages.indexOf(pageState);
// //   // pages.splice(i, 1);
// //   // $wrapper.classList.add(pageState);
// //   // pages.forEach((p) => $wrapper.classList.remove(p));
// // };

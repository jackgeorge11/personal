export let pageState = undefined;
const $wrapper = document.querySelector(".wrapper");

window.onload = () => {
  pageState = window.location.pathname.substring(
    1,
    window.location.pathname.length
  );
  handleTransition(pageState ? pageState : "home");
};

document.querySelectorAll(".false-link").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const toward = e.target.id;
    if (pageState !== toward) {
      pageState = toward;
      window.history.pushState("", "", pageState === "home" ? "/" : pageState);
      handleTransition(pageState);
    }
  });
});

const handleTransition = (p) => {
  $wrapper.className = `wrapper ${p}`;
  // const pages = ["home", "projects", "about", "contact"];
  // const i = pages.indexOf(pageState);
  // pages.splice(i, 1);
  // $wrapper.classList.add(pageState);
  // pages.forEach((p) => $wrapper.classList.remove(p));
};

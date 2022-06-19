import "core-js/stable";
import "regenerator-runtime/runtime";
import { AnimateText } from "./js/animateText";
import { AnimateInView } from "./js/animateInView";
import $ from "jquery";
import { body, wantsReducedMotion, respondWidth } from "./js/variables";
import "./js/previewer";
import "./js/toolTips";

// Window properties
let innerWidth = window.innerWidth;

// navigation
const navigation = document.getElementsByClassName("navigation")[0];
const toTopArrow = document.getElementsByClassName("to-top")[0];

// Button for changing screen theme to dark or light
const modeChangeBtn = document.getElementsByClassName("dark-mode")[0];

// Phone navigation
const phoneCover = document.getElementsByClassName("navigation__cover")[0];
const hamburgerMenu = document.getElementsByClassName("navigation__button")[0];
const phoneMenu = document.getElementsByClassName("navigation__link-box")[0];

// webpage svg (Home page)
const webpageHomeSvgs = Array.from(
  document.getElementsByClassName("home-header__svg")
);

//  In-page scrolling buttons (Education page)
const scrollToButton = Array.from(
  document.querySelectorAll(".button.button--down-arrow")
);

// Elements that will have a custom tool tip
const toolTipElements = Array.from(document.querySelectorAll(".has-tool-tip"));

// Event to tell custom tool tips to hide
const customMouseOut = new CustomEvent("pageScrolling");

// Event to tell previewer of a window resize
const customBodyEvent = new CustomEvent("resizePreviewer");

// GLOBAL PAGE COMPONENTS -------

// Scroll to top arrow
if (toTopArrow) {
  toTopArrow.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Design previewer
$(".in-site").on("click", function () {
  $(".previewer").addClass("previewer--active");
  $(".previewer__zoomer").html("");
  $(this)
    .data("src")
    .split(",")
    .forEach((src) => {
      $(".previewer__zoomer").append(
        `<img src=${src} alt=${src} class="previewer__img" />`
      );
    });
  $("body").css("overflow", "hidden");
});

$(".previewer__close").on("click", function () {
  $(".previewer").removeClass("previewer--active");
  $("body").css("overflow", "");
});

// Hide all custom tooltips
const toolTipHide = () => {
  toolTipElements.forEach((el) => {
    el.dispatchEvent(customMouseOut);
  });
};

// NAVIGATION -------

//Desktop page scrolling
const scrolling = () => {
  if (window.scrollY >= 10) {
    navigation.classList.add("navigation--active");
    toTopArrow.classList.add("to-top--active");
    // Hide all custom tool tips
    toolTipHide();
    return true;
  }
  navigation.classList.remove("navigation--active");
  toTopArrow.classList.remove("to-top--active");
};

// Phone/tablet page scrolling
const scrollingPhone = () => {
  if (window.scrollY >= 10) {
    toTopArrow.classList.add("to-top--active");
    return true;
  }
  toTopArrow.classList.remove("to-top--active");
};

// Restrict the rate the scrolling function is called
// with requestAnimationFrame()
const navScrollDesktop = function () {
  requestAnimationFrame(scrolling);
  return true;
};

// Restrict the rate the scrollingPhone function is called
// with requestAnimationFrame()
const navScrollPhone = function () {
  requestAnimationFrame(scrollingPhone);
  return true;
};

// Determine which window scrolling event
const shouldNavScroll = function () {
  if (innerWidth > respondWidth && navScrollDesktop()) {
    window.addEventListener("scroll", navScrollDesktop, { passive: true });
    window.removeEventListener("scroll", navScrollPhone, { passive: true });
    return true;
  }
  navigation.classList.remove("navigation--active");
  window.removeEventListener("scroll", navScrollDesktop, { passive: true });
  window.addEventListener("scroll", navScrollPhone, { passive: true });
};

// Toggle navigation on phone
const phoneNavViewChange = () => {
  hamburgerMenu.classList.toggle("navigation__button--active");
  phoneMenu.classList.toggle("navigation__link-box--active");
  phoneCover.classList.toggle("navigation__cover--active");
};

// Listen for click on hamburger menu on phone
if (hamburgerMenu) {
  phoneCover.addEventListener("touchstart", phoneNavViewChange);
  //hamburgerMenu.addEventListener("touchmove", phoneNavViewChange);
  phoneCover.addEventListener("click", phoneNavViewChange);
  hamburgerMenu.addEventListener("click", phoneNavViewChange);
  hamburgerMenu.blur();
}

// WINDOW EVENTS ------
if (!wantsReducedMotion) {
  window.addEventListener("load", (e) => {
    // Animation for home page webpage svgs on load
    webpageHomeSvgs.forEach((el, i) => {
      el.classList.add(`home-header__svg-${i + 1}--active`);
    });

    // Body transition for changing theme mode
    body.style.transition = "all .2s";

    // Determine which scrolling function
    // the Window should call on scroll
    if (navigation) shouldNavScroll();
  });
} else {
  navigation.classList.add("navigation--active");
  toTopArrow.classList.add("to-top--active");
  webpageHomeSvgs.forEach((el) => {
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
  });
}

// Redetermine which scrolling function
// the Window should call on scroll
window.addEventListener("resize", function (e) {
  innerWidth = customBodyEvent.width = $(window).width();
  if (!wantsReducedMotion) shouldNavScroll();
  body.dispatchEvent(customBodyEvent);
});

// DARK MODE -------

// toggles screen mode to dark or light
const changeMode = function () {
  if (body.getAttribute("class")) {
    this.setAttribute("title", "Dark mode");
    this.setAttribute("data-title", "Dark mode");
    this.firstElementChild.style.display = "";
    this.lastElementChild.style.display = "none";

    body.classList.remove("body--dark-mode");
    document.cookie = `mode=light; SameSite=Strict`;
    return true;
  }
  this.setAttribute("title", "Light mode");
  this.setAttribute("data-title", "Light mode");
  this.firstElementChild.style.display = "none";
  this.lastElementChild.style.display = "";

  body.classList.add("body--dark-mode");
  document.cookie = `mode=dark; SameSite=Strict`;
};

// Listen for click on button
modeChangeBtn.addEventListener("click", changeMode);
if (document.cookie.includes("mode=dark")) changeMode.call(modeChangeBtn);
else modeChangeBtn.lastElementChild.style.display = "none";

// Check bowsers color theme and use it on website
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches &&
  !document.cookie.includes("mode=")
) {
  changeMode.call(modeChangeBtn);
}

// PAGE COMPONENTS

// In-page scolling buttons. Scoll to page section with
// the id of the button's date-id attribute
scrollToButton.forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById(this.dataset.id).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Display couse work for the wide tiles (class of wide-tiles)
$(".wide-tiles .wide-tiles__sub").slideToggle(0);
$(".wide-tiles button.button--plus.button--no-margin:not(.button--hidden)").on(
  "click",
  function () {
    $(this).toggleClass("wide-tiles__open");
    $(this.parentElement.nextElementSibling).slideToggle(500);
  }
);

// PAGE SPECIFIC JS

// Contact page popup map
$(".map").css("display", "block");
$("#map").on("click", function (e) {
  e.preventDefault();
  $(".map iframe").attr(
    "src",
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d345967.06803882046!2d-123.25882165682371!3d47.35598050156522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5491d0c45198e82d%3A0x41f1d9fc4177d646!2sMason%20County%2C%20WA!5e0!3m2!1sen!2sus!4v1647728336739!5m2!1sen!2sus"
  );
  $(".map").addClass("map--active");
});

$("button.map__button").on("click", function () {
  $(".map").removeClass("map--active");
});

// Contact page email popup
$("#internet-contact").on("click", function (e) {
  e.preventDefault();
  $(".show-internet-mail .paragraph--center").html(`
      me<svg viewBox="0 0 18.660156 19.830078" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 19.8301C7.18994 19.8301 6.16504 19.6399 5.1748 19.26C4.18506 18.8799 3.2998 18.3 2.52002 17.52C1.74023 16.74 1.125 15.7451 0.674805 14.5349C0.225098 13.325 0 11.8899 0 10.23C0 8.3501 0.325195 6.63501 0.975098 5.08496C1.625 3.53491 2.64502 2.30005 4.03516 1.37988C5.4248 0.459961 7.22021 0 9.41992 0C11.3999 0 13.0801 0.375 14.46 1.125C15.8398 1.875 16.8848 2.96509 17.5952 4.39502C18.3052 5.82495 18.6602 7.58008 18.6602 9.65991C18.6602 10.72 18.5449 11.7151 18.3149 12.645C18.085 13.575 17.71 14.3301 17.1899 14.9099C16.6699 15.49 15.9502 15.78 15.0298 15.78C14.29 15.78 13.6499 15.585 13.1099 15.1951C12.5698 14.8049 12.2402 14.3501 12.1201 13.8301C11.6001 14.3701 11.0752 14.7849 10.5449 15.075C10.0151 15.365 9.31006 15.51 8.43018 15.51C7.77002 15.51 7.1499 15.405 6.56982 15.1951C5.99023 14.9851 5.52979 14.6399 5.18994 14.1599C4.8501 13.6799 4.68018 13.04 4.68018 12.24C4.68018 11.3201 4.91992 10.615 5.3999 10.125C5.87988 9.63501 6.56006 9.30005 7.43994 9.12012C8.31982 8.93994 9.35986 8.8501 10.5601 8.8501L11.8501 8.8501L11.8501 8.28003C11.8501 7.3999 11.6152 6.75488 11.145 6.34497C10.6748 5.93506 9.93018 5.72998 8.91016 5.72998C8.27002 5.72998 7.7749 5.79004 7.4248 5.90991C7.0752 6.03003 6.7998 6.15503 6.6001 6.28491C6.3999 6.41504 6.22021 6.47998 6.06006 6.47998C5.93994 6.47998 5.83008 6.42993 5.72998 6.33008C5.62988 6.22998 5.55518 6.11011 5.50488 5.96997C5.45508 5.83008 5.43018 5.71997 5.43018 5.63989C5.43018 5.36011 5.625 5.11011 6.01514 4.88989C6.40479 4.66992 6.89014 4.49512 7.47021 4.36499C8.0498 4.23511 8.62988 4.16992 9.20996 4.16992C10.0898 4.16992 10.8452 4.32007 11.4751 4.62012C12.105 4.91992 12.5952 5.35498 12.9448 5.92505C13.2949 6.49512 13.4702 7.18994 13.4702 8.01001L13.4702 12.99C13.5298 13.45 13.73 13.8149 14.0698 14.085C14.4102 14.355 14.77 14.49 15.1499 14.49C15.5698 14.49 15.915 14.345 16.1851 14.0549C16.4551 13.7649 16.6602 13.385 16.7998 12.915C16.9399 12.4451 17.0352 11.9451 17.085 11.415C17.1348 10.885 17.1602 10.3701 17.1602 9.87012C17.1602 7.25 16.5249 5.19507 15.2549 3.70508C13.9849 2.21509 12.02 1.46997 9.35986 1.46997C7.85986 1.46997 6.60986 1.70508 5.60986 2.17505C4.60986 2.64502 3.80518 3.29492 3.19482 4.125C2.58496 4.95508 2.14502 5.88989 1.875 6.92993C1.60498 7.96997 1.47021 9.06006 1.47021 10.2C1.47021 11.26 1.58984 12.2849 1.83008 13.2749C2.06982 14.2649 2.45996 15.145 3 15.915C3.54004 16.6851 4.25488 17.2949 5.14502 17.7451C6.03516 18.1951 7.14014 18.4199 8.45996 18.4199C9.33984 18.4199 10.0552 18.3401 10.605 18.1799C11.1548 18.02 11.5952 17.865 11.9248 17.7151C12.2549 17.5649 12.5098 17.49 12.6899 17.49C12.8901 17.49 13.0449 17.5649 13.1548 17.7151C13.2651 17.865 13.3198 18.01 13.3198 18.1499C13.3198 18.3501 13.1699 18.55 12.8701 18.75C12.5698 18.95 12.165 19.1299 11.6548 19.29C11.145 19.45 10.5898 19.5801 9.99023 19.6799C9.39014 19.78 8.81006 19.8301 8.25 19.8301L8.25 19.8301ZM8.63965 14.1902C9.31982 14.1902 9.8999 14.0601 10.3799 13.8C10.8599 13.54 11.2349 13.22 11.5049 12.8401C11.7749 12.46 11.9097 12.0901 11.9097 11.73L11.9097 10.0801L10.6797 10.0801C9.85986 10.0801 9.125 10.125 8.4751 10.2151C7.82471 10.3052 7.31006 10.5051 6.92969 10.8152C6.5498 11.125 6.35986 11.6001 6.35986 12.24C6.35986 12.9202 6.58008 13.415 7.02002 13.7251C7.45996 14.0352 8 14.1902 8.63965 14.1902L8.63965 14.1902Z" stroke="none" />
      </svg>jamescoolidge&#46;com
  `);
  $(".show-internet-mail").addClass("show-internet-mail--active");
});

$("#internet-contact-close").on("click", function () {
  $(".show-internet-mail").removeClass("show-internet-mail--active");
});

// ANIMATIONS -------

if (!wantsReducedMotion) {
  // animation each (except home) page h1 element text
  if (document.querySelector(".header__container"))
    new AnimateText(".header__container", {
      write: 100,
      startPause: 100,
      endPause: 3000,
    }).start();

  // Animation card and footer svgs (drawing circle)
  // when they come into view.
  new AnimateInView(
    ".cards__card > svg",
    "cards__svg--active",
    0.5
  ).observation();
  new AnimateInView(
    ".footer__contact svg",
    "footer__svg--active"
  ).observation();
} else {
  new AnimateText(".header__container", {
    write: 100,
    startPause: 100,
    endPause: 3000,
  }).showAccessibility();
  new AnimateInView(
    ".cards__card > svg",
    "cards__svg--active"
  ).showAccessibility();
  new AnimateInView(
    ".footer__contact svg",
    "footer__svg--active"
  ).showAccessibility();
}

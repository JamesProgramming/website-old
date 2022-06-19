import $ from "jquery";
import { body } from "./variables";

// Max width that image can zoom. The zoom % scale is determined by dividing the
// image pixal width by 10.
let maxImageWidth = Math.trunc(($(window).width() - 90) / 10);

// Input (text input with custom filtering) for zoom level
const zoomLevelInput = document.getElementsByClassName(
  "previewer__zoom-level"
)[0];

if (zoomLevelInput) {
  // Initial zoom to 100% (zoom scale is image width divived by 10)
  let zoomScale = 100;
  let zoomInterval;

  // Minimum zoom scale
  const minWidth = 20;

  // ckeck if screen less than 1000px wide
  if (zoomScale >= maxImageWidth) {
    zoomLevelInput.value = zoomScale = maxImageWidth;
    $(".previewer__zoomer").css("width", `${zoomScale * 10}px`);
  } else {
    $(".previewer__zoomer").css("width", `${zoomScale * 10}px`);
    zoomLevelInput.value = zoomScale;
  }

  zoomLevelInput.addEventListener("input", function (e) {
    e.preventDefault();

    // Get in put value and filer out all none numeric values.
    this.value = this.value
      .split("")
      .map((letter) => (isNaN(letter) ? "" : letter))
      .join("");
  });

  const focusLeavingInput = function (e) {
    // Value in zoom scale
    const displayValue = this.value;

    // Apply input scale if input box losses foucus or user presses 'enter' key
    if (e.key === "Enter" || e.type === "focusout") {
      // Value greater than max width
      if (displayValue * 1 > maxImageWidth) {
        this.value = zoomScale = maxImageWidth;

        // Value less than min width
      } else if (displayValue * 1 < minWidth) {
        this.value = minWidth;
        zoomScale = minWidth;
      } else {
        this.value = displayValue;
        zoomScale = displayValue * 1;
      }

      // Set the image holder to the new width
      $(".previewer__zoomer").css("width", `${zoomScale * 10}px`);
    }
  };

  zoomLevelInput.addEventListener("keypress", focusLeavingInput);
  zoomLevelInput.addEventListener("focusout", focusLeavingInput);

  // Zoom out button
  $(".previewer .previewer__zooming-out").on("mousedown", function () {
    if (zoomScale <= minWidth) return true;

    // Fire this interval every 70 milliseconds
    zoomInterval = setInterval(function () {
      zoomScale -= 1;
      $(".previewer__zoomer").css("width", `${zoomScale * 10}px`);
      zoomLevelInput.value = zoomScale;

      if (zoomScale <= minWidth) clearInterval(zoomInterval);
    }, 70);
  });

  // If mouse leaves button or mouse 'mouseup' event is fired, clear the zoomInterval.
  $(".previewer .previewer__zooming-out").on("mouseup", function () {
    clearInterval(zoomInterval);
  });
  $(".previewer .previewer__zooming-out").on("mouseleave", function () {
    clearInterval(zoomInterval);
  });

  $(".previewer .previewer__zooming-in").on("mousedown", function () {
    // If the image is wider than or equal to the max width.
    if ($(".previewer__img").outerWidth(true) / 10 >= maxImageWidth)
      return true;

    zoomInterval = setInterval(function () {
      zoomScale += 1;
      $(".previewer__zoomer").css("width", `${zoomScale * 10}px`);
      zoomLevelInput.value = zoomScale;

      if ($(".previewer__img").outerWidth(true) / 10 >= maxImageWidth)
        clearInterval(zoomInterval);
    }, 70);
  });

  // If mouse leaves button or mouse 'mouseup' event is fired, clear the zoomInterval.
  $(".previewer .previewer__zooming-in").on("mouseup", function () {
    clearInterval(zoomInterval);
  });
  $(".previewer .previewer__zooming-in").on("mouseleave", function () {
    clearInterval(zoomInterval);
  });

  // This event is fired every time the window is resized.
  // It resets the maxImageWidth and resize the image holder
  // if it exceeds the new window width.
  body.addEventListener("resizePreviewer", (e) => {
    maxImageWidth = Math.trunc((e.width - 90) / 10);

    if (zoomScale >= maxImageWidth) {
      zoomLevelInput.value = zoomScale = maxImageWidth;
      $(".previewer__zoomer").css("width", `${zoomScale * 10}px`);
    }
  });
}

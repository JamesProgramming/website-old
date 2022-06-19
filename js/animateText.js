/**
 * @author James J. Coolidge <jamesjcoolidge.space>
 * @class
 */

export class AnimateText {
  /**
   * This types the letters in the each of the element returned for the query
   * created by the `elementQuery`. Each element can have one child element.
   * However, all the text in the child element will read written to the screen immediately.
   * @param {string} elementQuery - string used to create DOM query
   * @param {object} options - animation time and delay options
   */
  constructor(elementQuery, { write, endPause = 200, startPause = 500 }) {
    this.write = write;
    this.endPause = endPause;
    this.startPause = startPause;
    this.element = document.querySelector(elementQuery);
  }

  /**
   * Call to start animation
   * @async
   */
  async start() {
    // wait to start animation
    await this.promisifyTimeout(() => true, this.startPause);

    // first element child
    let child = this.element.firstElementChild;

    // skip child if it is an image
    if (child.tagName.toLowerCase() === "svg") child = child.nextElementSibling;

    // animate first child element
    await this.addTextAnimation(child);

    // check if there is a sibling and animate it
    while (child.nextElementSibling) {
      await this.addTextAnimation(child.nextElementSibling);

      // addTextAnimation injects a duplicate element before each child.
      // The next child to animate would be after the next silbing element
      child = child.nextElementSibling.nextElementSibling;
    }

    // keep cursor flashing once done write text
    child.previousElementSibling.classList.add(`cursor--flash`);

    // hide cursor
    setTimeout(() => {
      child.previousElementSibling.classList.remove(`cursor--flash`);
    }, this.endPause);
  }

  // animates the current node element
  async addTextAnimation(currentElement) {
    await new Promise((res, rej) => {
      // create a new element with same tag name
      const element = document.createElement(
        currentElement.tagName.toLowerCase()
      );

      // if the element has classes, remove the
      // classes that end with the name hide or break.
      if (currentElement.classList[0])
        element.setAttribute(
          "class",
          `${[...currentElement.classList]
            .map((el) =>
              el.endsWith("hide") || el.endsWith("break") ? "" : el
            )
            // CHANGE CURSOR LOCATION (CSS)
            .join(" ")} cursor`
        );

      currentElement.insertAdjacentElement("beforebegin", element);

      let currentElementList = currentElement.innerHTML.split("");

      // create IIFE to run code asynchronously
      (async () => {
        for (let i = 0; i < currentElementList.length; i++) {
          // if the current element has a child element
          if (currentElementList[i] === "<") {
            const last = currentElementList.lastIndexOf(">");
            i = last;
            currentElementList[i] = currentElement.firstElementChild.outerHTML;
            currentElement.innerHTML = currentElement.innerHTML.replace(
              /<.*>[.\n\s\S]*<.*>/,
              ""
            );
          }

          await this.promisifyTimeout(
            () => (element.innerHTML += currentElementList[i]),
            Math.floor(this.write + Math.random() * 100)
          );

          currentElement.innerHTML = currentElement.innerHTML
            .split("")
            .splice(1)
            .join("");
        }

        element.classList.remove(`cursor`);
        return res();
      })();
    });
  }

  // calls the callBack function after in
  // the time specified in the time param.
  promisifyTimeout(callBack, time) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        callBack();
        res();
      }, time);
    });
  }

  // Show text immediately after load for accessiblity
  showAccessibility() {
    let child = this.element.firstElementChild;

    while (child) {
      child.setAttribute(
        "class",
        `${[...child.classList]
          .map((el) => (el.endsWith("hide") || el.endsWith("break") ? "" : el))
          // CHANGE CURSOR LOCATION (CSS)
          .join(" ")}`
      );

      child = child.nextElementSibling;
    }
  }
}

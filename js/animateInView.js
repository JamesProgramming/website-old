/**
 * Animate element when coming into view
 * @author James J. Coolidge <jamesjcoolidge.space>
 */
export const AnimateInView = class {
  /**
   * Add a class when element comes into viewport
   * @param {String} elements - elements to observe
   * @param {String} className - class name to add
   * @param {Number} intersectionRatio - Percentage of element showing when class should be added
   */
  constructor(elements, className, intersectionRatio = 0) {
    this.elements = document.querySelectorAll(elements);
    this.className = className;
    this.intersectionRatio = intersectionRatio;
  }

  intersection() {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.intersectionRatio > this.intersectionRatio)
            el.target.classList.add(this.className);
        });
      },
      { threshold: [1] }
    );
  }

  observation() {
    const intersection = this.intersection();
    this.elements.forEach((el) => {
      intersection.observe(el);
    });
  }

  // For Accessibility (allows animation to be run immediately)
  showAccessibility() {
    this.elements.forEach((el) => {
      el.classList.add(this.className);
    });
  }
};

class DraggableElement {
  #element
  constructor(element) {
    this.#element = element
  }

  get top() { return this.#style("top") }
  set top(val) { this.#setProperty("--top", val) }

  get bottom() { return this.#style("bottom") }
  set bottom(val) { this.#setProperty("--bottom", val) }

  get left() { return this.#style("left") }
  set left(val) { this.#setProperty("--left", val) }

  get right() { return this.#style("right") }
  set right(val) { this.#setProperty("--right", val) }

  get minHeight() { return this.#style("min-height") }

  #setProperty(property, val, units = "px") { this.#element.style.setProperty(property, `${val}${units}`) }

  #style(property) { return parseInt(getComputedStyle(this.#element).getPropertyValue(property)) }
}
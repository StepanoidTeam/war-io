export class Status {
  constructor(el) {
    this.el = el;
  }

  update(col, row) {
    this.el.innerText = `${col
      .toString()
      .padStart(2, "0")}:${row.toString().padStart(2, "0")}`;
  }
}

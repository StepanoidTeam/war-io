import { html, render } from "https://unpkg.com/lit-html@latest/lit-html.js";

const container = document.getElementById("unit-editor");

function select(items, selected, callback) {
  return html`
    <select @change=${event => callback(event.target.value)}>
      ${items.map(
        item =>
          html`
            <option ?selected=${item === selected}>${item}</option>
          `
      )}
    </select>
  `;
}

function editorTemplate(item) {
  if (!item)
    return html`
      <div>nothing selected</div>
    `;

  const numEditor = propName => {
    const handler = event => {
      const { value } = event.target;
      const intValue = Number.parseInt(value);

      if (isNaN(intValue)) return;

      item[propName] = intValue;
    };
    return html`
      <label>
        ${propName}

        <input type="text" value="${item[propName]}" @input=${handler} />
      </label>
    `;
  };

  item.tileCodes;

  //
  //
  //<div>cords: ${item.x}, ${item.y}</div>
  return html`
    <div class="unit-editor flex col">
      <div>type: ${item.constructor.name}</div>

      ${numEditor("x")} ${numEditor("y")}
      ${select(item.tileCodes, item.animation, value => {
        item.setAnimation(value);
      })}

      <button @click=${() => {}}>Click Me</button>
    </div>
  `;
}

export function showEditor(item) {
  render(editorTemplate(item), container);
}

render(editorTemplate(null), container);

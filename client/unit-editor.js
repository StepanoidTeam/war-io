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

function editorTemplate(entity) {
  if (!entity)
    return html`
      <div>nothing selected</div>
    `;

  const numEditor = propName => {
    const handler = event => {
      const { value } = event.target;
      const intValue = Number.parseInt(value);

      if (isNaN(intValue)) return;

      entity[propName] = intValue;
    };
    return html`
      <label>
        ${propName}

        <input type="text" value="${entity[propName]}" @input=${handler} />
      </label>
    `;
  };

  //
  //
  //<div>cords: ${item.x}, ${item.y}</div>
  return html`
    <div class="unit-editor flex col">
      <div>type: ${entity.constructor.name}</div>

      ${entity.x && numEditor("x")} ${entity.y && numEditor("y")}
      ${entity.animation &&
        select(entity.tileCodes, entity.animation, value => {
          entity.setAnimation(value);
        })}

      <button @click=${() => {}}>Click Me</button>
    </div>
  `;
}

export function showEditor(entity) {
  render(editorTemplate(entity), container);
}

render(editorTemplate(null), container);

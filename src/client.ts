export function injectStyle(content: string) {
  const id = "_VITE_REPLACE_COLOR_";
  const style = document.getElementById(id) || document.createElement("style");
  if (!content) {
    style.parentNode && style.parentNode.removeChild(style);
    return;
  }
  if (style.innerHTML === content) return;
  style.id = style.id || id;
  style.innerHTML = content;
  if (style.parentNode !== document.body) document.body.appendChild(style);
}

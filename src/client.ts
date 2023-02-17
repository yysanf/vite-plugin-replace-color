export const STYLE_ID = "_VITE_REPLACE_COLOR_";

export function injectStyle(content: string) {
  const style =
    document.getElementById(STYLE_ID) || document.createElement("style");
  if (!content) {
    style.parentNode && style.parentNode.removeChild(style);
    return;
  }
  style.id = style.id || STYLE_ID;
  style.innerHTML = content;
  if (style.parentNode !== document.body) document.body.appendChild(style);
}

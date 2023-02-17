export const rgbRegStr = "(rgba?)\\(([\\d\\,\\.\\s\\/\\%]+)\\)";
export const colorReg = new RegExp(`(#[a-zA-Z0-9]+)|(${rgbRegStr})`, 'g');

const rgbReg = new RegExp(rgbRegStr);

export function parseRgba(rgba: string) {
  const match = rgba.match(rgbReg);
  if (match) {
    const [_, _r, value] = match;
    const space = !value.includes(",");
    const rgbs = value
      .replace(/\s*\/\s*/, space ? " " : ",")
      .split(space ? /\s+/ : /\s*,\s*/);

    const hex = rgbs.reduce((r, s, i) => {
      const n = s.includes("%")
        ? Number(Math.ceil((parseInt(s) / 100) * 255))
        : i === 3
        ? Math.ceil(Number(s) * 255)
        : Number(s);
      return r + n.toString(16);
    }, "");
    if (rgbs.length < 4) rgbs.push("1");
    return {
      hex: "#" + hex,
      alpha: rgbs[3],
    };
  }
}

export function formatHex(hex: string) {
  return (
    hex.length <= 4
      ? hex
          .split("")
          .map((s) => s + s)
          .join("")
      : hex
  ).toLocaleLowerCase();
}

import { Plugin } from "vite";
import { formatHex, parseRgba, colorReg } from "./utils";
import { createFilter } from "vite";

export interface Options {
  colorVariables: Record<string, string | { hex?: string; rgb?: string }>;
  styleId?: string;
  customerReplaceVariable?: (decl: Record<string, any>) => string | void;
  includes?: Array<string | RegExp> | string | RegExp;
  exclude?: Array<string | RegExp> | string | RegExp;
  ignoreMark?: string;
}

const pluginName = "vite-plugin-replace-color";
const IGNORE_MARK = "ignore color";

function parseColorVariables(colors: Options["colorVariables"]) {
  const hexVariables = {},
    rgbVariables = {};
  Object.keys(colors).forEach((k) => {
    const val = colors[k];
    if (typeof val === "string") {
      hexVariables[k] = val;
    } else {
      const { hex, rgb } = val;
      if (hex) hexVariables[k] = hex;
      if (rgb) rgbVariables[k] = rgb;
    }
  });
  return {
    hexVariables,
    rgbVariables,
  };
}

export default function replaceCssVar(options: Options): Plugin {
  const { colorVariables, styleId } = options;
  const { hexVariables, rgbVariables } = parseColorVariables(colorVariables);
  // 用 hex 颜色匹配 rgb
  function matchRgb(hex: string, alpha: number | string) {
    const color = rgbVariables[hex.slice(0, 7)];
    if (color) {
      return `rgb(${color}${color.includes(",") ? "," : "/"}${alpha})`;
    }
  }
  function replace({ value }: { value: string; [key: string]: unknown }) {
    return value.replace(colorReg, (s) => {
      const isHex = s.startsWith("#");
      if (isHex) {
        const hex = formatHex(s);
        if (hexVariables[hex]) return hexVariables[hex];
        if (hex.length === 9) {
          // 9位的尝试计算 rgb
          const alpha =
            Math.ceil((parseInt("0x" + hex.slice(-2)) / 255) * 100) / 100;
          return matchRgb(hex.slice(0, 7), alpha) || s;
        }
      } else {
        const rgb = parseRgba(s);
        return (rgb && matchRgb(rgb.hex, rgb.alpha)) || s;
      }
      return s;
    });
  }

  const filter = createFilter(options.includes, options.exclude);
  const replaceVariable = options.customerReplaceVariable || replace;
  const mark = options.ignoreMark || IGNORE_MARK;
  return {
    name: pluginName,
    config(config) {
      const css: any = config.css || {};
      if (!config.css) config.css = css;
      if (!css.postcss) css.postcss = {};
      if (!css.postcss.plugins) css.postcss.plugins = [];
      const plugins = css.postcss.plugins;
      // 添加 postcss 插件处理 css 有关颜色的属性
      plugins.push({
        postcssPlugin: "postcss-vite-replace",
        Once(root) {
          const file = root.source.input.file;
          if (!filter(file)) return;
          root.walkDecls((decl) => {
            const val = replaceVariable(decl);
            if (val) {
              if (val === decl.value) return;
              const next = decl.next();
              if (next && next.type === "comment" && next.text === mark) return;
              decl.value = val;
            } else if (val === "") decl.remove();
          });
        },
      });
    },
    transform(code, id) {
      if (id.includes(pluginName) && /client\.js/.test(id)) {
        return {
          code: styleId ? code.replace("_VITE_REPLACE_COLOR_", styleId) : code,
          map: this.getCombinedSourcemap(),
        };
      }
    },
  };
}

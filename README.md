# vite-plugin-replace-color

## 简介
- 替换css文件中的颜色 或者 自定替换css 的属性；搭配 css变量可实现动态切换主题色

## 安装

**node version:** >=16.0.0

**vite version:** >=3.0.0

```bash
npm i vite-plugin-replace-color -D
# or
yarn add vite-plugin-replace-color -D
# or
pnpm install vite-plugin-replace-color -D
```

## 使用

- vite.config.ts 中的配置插件

```ts
import replaceColorPlugin from 'vite-plugin-replace-color'
import path from 'path'
export default () => {
  return {
    plugins: [
      replaceColorPlugin({
        colorVariables: {
          //  定义 rgb 时 会替换 rgb() 里面的 内容 透明度不会修改
          // color: #fff  --> color: var(--c5-white)
          // backgroud: rgb(255,255,255,0.2) --->  backgroud:rgb(var(--c5-white-rgb)/0.2)
          "#fff": { hex: "var(--c5-white)", rgb: "var(--c5-white-rgb)" },
          "#2563f4": { hex: "var(--c5-color)", rgb: "var(--c5-rgb)" },
          "#409eff": "var(--c5-color)",
        },
        styleId: "_VITE_REPLACE_COLOR_", // 注入自定义css 内容 时  style标签名
      }),
    ],
  }
}
```
## 示例
```css
.color {
  color: #2563f4;
  background-color: rgb(#2563f4, 0.4); // 有透明度 会从 rgb 属性中去匹配
  box-sizing: 0 0 1 rgb(37 99 244);
  border-color: #2563f466; // 8位带颜色的 也会从 rgb 属性中去匹配
}
```
- 颜色替换结果
```css
.color {
  color: var(--c5-color);
  background-color: rgb(var(--c5-rgb)/0.4);
  border-color: rgb(var(--c5-rgb)/0.4);
  box-sizing: 0 0 1 var(--c5-color);
}
```

### 参数说明

| 参数 | 类型 | 默认值/参数 | 必填 | 说明 |
| ---------   | --------- | --------- | --------- | --------- |
| colorVariables    | `Record<string, string \| { hex?: string; rgb?: string }>` | - | 是 | 声明替换的颜色 |
| styleId | `string` | `_VITE_REPLACE_COLOR_` | 否 | 注入自定义css 内容 时  style标签名 |
| customerReplaceVariable      | `(decl,postcss) => string` | decl,postcss | 否 | 自定义替换css属性 参数postcss的declaration和result  (https://postcss.org/api#result) |

### 辅助功能
- injectStyle   创建style标签 写入一些自定义css 到页面中  内容为空则删除 style标签
```
import { injectStyle } from "vite-plugin-replace-theme/es/client";
injectStyle(`:root { --c5-color: #2563F4; --c5-rgb: 37 99 244;}`)
```

import typescript from "@rollup/plugin-typescript";

const defaultConfig = {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/index.js",
      format: "cjs",
    },
    {
      file: "./es/index.js",
      format: "esm",
    },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
};

const clientConfig = {
  input: "./src/client.ts",
  output: [
    {
      file: "./dist/client.js",
      format: "cjs",
    },
    {
      file: "./es/client.js",
      format: "esm",
    },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
};
export default process.env.MODE === "client" ? clientConfig : defaultConfig;

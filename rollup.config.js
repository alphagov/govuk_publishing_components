import resolve from "@rollup/plugin-node-resolve"
import buble from '@rollup/plugin-buble';
import { glob } from 'glob';
import fs from 'fs';

// uhhh

//  document.querySelectorAll('[data-module*="layout-super-navigation-header"]').forEach((el) => {
  //   console.log(el)
  //   var instance = new LayoutSuperNavigationHeader(el);    
  //   instance.init();
  // })

const templateForExportedJS = (input, name) => `
  ${input}
  document.querySelectorAll('[data-module*="${name}"]').forEach((el) => {
    var instance = new ${name.split("-").map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join("")}(el);
    instance.init();
  })
`;

// i dont need this now
const camelCaseMaker = input => input.split("-").slice(1).reduce((string, x) => `${string}${x[0].toUpperCase()}${x.slice(1)}`, input.split("-")[0])

const capitalizer = input => input.split("-").reduce((string, x) => `${string}${x[0].toUpperCase()}${x.slice(1)}`, "");

const defaultConfig = input => ({
  input,
  output: {
    file: `app/assets/builds/${input.match(/(\w|-)+(?=\.js)/g)[0]}.js`,
    format: "iife",
    name: capitalizer(input.match(/(\w|-)+(?=\.js)/g)[0]),
    inlineDynamicImports: false,
    sourcemap: true // maybe? idk
  },
  plugins: [
    resolve(),
    buble({
      transforms: {
        modules: false
      }
    }),
    {
      writeBundle: ({ file }) => {
        const data = fs.readFileSync(file, {encoding:'utf8'});
        fs.writeFileSync(file, templateForExportedJS(data, file.match(/(\w|-)+(?=\.js)/g)[0]), {encoding:'utf8'});
      }
    }
  ],
});

export default glob("app/assets/javascripts/govuk_publishing_components/modules/*.js")
               .then(files => files.map(file => defaultConfig(file)))
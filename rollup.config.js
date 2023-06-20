import resolve from "@rollup/plugin-node-resolve"
import buble from '@rollup/plugin-buble';
import { polyfill } from 'rollup-plugin-polyfill'
import { glob } from 'glob';
import uglify from "uglify-js";
import fs from 'fs';

// my only thought rly is about polyfills? i guess are those npm modules? you'd just install those...?
// hmm probably need smth like this

const polyfillConfig = {
  "gem-accordion": ["./app/assets/javascripts/govuk_publishing_components/vendor/polyfills/common.js"],
  "gem-accordion-extend": ["./app/assets/javascripts/govuk_publishing_components/vendor/polyfills/common.js"]
}

const capitalizer = input => input.split("-").reduce((string, x) => `${string}${x[0].toUpperCase()}${x.slice(1)}`, "");

// for this way, we would have no window object anymore
// if you include a script in the header, it would self execute

// const templateForExportedJS = (input, name) => `
//   ${input}
//   document.querySelectorAll('[data-module*="${name}"]').forEach((el) => {
//     var instance = new ${name.split("-").map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join("")}(el);
//     instance.init();
//   })
// `;

// for this way, we would still have the window object
// but you would only include the scripts you wanted
// and then initAll would only init what is actually in
// the window object

const templateForExportedJS = (input, name) => `
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

${input}

window.GOVUK.Modules.${capitalizer(name)} = ${capitalizer(name)}
`;


const defaultConfig = input => ({
  input,
  output: {
    file: `app/assets/builds/${input.match(/(\w|-)+(?=\.js)/g)[0]}.js`,
    format: "iife",
    name: capitalizer(input.match(/(\w|-)+(?=\.js)/g)[0]),
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
        // uglify works fine, but im gonna not use it for now for easier debugging
        // fs.writeFileSync(file, uglify.minify(templateForExportedJS(data, file.match(/(\w|-)+(?=\.js)/g)[0])).code, {encoding:'utf8'});
        fs.writeFileSync(file, templateForExportedJS(data, file.match(/(\w|-)+(?=\.js)/g)[0]), {encoding:'utf8'});
      }
    },
  ],
});

export default glob("app/assets/javascripts/govuk_publishing_components/modules/*.js")
               .then(files => files.map(file => defaultConfig(file)))
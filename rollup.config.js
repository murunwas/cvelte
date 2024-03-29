import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json";
import postcss from 'rollup-plugin-postcss'

const production = !process.env.ROLLUP_WATCH;

const { name } = pkg;

const output= !production? {
	sourcemap: true,
	format: 'iife',
	name: 'app',
	file: 'public/bundle.js'
}:[
	{
		file: pkg.module,
		format: "es",
		sourcemap: true,
		name
	},
	{
		file: pkg.main,
		format: "umd",
		sourcemap: true,
		name
	}
];


const input= !production?'src/main.js':"src/index.js";

export default {
	input,
  output,
	plugins: [
		postcss({extract: false}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			// css: css => {
			// 	css.write('public/bundle.css');
			// }
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

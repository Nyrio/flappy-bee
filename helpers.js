const path = require("path");

const root = path.resolve(__dirname, ".");
const resolve = p => path.resolve(root, p);

exports.root = root;
exports.resolve = resolve;

exports.paths = {
	root,
	src: {
		dir: resolve("src"),
		assets: resolve("assets")
	},
	build: {
		dir: resolve("dist"),
		assets: resolve("dist/assets")
	}
};
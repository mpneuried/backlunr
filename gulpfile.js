const { src, dest, series } = require("gulp");
const coffee = require("gulp-coffee");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const header = require("gulp-header");

const pkg = require("./package.json");
const banner = [
	"/**",
	" * <%= pkg.name %> - <%= pkg.description %>",
	" * @version v<%= pkg.version %>",
	" * @link <%= pkg.homepage %>",
	" * @license <%= pkg.license %>",
	" */",
	"",
].join("\n");

function compress() {
	return (
		src("backlunr.js")
			//.pipe(uglify())
			.pipe(header(banner, { pkg: pkg }))
			.pipe(
				rename({
					extname: ".min.js",
				})
			)
			.pipe(dest("."))
	);
}
function compile() {
	return src("_src/backlunr.coffee")
		.pipe(coffee())
		.pipe(header(banner, { pkg: pkg }))
		.pipe(dest("."));
}
function compileTest() {
	return src("_src/test.coffee")
		.pipe(coffee())
		.pipe(header(banner, { pkg: pkg }))
		.pipe(dest("test"));
}

const release = series(compileTest, compile, compress);

exports.compile = compile;
exports.compileTest = compileTest;
exports.release = release;
exports.compileAll = series(compileTest, compile);

exports.default = release;

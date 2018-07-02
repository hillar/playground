default:release

serve:
	rollup -c rollup.config.js -w -m

release:
	rm -rf dist/main.*
	rollup src/main.js --file dist/main.js --format es

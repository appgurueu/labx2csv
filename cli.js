#!/usr/bin/env node

const { convert, filename } = require("./index.js")

const arguments = process.argv.slice(2)

try {
	if (arguments.length > 4) throw new SyntaxError("Too many arguments")
	else if (arguments.length < 1) throw new SyntaxError("<infile> is required")

	const infile = arguments[0]
	const outfile = filename(infile)
	let params = {
		infile,
		outfile,
		spacing: 2,
		transpose: true
	}
	if (arguments.length > 1) {
		params.outfile = arguments[1]
		if (arguments.length > 2) {
			try {
				params.spacing = parseInt(arguments[2])
			} catch (e) {
				throw new SyntaxError("[spacing] needs to be a valid integer")
			}
			if (arguments.length > 3) {
				params.transpose = {
					y: true,
					yes: true,
					t: true,
					true: true,
					n: false,
					no: false,
					f: false,
					false: false
				}[arguments[3].toLowerCase()]
				if (params.transpose === undefined) {
					throw new SyntaxError("[transpose] needs to be a valid boolean")
				}
			}
		}
	}
	fs.readFile(params.infile, function (err, data) {
		if (err) throw err
		params.input = data
		params.callback = output => {
			fs.writeFile(params.outfile, output, err => {
				if (err) throw err
				console.log("Wrote " + params.outfile)
			})
		}
		convert(params)
	})
} catch (e) {
	if (e instanceof SyntaxError) console.error(e.message + ". Syntax: <infile> [outfile] [spacing] [transpose]")
	else {
		console.error("Writing .csv failed:")
		throw e
	}
}

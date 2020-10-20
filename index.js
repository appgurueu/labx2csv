const { xml2js } = require("xml-js")
const stringify = require("csv-stringify")

function convert(params) {
	const { input, callback, spacing, transpose } = params
	const channels = xml2js(input, { compact: true, ignoreComment: true }).cassylab.allchannels.channels
	let rows = []
	for (const the_channels of channels) {
		for (const channel of the_channels.channel) {
			if (channel.quantity._text === "Index" || channel.values._attributes.count === "0") continue
			rows.push([channel.quantity._text + " [" + channel.unit._text + "]", ...channel.values.value.map(x => parseFloat(x._text))])
		}
	}
	let new_rows = []
	if (transpose) {
		let x = 0
		for (let i = 0; i < rows.length / 2; i++) {
			for (let j = 0; j < rows[i].length; j++) {
				if (new_rows.length <= j) new_rows.push(Array(x).fill(""))
				else {
					for (let l = new_rows[j].length; l < x; l++) new_rows[j].push("")
				}
				new_rows[j].push(rows[i][j])
			}
			let second_row = rows[i + rows.length / 2]
			for (let j = 0; j < second_row.length; j++) {
				new_rows[j].push(second_row[j])
			}
			x += 2 + spacing
		}
	} else {
		for (let i = 0; i < rows.length / 2; i++) {
			new_rows.push(rows[i])
			new_rows.push(rows[i + rows.length / 2])
			for (let j = 0; j < spacing; j++) new_rows.push([])
		}
	}
	stringify(new_rows, function (err, output) {
		if (err) throw err
		callback(output)
	})
}

function filename(file) {
	return file.substring(0, file.lastIndexOf(".")) + ".csv"
}

module.exports = { convert, filename }

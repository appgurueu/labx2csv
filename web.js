$ = require("jquery")
const { saveAs } = require("file-saver")
const { convert, filename } = require("./index.js")

const labx = document.getElementById("labx")
let current_action
const action = text => {
	current_action = text
	$("#action").text(text)
}
const download = $("#download")
const processing = $("#processing")
let file, outfile
$("#labx").on("change", () => {
	file = labx.files[0]
	download.attr("disabled", false)
	// HACK this should be handled by Bootstrap JS
	$("[for=labx]").text(file.name)
})

download.on("click", e => {
	e.preventDefault()
	if (current_action == "Download") {
		saveAs(outfile, filename(file.name))
		action("Process")
		return
	}
	action("Processing…")
	processing.show()
	const reader = new FileReader()
	reader.onload = e => {
		convert({
			input: e.target.result,
			spacing: parseInt($("#spacing").val()),
			transpose: $("#transpose").is(":checked"),
			callback: output => {
				outfile = new Blob([output], { type: "text/csv;charset=utf-8" })
				action("Download")
				processing.hide()
			}
		})
	}
	reader.readAsText(file)
})

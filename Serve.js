// const HTTP = require("http")

// HTTP.createServer((request, response) => {
// 	response.sendFile("Horaire.html")
// 	response.end
// }).listen(process.env.PORT)


const EXPRESS = require("express")
const APP = EXPRESS()
const PORT = process.env.PORT

APP.get("/", (request, response) => {
	response.sendFile("Horaire.html")
})

APP.listen(PORT || 80, () => {
	console.info(`Application en marche! Port : ${PORT}.`)
})
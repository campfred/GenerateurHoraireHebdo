const EXPRESS = require("express")
const APP = EXPRESS()
const PORT = process.env.port

APP.get("/", (request, response) => {
	response.sendFile("Horaire.html")
})

APP.listen(PORT || 80, () => {
	console.info(`Application en marche! Port : ${PORT}.`)
})
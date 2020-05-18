const EXPRESS = require("express")
const APP = express()

applicationCache.get("/", (request, response) => {
	response.sendFile("Horaire.html")
})

applicationCache.listen(process.env.port || 80)
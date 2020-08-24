// moment.locale(navigator.language || navigator.userLanguage)
moment.locale("fr-CA")

/**
 * Constantes pour programmation paresseuse
 */
// Événements
const click = "click"
const change = "change"
// Types d'éléments DOM
const table = "table"
const thead = "thead"
const tbody = "tbody"
const tr = "tr"
const th = "th"
const td = "td"
const div = "div"
const span = "span"
const input = "input"
const select = "select"
const option = "option"
const button = "button"

/**
 * Données générales
 */
const TYPES_SÉANCES = ["Cours", "Travail pratique", "Laboratoire", "Autre"]
const JOURS_SEMAINE = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const ICÔNES = {
	AJOUTER: "add_circle-black-24dp.svg",
	AJOUTER_ALT: "➕",
	SUPPRIMER: "remove_circle-black-24dp.svg",
	SUPPRIMER_ALT: "❌"
}

/**
 * Repris de la réponse de rew sur StackOverflow.
 * https://stackoverflow.com/a/57444006
 */
function obtenirSaisonCourante() {
	const dateCourante = new Date()

	let tabSaisons = [
		{ nom: "printemps", date: new Date(dateCourante.getFullYear(), 2, (dateCourante.getFullYear() % 4 === 0) ? 19 : 20).getTime() },
		{ nom: "été", date: new Date(dateCourante.getFullYear(), 5, (dateCourante.getFullYear() % 4 === 0) ? 20 : 21).getTime() },
		{ nom: "automne", date: new Date(dateCourante.getFullYear(), 8, (dateCourante.getFullYear() % 4 === 0) ? 22 : 23).getTime() },
		{ nom: "hiver", date: new Date(dateCourante.getFullYear(), 11, (dateCourante.getFullYear() % 4 === 0) ? 20 : 21).getTime() }
	]

	return (tabSaisons.filter(({ date }) => date <= dateCourante).slice(-1)[0] || { nom: "hiver" }).nom
}

function obtenirAnnéeCourante() {
	return moment().year()
}

function majusculerPremièreLettre(chaîne) {
	return chaîne[0].toUpperCase() + chaîne.slice(1).toLowerCase()
}


/*
	Logique de traitement d'info
*/

function récupérerDonnéesÉtudiant() {
	return {
		nom: (() => {
			let nom = document.getElementById("donnéesÉtudiantNom").value
			var chaîneNom = undefined
			if (nom) {
				chaîneNom = ""
				for (let indexLettre = 0; indexLettre < nom.length; indexLettre++) {
					const lettre = nom[indexLettre];
					if (indexLettre > 0) {
						const lettrePrécédente = nom[indexLettre - 1]
						chaîneNom += lettrePrécédente == " " || lettrePrécédente == "-" ? lettre.toUpperCase() : lettre.toLowerCase()
					} else {
						chaîneNom = lettre.toUpperCase()
					}
				}
			}
			return chaîneNom
		})(),
		code: document.getElementById("donnéesÉtudiantCodePermanent").value,
		session: {
			saison: document.getElementById("donnéesÉtudiantSessionSaison").value,
			année: document.getElementById("donnéesÉtudiantSessionAnnée").value
		}
	}
}

function récupérerDonnéesCours() {
	let tabDonnéesCours = []
	const rangéesTableau = document.getElementById("grilleDonnéesCours").children[1].children

	for (let indexRangée = 0; indexRangée < rangéesTableau.length; indexRangée++) {
		const rangéeCours = rangéesTableau[indexRangée];
		let colonnesCours = rangéeCours.children

		let rangéesTableauSéances = colonnesCours[5].firstElementChild.children[1].children
		let séances = []
		for (let indexRangéeSéance = 0; indexRangéeSéance < rangéesTableauSéances.length; indexRangéeSéance++) {
			const rangéeSéance = rangéesTableauSéances[indexRangéeSéance];
			const colonnesSéance = rangéeSéance.children
			let donnéesSéance = {}
			if (colonnesSéance[0].firstElementChild.value) {
				donnéesSéance.type = colonnesSéance[0].firstElementChild.value
			}
			if (donnéesSéance.local) {
				donnéesSéance.local = colonnesSéance[1].firstElementChild.value
			}
			if (colonnesSéance[3].firstElementChild.value) {
				donnéesSéance.horaire = moment().day(colonnesSéance[2].firstElementChild.selectedIndex)
					.hours(colonnesSéance[3].firstElementChild.value.split(":")[0])
					.minutes(colonnesSéance[3].firstElementChild.value.split(":")[1])
			}
			if (colonnesSéance[4].firstElementChild.value) {
				donnéesSéance.durée = moment.duration({
					hours: colonnesSéance[4].firstElementChild.value.split(":")[0],
					minutes: colonnesSéance[4].firstElementChild.value.split(":")[1],
				})
			}
			if (donnéesSéance.type && donnéesSéance.horaire && donnéesSéance.durée) {
				séances.push(donnéesSéance)
			}
		}
		let donnéesCours = {
			code: colonnesCours[0].firstElementChild.value ? colonnesCours[0].firstElementChild.value : undefined,
			groupe: colonnesCours[1].firstElementChild.value ? colonnesCours[1].firstElementChild.value : undefined,
			nom: colonnesCours[2].firstElementChild.value ? colonnesCours[2].firstElementChild.value : undefined,
			crédits: colonnesCours[3].firstElementChild.value ? colonnesCours[3].firstElementChild.value : undefined,
			icône: colonnesCours[4].firstElementChild.value ? colonnesCours[4].firstElementChild.value : undefined,
			séances: séances.length > 0 ? séances : undefined
		}
		if (donnéesCours.code && donnéesCours.séances) {
			tabDonnéesCours.push(donnéesCours)
		}
	}

	return tabDonnéesCours
}

function donnéesCoursSontSuffisantes() {
	let donnéesCours = récupérerDonnéesCours()
	var donnéesSontSuffisantes = donnéesCours.length > 0

	donnéesCours.forEach(cours => {
		if (!cours.code) { donnéesSontSuffisantes = false }
		if (cours.séances) {
			cours.séances.forEach(séance => {
				if (!séance.type || !séance.horaire || !séance.durée) {
					donnéesSontSuffisantes = false
				}
			})
		} else { donnéesSontSuffisantes = false }
	})

	return donnéesSontSuffisantes
}

function décoderSession(codeSession) {
	let descripteurSession = { saison: undefined, année: undefined }
	switch (codeSession[0]) {
		case "A":
			descripteurSession.saison = "automne"
			break;
		case "H":
			descripteurSession.saison = "hiver"
			break;
		case "E":
			descripteurSession.saison = "été"
			break;
		case "P":
			descripteurSession.saison = "printemps"
			break;
		default:
			break;
	}
	descripteurSession.année = parseInt(`20${codeSession.slice(1)}`)
	return descripteurSession
}

function obtenirLimitesJours(coursSession) {
	var jourMin = moment().day(1) // Limite prédéfinie à Lundi
	var jourMax = moment().day(5) // Limite prédéfinie à Vendredi

	coursSession.forEach(cours => {
		cours.séances.forEach(séance => {
			if (séance.horaire.day() < jourMin.day()) {
				jourMin.day(séance.horaire.day())
			}
			if (séance.horaire.day() > jourMax.day()) {
				jourMax.day(séance.horaire.day())
			}
		})
	})

	return { min: jourMin, max: jourMax }
}

function obtenirLimitesHeures(coursSession) {
	var heureMin = moment().hours(12).minutes(0)
	var heureMax = moment().hours(13).minutes(0)

	coursSession.forEach(cours => {
		cours.séances.forEach(séance => {
			if (séance.horaire.hours() < heureMin.hours()) {
				heureMin.hours(séance.horaire.hours())
				// if (séance.horaire.minutes() != heureMin.minutes()) {
				// 	heureMin.minutes(séance.horaire.minutes())
				// }
			}
			let finSéance = séance.horaire.clone().add(séance.durée)
			if (finSéance.hours() >= heureMax.hours()) {
				heureMax.hours(finSéance.hours())
				// if (finSéance.minutes() > heureMax.minutes()) {
				if (finSéance.minutes() > heureMax.minutes()) {
					heureMax.add(1, "hours")
				}
			}
		})
	})

	return { min: heureMin, max: heureMax }
}

function obtenirGrandeurDivisionsHeures(coursSession) {
	var minutesHeureDébut = 60
	coursSession.forEach(cours => {
		cours.séances.forEach(séance => {
			if (séance.horaire.minutes() != 0 && séance.horaire.minutes() < minutesHeureDébut) {
				minutesHeureDébut = séance.horaire.minutes()
			} else if (séance.durée.minutes() != 0 && séance.durée.minutes() < minutesHeureDébut) {
				minutesHeureDébut = séance.durée.minutes()
			}
		})
	})

	return minutesHeureDébut
}

/*
	Génération d'éléments de page
*/

function mettreÀJourTitrePage() {
	let donnéesÉtudiant = récupérerDonnéesÉtudiant()
	var chaîneNom = undefined
	if (donnéesÉtudiant.nom) {
		chaîneNom = donnéesÉtudiant.nom.split(" ")[0]
	}
	if (donnéesÉtudiant.session.année || donnéesÉtudiant.session.saison) {
		var chaîneSession = undefined
		if (donnéesÉtudiant.session.saison) {
			chaîneSession = donnéesÉtudiant.session.saison[0].toUpperCase()
			if (donnéesÉtudiant.session.année) {
				chaîneSession = donnéesÉtudiant.session.saison[0].toUpperCase() + donnéesÉtudiant.session.année.toString().slice(-2)
			} else {
				chaîneSession = majusculerPremièreLettre(donnéesÉtudiant.session.saison)
			}
		} else if (donnéesÉtudiant.session.année) {
			chaîneSession = donnéesÉtudiant.session.année
		}
	}
	document.title = `Horaire${chaîneNom ? " " + chaîneNom : ""}${chaîneSession ? " - " + chaîneSession : ""}`
}

function ajouterRangéeDonnéesCours(nœudHTMLTableau) {
	function ajouterRangéeCours(rangéeActuelle) {
		function ajouterRangéeSéance(corpsTableauSéanceActuelle) {
			rangéeSéance = document.createElement(tr)
			corpsTableauSéanceActuelle.appendChild(rangéeSéance)
			// Type
			let colonneSéanceType = document.createElement(td)
			rangéeSéance.appendChild(colonneSéanceType)
			let listeDéroulanteTypes = document.createElement(select)
			colonneSéanceType.appendChild(listeDéroulanteTypes)
			listeDéroulanteTypes.setAttribute("class", "type")
			TYPES_SÉANCES.forEach(typeSéance => {
				let choix = document.createElement(option)
				listeDéroulanteTypes.appendChild(choix)
				choix.setAttribute("value", typeSéance.toLowerCase())
				choix.innerText = typeSéance
			})
			// Local
			let colonneSéanceLocal = document.createElement(td)
			rangéeSéance.appendChild(colonneSéanceLocal)
			let champsSéanceLocal = document.createElement(input)
			colonneSéanceLocal.appendChild(champsSéanceLocal)
			champsSéanceLocal.setAttribute("class", "local")
			// Jour
			let colonneSéanceJour = document.createElement(td)
			rangéeSéance.appendChild(colonneSéanceJour)
			let listeDéroulanteJours = document.createElement(select)
			colonneSéanceJour.appendChild(listeDéroulanteJours)
			listeDéroulanteJours.setAttribute("class", "jour")
			JOURS_SEMAINE.forEach(jourSemaine => {
				let choix = document.createElement(option)
				listeDéroulanteJours.appendChild(choix)
				choix.setAttribute("value", jourSemaine.toLowerCase())
				choix.innerText = jourSemaine.slice(0, 3) + "."
			})
			// Heure début
			let colonneSéanceHeureDébut = document.createElement(td)
			rangéeSéance.appendChild(colonneSéanceHeureDébut)
			let champsSéanceHeureDébut = document.createElement(input)
			colonneSéanceHeureDébut.appendChild(champsSéanceHeureDébut)
			champsSéanceHeureDébut.setAttribute("class", "heureDébut")
			champsSéanceHeureDébut.setAttribute("type", "time")
			champsSéanceHeureDébut.setAttribute("step", 15 * 60)
			// Durée
			let colonneSéanceDurée = document.createElement(td)
			rangéeSéance.appendChild(colonneSéanceDurée)
			let champsSéanceDurée = document.createElement(input)
			colonneSéanceDurée.appendChild(champsSéanceDurée)
			champsSéanceDurée.setAttribute("class", "durée")
			champsSéanceDurée.setAttribute("type", "time")
			champsSéanceDurée.setAttribute("step", 15 * 60)
			// Bouton
			let colonneSéanceContrôle = document.createElement(td)
			rangéeSéance.appendChild(colonneSéanceContrôle)
			let boutonSéanceAjouter = document.createElement("IMG")
			colonneSéanceContrôle.appendChild(boutonSéanceAjouter)
			boutonSéanceAjouter.setAttribute("src", ICÔNES.AJOUTER)
			boutonSéanceAjouter.setAttribute("alt", ICÔNES.AJOUTER_ALT)
			boutonSéanceAjouter.setAttribute("class", "ajouterSéance")
			boutonSéanceAjouter.addEventListener(click, (evenementBoutonAjout) => {
				ajouterRangéeSéance(corpsTableauSéanceActuelle)
				let boutonSéanceSupprimer = document.createElement("IMG")
				evenementBoutonAjout.target.replaceWith(boutonSéanceSupprimer)
				boutonSéanceSupprimer.setAttribute("src", ICÔNES.SUPPRIMER)
				boutonSéanceSupprimer.setAttribute("alt", ICÔNES.SUPPRIMER_ALT)
				boutonSéanceSupprimer.setAttribute("class", "supprimerSéance")
				boutonSéanceSupprimer.addEventListener(click, (evenementBoutonSupprimer) => {
					evenementBoutonSupprimer.target.parentElement.parentElement.remove()
					rafraîchirTableaux()
				})
			})
		}

		// Code
		let colonneCoursCode = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursCode)
		colonneCoursCode.setAttribute("class", "colonneCoursCode")
		let champsCoursCode = document.createElement(input)
		colonneCoursCode.appendChild(champsCoursCode)
		champsCoursCode.setAttribute("class", "codeCours")
		// Groupe
		let colonneCoursGroupe = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursGroupe)
		let champsCoursGroupe = document.createElement(input)
		colonneCoursGroupe.appendChild(champsCoursGroupe)
		champsCoursGroupe.setAttribute("class", "groupe")
		champsCoursGroupe.setAttribute("type", "number")
		champsCoursGroupe.setAttribute("min", 0)
		// Nom
		let colonneCoursNom = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursNom)
		let champsCoursNom = document.createElement(input)
		colonneCoursNom.appendChild(champsCoursNom)
		champsCoursNom.setAttribute("class", "nom")
		// Crédits
		let colonneCoursCrédits = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursCrédits)
		let champsCoursCrédits = document.createElement(input)
		colonneCoursCrédits.appendChild(champsCoursCrédits)
		champsCoursCrédits.setAttribute("class", "crédits")
		champsCoursCrédits.setAttribute("type", "number")
		champsCoursCrédits.setAttribute("min", 0)
		// Icône
		let colonneCoursIcône = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursIcône)
		let champsCoursIcône = document.createElement(input)
		colonneCoursIcône.appendChild(champsCoursIcône)
		champsCoursIcône.setAttribute("class", "icône")
		// Séances
		let colonneCoursSéances = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursSéances)
		let tableCoursSéances = document.createElement(table)
		colonneCoursSéances.appendChild(tableCoursSéances)
		tableCoursSéances.setAttribute("class", "tableSéances")
		let entêteTableauSéance = document.createElement(thead)
		tableCoursSéances.appendChild(entêteTableauSéance)
		let rangéeSéance = document.createElement(tr)
		entêteTableauSéance.appendChild(rangéeSéance)

		let colonneSéanceTitreType = document.createElement(th)
		rangéeSéance.appendChild(colonneSéanceTitreType)
		colonneSéanceTitreType.innerText = "Type"

		let colonneSéanceTitreLocal = document.createElement(th)
		rangéeSéance.appendChild(colonneSéanceTitreLocal)
		colonneSéanceTitreLocal.innerText = "Local"

		let colonneSéanceTitreJour = document.createElement(th)
		rangéeSéance.appendChild(colonneSéanceTitreJour)
		colonneSéanceTitreJour.innerText = "Jour"

		let colonneSéanceTitreHeureDébut = document.createElement(th)
		rangéeSéance.appendChild(colonneSéanceTitreHeureDébut)
		colonneSéanceTitreHeureDébut.innerText = "Heure début"

		let colonneSéanceTitreDurée = document.createElement(th)
		rangéeSéance.appendChild(colonneSéanceTitreDurée)
		colonneSéanceTitreDurée.innerText = "Durée"

		let colonneSéanceTitreContrôle = document.createElement(th)
		rangéeSéance.appendChild(colonneSéanceTitreContrôle)

		let corpsTableauSéance = document.createElement(tbody)
		tableCoursSéances.appendChild(corpsTableauSéance)
		ajouterRangéeSéance(corpsTableauSéance)
		// Bouton
		let colonneCoursContrôle = document.createElement(td)
		rangéeActuelle.appendChild(colonneCoursContrôle)
		colonneCoursContrôle.setAttribute("class", "colonneCoursContrôle")
		let boutonCoursAjouter = document.createElement("IMG")
		colonneCoursContrôle.appendChild(boutonCoursAjouter)
		boutonCoursAjouter.setAttribute("class", "ajouterCours")
		boutonCoursAjouter.setAttribute("src", ICÔNES.AJOUTER)
		boutonCoursAjouter.setAttribute("alt", ICÔNES.AJOUTER_ALT)
		boutonCoursAjouter.addEventListener(click, (e) => {
			ajouterRangéeDonnéesCours(nœudHTMLTableau)
			let boutonCoursSupprimer = document.createElement("IMG")
			e.target.replaceWith(boutonCoursSupprimer)
			boutonCoursSupprimer.setAttribute("class", "supprimerCours")
			boutonCoursSupprimer.setAttribute("src", ICÔNES.SUPPRIMER)
			boutonCoursSupprimer.setAttribute("alt", ICÔNES.SUPPRIMER_ALT)
			boutonCoursSupprimer.addEventListener(click, (e) => {
				e.target.parentElement.parentElement.remove()
				rafraîchirTableaux()
			})
		})
	}

	let corpsTableau = nœudHTMLTableau.getElementsByTagName(tbody)[0]
	let rangéeCours = document.createElement(tr)
	corpsTableau.appendChild(rangéeCours)
	rangéeCours.setAttribute("class", "tableauRangéeContenu")
	ajouterRangéeCours(rangéeCours, corpsTableau)
}

function mettreÀJourTitreHoraire() {
	let donnéesÉtudiant = récupérerDonnéesÉtudiant()
	var chaîneSession = donnéesÉtudiant.session.saison
	if (chaîneSession == "printemps") {
		chaîneSession = `de ${chaîneSession}`
	} else if (chaîneSession) {
		chaîneSession = `d'${chaîneSession}`
	}

	document.getElementById("titreHoraire").innerText = `Horaire de cours${donnéesÉtudiant.session.saison || donnéesÉtudiant.session.année ? " pour " : ""}${donnéesÉtudiant.session.saison ? "la session " + chaîneSession : ""}${donnéesÉtudiant.session.année ? " " + donnéesÉtudiant.session.année : ""}`
}

function mettreÀJourSousTitreHoraire() {
	let elementSousTitre = document.getElementById("nomPersonne")
	while (elementSousTitre.firstChild) {
		elementSousTitre.lastChild.remove()
	}

	let donnéesÉtudiant = récupérerDonnéesÉtudiant()
	if (donnéesÉtudiant.nom && donnéesÉtudiant.code) {
		elementSousTitre.appendChild(document.createTextNode(`${donnéesÉtudiant.nom} - `))
		let sousTitrePersonneCodePermanent = document.createElement(span)
		sousTitrePersonneCodePermanent.setAttribute("class", "codePermanent")
		elementSousTitre.appendChild(sousTitrePersonneCodePermanent)
		sousTitrePersonneCodePermanent.appendChild(document.createTextNode(donnéesÉtudiant.code))
	} else {
		if (donnéesÉtudiant.nom) {
			elementSousTitre.appendChild(document.createTextNode(donnéesÉtudiant.nom))
		} else if (donnéesÉtudiant.code) {
			let sousTitrePersonneCodePermanent = document.createElement(span)
			sousTitrePersonneCodePermanent.setAttribute("class", "codePermanent")
			elementSousTitre.appendChild(sousTitrePersonneCodePermanent)
			sousTitrePersonneCodePermanent.appendChild(document.createTextNode(donnéesÉtudiant.code))
		}
	}
}

function générerEntêteGrilleHoraire(elementTableauHTML, joursLimites) {
	let rangéeEntête = document.createElement(tr)
	elementTableauHTML.createTHead().appendChild(rangéeEntête)
	rangéeEntête.setAttribute("class", "horaireRangéeEntête")
	var colonne = document.createElement(td) // Cellule vide au coin en haut à gauche
	colonne.setAttribute("class", "horaireColonneHeure")
	rangéeEntête.appendChild(colonne)
	for (let indexJour = joursLimites.min.days(); indexJour <= joursLimites.max.days(); indexJour++) {
		let jourSemaine = moment().day(indexJour).format("dddd")
		colonne = document.createElement(td) // Colonne vide pour espacement des cases horaire
		colonne.setAttribute("class", "horaireColonnePadding")
		rangéeEntête.appendChild(colonne)
		colonne = document.createElement(td)
		rangéeEntête.appendChild(colonne)
		colonne.innerText = majusculerPremièreLettre(jourSemaine)
		colonne.setAttribute("class", "horaireColonneJour")
	}
	colonne = document.createElement(td) // Colonne vide pour espacement des cases horaire
	colonne.setAttribute("class", "horaireColonnePadding")
	rangéeEntête.appendChild(colonne)
}

function générerGrilleHoraire(elementTableauHTML, coursSession) {
	let limitesHeures = obtenirLimitesHeures(coursSession)
	let limitesJours = obtenirLimitesJours(coursSession)
	let nbMinuteParSousDivisionDHeure = obtenirGrandeurDivisionsHeures(coursSession)
	let nbSousDivisionParHeure = 60 / nbMinuteParSousDivisionDHeure

	let nbTotalBlocsDeTempsParJour = moment.duration(limitesHeures.max - limitesHeures.min).asMinutes() / nbMinuteParSousDivisionDHeure

	let corpsTableau = document.createElement(tbody)
	elementTableauHTML.appendChild(corpsTableau)

	// Création de la colonne d'heure
	for (let indexTemps = 0; indexTemps < nbTotalBlocsDeTempsParJour; indexTemps++) {
		let tempsÀItération = moment().day(limitesJours.min.day()).hours(limitesHeures.min.hours()).minutes(indexTemps * nbMinuteParSousDivisionDHeure + limitesHeures.min.minutes())
		let rangée = document.createElement(tr)
		corpsTableau.appendChild(rangée)
		rangée.setAttribute("id", tempsÀItération.format("H:mm"))
		rangée.setAttribute("class", "horaireRangéeContenu")
		if (tempsÀItération.hours() % 2 == 1) {
			rangée.setAttribute("class", "impair " + rangée.getAttribute("class"))
		}

		if (tempsÀItération.minutes() == 0) {
			let colonne = document.createElement(td)
			colonne.innerText = tempsÀItération.format("H:mm")
			colonne.setAttribute("rowspan", nbSousDivisionParHeure)
			colonne.setAttribute("class", "horaireColonneHeure")
			rangée.appendChild(colonne)
		}
	}

	// Remplissage de la grille avec entre autres les cours
	for (indexJour = limitesJours.min.day(); indexJour <= limitesJours.max.day(); indexJour++) {
		for (let indexTemps = 0; indexTemps < nbTotalBlocsDeTempsParJour; indexTemps++) {
			let temps = moment().day(indexJour).hours(indexTemps / nbSousDivisionParHeure + limitesHeures.min.hours()).minutes((indexTemps % nbSousDivisionParHeure) * nbMinuteParSousDivisionDHeure + limitesHeures.min.minutes())
			let période

			// Obtention d'un cours qui se trouve à ce temps-là (s'il y a lieu)...
			coursSession.forEach(cours => {
				cours.séances.forEach(séance => {
					let finSéance = moment(séance.horaire).add(séance.durée)
					if (séance.horaire <= temps && temps <= finSéance) {
						période = { cours: cours, séance: séance }
					}
				})
			})

			let rangée = document.getElementById(temps.format("H:mm"))
			let colonnePadding = document.createElement(td)
			colonnePadding.setAttribute("class", "horaireColonnePadding")
			rangée.appendChild(colonnePadding) // Colonne vide pour espacement des cases horaire
			if (période) {
				if (période.séance.horaire.day() == temps.day()
					&& période.séance.horaire.hours() == temps.hours()
					&& période.séance.horaire.minutes() == temps.minutes()) {
					let colonneSéance = document.createElement(td)
					rangée.appendChild(colonneSéance)
					let duréeSéance = période.séance.durée.asMinutes()
					let hauteurColonne = duréeSéance / nbMinuteParSousDivisionDHeure
					colonneSéance.setAttribute("rowspan", hauteurColonne)
					colonneSéance.setAttribute("class", `horaireColonneJour horaireSéance cours${coursSession.indexOf(période.cours)}`)

					let contenu = colonneSéance
					let divSéanceTitre = document.createElement(div)
					contenu.appendChild(divSéanceTitre)
					divSéanceTitre.setAttribute("class", "horaireSéanceTitre")
					if (période.cours.icône) {
						let spanIcône = document.createElement(span)
						divSéanceTitre.appendChild(spanIcône)
						spanIcône.setAttribute("class", "horaireSéanceTitreIcône")
						let icône = document.createTextNode(période.cours.icône + " ")
						spanIcône.appendChild(icône)
					}
					let spanCodeCours = document.createElement(span)
					divSéanceTitre.appendChild(spanCodeCours)
					let titre = document.createTextNode(période.cours.code)
					spanCodeCours.appendChild(titre)
					if (période.cours.groupe) {
						let spanGroupe = document.createElement(span)
						divSéanceTitre.appendChild(spanGroupe)
						spanGroupe.setAttribute("class", "horaireSéanceTitreGroupe")
						let groupe = document.createTextNode("-" + période.cours.groupe)
						spanGroupe.appendChild(groupe)
					}
					if (période.séance.type) {
						divSéanceTitre.appendChild(document.createElement("BR"))
						let spanType = document.createElement(span)
						divSéanceTitre.appendChild(spanType)
						spanType.setAttribute("class", "horaireSéanceType")
						let type = document.createTextNode(`(${période.séance.type})`)
						spanType.appendChild(type)
					}
					let divSéanceHoraire = document.createElement(div)
					divSéanceHoraire.setAttribute("class", "horaireSéanceHoraire")
					contenu.appendChild(divSéanceHoraire)
					let horaire = document.createTextNode(`${période.séance.horaire.format("H:mm")} - ${moment(période.séance.horaire).add(période.séance.durée).format("H:mm")}`)
					divSéanceHoraire.appendChild(horaire)
					if (période.séance.local) {
						let divSéanceLocal = document.createElement(div)
						divSéanceLocal.setAttribute("class", "horaireSéanceLocal")
						contenu.appendChild(divSéanceLocal)
						let local = document.createTextNode(période.séance.local)
						divSéanceLocal.appendChild(local)
					}
				}
			} else {
				let colonneLibre = document.createElement(td)
				colonneLibre.setAttribute("class", "horaireColonneJour libre")
				rangée.appendChild(colonneLibre)
			}
			if (indexJour == limitesJours.max.day()) {
				let colonnePaddingFin = document.createElement(td)
				colonnePaddingFin.setAttribute("class", "horaireColonnePadding")
				rangée.appendChild(colonnePaddingFin) // Colonne vide pour espacement des cases horaire
			}
		}
	}
}

function créerTitreGrilleHoraire(nœudHTMLParentHoraire) {
	let titreGrilleHoraire = nœudHTMLParentHoraire.appendChild(document.createElement("H3"))
	titreGrilleHoraire.textContent = `Grille horaire pour la session d'${décoderSession(étudiant.session).saison} ${décoderSession(étudiant.session).année}`
}

function générerTableauHoraire(nœudHTMLParentHoraire, coursSession) {
	if (!donnéesCoursSontSuffisantes()) {
		return
	}

	let tableauHoraire = document.createElement(table)
	nœudHTMLParentHoraire.appendChild(tableauHoraire)
	tableauHoraire.setAttribute("id", "grilleHoraire")

	générerEntêteGrilleHoraire(tableauHoraire, obtenirLimitesJours(coursSession))
	générerGrilleHoraire(tableauHoraire, coursSession)
}

function générerTableauListeCours(nœudHTMLTableauListe, coursSession) {
	if (!donnéesCoursSontSuffisantes()) {
		return
	}
	for (let indexCours = 0; indexCours < coursSession.length; indexCours++) {
		const cours = coursSession[indexCours];
		let rangéeCours = document.createElement(tr)
		nœudHTMLTableauListe.appendChild(rangéeCours)
		rangéeCours.setAttribute("class", "tableauRangéeContenu")
		let colonneCouleur = document.createElement(td)
		rangéeCours.appendChild(colonneCouleur)
		colonneCouleur.setAttribute("class", `cours${indexCours}`)
		if (indexCours % 2 == 1) {
			rangéeCours.setAttribute("class", rangéeCours.getAttribute("class") + " impair")
		}
		if (cours.icône) {
			colonneCouleur.innerText = cours.icône
		}
		let colonneCode = document.createElement(td)
		rangéeCours.appendChild(colonneCode)
		colonneCode.setAttribute("class", "listeColonneCode")
		colonneCode.innerText = cours.code
		let colonneGroupe = document.createElement(td)
		rangéeCours.appendChild(colonneGroupe)
		colonneGroupe.setAttribute("class", "listeColonneGroupe")
		colonneGroupe.innerText = cours.groupe ? cours.groupe : "-"
		let colonneNom = document.createElement(td)
		rangéeCours.appendChild(colonneNom ? colonneNom : "")
		colonneNom.innerText = cours.nom ? cours.nom : "-"
		let colonneCrédits = document.createElement(td)
		rangéeCours.appendChild(colonneCrédits)
		colonneCrédits.setAttribute("class", "listeColonneCrédits")
		colonneCrédits.innerText = cours.crédits ? cours.crédits : "-"
	}
}

function effacerTableauGrilleHoraire(nœudHTMLParentHoraire) {
	while (nœudHTMLParentHoraire.firstElementChild) {
		nœudHTMLParentHoraire.removeChild(nœudHTMLParentHoraire.lastChild)
	}
}

function rafraîchirTableaux() {
	if (donnéesCoursSontSuffisantes()) {
		document.getElementById("contenu").setAttribute("style", "display: block;")
		document.getElementById("contrôlesPrincipaux").setAttribute("style", "display: block;")
	}
	let elementTableauHoraire = document.getElementById("horaire") // div
	while (elementTableauHoraire.firstChild) {
		elementTableauHoraire.lastChild.remove()
	}
	générerTableauHoraire(elementTableauHoraire, récupérerDonnéesCours())
	if (document.getElementById("grilleCours").children.length > 1) {
		for (let index = 1; index < document.getElementById("grilleCours").children.length; index++) {
			const element = document.getElementById("grilleCours").children[index];
			element.remove()
		}
	}
	let elementTableauCoursCorps = document.createElement(tbody)
	document.getElementById("grilleCours").appendChild(elementTableauCoursCorps)
	while (elementTableauCoursCorps.firstChild) {
		elementTableauCoursCorps.lastChild.remove()
	}
	document.getElementById("grilleCours").appendChild(elementTableauCoursCorps)
	générerTableauListeCours(elementTableauCoursCorps, récupérerDonnéesCours())
}

/*
	Actions principales.
*/

// Champs de données de base
document.getElementById("donnéesÉtudiantSessionAnnée").value = moment().year()
document.getElementById("donnéesÉtudiantSessionSaison").value = obtenirSaisonCourante()

mettreÀJourTitrePage()
ajouterRangéeDonnéesCours(document.getElementById("grilleDonnéesCours"))
mettreÀJourTitreHoraire()
mettreÀJourSousTitreHoraire()
rafraîchirTableaux()

/**
 * Configuration des actions sur éléments d'interface
 */
// Données d'étudiant(e)
const tableauDonnéesÉtudiantes = document.getElementById("grilleDonnéesÉtudiantes")
tableauDonnéesÉtudiantes.addEventListener(change, (e) => {
	mettreÀJourTitrePage()
	mettreÀJourTitreHoraire()
	mettreÀJourSousTitreHoraire()
})
// Données de cours
const tableauDonnéesCours = document.getElementById("grilleDonnéesCours")
tableauDonnéesCours.addEventListener(change, (e) => {
	rafraîchirTableaux()
})
// Voir fonctions relatives aux ajouts et retraits de séances et de cours
// pour les actions effectuées lors d'un clic.

const boutonVersionImprimable = document.getElementById("boutonVersionImprimable")
boutonVersionImprimable.addEventListener(click, (e) => {
	document.getElementById("contrôlesPrincipaux").setAttribute("style", "display: none;")
	document.getElementById("données").setAttribute("style", "display: none;")
	window.print()
	document.getElementById("contrôlesPrincipaux").setAttribute("style", "display: block;")
	document.getElementById("données").setAttribute("style", "display: block;")
})
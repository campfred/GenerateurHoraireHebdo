/**
 * Utility functions for diverse mechanics
 */
function getInputNodes()
{
	return {
		personal: {
			date: {
				none: document.getElementById("data-personal-form-date-none"),
				today: document.getElementById("data-personal-form-date-today"),
				custom: document.getElementById("data-personal-form-date-custom"),
				input: document.getElementById("data-personal-form-date-input")
			}
		},
		subject: {
			title: {
				input: document.getElementById("data-subject-form-title-input")
			},
			subtitle: {
				input: document.getElementById("data-subject-form-subtitle-input")
			}
		},
		events: {
			template: document.getElementById("template-event-item"),
			accordion: document.getElementById("data-events-accordion"),
			add: document.getElementById("data-events-button")
		}
	}
}

function inputPersonalDateNoneClick(dateInputs)
{
	if (dateInputs.none.checked)
	{
		console.log("None!")
		dateInputs.input.disabled = true
		dateInputs.input.readOnly = false
		dateInputs.input.value = ""
		dateInputs.input.placeholder = "No date"
	}
}

function inputPersonalDateTodayClick(dateInputs)
{
	if (dateInputs.today.checked)
	{
		console.log("Today!")
		dateInputs.input.disabled = false
		dateInputs.input.readOnly = true
		dateInputs.input.value = dayjs().format("YYYY-MM-DD")
		dateInputs.input.placeholder = "Today's date"
	}
}

function inputPersonalDateCustomClick(dateInputs)
{
	if (dateInputs.custom.checked)
	{
		console.log("Custom!")
		dateInputs.input.disabled = false
		dateInputs.input.readOnly = false
		dateInputs.input.placeholder = "Custom date"
	}
}


/**
 * Function to run on page load
 */
function initialize()
{
	setupEvents()
	setupTemplate()
}

function setupEvents()
{
	const InputNodes = getInputNodes()
	let dateInputs = InputNodes.personal.date
	InputNodes.personal.date.none.addEventListener("click", () => { inputPersonalDateNoneClick(dateInputs) })
	InputNodes.personal.date.today.addEventListener("click", () => { inputPersonalDateTodayClick(dateInputs) })
	InputNodes.personal.date.custom.addEventListener("click", () => { inputPersonalDateCustomClick(dateInputs) })
	inputPersonalDateNoneClick(dateInputs)
	inputPersonalDateTodayClick(dateInputs)
	inputPersonalDateCustomClick(dateInputs)

	InputNodes.events.add.addEventListener("click", setupTemplate)

	console.log("Events set up!")
}

function setupTemplate()
{
	const InputNodes = getInputNodes()
	const template = InputNodes.events.template
	const container = InputNodes.events.accordion
	var nextIndex = 0
	do
	{
		nextIndex++
	} while (document.querySelector(`#data-events-${nextIndex}`) != null);

	const clone = template.content.cloneNode(true)
	console.log("clone, before being edited", clone)
	clone.children[0].outerHTML = clone.children[0].outerHTML.replaceAll("$", nextIndex)
	console.log("clone, after being edited", clone)

	container.insertBefore(clone, container.childNodes[container.childNodes.length - 2])
	result = document.querySelector(`#data-events-${nextIndex}`)
	console.log("result", result)
	result.querySelector(`#data-events-${nextIndex}-delete-button`).addEventListener("click", function ()
	{
		console.log("this", this)
		console.log(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode)
		container.removeChild(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode)
	})

	const inputTitle = result.querySelector(`#data-events-${nextIndex}-form-title-input`)
	inputTitle.addEventListener("input", function (event)
	{
		if (inputTitle.value.length > 0)
		{
			console.log("nextIndex", nextIndex)
			document.querySelector(`#data-events-${nextIndex}`).querySelector(`#data-events-${nextIndex}-heading-button`).innerText = event.target.value
		}
		else
		{
			document.querySelector(`#data-events-${nextIndex}`).querySelector(`#data-events-${nextIndex}-heading-button`).innerText = `Event ${nextIndex}`
		}
	})
}
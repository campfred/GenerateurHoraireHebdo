/**
 * Utility functions for diverse mechanics
 */
function getInputNodes()
{
	return {
		personal: {
			date: {
				none: document.querySelector("#data-personal-form-date-none"),
				today: document.querySelector("#data-personal-form-date-today"),
				custom: document.querySelector("#data-personal-form-date-custom"),
				input: document.querySelector("#data-personal-form-date-input")
			}
		},
		subject: {
			title: {
				input: document.querySelector("#data-subject-form-title-input")
			},
			subtitle: {
				input: document.querySelector("#data-subject-form-subtitle-input")
			}
		},
		events: {
			template: document.querySelector("#template-event-item"),
			accordion: document.querySelector("#data-events-accordion"),
			add: document.querySelector("#data-events-button")
		},
		schedules: {
			template: document.querySelector("#template-schedule-item")
		}
	}
}

function inputPersonalDateNoneClick(dateInputs)
{
	if (dateInputs.none.checked)
	{
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
		dateInputs.input.disabled = false
		dateInputs.input.readOnly = false
		dateInputs.input.placeholder = "Custom date"
	}
}

function inputScheduleTimeFullDayClick(eventNumber, scheduleNumber)
{
	const inputTime = {
		check: document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-time-check`),
		start: document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-time-start`),
		end: document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-time-end`)
	}
	inputTime.start.disabled = inputTime.check.checked
	inputTime.end.disabled = inputTime.check.checked
}


/**
 * Function to run on page load
 */
function initialize()
{
	setupEvents()
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

	InputNodes.events.add.addEventListener("click", setupEventTemplate)
	InputNodes.events.add.click()
}


/**
 * Template prepping functions
 */
function setupEventTemplate(event)
{
	const InputNodes = getInputNodes()
	const template = InputNodes.events.template
	const container = InputNodes.events.accordion
	var eventNumber = 0
	do
	{
		eventNumber++
	} while (document.querySelector(`#data-event-${eventNumber}`) != null);

	const clone = template.content.cloneNode(true)
	clone.children[0].outerHTML = clone.children[0].outerHTML.replaceAll("$", eventNumber)

	container.insertBefore(clone, container.childNodes[container.childNodes.length - 2])
	result = document.querySelector(`#data-event-${eventNumber}`)
	result.querySelector(`#data-event-${eventNumber}-delete-button`).addEventListener("click", () =>
	{
		container.removeChild(document.querySelector(`#data-event-${eventNumber}`))
	})

	const inputTitle = result.querySelector(`#data-event-${eventNumber}-form-title-input`)
	inputTitle.addEventListener("input", (event) =>
	{
		if (inputTitle.value.length > 0)
		{
			document.querySelector(`#data-event-${eventNumber}-heading-button`).innerText = event.target.value
		}
		else
		{
			document.querySelector(`#data-event-${eventNumber}-heading-button`).innerText = `Event ${eventNumber}`
		}
	})

	const addScheduleItemButton = result.querySelector(`#data-event-${eventNumber}-schedules-button`)
	addScheduleItemButton.addEventListener("click", setupScheduleTemplate)
	addScheduleItemButton.click()
}

function setupScheduleTemplate(event)
{
	const InputNodes = getInputNodes()
	var target = event.target.tagName === "I" ? event.target.parentElement : event.target
	const eventNumber = target.id.split("-")[2]
	const container = document.querySelector(`#data-event-${eventNumber}-schedules-accordion`)
	const template = InputNodes.schedules.template

	var scheduleNumber = 0
	do
	{
		scheduleNumber++
	} while (document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}`) != null);

	const clone = template.content.cloneNode(true)
	clone.children[0].outerHTML = clone.children[0].outerHTML.replaceAll("$", eventNumber).replaceAll("%", scheduleNumber)

	container.insertBefore(clone, container.childNodes[container.childNodes.length - 2])
	result = document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}`)
	result.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-delete-button`).addEventListener("click", function ()
	{
		container.removeChild(document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}`))
	})

	function updateScheduleHeading(type, location)
	{
		if (type.length > 0)
		{
			document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-heading-button`).innerText = location.length > 0 ? `${type} (${location})` : type
		}
		else
		{
			document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-heading-button`).innerText = location.length > 0 ? location : `Schedule ${scheduleNumber}`
		}
	}
	const inputType = document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-type-input`)
	const inputLocation = document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-location-input`)
	inputType.addEventListener("input", () => { updateScheduleHeading(inputType.value, inputLocation.value) })
	inputLocation.addEventListener("input", () => { updateScheduleHeading(inputType.value, inputLocation.value) })

	document
		.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-form-time-check`)
		.addEventListener("click", () => { inputScheduleTimeFullDayClick(eventNumber, scheduleNumber) })
}

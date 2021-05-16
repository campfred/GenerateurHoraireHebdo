class BootstrapColours
{
	constructor()
	{
		this.ColourStrings = [
			"primary",
			"secondary",
			"success",
			"info",
			"warning",
			"danger",
			"light"
		]
		this.Index = -1
	}

	get resetIndex()
	{
		this.Index = -1
		return this.Index
	}

	get nextIndex()
	{
		this.Index = (this.Index + 1) % this.ColourStrings.length
		return this.Index
	}

	get colourClasses()
	{
		return this.ColourStrings
	}

	get nextColourClass()
	{
		return this.ColourStrings[this.nextIndex]
	}
}

function getBoostrapColorClasses()
{
	return [
		"primary",
		"secondary",
		"success",
		"info",
		"warning",
		"danger",
		"light",
		"dark"
	]
}

/**
 * Utility functions for various mechanics
 */
function getEventAccordionItems()
{
	return Array.from(document.querySelectorAll(".accordion-item")).filter((item) =>
	{
		return !item.id.includes("schedule")
	})
}

function getScheduleAccordionItems(eventItemID)
{
	return Array.from(document.querySelector(`#${eventItemID}`).querySelectorAll(".accordion-item"))
}

function getInputNodes()
{
	return {
		personal: {
			name: document.querySelector("#data-personal-name-input"),
			code: document.querySelector("#data-personal-code-input"),
			date: {
				none: document.querySelector("#data-personal-date-radio-none"),
				today: document.querySelector("#data-personal-date-radio-today"),
				custom: document.querySelector("#data-personal-date-radio-custom"),
				input: document.querySelector("#data-personal-date-input")
			}
		},
		subject: {
			title: document.querySelector("#data-subject-title-input"),
			subtitle: document.querySelector("#data-subject-subtitle-input")
		},
		events: {
			accordion: document.querySelector("#data-events-accordion"),
			add: document.querySelector("#data-events-button"),
			items: (() =>
			{
				let eventItems = []
				let eventAccordionItems = getEventAccordionItems()
				eventAccordionItems.forEach(eventItem =>
				{
					let currentEventItem = {
						title: eventItem.querySelector(`#${eventItem.id}-title-input`),
						description: eventItem.querySelector(`#${eventItem.id}-description-input`),
						group: eventItem.querySelector(`#${eventItem.id}-group-input`),
						icon: eventItem.querySelector(`#${eventItem.id}-icon-input`),
						schedules: (() =>
						{
							let scheduleItems = []
							let scheduleAccordionItems = getScheduleAccordionItems(eventItem.id)
							scheduleAccordionItems.forEach(scheduleItem =>
							{
								let currentScheduleItem = {
									type: scheduleItem.querySelector(`#${scheduleItem.id}-type-input`),
									location: scheduleItem.querySelector(`#${scheduleItem.id}-location-input`),
									day: scheduleItem.querySelector(`#${scheduleItem.id}-day-select`),
									time: {
										fullday: scheduleItem.querySelector(`#${scheduleItem.id}-time-check`),
										start: scheduleItem.querySelector(`#${scheduleItem.id}-time-start`),
										end: scheduleItem.querySelector(`#${scheduleItem.id}-time-end`)
									}
								}
								scheduleItems.push(currentScheduleItem)
							})
							return scheduleItems
						})()
					}
					eventItems.push(currentEventItem)
				})
				return eventItems
			})()
		}
	}
}

function getTemplateNodes()
{
	return {
		event: document.querySelector("#template-event-item"),
		schedule: document.querySelector("#template-schedule-item"),
		render: {
			grid: document.querySelector("#template-render-base")
		}
	}
}

function getPersonalInfo()
{
	return {
		name: document.querySelector("#data-personal-name-input").value,
		code: document.querySelector("#data-personal-code-input").value,
		date: (() =>
		{
			if (document.querySelector("#data-personal-date-radio-none").checked)
			{
				return null
			} else
			{
				return document.querySelector("#data-personal-date-input").value
			}
		})()
	}
}

function getSubjectInfo()
{
	return {
		title: document.querySelector("#data-subject-title-input").value,
		subtitle: document.querySelector("#data-subject-subtitle-input").value
	}
}

function getEventsData()
{
	const Colours = new BootstrapColours()
	const events = []
	document.querySelectorAll(".accordion-item").forEach((accordionItem) =>
	{
		// If the node is not for a schedule accordion item
		if (!accordionItem.id.includes("schedule"))
		{
			let event = {
				id: accordionItem.id,
				title: accordionItem.querySelector(`#${accordionItem.id}-title-input`).value,
				description: accordionItem.querySelector(`#${accordionItem.id}-description-input`).value,
				group: accordionItem.querySelector(`#${accordionItem.id}-group-input`).value,
				icon: accordionItem.querySelector(`#${accordionItem.id}-icon-input`).value,
				schedules: [],
				colour: Colours.nextColourClass
			}
			events.push(event)
		} else
		{
			let eventID = (() =>
			{
				let idParts = accordionItem.id.split("-")
				return `${idParts[0]}-${idParts[1]}-${idParts[2]}`
			})()
			let schedule = {
				type: accordionItem.querySelector(`#${accordionItem.id}-type-input`).value,
				location: accordionItem.querySelector(`#${accordionItem.id}-location-input`).value,
				day: accordionItem.querySelector(`#${accordionItem.id}-day-select`).value,
				fullday: accordionItem.querySelector(`#${accordionItem.id}-time-check`).checked,
				time: {
					start: accordionItem.querySelector(`#${accordionItem.id}-time-start`).value,
					end: accordionItem.querySelector(`#${accordionItem.id}-time-end`).value
				}
			}
			events.find(({ id }) => id === eventID).schedules.push(schedule)
		}
	})

	console.log("getEventsData()", events)
	return events
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
		check: document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-time-check`),
		start: document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-time-start`),
		end: document.querySelector(`#data-event-${eventNumber}-schedule-${scheduleNumber}-time-end`)
	}
	inputTime.start.disabled = inputTime.check.checked
	inputTime.end.disabled = inputTime.check.checked
}


/**
 * Processing functions
 */
function renderSchedule(listenedEvent)
{
	console.info("Rendering!")
	const PersonalInfo = getPersonalInfo()
	const SubjectInfo = getSubjectInfo()
	const EventsData = getEventsData()

	setupRenderTemplate(listenedEvent)
}


/**
 * Function to run on page load
 */
function initialize()
{
	setupEventListeners()
}

function setupEventListeners()
{
	const InputNodes = getInputNodes()
	const DateInputs = InputNodes.personal.date
	InputNodes.personal.date.none.addEventListener("click", () => { inputPersonalDateNoneClick(DateInputs) })
	InputNodes.personal.date.today.addEventListener("click", () => { inputPersonalDateTodayClick(DateInputs) })
	InputNodes.personal.date.custom.addEventListener("click", () => { inputPersonalDateCustomClick(DateInputs) })
	inputPersonalDateNoneClick(DateInputs)
	inputPersonalDateTodayClick(DateInputs)
	inputPersonalDateCustomClick(DateInputs)

	InputNodes.events.add.addEventListener("click", setupEventTemplate)
	InputNodes.events.add.click()

	const RenderButton = document.querySelector("#render-button")
	RenderButton.addEventListener("click", renderSchedule)
}


/**
 * Template prepping functions
 */
function setupEventTemplate(event)
{
	const InputNodes = getInputNodes()
	const TemplateNodes = getTemplateNodes()

	const Template = TemplateNodes.event
	const Container = InputNodes.events.accordion
	var eventNumber = 0
	do
	{
		eventNumber++
	} while (document.querySelector(`#data-event-${eventNumber}`) != null);

	const Clone = Template.content.cloneNode(true)
	Clone.children[0].outerHTML = Clone.children[0].outerHTML.replaceAll("$", eventNumber)

	Container.insertBefore(Clone, Container.childNodes[Container.childNodes.length - 2])
	result = document.querySelector(`#data-event-${eventNumber}`)
	result.querySelector(`#data-event-${eventNumber}-delete-button`).addEventListener("click", () =>
	{
		Container.removeChild(document.querySelector(`#data-event-${eventNumber}`))
	})

	const InputTitle = result.querySelector(`#data-event-${eventNumber}-title-input`)
	InputTitle.addEventListener("input", (event) =>
	{
		if (InputTitle.value.length > 0)
		{
			document.querySelector(`#data-event-${eventNumber}-heading-button`).innerText = event.target.value
		}
		else
		{
			document.querySelector(`#data-event-${eventNumber}-heading-button`).innerText = `Event ${eventNumber}`
		}
	})

	const AddScheduleItemButton = result.querySelector(`#data-event-${eventNumber}-schedules-button`)
	AddScheduleItemButton.addEventListener("click", setupScheduleTemplate)
	AddScheduleItemButton.click()
}

function setupScheduleTemplate(event)
{
	const InputNodes = getInputNodes()
	const TemplateNodes = getTemplateNodes()

	var target = event.target.tagName === "I" ? event.target.parentElement : event.target
	const EventNumber = target.id.split("-")[2]
	const Container = document.querySelector(`#data-event-${EventNumber}-schedules-accordion`)
	const Template = TemplateNodes.schedule

	var scheduleNumber = 0
	do
	{
		scheduleNumber++
	} while (document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}`) != null);

	const Clone = Template.content.cloneNode(true)
	Clone.children[0].outerHTML = Clone.children[0].outerHTML.replaceAll("$", EventNumber).replaceAll("%", scheduleNumber)

	Container.insertBefore(Clone, Container.childNodes[Container.childNodes.length - 2])
	result = document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}`)
	result.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}-delete-button`).addEventListener("click", function ()
	{
		Container.removeChild(document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}`))
	})

	function updateScheduleHeading(type, location)
	{
		if (type.length > 0)
		{
			document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}-heading-button`).innerText = location.length > 0 ? `${type} (${location})` : type
		}
		else
		{
			document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}-heading-button`).innerText = location.length > 0 ? location : `Schedule ${scheduleNumber}`
		}
	}
	const InputType = document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}-type-input`)
	const InputLocation = document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}-location-input`)
	InputType.addEventListener("input", () => { updateScheduleHeading(InputType.value, InputLocation.value) })
	InputLocation.addEventListener("input", () => { updateScheduleHeading(InputType.value, InputLocation.value) })

	document
		.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}-time-check`)
		.addEventListener("click", () => { inputScheduleTimeFullDayClick(EventNumber, scheduleNumber) })
}

function setupRenderTemplate(listenedEvent)
{
	const Template = getTemplateNodes().render.grid
	const Container = document.querySelector("#render-grid")

	const Clone = Template.content.cloneNode(true)
	var iconsEnabled = false
	var descriptionsEnabled = false
	var groupsEnabled = false
	const Events = getEventsData()
	Events.forEach(event =>
	{
		if (event.icon)
			iconsEnabled = true
		if (event.description)
			descriptionsEnabled = true
		if (event.group)
			groupsEnabled = true
	})
	// Clone.querySelector("#render-events-grid").appendChild(generateEventsGridTable(Events, iconsEnabled, descriptionsEnabled, groupsEnabled))
	Clone.querySelector("#render-events-list").appendChild(generateEventsListTable(Events, iconsEnabled, descriptionsEnabled, groupsEnabled))
	// Clone.appendChild(generateEventsListTable())


	console.log(Clone)
	Array.from(Container.children).forEach(childElement =>
	{
		Container.removeChild(childElement)
	})
	Container.appendChild(Clone)
	// result = document.querySelector(`#data-event-${EventNumber}-schedule-${scheduleNumber}`)
}
function generateEventsGridTable(events, iconsEnabled, descriptionsEnabled, groupsEnabled)
{


	return undefined
}
function generateEventsListTable(events, iconsEnabled, descriptionsEnabled, groupsEnabled)
{
	const Table = document.createElement("table")
	Table.setAttribute("class", "table")

	const THead = document.createElement("thead")
	Table.appendChild(THead)
	const THeadTR = document.createElement("tr")
	THead.appendChild(THeadTR)
	if (iconsEnabled)
	{
		const THIcon = document.createElement("th")
		THIcon.setAttribute("scope", "col")
		// THIcon.innerText = "Icon"
		THeadTR.appendChild(THIcon)
	}
	const THTitle = document.createElement("th")
	THTitle.setAttribute("scope", "col")
	THTitle.innerText = "Title"
	THeadTR.appendChild(THTitle)
	if (descriptionsEnabled)
	{
		const THDescription = document.createElement("th")
		THDescription.setAttribute("scope", "col")
		THDescription.innerText = "Description"
		THeadTR.appendChild(THDescription)
	}
	if (groupsEnabled)
	{
		const THGroup = document.createElement("th")
		THGroup.setAttribute("scope", "col")
		THGroup.innerText = "Group"
		THeadTR.appendChild(THGroup)
	}

	const TBody = document.createElement("tbody")
	Table.appendChild(TBody)

	events.forEach(event =>
	{
		// Create table rows according to Bootstrap's tables doc.
		// https://getbootstrap.com/docs/5.0/content/tables/

		const TBodyTR = document.createElement("tr")
		TBody.appendChild(TBodyTR)
		TBodyTR.setAttribute("class", `table-${event.colour}`)
		if (iconsEnabled)
		{
			const IconTH = document.createElement("th")
			IconTH.setAttribute("scope", "row")
			TBodyTR.appendChild(IconTH)
			IconTH.innerText = event.icon
		}
		const TitleTH = document.createElement("th")
		if (!iconsEnabled)
		{
			TitleTH.setAttribute("scope", "row")
		}
		TBodyTR.appendChild(TitleTH)
		TitleTH.innerText = event.title
		if (descriptionsEnabled)
		{
			const DescriptionTD = document.createElement("td")
			TBodyTR.appendChild(DescriptionTD)
			DescriptionTD.innerText = event.description
		}
		if (groupsEnabled)
		{
			const GroupTD = document.createElement("td")
			TBodyTR.appendChild(GroupTD)
			GroupTD.innerText = event.group
		}
	})


	return Table
}

/**
 * Utility functions for diverse mechanics
 */
function inputPersonalDateNoneClick(dateInputs)
{
	if (dateInputs.none.checked)
	{
		console.log("None!")
		dateInputs.input.disabled = true
		dateInputs.input.readOnly = false
	}
}

function inputPersonalDateTodayClick(dateInputs)
{
	if (dateInputs.today.checked)
	{
		console.log("Today!")
		dateInputs.input.disabled = false
		dateInputs.input.readOnly = true
	}
}

function inputPersonalDateCustomClick(dateInputs)
{
	if (dateInputs.custom.checked)
	{
		console.log("Custom!")
		dateInputs.input.disabled = false
		dateInputs.input.readOnly = false
	}
}


/**
 * Function to run on page load
 */
function setupEvents()
{
	// Making handy dictionary to reach objects in the page
	const Inputs = {
		personal: {
			date: {
				none: document.getElementById("data-personal-form-date-none"),
				today: document.getElementById("data-personal-form-date-today"),
				custom: document.getElementById("data-personal-form-date-custom"),
				input: document.getElementById("data-personal-form-date-input")
			}
		}
	}

	let dateInputs = Inputs.personal.date
	Inputs.personal.date.none.addEventListener("click", () => { inputPersonalDateNoneClick(dateInputs) })
	Inputs.personal.date.today.addEventListener("click", () => { inputPersonalDateTodayClick(dateInputs) })
	Inputs.personal.date.custom.addEventListener("click", () => { inputPersonalDateCustomClick(dateInputs) })
	inputPersonalDateNoneClick(dateInputs)
	inputPersonalDateTodayClick(dateInputs)
	inputPersonalDateCustomClick(dateInputs)

	console.log("Events set up!")
}
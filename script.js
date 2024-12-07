class CalendarData {
  constructor(mockedData) {
    this.mockedData = mockedData;
    this.today = new Date(2024, 12, 12).getDate();
  }

  // Fetch tasks only up to today's date
  getFilteredDays() {
    return this.mockedData.calendarDays.filter(day => day.day <= this.today);
  }

  // Check if a task is completed
  isTaskCompleted(day) {
    return this.mockedData.completedDays[day] || false;
  }

  // Get the task completion response for a given day
  getTaskCompletionResponse(day) {
    return this.mockedData.taskCompletions[day] || '';
  }
}

let mockedData = {};
let calendarData;

// Load the mocked data and initialize the CalendarData class
async function loadMockedData() {
  try {
    const response = await fetch('mockedData.json');
    mockedData = await response.json();
    calendarData = new CalendarData(mockedData); // Instantiate CalendarData with the JSON data
    createCalendar();
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

const calendarContainer = document.getElementById("calendar");

// Create calendar
function createCalendar() {
  calendarContainer.innerHTML = ""; // Clear previous content
  const allDays = calendarData.mockedData.calendarDays; // Include all days

  allDays.forEach(dayData => {
    const dayElement = createDayElement(dayData.day);
    const taskElement = document.createElement("p");

    const isCompleted = calendarData.isTaskCompleted(dayData.day);
    const taskResponse = calendarData.getTaskCompletionResponse(dayData.day);

    if (dayData.day <= calendarData.today) {
      // For past and today's tasks
      if (isCompleted) {
        dayElement.classList.add("completed");
        taskElement.textContent = "Completed: " + taskResponse;
      } else {
        taskElement.textContent = dayData.task;
      }
    } else {
      // For future tasks
      dayElement.classList.add("future");
      taskElement.textContent = ""; // Hide task description
    }

    // Highlight today's date
    if (dayData.day === calendarData.today) {
      dayElement.classList.add("today");
    }

    dayElement.appendChild(taskElement);
    calendarContainer.appendChild(dayElement);
  });
}

// Helper to create a day element
function createDayElement(day) {
  const dayElement = document.createElement("div");
  dayElement.classList.add("day");
  dayElement.textContent = `Day ${day}`;
  return dayElement;
}

// Initialize the application
loadMockedData();

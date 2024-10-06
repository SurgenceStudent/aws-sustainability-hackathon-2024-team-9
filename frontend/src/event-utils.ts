let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS = generateDailyEvents(todayStr, 30); // Generate events for the next 30 days

export function createEventId() {
  return String(eventGuid++);
}

// Function to generate "Wake Up" and "Go to Sleep" events for a number of days
function generateDailyEvents(startDateStr: string, numDays: number) {
  const events = [];

    // Create "Wake Up" event at 8:00 AM
    events.push({
      id: createEventId(),
      title: 'Wake Up',
      startTime: `08:00:00`,
      endTime: `08:30:00`, // Optional: Add a duration if needed
      allDay: false,
      extendedProps: {
        location: '2366 Main Mall, Vancouver, BC V6T 1Z4'
      }
    });

    // Create "Go to Sleep" event at 11:00 PM
    events.push({
      id: createEventId(),
      title: 'Go to Sleep',
      startTime: `23:00:00`,
      endTime: `23:30:00`, // Optional: Add a duration if needed
      allDay: false,
      extendedProps: {
        location: '2366 Main Mall, Vancouver, BC V6T 1Z4'
      }
    });
    return events;
  }

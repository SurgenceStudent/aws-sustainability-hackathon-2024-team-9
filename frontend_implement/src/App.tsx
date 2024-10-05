import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import '@fullcalendar/core/main.css'; // for core styles
import '@fullcalendar/daygrid/main.css'; // for the day grid view
import '@fullcalendar/timegrid/main.css'; // for the time grid view
import '@fullcalendar/interaction/main.css'; // for interaction styles (drag and drop)

function App() {
  return (
<FullCalendar
  plugins={[ dayGridPlugin ]}
  initialView="timeGridWeek"
  weekends={false}
  events={[
  ]}
/>
  )
}

export default App

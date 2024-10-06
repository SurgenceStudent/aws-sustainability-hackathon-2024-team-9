import React, { useState, useRef } from 'react';
import FullCalendar, { EventApi } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from './event-utils.ts';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Day } from './Day.ts'; // Import your interfaces
import { CalendarEvent } from './CalendarEvent.ts';

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEventInfo, setNewEventInfo] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [eventData, setEventData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: ''
  });
  const [analyzeOpen, setAnalyzeOpen] = useState(false); // Dialog for Analyze button
  const [analyzeText, setAnalyzeText] = useState('');

  const calendarRef = useRef<FullCalendar | null>(null); // Create a ref for FullCalendar

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo: any) {
    setNewEventInfo(selectInfo);
    setSelectedEvent(null);
    setEventData({
      title: '',
      startTime: '',
      endTime: '',
      location: ''
    });
    setOpenDialog(true);
  }

  function handleEventClick(clickInfo: any) {
    const event = clickInfo.event;

    setSelectedEvent(event);
    setEventData({
      title: event.title,
      startTime: event.start ? formatTime(event.start) : '',
      endTime: event.end ? formatTime(event.end) : '',
      location: event.extendedProps.location || ''
    });

    setOpenDialog(true);
  }

  function formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function handleEvents(events: EventApi[]) {
    setCurrentEvents(events);
  }

  function handleClose() {
    setOpenDialog(false);
    setNewEventInfo(null);
    setSelectedEvent(null);
    setEventData({ title: '', startTime: '', endTime: '', location: '' });
  }

  function handleSave() {
    if (!eventData.title || !eventData.startTime || !eventData.endTime) {
      alert('Please fill in all required fields (Title, Start Time, and End Time).');
      return;
    }
  
    let calendarApi = newEventInfo ? newEventInfo.view.calendar : selectedEvent?._calendar;
    
    let startDate, endDate;
    if (newEventInfo) {
      // Creating a new event
      startDate = new Date(newEventInfo.startStr);
      endDate = new Date(newEventInfo.endStr);
  
      // Apply the user-selected time to start and end dates
      const [startHour, startMinute] = eventData.startTime.split(':').map(Number);
      const [endHour, endMinute] = eventData.endTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute);
      endDate.setHours(endHour, endMinute);
  
      // Add the new event to the calendar
      calendarApi.addEvent({
        id: createEventId(),
        title: eventData.title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: newEventInfo.allDay,
        extendedProps: {
          location: eventData.location
        }
      });
    } else if (selectedEvent) {
      // Editing an existing event
      startDate = new Date(selectedEvent.start);
      endDate = new Date(selectedEvent.end);
  
      // Apply the user-selected time to start and end dates
      const [startHour, startMinute] = eventData.startTime.split(':').map(Number);
      const [endHour, endMinute] = eventData.endTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute);
      endDate.setHours(endHour, endMinute);
  
      // Update the existing event with new data
      selectedEvent.setProp('title', eventData.title);
      selectedEvent.setStart(startDate);
      selectedEvent.setEnd(endDate);
      selectedEvent.setExtendedProp('location', eventData.location);
    }
  
    // Close the dialog and reset the form
    handleClose();
  }
    
  function handleDelete() {
    if (selectedEvent) {
      selectedEvent.remove();
      handleClose();
    }
  }

  // Open analyze dialog
  function openAnalyzeDialog() {
    setAnalyzeOpen(true);
  }

  // Close analyze dialog
  function closeAnalyzeDialog() {
    setAnalyzeOpen(false);
    setAnalyzeText('');
  }

  // Function to transform FullCalendar events to Day objects
  function transformEventsToDays(events: EventApi[]): Day[] {
    const dayMap: { [date: string]: CalendarEvent[] } = {};

    events.forEach(event => {
      const dateStr = event.start!.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dayMap[dateStr]) {
        dayMap[dateStr] = [];
      }

      const calendarEvent: CalendarEvent = {
        name: event.title,
        start: event.start!,
        end: event.end!,
        address: event.extendedProps.location || '',
        timeSensitive: true, // Set based on your logic
        daySensitive: false // Set based on your logic
      };

      dayMap[dateStr].push(calendarEvent);
    });

    const days: Day[] = Object.keys(dayMap).map(dateStr => ({
      date: new Date(dateStr),
      events: dayMap[dateStr]
    }));

    return days;
  }

  async function handleAnalyze() {
    // Transform current events to Day objects
    const days: Day[] = transformEventsToDays(currentEvents);
  
    // Create the payload with days and prompt
    const payload = {
      days,
      prompt: analyzeText
    };

    console.log(payload);
  
    try {
      const response = await fetch('http://localhost:5000/api/calendar/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
  
      const result = await response.json();
      let days = result.days;
      console.log(days);
  
      let calendarApi = calendarRef.current?.getApi(); // Access FullCalendar API
  
      if (calendarApi) {
        // Clear all existing events before adding new ones
        calendarApi.removeAllEvents();
  
        days.forEach((day: any) => {
          let events = day.events; // Access the events array from each day
          if (events) {
            events.forEach((event: any) => {
              calendarApi.addEvent({
                id: createEventId(), // Use a unique ID generator
                title: event.name,
                start: event.start, // Assuming start is in a valid ISO format or Date object
                end: event.end,     // Same for end
                extendedProps: {
                  location: event.address
                },
                backgroundColor: event.name.startsWith('Traveling') ? '#FFB6C1' : '', // Set color for travel events
              });
            });  
          }
        });
      }
      
      alert('Analysis completed successfully!');
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('Failed to perform analysis. Please try again.');
    }
  
    closeAnalyzeDialog();
  }
  
  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
        <FullCalendar
          ref={calendarRef} // Attach the ref to FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'analyzeButton',
            center: 'title',
            right: 'prev,next today'
          }}
          customButtons={{
            analyzeButton: {
              text: 'Analyze',
              click: openAnalyzeDialog
            }
          }}
          initialView='timeGridWeek'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          initialEvents={INITIAL_EVENTS}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          allDaySlot={false}
        />
      </div>

      {/* Event Creation/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          {selectedEvent ? 'Edit Event' : 'Create New Event'}
          {selectedEvent && (
            <IconButton
              aria-label='delete'
              onClick={handleDelete}
              style={{ float: 'right', color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Event Title'
            type='text'
            fullWidth
            variant='standard'
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
          <TextField
            margin='dense'
            label='Start Time'
            type='time'
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
          />
          <TextField
            margin='dense'
            label='End Time'
            type='time'
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
          />
          <TextField
            margin='dense'
            label='Location'
            type='text'
            fullWidth
            variant='standard'
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>{selectedEvent ? 'Save Changes' : 'Create Event'}</Button>
        </DialogActions>
      </Dialog>

      {/* Analyze Dialog */}
      <Dialog open={analyzeOpen} onClose={closeAnalyzeDialog}>
        <DialogTitle>Analyze Calendar</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Enter details for analysis'
            type='text'
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            value={analyzeText}
            onChange={(e) => setAnalyzeText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAnalyzeDialog}>Cancel</Button>
          <Button onClick={handleAnalyze} disabled={!analyzeText.trim()}>
            Go
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

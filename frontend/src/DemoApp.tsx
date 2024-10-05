import React, { useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
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
import DeleteIcon from '@mui/icons-material/Delete'; // Material UI delete icon

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEventInfo, setNewEventInfo] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Store the event being edited
  const [eventData, setEventData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: ''
  });

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

  function handleEvents(events: any) {
    setCurrentEvents(events);
  }

  function handleClose() {
    setOpenDialog(false);
    setNewEventInfo(null);
    setSelectedEvent(null);
    setEventData({ title: '', startTime: '', endTime: '', location: '' });
  }

  function handleSave() {
    let calendarApi = newEventInfo ? newEventInfo.view.calendar : selectedEvent._calendar;

    if (eventData.title && eventData.startTime && eventData.endTime) {
      let startDate, endDate;

      if (newEventInfo) {
        startDate = new Date(newEventInfo.startStr);
        endDate = new Date(newEventInfo.endStr);
      } else if (selectedEvent) {
        startDate = selectedEvent.start;
        endDate = selectedEvent.end;
      }

      const [startHour, startMinute] = eventData.startTime.split(':').map(Number);
      const [endHour, endMinute] = eventData.endTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute);
      endDate.setHours(endHour, endMinute);

      if (selectedEvent) {
        selectedEvent.setProp('title', eventData.title);
        selectedEvent.setStart(startDate);
        selectedEvent.setEnd(endDate);
        selectedEvent.setExtendedProp('location', eventData.location);
      } else {
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
      }

      handleClose();
    } else {
      alert('Please fill in all required fields (Title, Start Time, and End Time).');
    }
  }

  function handleDelete() {
    if (selectedEvent) {
      selectedEvent.remove();
      handleClose();
    }
  }

  return (
    <div className='demo-app'>
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: '',
            center: 'title',
            right: 'prev,next today'
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

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to edit it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event: any) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  );
}

import { useState, useEffect } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'dayjs/locale/fi'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import trainingService from '../services/trainingService'

dayjs.locale('fi')
const localizer = dayjsLocalizer(dayjs)

const messages = {
  today: 'Tänään',
  previous: '‹',
  next: '›',
  month: 'Kuukausi',
  week: 'Viikko',
  day: 'Päivä',
  agenda: 'Agenda',
  date: 'Päivämäärä',
  time: 'Aika',
  event: 'Harjoitus',
  noEventsInRange: 'Ei harjoituksia tällä ajanjaksolla.',
}

const CalendarPage = () => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    trainingService
      .getTrainings()
      .then((trainings) => {
        const mapped = trainings.map((t) => ({
          id: t.id,
          title: t.customer
            ? `${t.activity} — ${t.customer.firstname} ${t.customer.lastname}`
            : t.activity,
          start: new Date(t.date),
          end: new Date(new Date(t.date).getTime() + t.duration * 60000),
        }))
        setEvents(mapped)
      })
      .catch(() => setError('Harjoitusten lataaminen epäonnistui.'))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Kalenteri</h1>
      </div>

      {error && (
        <div className="error-banner">
          {error}<button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="calendar-wrap">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="month"
          views={['month', 'week', 'day']}
          messages={messages}
          style={{ height: 650 }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#185fa5',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12px',
              padding: '2px 6px',
            },
          })}
        />
      </div>
    </div>
  )
}

export default CalendarPage
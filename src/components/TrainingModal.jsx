import { useState } from 'react'

const TrainingModal = ({ customers, onSave, onClose }) => {
  const [date, setDate] = useState('')
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')
  const [customerHref, setCustomerHref] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      date: new Date(date).toISOString(),
      activity,
      duration: Number(duration),
      customer: customerHref,
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Lisää harjoitus</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            <div className="field">
              <label>Päivämäärä ja aika</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Aktiviteetti</label>
              <input
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="esim. Juoksu"
                required
              />
            </div>
            <div className="field">
              <label>Kesto (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                min="1"
                required
              />
            </div>
            <div className="field">
              <label>Asiakas</label>
              <select
                value={customerHref}
                onChange={(e) => setCustomerHref(e.target.value)}
                required
              >
                <option value="">Valitse asiakas</option>
                {customers.map((c) => (
                  <option key={c.href} value={c.href}>
                    {c.firstname} {c.lastname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Peruuta</button>
            <button type="submit" className="btn-primary">Lisää</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TrainingModal
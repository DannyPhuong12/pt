import { useState, useEffect } from 'react'

const EMPTY = { firstname: '', lastname: '', email: '', phone: '', streetaddress: '', postcode: '', city: '' }

const CustomerModal = ({ customer, onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (customer) {
      const { id, href, _links, ...rest } = customer
      setForm(rest)
    } else {
      setForm(EMPTY)
    }
  }, [customer])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  const fields = [
    { name: 'firstname', label: 'Etunimi' },
    { name: 'lastname', label: 'Sukunimi' },
    { name: 'email', label: 'Sähköposti' },
    { name: 'phone', label: 'Puhelin' },
    { name: 'streetaddress', label: 'Katuosoite' },
    { name: 'postcode', label: 'Postinumero' },
    { name: 'city', label: 'Kaupunki' },
  ]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{customer ? 'Muokkaa asiakasta' : 'Lisää uusi asiakas'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            {fields.map((f) => (
              <div className="field" key={f.name}>
                <label>{f.label}</label>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Peruuta</button>
            <button type="submit" className="btn-primary">
              {customer ? 'Tallenna' : 'Lisää'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerModal
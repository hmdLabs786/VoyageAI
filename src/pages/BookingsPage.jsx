import React, { useState } from 'react'
import { Plane, Hotel, Ticket, ExternalLink, Star, DollarSign, CheckCircle } from 'lucide-react'
import './BookingsPage.css'

const TABS = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'activities', label: 'Activities', icon: Ticket },
]

export default function BookingsPage({ itinerary }) {
  const [tab, setTab] = useState('flights')
  const [saved, setSaved] = useState([])

  if (!itinerary) {
    return (
      <div className="empty-state">
        <Hotel size={48} strokeWidth={1} />
        <h2>No trip planned yet</h2>
        <p>Generate an itinerary first to see booking suggestions.</p>
      </div>
    )
  }

  const b = itinerary.bookingSuggestions || {}

  const toggleSave = (id) => {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1>Booking Suggestions</h1>
        <p>Curated options for {itinerary.destination} — tailored to your preferences.</p>
        {saved.length > 0 && (
          <div className="saved-count">
            <CheckCircle size={14} />
            {saved.length} item{saved.length > 1 ? 's' : ''} saved
          </div>
        )}
      </div>

      <div className="tab-bar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'flights' && (
          <div className="cards-grid">
            {(b.flights || []).map((f, i) => (
              <div key={i} className="booking-card flight-card">
                <div className="card-badge">
                  <Plane size={13} />
                  {f.type}
                </div>
                <div className="flight-route">
                  <div className="route-point">
                    <span className="route-dot" />
                    <span>Origin</span>
                  </div>
                  <div className="route-line">
                    <Plane size={14} style={{ transform: 'rotate(0deg)', color: 'var(--terra)' }} />
                  </div>
                  <div className="route-point">
                    <span className="route-dot dest" />
                    <span>{itinerary.destination}</span>
                  </div>
                </div>
                <div className="card-airline">{f.airline}</div>
                <div className="card-price-row">
                  <div className="card-price">
                    <DollarSign size={14} />
                    {f.approxPrice}
                  </div>
                  <button
                    className={`save-btn ${saved.includes('f' + i) ? 'saved' : ''}`}
                    onClick={() => toggleSave('f' + i)}
                  >
                    {saved.includes('f' + i) ? '✓ Saved' : 'Save'}
                  </button>
                </div>
                {f.tip && <div className="card-tip">💡 {f.tip}</div>}
                <a className="book-link" href="#" onClick={e => e.preventDefault()}>
                  Search Flights <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'hotels' && (
          <div className="cards-grid">
            {(b.hotels || []).map((h, i) => (
              <div key={i} className="booking-card hotel-card">
                <div className="hotel-stars">
                  {Array.from({ length: h.stars || 4 }).map((_, s) => (
                    <Star key={s} size={12} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <h3 className="hotel-name">{h.name}</h3>
                <div className="hotel-area">📍 {h.area}</div>
                <p className="hotel-highlight">{h.highlight}</p>
                <div className="card-price-row">
                  <div className="card-price">
                    <DollarSign size={14} />
                    {h.approxPrice}
                  </div>
                  <button
                    className={`save-btn ${saved.includes('h' + i) ? 'saved' : ''}`}
                    onClick={() => toggleSave('h' + i)}
                  >
                    {saved.includes('h' + i) ? '✓ Saved' : 'Save'}
                  </button>
                </div>
                <a className="book-link" href="#" onClick={e => e.preventDefault()}>
                  Check Availability <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'activities' && (
          <div className="cards-grid">
            {(b.activities || []).map((a, i) => (
              <div key={i} className="booking-card activity-card">
                <div className="card-badge activity">
                  <Ticket size={13} />
                  Experience
                </div>
                <h3 className="activity-name">{a.name}</h3>
                <div className="card-price-row">
                  <div className="card-price">
                    <DollarSign size={14} />
                    {a.price}
                  </div>
                  <button
                    className={`save-btn ${saved.includes('a' + i) ? 'saved' : ''}`}
                    onClick={() => toggleSave('a' + i)}
                  >
                    {saved.includes('a' + i) ? '✓ Saved' : 'Save'}
                  </button>
                </div>
                {a.bookingTip && <div className="card-tip">📅 {a.bookingTip}</div>}
                <a className="book-link" href="#" onClick={e => e.preventDefault()}>
                  Book Now <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Sun, Sunset, Moon, MapPin, Lightbulb, Package, Clock, ChevronRight, Map } from 'lucide-react'
import './ItineraryPage.css'

const PERIOD_ICONS = { morning: Sun, afternoon: Sunset, evening: Moon }
const PERIOD_COLORS = { morning: '#f59e0b', afternoon: '#ef4444', evening: '#6366f1' }

export default function ItineraryPage({ itinerary, setActivePage }) {
  const [activeDay, setActiveDay] = useState(0)

  if (!itinerary) {
    return (
      <div className="empty-state">
        <Map size={48} strokeWidth={1} />
        <h2>No itinerary yet</h2>
        <p>Head to Plan Trip to generate your personalized itinerary.</p>
        <button className="cta-btn" onClick={() => setActivePage('planner')}>Plan My Trip</button>
      </div>
    )
  }

  const day = itinerary.days[activeDay]

  return (
    <div className="itinerary-page">
      <div className="itin-header">
        <div className="itin-header-text">
          <div className="itin-dest-label">
            <MapPin size={14} />
            {itinerary.destination}
          </div>
          <h1>{itinerary.tagline}</h1>
          <div className="itin-meta-row">
            <span className="meta-pill">🌤 {itinerary.weather}</span>
            <span className="meta-pill">💱 {itinerary.currency}</span>
            <span className="meta-pill">📅 {itinerary.days.length} Days</span>
          </div>
        </div>
      </div>

      <div className="itin-body">
        <div className="day-tabs-wrap">
          <div className="day-tabs">
            {itinerary.days.map((d, i) => (
              <button
                key={i}
                className={`day-tab ${activeDay === i ? 'active' : ''}`}
                onClick={() => setActiveDay(i)}
              >
                <span className="day-num">Day {d.day}</span>
                <span className="day-theme">{d.theme}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="day-content">
          <div className="day-title-row">
            <h2>Day {day.day}: {day.theme}</h2>
            {day.date && <span className="day-date">{new Date(day.date).toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}</span>}
          </div>

          <div className="timeline">
            {['morning', 'afternoon', 'evening'].map(period => {
              const slot = day[period]
              if (!slot) return null
              const Icon = PERIOD_ICONS[period]
              const color = PERIOD_COLORS[period]
              return (
                <div key={period} className="timeline-item" style={{ '--period-color': color }}>
                  <div className="timeline-marker">
                    <div className="marker-icon" style={{ background: color + '22', color }}>
                      <Icon size={16} />
                    </div>
                    <div className="marker-line" />
                  </div>
                  <div className="timeline-card">
                    <div className="card-header">
                      <div>
                        <div className="card-time">
                          <Clock size={12} />
                          {slot.time}
                        </div>
                        <h3 className="card-activity">{slot.activity}</h3>
                        <div className="card-location">
                          <MapPin size={11} />
                          {slot.location}
                        </div>
                      </div>
                      <span className="period-badge" style={{ background: color + '18', color }}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </span>
                    </div>
                    <p className="card-desc">{slot.description}</p>
                    {slot.tip && (
                      <div className="tip-box">
                        <Lightbulb size={13} />
                        <span>{slot.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {itinerary.packingList?.length > 0 && (
          <div className="packing-section">
            <h3><Package size={16} /> Packing Essentials</h3>
            <div className="packing-grid">
              {itinerary.packingList.map((item, i) => (
                <div key={i} className="pack-item">
                  <ChevronRight size={12} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="itin-footer-actions">
          <button className="action-btn primary" onClick={() => setActivePage('bookings')}>
            View Booking Suggestions →
          </button>
        </div>
      </div>
    </div>
  )
}

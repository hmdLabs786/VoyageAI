import React from 'react'
import { Compass, Map, Hotel, Bell, Sparkles } from 'lucide-react'
import './Sidebar.css'

const NAV = [
  { id: 'planner', icon: Sparkles, label: 'Plan Trip' },
  { id: 'itinerary', icon: Map, label: 'Itinerary' },
  { id: 'bookings', icon: Hotel, label: 'Bookings' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
]

export default function Sidebar({ activePage, setActivePage, unread, hasItinerary }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Compass size={22} strokeWidth={1.5} />
        <span>Voyagr</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, icon: Icon, label }) => {
          const disabled = (id === 'itinerary' || id === 'bookings') && !hasItinerary
          return (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && setActivePage(id)}
              title={disabled ? 'Generate a trip first' : label}
            >
              <div className="nav-icon-wrap">
                <Icon size={18} strokeWidth={1.8} />
                {id === 'notifications' && unread > 0 && (
                  <span className="badge">{unread}</span>
                )}
              </div>
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="ai-chip">
          <span className="ai-dot" />
          AI Agent Active
        </div>
        <p className="sidebar-tagline">Personalized travel, powered by intelligence.</p>
      </div>
    </aside>
  )
}

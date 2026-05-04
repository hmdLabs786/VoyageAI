import React from 'react'
import { Bell, BellOff, Clock, TrendingDown, Lightbulb, CheckCheck } from 'lucide-react'
import './NotificationsPage.css'

const TYPE_CONFIG = {
  reminder: { icon: Clock, color: '#3b82f6', bg: '#eff6ff', label: 'Reminder' },
  update: { icon: TrendingDown, color: '#10b981', bg: '#ecfdf5', label: 'Price Alert' },
  tip: { icon: Lightbulb, color: '#f59e0b', bg: '#fffbeb', label: 'Tip' },
}

export default function NotificationsPage({ notifications, markAllRead }) {
  const hasUnread = notifications.some(n => !n.read)

  return (
    <div className="notif-page">
      <div className="notif-header">
        <div>
          <h1>Alerts & Reminders</h1>
          <p>Your AI agent keeps you updated every step of the way.</p>
        </div>
        {hasUnread && (
          <button className="mark-read-btn" onClick={markAllRead}>
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      <div className="notif-agent-banner">
        <div className="agent-pulse">
          <Bell size={16} />
          <span className="pulse-ring" />
        </div>
        <div>
          <div className="agent-banner-title">AI Agent is monitoring your trip</div>
          <div className="agent-banner-sub">Tracking prices, weather, and sending timely reminders before your departure.</div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifs">
          <BellOff size={40} strokeWidth={1} />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.tip
            const Icon = cfg.icon
            return (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                <div
                  className="notif-icon"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <Icon size={16} />
                </div>
                <div className="notif-body">
                  <div className="notif-top">
                    <div>
                      <span className="notif-label" style={{ color: cfg.color }}>{cfg.label}</span>
                      <div className="notif-title">{n.title}</div>
                    </div>
                    <div className="notif-right">
                      <span className="notif-time">{n.time}</span>
                      {!n.read && <span className="unread-dot" />}
                    </div>
                  </div>
                  <p className="notif-text">{n.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="reminder-setup">
        <h2>Smart Reminder Settings</h2>
        <p>Your AI agent will automatically send reminders at these intervals:</p>
        <div className="reminder-timeline">
          {[
            { days: 30, label: 'Apply for visa, book flights & hotels', status: 'upcoming' },
            { days: 14, label: 'Confirm reservations, check travel advisories', status: 'upcoming' },
            { days: 7, label: 'Pack bags, download offline maps', status: 'upcoming' },
            { days: 1, label: 'Online check-in, confirm all bookings', status: 'upcoming' },
            { days: 0, label: 'Travel day — have a great trip!', status: 'final' },
          ].map((r, i) => (
            <div key={i} className="reminder-row">
              <div className={`reminder-marker ${r.status}`}>
                {r.days === 0 ? '✈️' : r.days}
              </div>
              <div className="reminder-connector" />
              <div className="reminder-content">
                <span className="reminder-days">{r.days === 0 ? 'Departure day' : `${r.days} days before`}</span>
                <span className="reminder-task">{r.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EVENTS_A3F9 } from '@/data/mockData';
import type { Session, Event } from '@/data/mockData';

function statusColor(s: string): string {
  if (s === 'BLOCKED') return 'var(--critical)';
  if (s === 'FLAGGED') return 'var(--warning)';
  return 'var(--icon-grey)';
}

export interface ElementPickerModalProps {
  open: boolean;
  session: Session | null;
  onClose: () => void;
  onSelect: (data: { eventId: string; action: string; target: string; timestamp: string; sessionId: string }) => void;
}

export function ElementPickerModal({ open, session, onClose, onSelect }: ElementPickerModalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  if (!open || !session) return null;

  // Use real events for ses_20260404_a3f9, placeholder for others
  const events: Event[] = session.id === 'ses_20260404_a3f9' ? EVENTS_A3F9 : [];
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.45)', zIndex: 290 }} />

      <div
        className="flex flex-col"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '720px',
          maxHeight: '80vh',
          background: 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          zIndex: 300,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--grey-stroke)' }}>
          <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)' }}>Select action</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>{session.id}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', padding: 'var(--space-1)', cursor: 'pointer', display: 'flex', margin: 0, borderRadius: '0px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={14} style={{ color: 'var(--icon-grey)' }} />
          </button>
        </div>

        {/* Instructions */}
        <div style={{ padding: 'var(--space-4) var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
            Select an action to use as a rule trigger.
          </span>
        </div>

        {/* Event list */}
        <div style={{ flex: 1, overflowY: 'auto', margin: '0 var(--space-6)', border: '1px solid var(--grey-stroke)', maxHeight: '300px' }}>
          {events.length === 0 ? (
            <div className="flex items-center justify-center" style={{ padding: 'var(--space-8)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
                No event detail available for this session
              </span>
            </div>
          ) : (
            events.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              const isHovered = hoveredEventId === evt.id;

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  onMouseEnter={() => setHoveredEventId(evt.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  className="flex items-center"
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    gap: 'var(--space-3)',
                    borderBottom: '1px solid var(--grey-stroke)',
                    background: isSelected ? 'rgba(11,13,196,0.06)' : isHovered ? 'var(--hover-gray)' : 'var(--card-bg)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                    outline: isSelected ? '2px solid var(--accent-color)' : 'none',
                    outlineOffset: '-2px',
                  }}
                >
                  {/* Sequence number */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', width: '24px', flexShrink: 0 }}>
                    {evt.sequence}
                  </span>

                  {/* Action */}
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {evt.action}
                  </span>

                  {/* Timestamp */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)', flexShrink: 0 }}>
                    {evt.timestamp}
                  </span>

                  {/* Status chip */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: statusColor(evt.classificationStatus), border: `1px solid ${statusColor(evt.classificationStatus)}`, padding: '1px 4px', flexShrink: 0 }}>
                    {evt.classificationStatus}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Detection drawer */}
        <div style={{ maxHeight: selectedEvent ? '80px' : '0px', overflow: 'hidden', transition: 'max-height 200ms ease-in-out', background: 'var(--pressed-gray)', borderTop: selectedEvent ? '1px solid var(--grey-stroke)' : 'none' }}>
          {selectedEvent && (
            <div className="flex items-center justify-between" style={{ padding: 'var(--space-4) var(--space-6)' }}>
              <div className="flex flex-col" style={{ gap: '2px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
                  Selected action: {selectedEvent.action}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
                  Detected at: {selectedEvent.timestamp}
                </span>
              </div>
              <Button variant="primary" size="sm" onClick={() => {
                onSelect({
                  eventId: selectedEvent.id,
                  action: selectedEvent.action,
                  target: selectedEvent.target,
                  timestamp: selectedEvent.timestamp,
                  sessionId: session.id,
                });
              }}>
                Use as rule trigger →
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end" style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--grey-stroke)' }}>
          <Button variant="ghost" size="sm" noAscii onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </>
  );
}

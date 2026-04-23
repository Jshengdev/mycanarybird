'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronDown, CodeXml, ScatterChart, Tag, Zap,
  PanelLeftClose, Settings, Radio,
} from 'lucide-react';
import { AsciiHover } from '@/components/ui/AsciiHover';
import { Toast } from '@/components/ui/Toast';
import { LIVE_SESSION_STATE, AGENTS } from '@/data/mockData';

interface SidebarProps {
  workspaceName?: string;
  activeAgentId?: string;
  activeItem?: string;
  onCollapse?: () => void;
  embedded?: boolean;
}

/* Sidebar nav items have two modes:
   1. Dropdown items (have a trailing chevron arrow) — no AsciiHover,
      arrow pinned far-right, hover bg only
   2. Leaf items (no arrow) — AsciiHover on hover

   All items get: grey-stroke border, 4px top/bottom, 6px left, 4px right */

const NAV_PADDING = { paddingTop: '4px', paddingBottom: '4px', paddingLeft: '6px', paddingRight: '4px' };

function NavItem({
  icon,
  label,
  indent,
  active,
  onClick,
  asciiColor,
  trailing,
  isDropdown,
  labelColor,
  asciiActive,
}: {
  icon?: React.ReactNode;
  label: string | React.ReactNode;
  indent: number;
  active?: boolean;
  onClick?: () => void;
  asciiColor?: string;
  trailing?: React.ReactNode;
  isDropdown?: boolean;
  labelColor?: string;
  asciiActive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const innerContent = (
    <>
      {icon}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 500,
          color: labelColor || 'var(--text-black)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      {trailing}
    </>
  );

  // Dropdown items (with arrow): no AsciiHover, just hover bg
  if (isDropdown) {
    return (
      <div
        className="flex items-center"
        style={{
          ...NAV_PADDING,
          paddingLeft: `${indent + 6}px`,
          border: hovered || active ? '1px solid var(--grey-stroke)' : '1px solid transparent',
          background: active || hovered ? 'var(--hover-gray)' : 'transparent',
          transition: 'background var(--transition-fast), border-color var(--transition-fast)',
          cursor: 'pointer',
          gap: 'var(--space-3)',
          marginBottom: '2px',
        }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {innerContent}
      </div>
    );
  }

  // Leaf items: AsciiHover
  return (
    <AsciiHover
      variant="right"
      color={asciiColor || 'var(--icon-grey)'}
      active={asciiActive}
      style={{
        ...NAV_PADDING,
        paddingLeft: `${indent + 6}px`,
        border: hovered || active ? '1px solid var(--grey-stroke)' : '1px solid transparent',
        background: active || hovered ? 'var(--hover-gray)' : 'transparent',
        transition: 'background var(--transition-fast)',
        '--ascii-pad-y': '4px',
        '--ascii-pad-x': '4px',
        marginBottom: '2px',
      } as React.CSSProperties}
    >
      <div
        className="flex items-center"
        style={{
          cursor: 'pointer',
          gap: 'var(--space-3)',
          position: 'relative',
          zIndex: 1,
        }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {innerContent}
      </div>
    </AsciiHover>
  );
}

/* ── Settings nav items ────────────────────────────────────── */

/* ── Sidebar ───────────────────────────────────────────────── */

export function Sidebar({
  workspaceName = 'Photon workspace',
  activeAgentId,
  activeItem = 'sessions',
  onCollapse,
  embedded = false,
}: SidebarProps) {
  const router = useRouter();
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(activeAgentId || null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  // Live pulse: cycle active on/off every 900ms
  const [livePulse, setLivePulse] = useState(false);
  const liveAgentId = LIVE_SESSION_STATE.isLive ? LIVE_SESSION_STATE.agentId : null;

  useEffect(() => {
    if (!liveAgentId) return;
    const id = setInterval(() => setLivePulse((p) => !p), 900);
    return () => clearInterval(id);
  }, [liveAgentId]);


  const handleSessionToggle = (agentId: string) => {
    if (LIVE_SESSION_STATE.isLive && LIVE_SESSION_STATE.agentId === agentId) {
      LIVE_SESSION_STATE.isLive = false;
      setToastMsg('Session stopped');
      forceUpdate((n) => n + 1);
    } else {
      LIVE_SESSION_STATE.isLive = true;
      LIVE_SESSION_STATE.agentId = agentId;
      LIVE_SESSION_STATE.sessionId = 'ses_20260412_a1b2';
      LIVE_SESSION_STATE.startedAt = new Date().toISOString();
      LIVE_SESSION_STATE.durationSeconds = 0;
      LIVE_SESSION_STATE.traceCount = 0;
      LIVE_SESSION_STATE.violationCount = 0;
      LIVE_SESSION_STATE.warningCount = 0;
      LIVE_SESSION_STATE.currentScore = 100;
      LIVE_SESSION_STATE.loopDetected = false;
      forceUpdate((n) => n + 1);
      router.push(`/demo/${agentId}/live`);
    }
  };

  return (
    <aside
      className="flex flex-col"
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--grey-stroke)',
        padding: 'var(--space-6)',
        position: embedded ? 'relative' : 'fixed',
        left: embedded ? undefined : 0,
        top: embedded ? undefined : 0,
        overflow: 'auto',
        zIndex: embedded ? undefined : ('var(--z-sticky)' as unknown as number),
      }}
    >
      {/* Workspace selector */}
      <div
        className="flex items-center"
        onClick={() => { if (onCollapse) onCollapse(); else router.push('/'); }}
        style={{
          gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-12)',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            background: 'var(--accent-color)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--text-white)',
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}
        >
          PH
        </div>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-black)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {workspaceName}
        </span>
        {onCollapse && (
          <button
            aria-label="Close sidebar"
            onClick={(e) => { e.stopPropagation(); onCollapse(); }}
            style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex' }}
          >
            <PanelLeftClose
              size={16}
              style={{ color: 'var(--icon-grey)', flexShrink: 0 }}
            />
          </button>
        )}
      </div>

      {/* ── Agent list ───── */}
      <div
        className="flex flex-col"
        style={{ flex: 1 }}
      >
        {/* Section label */}
        <span
          style={{
            fontFamily: 'var(--font-mono-alt)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--icon-grey)',
            textTransform: 'uppercase',
            padding: '0 var(--space-3)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Agents
        </span>

        {/* Agent list */}
        {AGENTS.map((agent) => {
          const isExpanded = expandedAgentId === agent.id;
          const isActive = activeAgentId === agent.id;
          const isLive = liveAgentId === agent.id;
          const isDisconnected = agent.connectionStatus === 'disconnected';

          return (
            <React.Fragment key={agent.id}>
              {/* Agent row — dropdown */}
              <NavItem
                icon={isExpanded ? <ChevronDown size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} /> : <ChevronRight size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
                label={
                  <span className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                    {agent.name}
                    {isLive && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--safe)', lineHeight: 1 }}>█</span>}
                    {isDisconnected && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--warning)', lineHeight: 1 }}>▒</span>}
                  </span>
                }
                indent={0}
                active={isActive && !isExpanded}
                onClick={() => setExpandedAgentId(isExpanded ? null : agent.id)}
                isDropdown
                trailing={
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)', flexShrink: 0 }}>
                    {agent.healthScore}
                  </span>
                }
              />

              {isExpanded && (
                <>
                  {/* Start / Stop Session */}
                  <div
                    onClick={() => handleSessionToggle(agent.id)}
                    className="flex items-center"
                    style={{
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      paddingLeft: '22px',
                      paddingRight: '4px',
                      gap: 'var(--space-3)',
                      background: isLive ? 'var(--card-bg)' : 'var(--accent-color)',
                      color: isLive ? 'var(--critical)' : 'var(--text-white)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      marginBottom: '2px',
                      border: isLive ? '1px solid var(--grey-stroke)' : '1px solid transparent',
                      borderRadius: '0px',
                    }}
                  >
                    <span style={{ fontSize: '10px', lineHeight: 1 }}>{isLive ? '■' : '▶'}</span>
                    {isLive ? 'Stop session' : 'Start session'}
                  </div>
                  {/* Profile */}
                  <NavItem
                    icon={<CodeXml size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
                    label="Profile"
                    indent={16}
                    active={isActive && activeItem === 'profile'}
                    onClick={() => router.push(`/demo/${agent.id}/profile`)}
                  />
                  {/* Live */}
                  <NavItem
                    icon={
                      isLive ? (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--safe)', flexShrink: 0, lineHeight: 1 }}>█</span>
                      ) : (
                        <Radio size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
                      )
                    }
                    label="Live"
                    indent={16}
                    active={isActive && activeItem === 'live'}
                    labelColor={isLive ? 'var(--accent-color)' : undefined}
                    asciiColor={isLive ? 'var(--accent-color)' : undefined}
                    asciiActive={isLive ? livePulse : undefined}
                    onClick={() => router.push(`/demo/${agent.id}/live`)}
                  />
                  {/* Sessions */}
                  <NavItem
                    icon={<ScatterChart size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
                    label="Sessions"
                    indent={16}
                    active={isActive && activeItem === 'sessions'}
                    onClick={() => router.push(`/demo/${agent.id}/sessions`)}
                  />
                  {/* Insights */}
                  <NavItem
                    icon={<Zap size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
                    label="Insights"
                    indent={16}
                    active={isActive && activeItem === 'insights'}
                    onClick={() => router.push(`/demo/${agent.id}/insights`)}
                  />
                  {/* Rules */}
                  <NavItem
                    icon={<Tag size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
                    label="Rules"
                    indent={16}
                    active={isActive && activeItem === 'rulesets'}
                    onClick={() => router.push(`/demo/${agent.id}/rules`)}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* Spacer pushes settings to bottom */}
        <div style={{ flex: 1 }} />
      </div>

      {/* Settings button at bottom */}
      <div style={{ borderTop: '1px solid var(--grey-stroke)', paddingTop: 'var(--space-3)' }}>
        <NavItem
          icon={<Settings size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
          label="Settings"
          indent={0}
          active={activeItem?.startsWith('settings')}
          onClick={() => router.push('/demo/settings/workspace')}
        />
      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: 'var(--space-6)', zIndex: 400 }}>
          <Toast
            variant={toastMsg === 'Session already running' ? 'warning' : 'success'}
            title={toastMsg}
            onDismiss={() => setToastMsg(null)}
          />
        </div>
      )}
    </aside>
  );
}

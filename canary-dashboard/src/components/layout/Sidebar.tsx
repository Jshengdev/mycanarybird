'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronRight, ChevronDown, CodeXml, ScatterChart, Tag,
  PanelLeftClose, DiamondPlus, Settings, ArrowLeft, Radio,
  Building2, BarChart3, Users, Plug, Bell, SlidersHorizontal, Trash2,
} from 'lucide-react';
import { AsciiHover } from '@/components/ui/AsciiHover';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Toast } from '@/components/ui/Toast';
import type { StatusVariant } from '@/components/ui/StatusIndicator';
import { LIVE_SESSION_STATE } from '@/data/mockData';

interface RulesetItem {
  name: string;
  count: number;
  severity: StatusVariant;
}

interface SidebarProps {
  workspaceName?: string;
  agentName?: string;
  activeItem?: string;
  activeRulesetId?: string;
  rulesets?: RulesetItem[];
  onCollapse?: () => void;
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

const SETTINGS_NAV = [
  { slug: 'workspace', label: 'Workspace', icon: Building2 },
  { slug: 'scoring', label: 'Scoring', icon: BarChart3 },
  { slug: 'members', label: 'Members', icon: Users },
  { slug: 'integrations', label: 'Integrations', icon: Plug },
  { slug: 'notifications', label: 'Notifications', icon: Bell },
  { slug: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { slug: 'workspace-actions', label: 'Workspace Actions', icon: Trash2 },
];

/* ── Sidebar ───────────────────────────────────────────────── */

export function Sidebar({
  workspaceName = 'Photon workspace',
  agentName = 'Email Agent',
  activeItem = 'sessions',
  activeRulesetId,
  rulesets = [
    { name: 'Email Safety', count: 8, severity: 'warning' as StatusVariant },
    { name: 'Attachment Rules', count: 3, severity: 'safe' as StatusVariant },
  ],
  onCollapse,
}: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const ws = (params?.workspace as string) || 'photon';
  const [agentExpanded, setAgentExpanded] = useState(true);
  const [rulesetsExpanded, setRulesetsExpanded] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Live pulse: cycle active on/off every 900ms
  const [livePulse, setLivePulse] = useState(false);
  const agentSlug = agentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const isAgentLive = LIVE_SESSION_STATE.isLive && LIVE_SESSION_STATE.agentId === agentSlug;

  useEffect(() => {
    if (!isAgentLive) return;
    const id = setInterval(() => setLivePulse((p) => !p), 900);
    return () => clearInterval(id);
  }, [isAgentLive]);

  // Derive active settings section from activeItem
  const activeSettingsSection = activeItem?.startsWith('settings-')
    ? activeItem.replace('settings-', '')
    : activeItem === 'settings' ? 'workspace' : null;

  // Auto-open settings panel when on a settings page
  useEffect(() => {
    if (activeSettingsSection) setSettingsOpen(true);
  }, [activeSettingsSection]);

  const handleSessionToggle = () => {
    if (LIVE_SESSION_STATE.isLive) {
      LIVE_SESSION_STATE.isLive = false;
      setToastMsg('Session stopped');
    } else {
      LIVE_SESSION_STATE.isLive = true;
      LIVE_SESSION_STATE.agentId = agentSlug;
      LIVE_SESSION_STATE.sessionId = 'ses_20260404_a3f9';
      LIVE_SESSION_STATE.startedAt = new Date().toISOString();
      LIVE_SESSION_STATE.durationSeconds = 0;
      LIVE_SESSION_STATE.traceCount = 0;
      LIVE_SESSION_STATE.violationCount = 0;
      LIVE_SESSION_STATE.warningCount = 0;
      LIVE_SESSION_STATE.currentScore = 100;
      LIVE_SESSION_STATE.loopDetected = false;
      router.push(`/${ws}/${agentSlug}/live`);
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
        position: 'fixed',
        left: 0,
        top: 0,
        overflow: 'auto',
        zIndex: 'var(--z-sticky)' as unknown as number,
      }}
    >
      {/* Workspace selector */}
      <div
        className="flex items-center"
        onClick={() => router.push('/')}
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
            background: 'var(--text-black)',
            borderRadius: 'var(--radius-avatar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-white)',
            flexShrink: 0,
          }}
        >
          CA
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
        <PanelLeftClose
          size={16}
          style={{ color: 'var(--icon-grey)', flexShrink: 0, cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); onCollapse?.(); }}
        />
      </div>

      {/* ── Agent list (hidden when settings open) ───── */}
      <div
        style={{
          opacity: settingsOpen ? 0 : 1,
          pointerEvents: settingsOpen ? 'none' : 'auto',
          transform: settingsOpen ? 'translateX(-8px)' : 'translateX(0)',
          transition: 'opacity 150ms ease, transform 150ms ease',
          display: settingsOpen ? 'none' : 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
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

        {/* Agent row — dropdown */}
        <NavItem
          icon={agentExpanded ? <ChevronDown size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} /> : <ChevronRight size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
          label={agentName}
          indent={0}
          onClick={() => setAgentExpanded(!agentExpanded)}
          isDropdown
        />

        {agentExpanded && (
          <>
            {/* Start / Stop Session */}
            <div
              onClick={handleSessionToggle}
              className="flex items-center"
              style={{
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingLeft: '22px',
                paddingRight: '4px',
                gap: 'var(--space-3)',
                background: isAgentLive ? 'var(--card-bg)' : 'var(--accent-color)',
                color: isAgentLive ? 'var(--critical)' : 'var(--text-white)',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: '2px',
                border: isAgentLive ? '1px solid var(--grey-stroke)' : '1px solid transparent',
                borderRadius: '0px',
              }}
            >
              <span style={{ fontSize: '10px', lineHeight: 1 }}>{isAgentLive ? '■' : '▶'}</span>
              {isAgentLive ? 'Stop session' : 'Start session'}
            </div>
            {/* Summary */}
            <NavItem
              icon={<ScatterChart size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
              label="Summary"
              indent={16}
              active={activeItem === 'summary'}
              onClick={() => router.push(`/${ws}/${agentSlug}`)}
            />
            {/* Profile */}
            <NavItem
              icon={<CodeXml size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
              label="Profile"
              indent={16}
              active={activeItem === 'profile'}
              onClick={() => router.push(`/${ws}/${agentSlug}/profile`)}
            />
            {/* Live */}
            <NavItem
              icon={
                isAgentLive ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--safe)', flexShrink: 0, lineHeight: 1 }}>█</span>
                ) : (
                  <Radio size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
                )
              }
              label="Live"
              indent={16}
              active={activeItem === 'live'}
              labelColor={isAgentLive ? 'var(--accent-color)' : undefined}
              asciiColor={isAgentLive ? 'var(--accent-color)' : undefined}
              asciiActive={isAgentLive ? livePulse : undefined}
              onClick={() => router.push(`/${ws}/${agentSlug}/live`)}
            />
            {/* Sessions */}
            <NavItem
              icon={<ScatterChart size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
              label="Sessions"
              indent={16}
              active={activeItem === 'sessions'}
              onClick={() => router.push(`/${ws}/${agentSlug}/sessions`)}
            />
            {/* Rulesets — dropdown */}
            <NavItem
              icon={<Tag size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
              label="Rulesets"
              indent={16}
              active={activeItem === 'rulesets'}
              onClick={() => setRulesetsExpanded(!rulesetsExpanded)}
              trailing={
                rulesetsExpanded ? (
                  <DiamondPlus
                    size={12}
                    style={{ color: 'var(--icon-grey)', flexShrink: 0, marginLeft: 'auto', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); console.log('Create new ruleset'); }}
                  />
                ) : (
                  <ChevronRight size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0, marginLeft: 'auto' }} />
                )
              }
              isDropdown
            />

            {rulesetsExpanded && (
              <>
                {rulesets.map((rs) => (
                  <NavItem
                    key={rs.name}
                    label={rs.name}
                    indent={32}
                    asciiColor={`var(--${rs.severity})`}
                    active={activeRulesetId === rs.name.toLowerCase().replace(/\s+/g, '-')}
                    icon={
                      <span
                        className="inline-flex items-center justify-center"
                        style={{
                          width: '14px',
                          height: '14px',
                          border: '1px solid var(--grey-stroke)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '7px',
                          color: 'var(--text-black)',
                          flexShrink: 0,
                        }}
                      >
                        {rs.count}
                      </span>
                    }
                    trailing={<StatusIndicator variant={rs.severity} />}
                    onClick={() => router.push(`/${ws}/${agentSlug}/rules?ruleset=${rs.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  />
                ))}
              </>
            )}
          </>
        )}

        {/* Spacer pushes settings to bottom */}
        <div style={{ flex: 1 }} />
      </div>

      {/* ── Settings inner nav ─────────────────────────────── */}
      {settingsOpen && (
        <div
          className="flex flex-col"
          style={{
            flex: 1,
            animation: 'settingsSlideIn 150ms ease',
          }}
        >
          <style>{`
            @keyframes settingsSlideIn {
              from { opacity: 0; transform: translateX(8px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
          {/* Back button */}
          <div
            className="flex items-center"
            onClick={() => setSettingsOpen(false)}
            style={{
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'pointer',
              marginBottom: 'var(--space-4)',
            }}
          >
            <ArrowLeft size={12} style={{ color: 'var(--icon-grey)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--icon-grey)',
              }}
            >
              ← Agents
            </span>
          </div>

          {/* Settings section label */}
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
            Settings
          </span>

          {/* Settings nav items */}
          {SETTINGS_NAV.map((s) => {
            const Icon = s.icon;
            const isActive = activeSettingsSection === s.slug;
            return (
              <NavItem
                key={s.slug}
                icon={<Icon size={12} style={{ color: isActive ? 'var(--accent-color)' : 'var(--icon-grey)', flexShrink: 0 }} />}
                label={s.label}
                indent={0}
                active={isActive}
                labelColor={isActive ? 'var(--accent-color)' : undefined}
                onClick={() => router.push(`/${ws}/settings/${s.slug}`)}
              />
            );
          })}

          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* Settings button at bottom — always visible */}
      <div style={{ borderTop: '1px solid var(--grey-stroke)', paddingTop: 'var(--space-3)' }}>
        <div
          className="flex items-center"
          onClick={() => {
            if (settingsOpen) {
              setSettingsOpen(false);
            } else {
              setSettingsOpen(true);
            }
          }}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            cursor: 'pointer',
            gap: 'var(--space-3)',
          }}
        >
          <Settings size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--icon-grey)',
            }}
          >
            Settings
          </span>
        </div>
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

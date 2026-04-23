'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PanelLeft, Building2, BarChart3, Users, Plug, Bell, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { AsciiHover } from '@/components/ui/AsciiHover';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { ScoringIndicator } from '@/components/ui/ScoringIndicator';
import { InlineAction } from '@/components/ui/InlineAction';
import { Modal } from '@/components/ui/Modal';
import { AGENTS, WORKSPACE_SETTINGS, SCORING_TEMPLATES } from '@/data/mockData';

/* ── Helpers ──────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400, textTransform: 'uppercase', color: 'var(--icon-grey)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {children}
      </span>
      <div style={{ flex: 1, borderBottom: '1px dotted var(--grey-stroke)' }} />
    </div>
  );
}

/* ── Section Components ───────────────────────────────────────── */

function WorkspaceSection() {
  const [name, setName] = useState(WORKSPACE_SETTINGS.name);
  const [editingName, setEditingName] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenConfirm, setRegenConfirm] = useState(false);
  const [regenInput, setRegenInput] = useState('');

  const handleSaveName = () => { setEditingName(false); setSaved(true); setTimeout(() => setSaved(false), 1500); };
  const handleCopyKey = () => { navigator.clipboard.writeText(WORKSPACE_SETTINGS.apiKey); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex flex-col" style={{ gap: '60px' }}>
      {/* Workspace Name */}
      <div>
        <SectionLabel>Workspace Name</SectionLabel>
        {editingName ? (
          <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleSaveName} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }} autoFocus style={{ fontSize: '16px', fontWeight: 500 }} />
        ) : (
          <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <span onClick={() => setEditingName(true)} style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, color: 'var(--text-black)', cursor: 'text', borderBottom: '1px dashed var(--grey-stroke)', paddingBottom: '2px' }}>{name}</span>
            {saved && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--safe)' }}>Saved</span>}
          </div>
        )}
      </div>

      {/* API Key */}
      <div>
        <SectionLabel>API Key</SectionLabel>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--grey-stroke)', padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-black)' }}>
            {showKey ? WORKSPACE_SETTINGS.apiKey : 'ck_live_••••••••••••••••'}
          </div>
          <Button variant="ghost" size="sm" noAscii onClick={() => setShowKey(!showKey)}>{showKey ? 'Hide' : 'Show'}</Button>
          <Button variant="ghost" size="sm" noAscii icon={copied ? <Check size={12} style={{ color: 'var(--safe)' }} /> : <Copy size={12} />} onClick={handleCopyKey}>{copied ? 'Copied' : 'Copy'}</Button>
          <Button variant="secondary" size="sm" noAscii onClick={() => setRegenConfirm(true)}>Regenerate</Button>
        </div>
        {regenConfirm && (
          <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--critical)' }}>Regenerating will break all connected agents. Type CONFIRM to proceed.</span>
            <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
              <div style={{ width: '200px' }}><Input value={regenInput} onChange={(e) => setRegenInput(e.target.value)} placeholder="Type CONFIRM" /></div>
              <Button variant="destructive" size="sm" disabled={regenInput !== 'CONFIRM'}>Confirm regenerate</Button>
              <button onClick={() => { setRegenConfirm(false); setRegenInput(''); }} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', font: 'inherit', color: 'var(--accent-color)', fontFamily: 'var(--font-sans)', fontSize: '12px', textDecoration: 'underline' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Plan */}
      <div>
        <SectionLabel>Plan</SectionLabel>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '4px 12px', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', display: 'inline-block', marginBottom: 'var(--space-4)' }}>TEAM</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <StatCard label="Agents" value="4 / 10" detail="active / limit" />
          <StatCard label="Sessions" value="127" detail="this month" />
          <StatCard label="Retention" value="90d" detail="session history" />
        </div>
        <div style={{ marginTop: 'var(--space-4)' }}><InlineAction label="Upgrade plan" /></div>
      </div>

      {/* Billing */}
      <div>
        <SectionLabel>Billing</SectionLabel>
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div className="flex items-center justify-between" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--grey-stroke)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Plan</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-black)' }}>Team</span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--grey-stroke)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Amount</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 400, color: 'var(--text-black)' }}>$3.10 / month</span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--grey-stroke)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Next billing</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 400, color: 'var(--text-black)' }}>Apr 30, 2026</span>
          </div>
          <div style={{ padding: 'var(--space-4)' }}>
            <InlineAction label="Manage billing" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoringSection() {
  const [activeTemplate, setActiveTemplate] = useState('standard');
  const [model, setModel] = useState({ ...WORKSPACE_SETTINGS.scoringModel });
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleTemplateClick = (t: typeof SCORING_TEMPLATES[0]) => {
    setActiveTemplate(t.id);
    setModel({ flaggedPenalty: t.flaggedPenalty, blockedPenalty: t.blockedPenalty, criticalSurcharge: t.criticalSurcharge, deploymentThreshold: t.deploymentThreshold });
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
      {/* Hierarchy */}
      <div className="flex items-center" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        {['WORKSPACE', 'PROJECT', 'AGENT', 'RULESET'].map((level, i) => (
          <React.Fragment key={level}>
            {i > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>→</span>}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', border: '1px solid var(--grey-stroke)', background: level === 'WORKSPACE' ? 'var(--text-black)' : 'transparent', color: level === 'WORKSPACE' ? 'var(--text-white)' : 'var(--icon-grey)' }}>{level}</span>
          </React.Fragment>
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>Smallest scope wins. Conflicts are flagged.</span>

      {/* Templates */}
      <div>
        <SectionLabel>Scoring Templates</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          {SCORING_TEMPLATES.map((t) => (
            <div key={t.id} onClick={() => handleTemplateClick(t)} className={activeTemplate === t.id ? 'card-gradient-border' : ''} style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)', border: activeTemplate === t.id ? 'none' : '1px solid var(--grey-stroke)', borderRadius: '4px', padding: 'var(--space-5)', cursor: 'pointer', position: 'relative' }}>
              {activeTemplate === t.id && <span style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', background: 'var(--accent-color)', color: 'white', padding: '1px 6px' }}>Active</span>}
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)', display: 'block', marginBottom: 'var(--space-3)' }}>{t.name}</span>
              <div className="flex flex-col" style={{ gap: '2px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>FLAGGED: −{t.flaggedPenalty} pts</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>BLOCKED: −{t.blockedPenalty} pts</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>Threshold: {t.deploymentThreshold}</span>
              </div>
            </div>
          ))}
        </div>
        {savingTemplate ? (
          <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <div style={{ width: '200px' }}><Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template name" /></div>
            <Button variant="primary" size="sm" onClick={() => { setSavingTemplate(false); setTemplateName(''); }}>Save</Button>
            <button onClick={() => setSavingTemplate(false)} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', font: 'inherit', color: 'var(--accent-color)', fontFamily: 'var(--font-sans)', fontSize: '12px', textDecoration: 'underline' }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setSavingTemplate(true)} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', font: 'inherit', color: 'var(--accent-color)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>+ Save current as template</button>
        )}
      </div>

      {/* Custom values */}
      <div>
        <SectionLabel>Workspace Scoring Model</SectionLabel>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-4)' }}>Applied to all agents unless overridden</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          {[
            { label: 'FLAGGED PENALTY', key: 'flaggedPenalty', unit: 'pts deducted per event' },
            { label: 'BLOCKED PENALTY', key: 'blockedPenalty', unit: 'pts deducted per event' },
            { label: 'CRITICAL SURCHARGE', key: 'criticalSurcharge', unit: 'pts per critical violation' },
            { label: 'DEPLOYMENT THRESHOLD', key: 'deploymentThreshold', unit: 'minimum score for READY' },
          ].map((field) => (
            <div key={field.key} className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>{field.label}</span>
              <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                <input type="number" value={model[field.key as keyof typeof model]} onChange={(e) => setModel({ ...model, [field.key]: parseInt(e.target.value) || 0 })} style={{ fontFamily: 'var(--font-mono)', height: '36px', width: '100%', border: '1px solid var(--grey-stroke)', background: 'var(--card-bg)', padding: '0 var(--space-3)', borderRadius: '0px', outline: 'none', margin: 0 }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>{field.unit}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end" style={{ marginTop: 'var(--space-4)' }}>
          <Button variant="primary" size="sm" onClick={() => console.log('Saved scoring model', model)}>Save workspace model</Button>
        </div>
      </div>

      {/* Preview */}
      <div>
        <SectionLabel>Scoring Indicator Preview</SectionLabel>
        <ScoringIndicator model={SCORING_TEMPLATES.find((t) => t.id === activeTemplate)?.name || 'Standard'} scope="workspace" variant="chip" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', marginTop: 'var(--space-3)' }}>This chip appears on agent summary and ruleset pages.</span>
      </div>
    </div>
  );
}

function MembersSection() {
  const [inviting, setInviting] = useState(false);
  const member = WORKSPACE_SETTINGS.members[0];

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 80px', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--grey-stroke)', background: 'var(--card-bg)' }}>
        {['MEMBER', 'ROLE', 'JOINED', ''].map((h) => (
          <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>{h}</span>
        ))}
      </div>

      {/* Member row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 80px', alignItems: 'center', padding: 'var(--space-4)', border: '1px solid var(--grey-stroke)', background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)', borderRadius: '4px' }}>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <div className="flex items-center justify-center" style={{ width: '28px', height: '28px', background: 'var(--accent-color)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>TS</div>
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)' }}>{member.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>(you)</span></span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>{member.email}</div>
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', padding: '2px 8px', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', display: 'inline-block', width: 'fit-content' }}>Owner</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>Mar 15, 2026</span>
        <span />
      </div>

      {/* Role matrix */}
      <div>
        <SectionLabel>Role Permissions</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: '1px' }}>
          <span />{['Owner', 'Admin', 'Viewer'].map((r) => <span key={r} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-black)', textAlign: 'center' }}>{r}</span>)}
          {[
            ['View sessions and reports', true, true, true],
            ['Create and edit rules', true, true, false],
            ['Manage agents', true, true, false],
            ['Edit scoring models', true, false, false],
            ['Manage members', true, false, false],
            ['Billing and plan', true, false, false],
          ].map(([perm, ...vals]) => (
            <React.Fragment key={perm as string}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)', padding: 'var(--space-2) 0' }}>{perm as string}</span>
              {(vals as boolean[]).map((v, i) => <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: v ? 'var(--safe)' : 'var(--icon-grey)', textAlign: 'center', padding: 'var(--space-2) 0' }}>{v ? '✓' : '—'}</span>)}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Invite */}
      <Button variant="primary" size="sm" onClick={() => setInviting(true)}>Invite member</Button>
      <Modal open={inviting} onClose={() => setInviting(false)} title="Invite member" size="form" footer={
        <>
          <Button variant="secondary" size="sm" noAscii onClick={() => setInviting(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => setInviting(false)}>Send invite</Button>
        </>
      }>
        <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
          <Input label="Email address" placeholder="colleague@company.com" />
          <Select label="Role" options={[{ value: 'admin', label: 'Admin' }, { value: 'viewer', label: 'Viewer' }]} value="admin" />
        </div>
      </Modal>
    </div>
  );
}

function IntegrationsSection() {
  const integrations = [
    { name: 'Slack', desc: 'Get alerts in Slack when agents violate rules or scores drop below threshold.', connected: false },
    { name: 'GitHub', desc: 'Link sessions to commits. See which deploy caused a regression.', connected: false },
    { name: 'CI/CD', desc: 'Fail your pipeline when agent score drops below deployment threshold.', connected: false },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
      {integrations.map((int) => (
        <div key={int.name} className="flex flex-col" style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)', border: '1px solid var(--grey-stroke)', borderRadius: '4px', padding: 'var(--space-6)', gap: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)' }}>{int.name}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>{int.desc}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: int.connected ? 'var(--safe)' : 'var(--icon-grey)', border: `1px solid ${int.connected ? 'var(--safe)' : 'var(--icon-grey)'}`, padding: '2px 6px', display: 'inline-block', width: 'fit-content' }}>{int.connected ? 'CONNECTED' : 'NOT CONNECTED'}</span>
          <div style={{ marginTop: 'auto' }}>
            <Button variant="secondary" size="sm" noAscii onClick={() => console.log(`Connect ${int.name} — coming soon`)}>Connect</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsSection() {
  const [notifs, setNotifs] = useState(WORKSPACE_SETTINGS.notifications);
  const [webhookUrl, setWebhookUrl] = useState(notifs.webhookUrl);

  const toggleEvent = (key: string) => setNotifs({ ...notifs, [key]: !notifs[key as keyof typeof notifs] });
  const toggleChannel = (key: string) => setNotifs({ ...notifs, channels: { ...notifs.channels, [key]: !notifs.channels[key as keyof typeof notifs.channels] } });

  const events = [
    { key: 'scoreBelowThreshold', name: 'Score below threshold', desc: 'Alert when any agent session scores below the deployment threshold' },
    { key: 'blockedEventFires', name: 'BLOCKED event fires', desc: 'Alert immediately when a BLOCKED rule violation occurs during a session' },
    { key: 'newSuggestions', name: 'New suggestions generated', desc: 'Alert when canary suggest produces new rule recommendations' },
    { key: 'agentOffline', name: 'Agent goes offline', desc: 'Alert when a connected agent stops sending data' },
  ];

  const channels = [
    { key: 'inApp', name: 'In-app toast', desc: 'Show a toast notification in the dashboard', alwaysOn: true },
    { key: 'email', name: 'Email', desc: 'Send to ttshim@usc.edu', comingSoon: true },
    { key: 'slack', name: 'Slack', desc: 'Post to a Slack channel', needsIntegration: true },
    { key: 'webhook', name: 'Webhook', desc: 'POST to a custom URL' },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
      <div>
        <SectionLabel>Alert Events</SectionLabel>
        {events.map((ev) => (
          <div key={ev.key} className="flex items-center justify-between" style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--grey-stroke)' }}>
            <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>{ev.name}</span><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>{ev.desc}</span></div>
            <Switch checked={notifs[ev.key as keyof typeof notifs] as boolean} onChange={() => toggleEvent(ev.key)} />
          </div>
        ))}
      </div>

      <div>
        <SectionLabel>Delivery Channels</SectionLabel>
        {channels.map((ch) => (
          <div key={ch.key} className="flex items-center justify-between" style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--grey-stroke)' }}>
            <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
              <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>{ch.name}</span><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>{ch.desc}</span></div>
              {ch.alwaysOn && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--icon-grey)' }}>ALWAYS ON</span>}
              {ch.comingSoon && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--icon-grey)', border: '1px solid var(--grey-stroke)', padding: '1px 4px' }}>COMING SOON</span>}
              {ch.needsIntegration && <InlineAction label="Connect Slack first" />}
            </div>
            <Switch checked={notifs.channels[ch.key as keyof typeof notifs.channels] as boolean} onChange={() => toggleChannel(ch.key)} disabled={ch.alwaysOn || ch.comingSoon} />
          </div>
        ))}
        {notifs.channels.webhook && (
          <div className="flex items-center" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <div style={{ flex: 1 }}><Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-server.com/canary-webhook" /></div>
            <Button variant="ghost" size="sm" noAscii>Test webhook</Button>
          </div>
        )}
      </div>

      <div>
        <SectionLabel>Per-Agent Overrides</SectionLabel>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-4)' }}>Override workspace notification settings for specific agents.</span>
        {AGENTS.map((agent) => (
          <div key={agent.id} className="flex items-center justify-between" style={{ padding: 'var(--space-3) var(--space-4)', background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)', border: '1px solid var(--grey-stroke)', borderRadius: '4px', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)' }}>{agent.name}</span>
            <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)', border: '1px solid var(--grey-stroke)', padding: '2px 6px' }}>Using workspace defaults</span>
              <Button variant="ghost" size="sm" noAscii>Customize →</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreferencesSection() {
  const [appearance, setAppearance] = useState('light');
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
      <div>
        <SectionLabel>Appearance</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
          {[{ id: 'light', name: 'Light', desc: 'Default. Clean light surfaces.', disabled: false }, { id: 'dark', name: 'Dark', desc: 'Coming soon.', disabled: true }, { id: 'system', name: 'System', desc: 'Coming soon.', disabled: true }].map((opt) => (
            <div key={opt.id} onClick={() => { if (!opt.disabled) setAppearance(opt.id); }} className={appearance === opt.id ? 'card-gradient-border' : ''} style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)', border: appearance === opt.id ? 'none' : '1px solid var(--grey-stroke)', borderRadius: '4px', padding: 'var(--space-4)', cursor: opt.disabled ? 'not-allowed' : 'pointer', opacity: opt.disabled ? 0.5 : 1, position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>{opt.name}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>{opt.desc}</span>
              {opt.disabled && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)', border: '1px solid var(--grey-stroke)', padding: '2px 6px', display: 'inline-block', marginTop: 'var(--space-2)' }}>COMING SOON</span>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Developer Preferences</SectionLabel>
        <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
          <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>Timestamp display</span><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-2)' }}>How timestamps appear throughout the dashboard</span><div style={{ width: '280px' }}><Select options={[{ value: 'absolute', label: 'Absolute (Apr 4, 10:14)' }, { value: 'relative-hover', label: 'Relative with absolute on hover' }]} value="relative-hover" /></div></div>
          <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>Default session sort</span><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-2)' }}>How sessions are ordered when you open the sessions list</span><div style={{ width: '280px' }}><Select options={[{ value: 'most-recent', label: 'Most recent' }, { value: 'lowest-score', label: 'Lowest score first' }, { value: 'most-violations', label: 'Most violations first' }, { value: 'oldest', label: 'Oldest first' }]} value="most-recent" /></div></div>
          <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>Table density</span><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-2)' }}>Row height in data tables</span><div className="flex" style={{ gap: 'var(--space-2)' }}>{['Comfortable', 'Compact'].map((d) => { const slug = d.toLowerCase(); const active = density === slug; return <span key={slug} onClick={() => setDensity(slug)} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', padding: '3px 10px', border: active ? '1px solid var(--text-black)' : '1px solid var(--grey-stroke)', background: active ? 'var(--text-black)' : 'transparent', color: active ? 'var(--text-white)' : 'var(--icon-grey)', cursor: 'pointer' }}>{d}</span>; })}</div></div>
          <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)', display: 'block' }}>Date format</span><div style={{ width: '280px', marginTop: 'var(--space-2)' }}><Select options={[{ value: 'mdy', label: 'Apr 4, 2026' }, { value: 'slash', label: '04/04/2026' }, { value: 'iso', label: '2026-04-04' }]} value="mdy" /></div></div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceActionsSection() {
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearInput, setClearInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const actions = [
    { name: 'Export all data', desc: 'Download all sessions, rules, and reports as JSON.', button: <Button variant="secondary" size="sm" noAscii onClick={() => console.log('Export — coming soon')}>Export</Button> },
    { name: 'Clear session history', desc: 'Permanently delete all session data. Rules and scoring models are preserved.', button: <Button variant="secondary" size="sm" noAscii onClick={() => setClearConfirm(true)} style={{ color: 'var(--warning)' }}>Clear sessions</Button>, confirm: clearConfirm, input: clearInput, setInput: setClearInput, word: 'CLEAR', setConfirm: setClearConfirm },
    { name: 'Delete workspace', desc: 'Permanently delete this workspace, all agents, sessions, and rules. This cannot be undone.', button: <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)}>Delete workspace</Button>, confirm: deleteConfirm, input: deleteInput, setInput: setDeleteInput, word: 'DELETE', setConfirm: setDeleteConfirm },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
      {actions.map((action) => (
        <div key={action.name}>
          <div className="flex items-center justify-between" style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)', border: '1px solid var(--grey-stroke)', borderRadius: '4px', padding: 'var(--space-5)' }}>
            <div><span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)', display: 'block' }}>{action.name}</span><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', marginTop: 'var(--space-1)', display: 'block' }}>{action.desc}</span></div>
            {!action.confirm && action.button}
          </div>
          {action.confirm && (
            <div className="flex flex-col" style={{ gap: 'var(--space-3)', padding: 'var(--space-4)', border: '1px solid var(--grey-stroke)', borderTop: 'none' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--critical)' }}>Type {action.word} to confirm.</span>
              <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                <div style={{ width: '160px' }}><Input value={action.input} onChange={(e) => action.setInput(e.target.value)} placeholder={`Type ${action.word}`} /></div>
                <Button variant="destructive" size="sm" disabled={action.input !== action.word}>Confirm {action.word.toLowerCase()}</Button>
                <button onClick={() => { action.setConfirm(false); action.setInput(''); }} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', font: 'inherit', color: 'var(--accent-color)', fontFamily: 'var(--font-sans)', fontSize: '12px', textDecoration: 'underline' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Section Descriptions ─────────────────────────────────────── */

const SECTION_META: Record<string, { title: string; desc: string }> = {
  workspace: { title: 'Workspace', desc: 'Manage your workspace identity, API key, and billing.' },
  scoring: { title: 'Scoring', desc: 'Configure how sessions are scored at each level. The most specific model wins — ruleset overrides agent, agent overrides project, project overrides workspace.' },
  members: { title: 'Members', desc: 'Manage who has access to this workspace.' },
  integrations: { title: 'Integrations', desc: 'Connect Canary to your existing developer workflow.' },
  notifications: { title: 'Notifications', desc: 'Configure when and how Canary alerts you. Workspace defaults apply to all agents unless overridden per agent.' },
  preferences: { title: 'Preferences', desc: 'Personalize how Canary looks and behaves for you.' },
  'workspace-actions': { title: 'Workspace Actions', desc: 'Irreversible actions that affect your entire workspace. Proceed carefully.' },
};

const SECTION_COMPONENTS: Record<string, React.FC> = {
  workspace: WorkspaceSection,
  scoring: ScoringSection,
  members: MembersSection,
  integrations: IntegrationsSection,
  notifications: NotificationsSection,
  preferences: PreferencesSection,
  'workspace-actions': WorkspaceActionsSection,
};

/* ── Main Page ────────────────────────────────────────────────── */

const SETTINGS_NAV = [
  { slug: 'workspace', label: 'Workspace', icon: Building2 },
  { slug: 'scoring', label: 'Scoring', icon: BarChart3 },
  { slug: 'members', label: 'Members', icon: Users },
  { slug: 'integrations', label: 'Integrations', icon: Plug },
  { slug: 'notifications', label: 'Notifications', icon: Bell },
  { slug: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { slug: 'workspace-actions', label: 'Workspace Actions', icon: Trash2 },
];

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const section = (params.section as string) || 'workspace';
  const meta = SECTION_META[section] || SECTION_META.workspace;
  const SectionComponent = SECTION_COMPONENTS[section] || WorkspaceSection;
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {/* Main sidebar — inline, pushes settings + content right */}
      {mainSidebarOpen && (
        <div style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
          <Sidebar activeItem={`settings-${section}`} onCollapse={() => setMainSidebarOpen(false)} embedded />
        </div>
      )}

      {/* Settings sidebar — inline, not fixed */}
      <aside
        className="flex flex-col"
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          height: '100vh',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--grey-stroke)',
          padding: 'var(--space-6)',
          position: 'sticky',
          top: 0,
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        {/* Top: sidebar toggle + Settings title */}
        <div
          className="flex items-center"
          style={{ gap: 'var(--space-3)', padding: 'var(--space-3)', marginBottom: 'var(--space-6)' }}
        >
          {!mainSidebarOpen && (
          <button
            aria-label="Open sidebar"
            onClick={() => setMainSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-1)',
              cursor: 'pointer',
              display: 'flex',
              margin: 0,
              borderRadius: '0px',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <PanelLeft size={16} style={{ color: 'var(--icon-grey)' }} />
          </button>
          )}
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--text-black)' }}>
            Settings
          </span>
        </div>

        {/* Nav items — same formatting as main sidebar */}
        {SETTINGS_NAV.map((s) => {
          const Icon = s.icon;
          const isActive = section === s.slug;

          return (
            <AsciiHover
              key={s.slug}
              variant="right"
              color="var(--icon-grey)"
              style={{
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingLeft: '6px',
                paddingRight: '4px',
                border: isActive ? '1px solid var(--grey-stroke)' : '1px solid transparent',
                background: isActive ? 'var(--hover-gray)' : 'transparent',
                transition: 'background var(--transition-fast)',
                '--ascii-pad-y': '4px',
                '--ascii-pad-x': '4px',
                marginBottom: '2px',
              } as React.CSSProperties}
            >
              <div
                className="flex items-center"
                onClick={() => router.push(`/demo/settings/${s.slug}`)}
                style={{
                  gap: 'var(--space-3)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Icon size={12} style={{ color: isActive ? 'var(--accent-color)' : 'var(--icon-grey)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: isActive ? 'var(--accent-color)' : 'var(--text-black)', flex: 1 }}>
                  {s.label}
                </span>
              </div>
            </AsciiHover>
          );
        })}
      </aside>

      {/* Content area */}
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: 'Settings' },
            { label: meta.title },
          ]}
        />
        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '30px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text-black)', margin: 0, marginBottom: 'var(--space-2)' }}>{meta.title}</h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)', margin: 0, marginBottom: 'var(--space-8)' }}>{meta.desc}</p>
            <SectionComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { SwitchGroup } from '@/components/ui/SwitchGroup';
import { RichSwitchGroup } from '@/components/ui/RichSwitchGroup';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerdictBadge } from '@/components/ui/VerdictBadge';
import { ScoreBlock } from '@/components/ui/ScoreBlock';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Toast } from '@/components/ui/Toast';
import { Modal, ConfirmBlock } from '@/components/ui/Modal';
import { Tooltip } from '@/components/ui/Tooltip';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Dropdown } from '@/components/ui/Dropdown';
import { MultiSelect } from '@/components/ui/MultiSelect';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        borderRadius: '0px',
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 600,
          color: 'var(--text-black)',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ height: '1px', background: 'var(--grey-stroke)' }} />
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 400,
          textTransform: 'uppercase',
          color: 'var(--icon-grey)',
        }}
      >
        {label}
      </span>
      <div className="flex flex-wrap items-center" style={{ gap: 'var(--space-3)' }}>
        {children}
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [switchOn, setSwitchOn] = useState(false);
  const [switchGroup1, setSwitchGroup1] = useState(true);
  const [switchGroup2, setSwitchGroup2] = useState(false);
  const [richSwitch, setRichSwitch] = useState(true);
  const [selectVal, setSelectVal] = useState('');
  const [dropdownVal, setDropdownVal] = useState('');
  const [multiVal, setMultiVal] = useState<string[]>(['ready']);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(3);
  const [sortKey, setSortKey] = useState('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>('desc');

  const selectOptions = [
    { value: 'boundary', label: 'Boundary' },
    { value: 'outcome', label: 'Outcome' },
    { value: 'sequence', label: 'Sequence' },
    { value: 'time', label: 'Time' },
  ];

  const multiOptions = [
    { value: 'ready', label: 'Ready', statusColor: 'var(--safe)' },
    { value: 'warning', label: 'Warning', statusColor: 'var(--warning)' },
    { value: 'blocked', label: 'Blocked', statusColor: 'var(--critical)' },
  ];

  const tableColumns = [
    { key: 'id', label: 'Session-ID', sortable: true },
    { key: 'date', label: 'Date/Time', sortable: true },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'verdict', label: 'Verdict', sortable: true },
    { key: 'events', label: 'Events', sortable: true },
  ];

  const tableData = [
    { id: 'ses-0A3F', date: '2026-04-09 14:32', score: <ScoreBlock score={92} />, verdict: <VerdictBadge variant="ready" />, events: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>24</span> },
    { id: 'ses-1B7C', date: '2026-04-09 13:15', score: <ScoreBlock score={67} />, verdict: <VerdictBadge variant="warning" />, events: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>18</span> },
    { id: 'ses-2D9E', date: '2026-04-09 12:01', score: <ScoreBlock score={43} />, verdict: <VerdictBadge variant="notready" />, events: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>31</span> },
  ];

  return (
    <div
      className="flex flex-col"
      style={{
        padding: 'var(--space-10)',
        gap: 'var(--space-8)',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '30px',
          lineHeight: '30px',
          fontWeight: 700,
          letterSpacing: '-1px',
          color: 'var(--black)',
          margin: 0,
        }}
      >
        Component Kitchen Sink
      </h1>

      {/* BUTTONS */}
      <Section title="Buttons">
        <Row label="Primary">
          <Button variant="primary" size="md">Create Rule</Button>
          <Button variant="primary" size="sm">Create</Button>
          <Button variant="primary" size="md" icon={<Plus size={14} />}>New Rule</Button>
          <Button variant="primary" size="md" asciiVariant="both">Both Sides</Button>
          <Button variant="primary" size="md" isLoading>Loading</Button>
          <Button variant="primary" size="md" disabled>Disabled</Button>
        </Row>
        <Row label="Secondary">
          <Button variant="secondary" size="md">Cancel</Button>
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="secondary" size="md" icon={<Download size={14} />}>Export</Button>
        </Row>
        <Row label="Ghost">
          <Button variant="ghost" size="md">View All</Button>
          <Button variant="ghost" size="sm">Edit</Button>
        </Row>
        <Row label="Destructive">
          <Button variant="destructive" size="md">Delete Rule</Button>
          <Button variant="destructive" size="sm" icon={<Trash2 size={12} />}>Delete</Button>
          <Button variant="destructive" size="md" disabled>Disabled</Button>
        </Row>
        <Row label="Icon-only">
          <Button variant="secondary" size="md" iconOnly icon={<Settings size={14} />} />
          <Button variant="secondary" size="sm" iconOnly icon={<Plus size={12} />} />
          <Button variant="secondary" size="sm" iconOnly icon={<Trash2 size={12} />} />
        </Row>
      </Section>

      {/* INPUTS */}
      <Section title="Inputs">
        <Row label="Default">
          <div style={{ width: '240px' }}>
            <Input placeholder="Enter rule name..." />
          </div>
        </Row>
        <Row label="With label">
          <div style={{ width: '240px' }}>
            <Input label="Rule Name" placeholder="e.g. Max Duration" />
          </div>
        </Row>
        <Row label="Error">
          <div style={{ width: '240px' }}>
            <Input label="Agent ID" error="Agent ID is required" />
          </div>
        </Row>
        <Row label="Search">
          <div style={{ width: '240px' }}>
            <Input search placeholder="Search sessions..." />
          </div>
        </Row>
        <Row label="Disabled">
          <div style={{ width: '240px' }}>
            <Input disabled value="Locked value" />
          </div>
        </Row>
      </Section>

      {/* TEXTAREA */}
      <Section title="Textarea">
        <Row label="Default">
          <div style={{ width: '360px' }}>
            <Textarea label="Description" placeholder="Describe this rule..." />
          </div>
        </Row>
        <Row label="No resize">
          <div style={{ width: '360px' }}>
            <Textarea resize="none" placeholder="Fixed height textarea" />
          </div>
        </Row>
      </Section>

      {/* CHECKBOX */}
      <Section title="Checkbox">
        <Row label="States">
          <Checkbox label="Unchecked" checked={checked1} onChange={setChecked1} />
          <Checkbox label="Checked" checked={checked2} onChange={setChecked2} />
          <Checkbox label="Indeterminate" indeterminate checked />
          <Checkbox label="Disabled" disabled checked />
          <Checkbox label="Disabled unchecked" disabled />
        </Row>
      </Section>

      {/* SELECT */}
      <Section title="Select">
        <Row label="Default">
          <div style={{ width: '200px' }}>
            <Select options={selectOptions} value={selectVal} onChange={setSelectVal} label="Rule Type" placeholder="Choose type..." />
          </div>
        </Row>
      </Section>

      {/* DROPDOWN */}
      <Section title="Dropdown">
        <Row label="Default">
          <div style={{ width: '200px' }}>
            <Dropdown
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'oldest', label: 'Oldest first' },
                { value: 'score-high', label: 'Score: high → low', group: 'Score' },
                { value: 'score-low', label: 'Score: low → high', group: 'Score' },
              ]}
              value={dropdownVal}
              onChange={setDropdownVal}
              label="Sort by"
              placeholder="Sort..."
            />
          </div>
        </Row>
      </Section>

      {/* MULTI-SELECT */}
      <Section title="MultiSelect">
        <Row label="Verdict filter">
          <div style={{ width: '280px' }}>
            <MultiSelect
              options={multiOptions}
              value={multiVal}
              onChange={setMultiVal}
              label="Filter by verdict"
              placeholder="All verdicts"
            />
          </div>
        </Row>
      </Section>

      {/* SWITCH */}
      <Section title="Switch">
        <Row label="Toggle">
          <Switch checked={switchOn} onChange={setSwitchOn} />
          <Switch checked={true} />
          <Switch disabled />
        </Row>
      </Section>

      {/* SWITCH GROUP */}
      <Section title="Switch Group">
        <Row label="Block layout">
          <div style={{ width: '240px' }}>
            <SwitchGroup label="Enable auto-flagging" checked={switchGroup1} onChange={setSwitchGroup1} layout="block" />
          </div>
        </Row>
        <Row label="Inline layout">
          <SwitchGroup label="Compact mode" checked={switchGroup2} onChange={setSwitchGroup2} layout="inline" />
        </Row>
      </Section>

      {/* RICH SWITCH GROUP */}
      <Section title="Rich Switch Group">
        <Row label="Default">
          <RichSwitchGroup label="Auto-assign rules" description="Automatically assign rules to new agents" checked={richSwitch} onChange={setRichSwitch} />
        </Row>
        <Row label="Flipped">
          <RichSwitchGroup label="Notifications" description="Get notified on failures" checked={true} flipped />
        </Row>
      </Section>

      {/* CARDS */}
      <Section title="Cards">
        <Row label="Stat card">
          <Card variant="stat" style={{ width: '200px', textAlign: 'center' }}>
            <div className="flex flex-col items-center" style={{ gap: 'var(--space-3)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
                compliance score
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 600, color: 'var(--safe)' }}>
                89
                <span style={{ fontSize: '16px', color: 'var(--icon-grey)', fontWeight: 400 }}>/100</span>
              </span>
              <VerdictBadge variant="warning" />
            </div>
          </Card>
        </Row>
        <Row label="Content card">
          <Card variant="content" header="Recent Sessions" action={
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--accent-color)', cursor: 'pointer' }}>
              VIEW ALL →
            </span>
          } style={{ width: '320px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)' }}>
              3 sessions today
            </span>
          </Card>
        </Row>
        <Row label="Clickable card">
          <Card variant="clickable" onClick={() => {}} style={{ width: '320px' }}>
            <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
              <StatusIndicator variant="warning" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500 }}>Max duration exceeded</span>
            </div>
          </Card>
        </Row>
      </Section>

      {/* BADGES */}
      <Section title="Badges">
        <Row label="Rule type tags">
          <Badge variant="boundary" />
          <Badge variant="outcome" />
          <Badge variant="sequence" />
          <Badge variant="time" />
        </Row>
        <Row label="Verdict badges">
          <VerdictBadge variant="ready" />
          <VerdictBadge variant="warning" />
          <VerdictBadge variant="notready" />
        </Row>
        <Row label="Score blocks">
          <ScoreBlock score={92} />
          <ScoreBlock score={67} />
          <ScoreBlock score={43} />
        </Row>
        <Row label="Status indicators">
          <StatusIndicator variant="safe" />
          <StatusIndicator variant="warning" />
          <StatusIndicator variant="critical" />
        </Row>
      </Section>

      {/* ALERT BANNER */}
      <Section title="Alert Banner">
        <AlertBanner>
          <strong>3 new rules</strong> suggested based on recent session patterns
        </AlertBanner>
      </Section>

      {/* TOAST */}
      <Section title="Toasts">
        <Row label="Variants">
          <Toast variant="success" title="2 rules baked successfully" description="Rules are now active" />
          <Toast variant="info" title="3 new rules suggested" description="Based on recent patterns" actionLabel="REVIEW RULES" />
          <Toast variant="warning" title="Session score dropped to 61" description="Check agent behavior" />
          <Toast variant="error" title="Failed to save rule" description="Network error, try again" />
        </Row>
      </Section>

      {/* TOOLTIP */}
      <Section title="Tooltip">
        <Row label="Hover to see">
          <Tooltip content="Create a new rule">
            <Button variant="secondary" size="sm" iconOnly icon={<Plus size={12} />} />
          </Tooltip>
          <Tooltip content="Delete this rule">
            <Button variant="secondary" size="sm" iconOnly icon={<Trash2 size={12} />} />
          </Tooltip>
          <Tooltip content="This is a longer tooltip that wraps at 200px max width" position="bottom">
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent-color)', cursor: 'help' }}>
              Hover me (bottom)
            </span>
          </Tooltip>
        </Row>
      </Section>

      {/* TABLE */}
      <Section title="Table">
        <Table
          columns={tableColumns}
          data={tableData}
          sortKey={sortKey}
          sortDirection={sortDir}
          onSort={(key) => {
            if (key === sortKey) {
              setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
            } else {
              setSortKey(key);
              setSortDir('asc');
            }
          }}
          onRowClick={() => {}}
        />
        <Table columns={tableColumns} data={[]} emptyText="Run your first session" emptyAction={<Button variant="primary" size="sm">Start Session</Button>} />
      </Section>

      {/* PAGINATION */}
      <Section title="Pagination">
        <Pagination currentPage={page} totalPages={12} onPageChange={setPage} totalItems={142} itemLabel="sessions" />
      </Section>

      {/* MODALS */}
      <Section title="Modals">
        <Row label="Triggers">
          <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>Open Form Modal</Button>
          <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>Open Confirm Modal</Button>
        </Row>
      </Section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Rule" size="form" footer={
        <>
          <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>Create</Button>
        </>
      }>
        <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
          <Input label="Rule Name" placeholder="e.g. Max page navigations" />
          <Textarea label="Description" placeholder="What does this rule check?" />
        </div>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Rule" size="confirm" destructive footer={
        <>
          <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(false)}>Delete</Button>
        </>
      }>
        <ConfirmBlock
          title="Are you sure you want to delete this rule?"
          description="This action cannot be undone. All associated data will be lost."
        />
      </Modal>
    </div>
  );
}

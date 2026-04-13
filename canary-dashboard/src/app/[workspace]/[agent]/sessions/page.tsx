'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ListFilter, ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ScoreBlock } from '@/components/ui/ScoreBlock';
import { VerdictBadge } from '@/components/ui/VerdictBadge';
import type { VerdictVariant } from '@/components/ui/VerdictBadge';
import { Pagination } from '@/components/ui/Pagination';
import { FilterPanel, EMPTY_FILTERS, countActiveFilters } from '@/components/ui/FilterPanel';
import type { FilterState } from '@/components/ui/FilterPanel';
import { InlineAction } from '@/components/ui/InlineAction';
import { SESSIONS, AGENTS, INSIGHTS } from '@/data/mockData';

/* ── Derived display type ─────────────────────────────────────── */

interface SessionRow {
  id: string;
  date: string;
  time: string;
  score: number;
  verdict: VerdictVariant;
  events: number;
  traces: number;
  violations: number;
  duration: string;
  durationSeconds: number;
}

function getVerdict(score: number): VerdictVariant {
  if (score >= 80) return 'ready';
  if (score >= 60) return 'warning';
  return 'notready';
}

function toSessionRow(s: typeof SESSIONS[number]): SessionRow {
  const d = new Date(s.date);
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return {
    id: s.id,
    date: `${month} ${day},`,
    time: `${hours}:${mins}`,
    score: s.score,
    verdict: getVerdict(s.score),
    events: s.eventCount,
    traces: s.tracesCount,
    violations: s.violationCount,
    duration: s.duration,
    durationSeconds: s.durationSeconds,
  };
}

const MOCK_SESSIONS: SessionRow[] = SESSIONS.map(toSessionRow);

/* ── Sort logic ───────────────────────────────────────────────── */

type SortKey = 'id' | 'date' | 'score' | 'verdict' | 'events' | 'traces' | 'violations' | 'duration';
type SortDir = 'asc' | 'desc' | null;

function applyColumnSort(data: SessionRow[], key: SortKey, dir: SortDir): SessionRow[] {
  if (!dir) return data;
  const sorted = [...data];
  const m = dir === 'asc' ? 1 : -1;
  sorted.sort((a, b) => {
    switch (key) {
      case 'id': return m * a.id.localeCompare(b.id);
      case 'date': return m * (MOCK_SESSIONS.indexOf(a) - MOCK_SESSIONS.indexOf(b));
      case 'score': return m * (a.score - b.score);
      case 'verdict': return m * a.verdict.localeCompare(b.verdict);
      case 'events': return m * (a.events - b.events);
      case 'traces': return m * (a.traces - b.traces);
      case 'violations': return m * (a.violations - b.violations);
      case 'duration': return m * (a.durationSeconds - b.durationSeconds);
      default: return 0;
    }
  });
  return sorted;
}

function applyFilters(data: SessionRow[], filters: FilterState): SessionRow[] {
  return data.filter((row) => {
    if (filters.verdicts.length > 0 && !filters.verdicts.includes(row.verdict)) return false;
    if (row.score < filters.scoreMin || row.score > filters.scoreMax) return false;
    if (filters.violationsMin && row.violations < parseInt(filters.violationsMin)) return false;
    if (filters.violationsMax && row.violations > parseInt(filters.violationsMax)) return false;
    if (filters.durationMin && row.durationSeconds < parseInt(filters.durationMin) * 60) return false;
    if (filters.durationMax && row.durationSeconds > parseInt(filters.durationMax) * 60) return false;
    return true;
  });
}

/* ── Skeleton ─────────────────────────────────────────────────── */

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'var(--hover-gray)',
        borderRadius: '0px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, var(--card-bg) 50%, transparent 100%)',
          animation: 'shimmer 1.4s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

/* ── Entry animation wrapper ──────────────────────────────────── */

function EntryAnim({ delay, show, children, style }: { delay: number; show: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 200ms ease-out ${delay}ms, transform 200ms ease-out ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Table header cell ────────────────────────────────────────── */

interface THProps {
  label: string;
  sortKey: SortKey;
  width?: string;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  tooltip?: string;
}

function TH({ label, sortKey, width, currentKey, currentDir, onSort, tooltip }: THProps) {
  const isActive = currentKey === sortKey && currentDir !== null;
  const SortIcon = !isActive
    ? ChevronsUpDown
    : currentDir === 'asc'
      ? ChevronUp
      : ChevronDown;

  return (
    <th
      onClick={() => onSort(sortKey)}
      title={tooltip}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '12px',
        fontWeight: isActive ? 500 : 400,
        textTransform: 'uppercase',
        color: isActive ? 'var(--text-black)' : 'var(--icon-grey)',
        padding: '8px 12px',
        borderBottom: '1px solid var(--grey-stroke)',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        width,
        userSelect: 'none',
      }}
    >
      <span className="inline-flex items-center" style={{ gap: 'var(--space-1)' }}>
        {label}
        <SortIcon size={12} />
      </span>
    </th>
  );
}

/* ── Main Sessions Page ───────────────────────────────────────── */

const ROWS_PER_PAGE = 10;

export default function SessionsPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = (params.agent as string) || 'email-agent';
  const workspaceSlug = (params.workspace as string) || 'photon';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Controls
  const [search, setSearch] = useState('');
  const [colSortKey, setColSortKey] = useState<SortKey>('date');
  const [colSortDir, setColSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  // Filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ ...EMPTY_FILTERS });
  const activeFilterCount = countActiveFilters(filters);

  // Loading simulation
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      requestAnimationFrame(() => setContentVisible(true));
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Column sort handler
  const handleColSort = useCallback((key: SortKey) => {
    if (colSortKey === key) {
      if (colSortDir === 'asc') setColSortDir('desc');
      else if (colSortDir === 'desc') {
        setColSortKey('date');
        setColSortDir('desc');
      } else {
        setColSortDir('asc');
      }
    } else {
      setColSortKey(key);
      setColSortDir('asc');
    }
  }, [colSortKey, colSortDir]);

  // Process data
  const processedData = useMemo(() => {
    let data = [...MOCK_SESSIONS];
    // Apply filters
    data = applyFilters(data, filters);
    // Search
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) => r.id.toLowerCase().includes(q));
    }
    // Sort — default is most recent (reverse order)
    if (colSortDir) {
      data = applyColumnSort(data, colSortKey, colSortDir);
    } else {
      data = [...data].reverse();
    }
    return data;
  }, [search, colSortKey, colSortDir, filters]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageData = processedData.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  // Reset page on filter/search change
  useEffect(() => { setPage(1); }, [search, filters]);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar activeItem="sessions" agentName={agent.name} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: 'var(--sidebar-width)' }}>
        <Breadcrumb items={[
          { label: 'Photon workspace', href: '/' },
          { label: agent.name, href: `/${workspaceSlug}/${agentId}` },
          { label: 'Sessions' },
        ]} />

        <main style={{ background: 'var(--bg)', padding: 'var(--space-5)', flex: 1 }}>
          {loading ? (
            /* ── Skeleton state ── */
            <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
              <Skeleton width="200px" height="36px" />
              <div className="flex" style={{ gap: 'var(--space-3)' }}>
                <Skeleton width="280px" height="32px" />
                <Skeleton width="100px" height="32px" />
              </div>
              <div className="flex flex-col">
                <Skeleton width="100%" height="40px" />
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} width="100%" height="48px" />
                ))}
              </div>
            </div>
          ) : (
            /* ── Real content ── */
            <>
              {/* Insights summary panel */}
              {(() => {
                const agentInsights = INSIGHTS.filter((i) => i.agentId === agentId && i.status !== 'resolved');
                if (agentInsights.length === 0) return null;
                const hasAnyCritical = agentInsights.some((i) => i.severity === 'critical');
                const displayed = agentInsights.slice(0, 3);
                return (
                  <EntryAnim delay={0} show={contentVisible}>
                    <div
                      style={{
                        marginBottom: 'var(--space-6)',
                        background: 'var(--card-gradient)',
                        border: '1px solid var(--grey-stroke)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Panel header */}
                      <div
                        className="flex items-center justify-between"
                        style={{
                          padding: 'var(--space-4) var(--space-5)',
                          borderBottom: '1px solid var(--grey-stroke)',
                        }}
                      >
                        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--icon-grey)', letterSpacing: '0.06em' }}>
                            Unresolved Insights
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', background: hasAnyCritical ? 'var(--critical)' : 'var(--warning)', color: 'var(--text-white)', padding: '1px 5px', lineHeight: '14px' }}>
                            {agentInsights.length}
                          </span>
                        </div>
                        <InlineAction label="View all" onClick={() => console.log('Navigate to insights page')} />
                      </div>

                      {/* Insight rows */}
                      {displayed.map((insight, idx) => {
                        const sevColor = insight.severity === 'critical' ? 'var(--critical)' : insight.severity === 'warning' ? 'var(--warning)' : 'var(--icon-grey)';
                        const isLast = idx === displayed.length - 1 && agentInsights.length <= 3;
                        return (
                          <div
                            key={insight.id}
                            className="flex"
                            style={{
                              alignItems: 'flex-start',
                              gap: 'var(--space-4)',
                              padding: 'var(--space-4) var(--space-5)',
                              borderBottom: isLast ? 'none' : '1px solid var(--grey-stroke)',
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: 1, color: sevColor, marginTop: '2px', flexShrink: 0 }}>{insight.severity === 'critical' ? '█' : '▒'}</span>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-black)', display: 'block' }}>
                                {insight.title}
                              </span>
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {insight.description}
                              </span>
                            </div>
                            <span
                              onClick={(e) => { e.stopPropagation(); router.push(`/${workspaceSlug}/${agentId}/sessions/${insight.sessionId}?trace=${insight.traceId}`); }}
                              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-color)', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}
                            >
                              → ses_{insight.sessionId.split('_').pop()}
                            </span>
                          </div>
                        );
                      })}

                      {/* Footer if more than 3 */}
                      {agentInsights.length > 3 && (
                        <div style={{ padding: 'var(--space-3) var(--space-5)' }}>
                          <InlineAction label={`View all ${agentInsights.length} insights`} onClick={() => console.log('Navigate to insights page')} />
                        </div>
                      )}
                    </div>
                  </EntryAnim>
                );
              })()}

              {/* Page title */}
              <EntryAnim delay={0} show={contentVisible}>
                <h1
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '30px',
                    lineHeight: '30px',
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    color: 'var(--black)',
                    margin: 0,
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  Sessions
                </h1>
              </EntryAnim>

              {/* Controls row */}
              <EntryAnim delay={80} show={contentVisible} style={{ position: 'relative', zIndex: 100 }}>
                <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)', position: 'relative', zIndex: 100 }}>
                  {/* Search */}
                  <div style={{ width: '280px' }}>
                    <Input
                      search
                      placeholder="Search through sessions"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Escape') setSearch(''); }}
                    />
                  </div>

                  {/* Filter button */}
                  <div className="relative">
                    <Button
                      variant="secondary"
                      size="sm"
                      noAscii
                      icon={<ListFilter size={12} />}
                      onClick={() => setFilterOpen(!filterOpen)}
                      style={{ minWidth: '120px' }}
                    >
                      <span className="flex items-center" style={{ gap: 'var(--space-1)', flex: 1 }}>
                        Filter
                        {activeFilterCount > 0 && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-color)' }}>
                            · {activeFilterCount}
                          </span>
                        )}
                        <ChevronDown size={12} style={{ color: 'var(--icon-grey)', marginLeft: 'auto' }} />
                      </span>
                    </Button>
                    {filterOpen && (
                      <FilterPanel
                        filters={filters}
                        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
                        onCancel={() => setFilterOpen(false)}
                      />
                    )}
                  </div>

                </div>
              </EntryAnim>

              {/* Table */}
              <EntryAnim delay={160} show={contentVisible}>
                <div
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--grey-stroke)',
                    borderRadius: '0px',
                    overflow: 'hidden',
                  }}
                >
                  {processedData.length === 0 ? (
                    /* Empty state */
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        border: '1px dashed var(--grey-stroke)',
                        margin: 'var(--space-4)',
                        minHeight: '200px',
                        gap: 'var(--space-3)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 400, color: 'var(--icon-grey)' }}>
                        {search || activeFilterCount > 0 ? 'No sessions match' : 'No sessions found'}
                      </span>
                      {(search || activeFilterCount > 0) ? (
                        <span
                          onClick={() => { setSearch(''); setFilters({ ...EMPTY_FILTERS }); }}
                          style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Clear filters →
                        </span>
                      ) : (
                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-black)', background: 'var(--bg)', padding: 'var(--space-4)', border: '1px solid var(--grey-stroke)', borderRadius: '0px' }}>
                          canary watch node agent.js
                        </code>
                      )}
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '12px',
                              lineHeight: '12px',
                              fontWeight: 400,
                              textTransform: 'uppercase',
                              color: 'var(--icon-grey)',
                              padding: '8px 12px',
                              borderBottom: '1px solid var(--grey-stroke)',
                              textAlign: 'left',
                              width: '280px',
                            }}
                          >
                            Session-ID
                          </th>
                          <TH label="Date / Time" sortKey="date" width="180px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} />
                          <TH label="Score" sortKey="score" width="120px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} />
                          <TH label="Verdict" sortKey="verdict" width="180px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} />
                          <TH label="Events" sortKey="events" width="90px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} />
                          <TH label="Traces" sortKey="traces" width="90px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} />
                          <TH label="Violations" sortKey="violations" width="110px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} tooltip="Total BLOCKED + FLAGGED events" />
                          <TH label="Duration" sortKey="duration" width="120px" currentKey={colSortKey} currentDir={colSortDir} onSort={handleColSort} />
                        </tr>
                      </thead>
                      <tbody>
                        {pageData.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => router.push(`/${params.workspace}/${params.agent}/sessions/${row.id}`)}
                            style={{
                              background: 'var(--card-bg)',
                              borderBottom: '1px solid var(--grey-stroke)',
                              cursor: 'pointer',
                              transition: 'background var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card-bg)'; }}
                          >
                            {/* SESSION-ID */}
                            <td
                              style={{
                                padding: '12px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                fontWeight: 400,
                                color: 'var(--icon-grey)',
                                whiteSpace: 'nowrap',
                              }}
                              title={row.id}
                            >
                              {row.id}
                            </td>
                            {/* DATE/TIME */}
                            <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'var(--icon-grey)' }}>
                                {row.date}
                              </span>
                              {' '}
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-black)' }}>
                                {row.time}
                              </span>
                            </td>
                            {/* SCORE */}
                            <td style={{ padding: '12px' }}>
                              <ScoreBlock score={row.score} />
                            </td>
                            {/* VERDICT */}
                            <td style={{ padding: '12px' }}>
                              <VerdictBadge variant={row.verdict} />
                            </td>
                            {/* EVENTS */}
                            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-black)' }}>
                              {row.events}
                            </td>
                            {/* TRACES */}
                            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-black)' }}>
                              {row.traces}
                            </td>
                            {/* VIOLATIONS */}
                            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-black)' }}>
                              {row.violations}
                            </td>
                            {/* DURATION */}
                            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 400, color: 'var(--text-black)' }}>
                              {row.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </EntryAnim>

              {/* Pagination */}
              <EntryAnim delay={240} show={contentVisible}>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalItems={processedData.length}
                    itemLabel="sessions"
                  />
                </div>
              </EntryAnim>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

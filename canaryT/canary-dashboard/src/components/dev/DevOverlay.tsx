'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, X, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useOnboardingContext } from '@/components/onboarding/OnboardingProvider';
import { LIVE_SESSION_STATE, INSIGHTS } from '@/data/mockData';

interface LayoutNode {
  name: string;
  type: 'FRAME' | 'TEXT' | 'RECTANGLE';
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: string;
  stroke?: string;
  cornerRadius?: number;
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  text?: string;
  children?: LayoutNode[];
}

function captureNode(el: Element, depth: number = 0): LayoutNode | null {
  if (depth > 6) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const cs = getComputedStyle(el);
  const tag = el.tagName.toLowerCase();
  const isText = tag === 'span' || tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'label';
  const textContent = isText ? (el.textContent || '').trim().slice(0, 50) : undefined;

  const display = cs.display;
  const flexDir = cs.flexDirection;
  const layoutMode: 'HORIZONTAL' | 'VERTICAL' | 'NONE' =
    display.includes('flex')
      ? flexDir === 'column' ? 'VERTICAL' : 'HORIZONTAL'
      : 'NONE';

  const node: LayoutNode = {
    name: el.getAttribute('data-figma') || tag + (el.className ? `.${String(el.className).split(' ')[0]}` : ''),
    type: isText ? 'TEXT' : 'FRAME',
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    fills: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : undefined,
    stroke: cs.borderColor !== 'rgba(0, 0, 0, 0)' ? cs.borderColor : undefined,
    cornerRadius: parseFloat(cs.borderRadius) || 0,
    layoutMode,
    itemSpacing: parseFloat(cs.gap) || 0,
    paddingTop: parseFloat(cs.paddingTop) || 0,
    paddingRight: parseFloat(cs.paddingRight) || 0,
    paddingBottom: parseFloat(cs.paddingBottom) || 0,
    paddingLeft: parseFloat(cs.paddingLeft) || 0,
  };

  if (isText && textContent) {
    node.text = textContent;
    node.fontFamily = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    node.fontSize = parseFloat(cs.fontSize);
    node.fontWeight = parseInt(cs.fontWeight);
    node.color = cs.color;
  }

  if (!isText) {
    const childNodes: LayoutNode[] = [];
    for (const child of Array.from(el.children)) {
      const cn = captureNode(child, depth + 1);
      if (cn) childNodes.push(cn);
    }
    if (childNodes.length > 0) node.children = childNodes;
  }

  return node;
}

function captureScreen(): LayoutNode {
  const main = document.querySelector('main') || document.querySelector('[class*="flex"]') || document.body;
  const root = captureNode(main, 0);
  return root || {
    name: 'Screen',
    type: 'FRAME',
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    layoutMode: 'VERTICAL',
  };
}

// Outline mode — shows layout boxes on all elements
function OutlineOverlay() {
  return (
    <style>{`
      [data-outline-mode] * {
        outline: 1px solid rgba(0, 136, 199, 0.3) !important;
      }
      [data-outline-mode] *:hover {
        outline: 2px solid rgba(0, 136, 199, 0.8) !important;
        outline-offset: -1px;
      }
    `}</style>
  );
}

function DevSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid var(--grey-stroke)', padding: 'var(--space-3) var(--space-4)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-2)' }}>
        {title}
      </span>
      <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
        {children}
      </div>
    </div>
  );
}

function DevButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--space-2) var(--space-3)',
        background: 'transparent',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-black)',
        margin: 0,
        width: '100%',
        textAlign: 'left',
      }}
    >
      {label}
    </button>
  );
}

export function DevOverlay() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outlineMode, setOutlineMode] = useState(false);
  const [capturedJson, setCapturedJson] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);
  const onboarding = useOnboardingContext();
  const router = useRouter();

  const handleCapture = useCallback(() => {
    const tree = captureScreen();
    const json = JSON.stringify(tree, null, 2);
    setCapturedJson(json);
  }, []);

  const handleCopy = useCallback(() => {
    if (!capturedJson) return;
    navigator.clipboard.writeText(capturedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [capturedJson]);

  const handleCopySvg = useCallback(() => {
    // Capture as simplified SVG for direct Figma paste
    const main = document.querySelector('main') || document.body;
    const rect = main.getBoundingClientRect();

    const svgParts: string[] = [];
    const captureToSvg = (el: Element, depth: number) => {
      if (depth > 4) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const border = cs.borderColor;
      const x = Math.round(r.left - rect.left);
      const y = Math.round(r.top - rect.top);
      const w = Math.round(r.width);
      const h = Math.round(r.height);

      if (bg && bg !== 'rgba(0, 0, 0, 0)') {
        svgParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" />`);
      }
      if (border && border !== 'rgba(0, 0, 0, 0)' && cs.borderWidth !== '0px') {
        svgParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${border}" stroke-width="1" />`);
      }

      const tag = el.tagName.toLowerCase();
      if (tag === 'span' || tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3') {
        const text = (el.textContent || '').trim().slice(0, 60);
        if (text) {
          const fontSize = parseFloat(cs.fontSize) || 12;
          const color = cs.color || '#121212';
          const fontFamily = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
          svgParts.push(`<text x="${x + 2}" y="${y + fontSize}" font-family="${fontFamily}" font-size="${fontSize}" fill="${color}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`);
        }
      }

      for (const child of Array.from(el.children)) {
        captureToSvg(child, depth + 1);
      }
    };

    captureToSvg(main, 0);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(rect.width)}" height="${Math.round(rect.height)}" viewBox="0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}">\n${svgParts.join('\n')}\n</svg>`;
    navigator.clipboard.writeText(svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // Toggle outline mode on body
  React.useEffect(() => {
    if (outlineMode) {
      document.body.setAttribute('data-outline-mode', 'true');
    } else {
      document.body.removeAttribute('data-outline-mode');
    }
    return () => document.body.removeAttribute('data-outline-mode');
  }, [outlineMode]);

  // Only show in development
  // Show in all environments — this is a demo app

  return (
    <>
      {outlineMode && <OutlineOverlay />}

      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 'var(--space-4)',
            right: 'var(--space-4)',
            width: '36px',
            height: '36px',
            background: 'var(--text-black)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            margin: 0,
          }}
        >
          <Layers size={16} style={{ color: 'var(--text-white)' }} />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--space-4)',
            right: 'var(--space-4)',
            width: '360px',
            maxHeight: '80vh',
            background: 'var(--card-bg)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--grey-stroke)' }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-black)', textTransform: 'uppercase' }}>
              Dev Tools
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', margin: 0, padding: '2px' }}
            >
              <X size={12} style={{ color: 'var(--icon-grey)' }} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col" style={{ padding: 'var(--space-4)', gap: 'var(--space-3)' }}>
            {/* Outline toggle */}
            <button
              onClick={() => setOutlineMode(!outlineMode)}
              className="flex items-center"
              style={{
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                background: outlineMode ? 'rgba(0,136,199,0.08)' : 'transparent',
                border: outlineMode ? '1px solid var(--accent-color)' : '1px solid var(--grey-stroke)',
                borderRadius: '0px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: outlineMode ? 'var(--accent-color)' : 'var(--text-black)',
                margin: 0,
                width: '100%',
              }}
            >
              {outlineMode ? <EyeOff size={12} /> : <Eye size={12} />}
              {outlineMode ? 'Hide layout outlines' : 'Show layout outlines'}
            </button>

            {/* Capture JSON */}
            <button
              onClick={handleCapture}
              className="flex items-center"
              style={{
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'transparent',
                border: '1px solid var(--grey-stroke)',
                borderRadius: '0px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--text-black)',
                margin: 0,
                width: '100%',
              }}
            >
              <Layers size={12} style={{ color: 'var(--icon-grey)' }} />
              Capture layout as JSON
            </button>

            {/* Copy SVG */}
            <button
              onClick={handleCopySvg}
              className="flex items-center"
              style={{
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'transparent',
                border: '1px solid var(--grey-stroke)',
                borderRadius: '0px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--text-black)',
                margin: 0,
                width: '100%',
              }}
            >
              <Copy size={12} style={{ color: 'var(--icon-grey)' }} />
              {copied ? 'Copied ✓' : 'Copy screen as SVG (paste in Figma)'}
            </button>
          </div>

          {/* Navigation */}
          <DevSection title="Navigation">
            <DevButton label="→ Sign-in page" onClick={() => router.push('/sign-in')} />
          </DevSection>

          {/* Onboarding */}
          <DevSection title="Onboarding">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>
              Step: {onboarding?.step !== null && onboarding?.step !== undefined ? `${onboarding.step + 1} / 4` : onboarding?.completed ? 'Completed' : 'Not started'}
            </span>
            <DevButton label="▶ Start onboarding tour" onClick={() => { onboarding?.startOnboarding(); router.push('/sign-in'); }} />
            <DevButton label="↺ Reset onboarding state" onClick={() => { localStorage.removeItem('onboarding_completed'); onboarding?.resetOnboarding(); router.push('/sign-in'); }} />
          </DevSection>

          {/* Live Session */}
          <DevSection title="Live Session">
            <DevButton
              label={`Live session: ${LIVE_SESSION_STATE.isLive ? 'ON' : 'OFF'} → toggle`}
              onClick={() => {
                LIVE_SESSION_STATE.isLive = !LIVE_SESSION_STATE.isLive;
                forceUpdate((n) => n + 1);
              }}
            />
            <DevButton
              label={`Loop detection: ${LIVE_SESSION_STATE.loopDetected ? 'ON' : 'OFF'} → toggle`}
              onClick={() => {
                LIVE_SESSION_STATE.loopDetected = !LIVE_SESSION_STATE.loopDetected;
                forceUpdate((n) => n + 1);
              }}
            />
          </DevSection>

          {/* Data State Presets */}
          <DevSection title="Data State Presets">
            <DevButton label="Active session running" onClick={() => {
              LIVE_SESSION_STATE.isLive = true;
              LIVE_SESSION_STATE.agentId = 'photon-research';
              forceUpdate((n) => n + 1);
            }} />
            <DevButton label="Multiple insights (all active)" onClick={() => {
              INSIGHTS.forEach((i) => { i.status = 'active'; });
              forceUpdate((n) => n + 1);
            }} />
            <DevButton label="No insights (all resolved)" onClick={() => {
              INSIGHTS.forEach((i) => { i.status = 'resolved'; });
              forceUpdate((n) => n + 1);
            }} />
          </DevSection>

          {/* JSON output */}
          {capturedJson && (
            <div className="flex flex-col" style={{ borderTop: '1px solid var(--grey-stroke)', flex: 1, overflow: 'hidden' }}>
              <div className="flex items-center justify-between" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)', textTransform: 'uppercase' }}>
                  Layout tree
                </span>
                <button
                  onClick={handleCopy}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', margin: 0, padding: '2px' }}
                >
                  {copied ? <Check size={12} style={{ color: 'var(--safe)' }} /> : <Copy size={12} style={{ color: 'var(--icon-grey)' }} />}
                </button>
              </div>
              <pre
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  margin: 0,
                  padding: 'var(--space-3)',
                  background: 'var(--text-black)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-white)',
                  whiteSpace: 'pre',
                }}
              >
                {capturedJson}
              </pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}

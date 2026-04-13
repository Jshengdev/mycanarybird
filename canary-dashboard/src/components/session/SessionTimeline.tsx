'use client';

import React from 'react';
import { ScreenshotZone } from '@/components/session/timeline/ScreenshotZone';
import { ScrubberBar } from '@/components/session/timeline/ScrubberBar';
import { ActionSidebar } from '@/components/session/timeline/ActionSidebar';
import { LoopDetectionBanner } from '@/components/session/timeline/LoopDetectionBanner';
import type { Event } from '@/data/mockData';

export interface SessionTimelineProps {
  events: Event[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
}

export function SessionTimeline({ events, activeIndex, onActiveChange }: SessionTimelineProps) {
  return (
    <div className="flex" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Left panel */}
      <div className="flex flex-col" style={{ flex: 1, overflow: 'hidden' }}>
        <LoopDetectionBanner detected={true} />
        <ScreenshotZone events={events} activeIndex={activeIndex} onActiveChange={onActiveChange} />
        <ScrubberBar events={events} activeIndex={activeIndex} onActiveChange={onActiveChange} />
      </div>

      {/* Right panel */}
      <ActionSidebar events={events} activeIndex={activeIndex} onActiveChange={onActiveChange} />
    </div>
  );
}

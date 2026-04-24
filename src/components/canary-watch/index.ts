/**
 * Canary-watch public API.
 *
 * Consume only these exports from outside the module.
 */

export { CanaryWatchProvider, useCanaryWatch } from './context';
export { CanaryMascot } from './CanaryMascot';
export { SessionLog } from './SessionLog';
export { useCanarySection } from './useCanarySection';
export { BlockedDemoButton } from './BlockedDemoButton';
export { ComplianceCtaButton } from './ComplianceCtaButton';
export type {
  LogEvent,
  LogEventType,
  CanarySectionRegistration,
} from './types';

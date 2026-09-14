import type { FindingSeverity } from "@/src/types/agent";

export interface FindingTemplate {
  summary: string;
  detail: string;
  severity: FindingSeverity;
  confidence: number;
  suggestedAction: string;
}

const FINDING_POOL: FindingTemplate[] = [
  {
    summary: "14 devices show accelerating battery degradation",
    detail:
      "Battery health across Region 2 laptops is dropping 6% faster than the fleet average over the last 7 days.",
    severity: "warning",
    confidence: 82,
    suggestedAction: "Queue a battery health scan for Region 2 devices",
  },
  {
    summary: "Warranty API latency up 3x in the last hour",
    detail:
      "p95 response time for the warranty reconciliation upstream rose from 400ms to 1.3s starting 11:05 UTC.",
    severity: "critical",
    confidence: 91,
    suggestedAction: "Page the integrations on-call and pause warranty sync",
  },
  {
    summary: "Support ticket volume spiking in Region 2",
    detail:
      "Inbound tickets are running 2.4x above the trailing 7-day average, concentrated in login-related issues.",
    severity: "warning",
    confidence: 74,
    suggestedAction: "Escalate ticket triage priority for Region 2",
  },
  {
    summary: "New device enrollment batch detected",
    detail:
      "212 devices enrolled overnight via bulk provisioning, above the typical batch size of ~40.",
    severity: "info",
    confidence: 96,
    suggestedAction: "Review the provisioning plan before it executes",
  },
  {
    summary: "Firmware rollout failure rate above threshold",
    detail:
      "6% of devices on the latest firmware build are failing to check in, versus a 1% baseline.",
    severity: "critical",
    confidence: 88,
    suggestedAction: "Halt the firmware rollout and flag affected devices",
  },
  {
    summary: "Idle license usage detected",
    detail:
      "38 seats have shown no activity in 60+ days, representing recoverable license spend.",
    severity: "info",
    confidence: 69,
    suggestedAction: "Draft a license reclamation recommendation for IT admin review",
  },
];

export function getRandomFinding(): FindingTemplate {
  return FINDING_POOL[Math.floor(Math.random() * FINDING_POOL.length)];
}

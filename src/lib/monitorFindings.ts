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
    summary: "212 parcels reclassified into a higher flood risk tier",
    detail:
      "An updated FEMA flood map revision moved 212 Region 2 parcels from moderate to high risk, above the typical monthly reclassification rate.",
    severity: "warning",
    confidence: 82,
    suggestedAction: "Queue a climate risk re-assessment for Region 2 parcels",
  },
  {
    summary: "Underwriting API latency up 3x in the last hour",
    detail:
      "p95 response time for the underwriting exception upstream rose from 400ms to 1.3s starting 11:05 UTC.",
    severity: "critical",
    confidence: 91,
    suggestedAction: "Page the integrations on-call and pause exception sync",
  },
  {
    summary: "Appraisal variance spike detected in Region 2",
    detail:
      "AVM estimates are diverging from final appraisals by 2.4x the trailing 7-day average, concentrated in new-construction parcels.",
    severity: "warning",
    confidence: 74,
    suggestedAction: "Escalate AVM review priority for Region 2 parcels",
  },
  {
    summary: "New MLS listing batch detected",
    detail:
      "212 new listings synced overnight from the Region 3 MLS feed, above the typical batch size of ~40.",
    severity: "info",
    confidence: 96,
    suggestedAction: "Review the AVM refresh plan before it executes",
  },
  {
    summary: "AVM model version rollout failure rate above threshold",
    detail:
      "6% of parcels re-scored under the newest AVM model version are failing validation, versus a 1% baseline.",
    severity: "critical",
    confidence: 88,
    suggestedAction: "Halt the model rollout and flag affected parcels",
  },
  {
    summary: "Idle MLS feed subscriptions detected",
    detail:
      "38 regional MLS feed subscriptions have shown no query activity in 60+ days, representing recoverable data-licensing spend.",
    severity: "info",
    confidence: 69,
    suggestedAction: "Draft a subscription reclamation recommendation for analyst review",
  },
];

export function getRandomFinding(): FindingTemplate {
  return FINDING_POOL[Math.floor(Math.random() * FINDING_POOL.length)];
}

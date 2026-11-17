import { hasDiscoveryBasics, missingEssentials } from "./requirements.ts"
import type { ConsultationRequirements, Stage } from "./types.ts"

/**
 * DISCOVERY → REQUIREMENTS → SOLUTION_DESIGN → REVIEW → CONFIRMATION → GENERATION → COMPLETED
 *
 * Transitions are decided here from the record and explicit visitor actions — never by the
 * model. The model can say it thinks the consultation is ready; only this module can move it.
 */

export type StageEvent =
  /** A normal conversational turn; `requirementsChanged` says whether the record changed. */
  | { type: "turn"; requirementsChanged: boolean }
  /** A proposal summary has been written and shown. */
  | { type: "proposal_presented" }
  /** The visitor explicitly confirmed a specific proposal version. */
  | { type: "confirmed" }
  | { type: "generation_started" }
  | { type: "generation_succeeded" }
  | { type: "generation_failed" }
  /** The visitor asked to change something after reviewing or completing. */
  | { type: "revise" }

/** The furthest pre-review stage the record supports. */
export function stageForRequirements(requirements: ConsultationRequirements): Stage {
  if (!hasDiscoveryBasics(requirements)) return "DISCOVERY"
  if (missingEssentials(requirements).length > 0) return "REQUIREMENTS"
  return "SOLUTION_DESIGN"
}

export function canPresentProposal(requirements: ConsultationRequirements): boolean {
  return missingEssentials(requirements).length === 0
}

/** A draft preview needs at least an industry and a need to say anything honest. */
export function canPreviewDraft(requirements: ConsultationRequirements): boolean {
  return hasDiscoveryBasics(requirements)
}

export function nextStage(
  current: Stage,
  event: StageEvent,
  requirements: ConsultationRequirements,
): Stage {
  switch (event.type) {
    case "turn": {
      if (current === "GENERATION" || current === "CONFIRMATION") return current
      // A change after review or completion invalidates the proposal: design it again.
      if ((current === "REVIEW" || current === "COMPLETED") && !event.requirementsChanged) {
        return current
      }
      return stageForRequirements(requirements)
    }
    case "proposal_presented":
      return canPresentProposal(requirements) ? "REVIEW" : stageForRequirements(requirements)
    case "confirmed":
      return current === "REVIEW" ? "CONFIRMATION" : current
    case "generation_started":
      return current === "CONFIRMATION" ? "GENERATION" : current
    case "generation_succeeded":
      return current === "GENERATION" ? "COMPLETED" : current
    case "generation_failed":
      // Nothing was lost: the confirmed proposal is still there to retry from.
      return current === "GENERATION" ? "REVIEW" : current
    case "revise":
      return stageForRequirements(requirements)
  }
}

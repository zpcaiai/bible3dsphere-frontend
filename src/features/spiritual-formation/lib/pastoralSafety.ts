export function getPastoralSafetyMessage(input: {
  mentionsSelfHarm?: boolean;
  mentionsAbuse?: boolean;
  mentionsAddiction?: boolean;
  mentionsSevereDistress?: boolean;
  recurringBondage?: boolean;
}): string | null {
  if (input.mentionsSelfHarm || input.mentionsAbuse || input.mentionsAddiction || input.mentionsSevereDistress) {
    return "If you are in immediate danger or may harm yourself or someone else, contact emergency services now. Please also reach out to a trusted person, pastor, counselor, or medical professional.";
  }
  if (input.recurringBondage) {
    return "This repeated pattern may need stronger boundaries and real accountability. Please consider speaking with a trusted mature believer, pastor, counselor, or accountability partner.";
  }
  return null;
}

export const MODULE_DISCLAIMER =
  "This tool is a spiritual formation aid. It does not replace Scripture, prayer, the Holy Spirit, the local church, pastoral care, wise accountability, or professional help when needed.";

export const GRACE_RECOVERY_STATEMENT =
  "In Christ, confession is not the end of your story. It is the doorway back into the light.";

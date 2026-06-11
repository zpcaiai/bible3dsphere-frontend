import type { Scripture } from "../types/spiritualFormation";

export const formationScriptures: Record<string, Scripture> = {
  newCreation: { reference: "2 Corinthians 5:17", text: "If anyone is in Christ, he is a new creation.", theme: "new_creation" },
  mortification: { reference: "Romans 8:13", text: "By the Spirit you put to death the deeds of the body.", theme: "mortification" },
  fruit: { reference: "Galatians 5:22-23", text: "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.", theme: "fruit" },
  putOffPutOn: { reference: "Ephesians 4:22-24", text: "Put off your old self and put on the new self.", theme: "put_off_put_on" },
  confession: { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us our sins.", theme: "confession" },
  mindRenewal: { reference: "Romans 12:1-2", text: "Be transformed by the renewal of your mind.", theme: "mind_renewal" },
  thoughtCaptivity: { reference: "2 Corinthians 10:5", text: "Take every thought captive to obey Christ.", theme: "thought_captivity" },
};

import { step1 } from "./step1-concept";
import { step2 } from "./step2-unicite";
import { step3 } from "./step3-activites";
import { step4 } from "./step4-competences";
import { step5 } from "./step5-evaluation";
import { step6 } from "./step6-programme";
import { step7 } from "./step7-generation";

const prompts: Record<number, string> = {
  1: step1,
  2: step2,
  3: step3,
  4: step4,
  5: step5,
  6: step6,
  7: step7,
};

export function getSystemPrompt(stepNumber: number): string {
  return prompts[stepNumber] ?? prompts[1];
}

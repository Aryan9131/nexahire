import { z } from "zod";

const QuestionSchema = z.object({
  question: z.string(),
   type: z.enum(["technical", "behavioral", "situational"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  follow_ups: z.array(z.string()),
  evaluation_criteria: z.string(),
  ai_evaluation_hints: z.string(),
});

const QuestionCategorySchema = z.object({
  category: z.string(),
  duration: z.string(),
  questions: z.array(QuestionSchema),
});

export const InterviewPlanSchema = z.object({
  total_duration: z.string(),
  question_categories: z.array(QuestionCategorySchema),
  additional_notes: z.string(),
});

export const InterviewResponseSchema = z.object({
  interview_plan: InterviewPlanSchema
});


type InterviewPlan = z.infer<typeof InterviewPlanSchema>;

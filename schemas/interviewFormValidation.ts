import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { types } from "util"
import { z } from "zod"

export const formSchema = z.object({
  position: z.string().min(2, {
    message: "Job Position must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Job Description must be at least 10 characters.",
  }).max(600, {
    message: "Job Description must be at most 600 characters.",
  }),
  duration: z.number().min(10, {
    message: "Interview Duration must be at least 10 minutes.",
  }),
  types: z.array(z.string()).min(1, {
    message: "At least one interview type must be selected.",
  }).max(5, {
    message: "You can select at most 5 interview types.",
  })
})

export type InterviewFormValues = z.infer<typeof formSchema>;

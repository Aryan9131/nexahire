import { InterviewPlanSchema, InterviewResponseSchema } from '@/schemas/apiResponseSchema';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

function normalizeInterviewJson(raw: any) {
  if (!raw.interview_plan) return raw;

  raw.interview_plan.question_categories?.forEach((cat: any) => {
    cat.questions?.forEach((q: any) => {
      // Normalize difficulty
      if (!q.difficulty && q.technical_depth) {
        q.difficulty = q.technical_depth;
        delete q.technical_depth;
      }
      if (!["beginner", "intermediate", "advanced"].includes(q.difficulty)) {
        q.difficulty = "beginner"; // fallback
      }
    });
  });

  return raw;
}

export async function POST(req: Request) {
  try {
    const { position, description, duration, types } = await req.json();

    // Enhanced prompt for AI-based audio/video interview platform
    const prompt = `
You are an expert HR professional and technical interviewer creating interview questions
for an AI-powered AUDIO/VIDEO INTERVIEW PLATFORM. 

⚠️ IMPORTANT: Your response MUST be a VALID JSON object that STRICTLY matches the schema below.
Do NOT add extra fields, do NOT rename fields, do NOT include explanations or markdown fences.

### JSON Schema (strictly follow):
{
  "interview_plan": {
    "total_duration": "<string> (e.g. '30 minutes')",
    "question_categories": [
      {
        "category": "<string>",
        "duration": "<string>",
        "questions": [
          {
            "question": "<string>",
            "type": "technical" | "behavioral" | "situational",
            "difficulty": "beginner" | "intermediate" | "advanced",
            "follow_ups": ["<string>", "..."],
            "evaluation_criteria": "<string>",
            "ai_evaluation_hints": "<string>"
          }
        ]
      }
    ],
    "additional_notes": "<string>"
  }
}

⚠️ CRITICAL RULES:
- Keys must be EXACTLY as above (do not invent new ones like "technical_depth").
- All values must be strings or arrays of strings.
- Output must be pure JSON (no markdown, no commentary, no text before/after).
- If unsure, default difficulty to "beginner".
`



    // Properly typed messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528:free',
      messages,
      temperature: 0.7, // Add some creativity
      max_tokens: 4000, // Ensure we get comprehensive responses
    });

    const responseContent = completion.choices[0].message.content;
    console.log('Generated Interview Questions Response:', responseContent);

    let parsedJson: any;
    try {
      let cleaned = responseContent ?? "{}";

      // Extract JSON block
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        cleaned = match[0]; // first JSON object
      }
      let raw = JSON.parse(cleaned);
      raw = normalizeInterviewJson(raw);
      parsedJson = InterviewResponseSchema.parse(raw);

      console.log("Parsed JSON : ", parsedJson);
    } catch (err) {
      console.log("Error while parsing responseContent : ", err)
      parsedJson = {};
    }
    return NextResponse.json({
      success: true,
      data: parsedJson.interview_plan,
    }, { status: 200 });


  } catch (error) {
    console.error('Error generating interview questions:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to generate interview questions',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
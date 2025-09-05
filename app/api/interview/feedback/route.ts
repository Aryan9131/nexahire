import { supabase } from '@/integrations/supabase/client';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { conversations, userEmail, userName, interview_id } = await request.json();
        
        console.log("conversations", conversations);

        // Correctly stringify the conversations array
        const prompt = `{
            "conversations": ${JSON.stringify(conversations)},
            "instruction": "Depends on this interview conversation between the assistant and user, give me feedback for the user interview. Give me a rating out of 10 for Technical Skills, Communication, Problem Solving, and Experience. Also, give me a summary in 3 lines about the interview and one line to let me know whether the user is recommended for hire or not with a message. Give me the response in JSON format.",
            "example_format": {
                "feedback": {
                    "rating": {
                        "technicalSkills": 5,
                        "communication": 6,
                        "problemSolving": 4,
                        "experience": 7
                    },
                    "summary": "<in 3 Line>",
                    "recommendation": "<RecommendationMsg>"
                }
            }
        }`;

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: 'user',
                content: prompt,
            },
        ];

        const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528:free',
            messages,
            temperature: 0.7,
            max_tokens: 4000,
        });

        const responseContent = completion.choices[0].message.content;
        console.log('Generated Interview feedback Response:', responseContent);

        // Regular expression to find and extract JSON content
        const jsonMatch = responseContent?.match(/```json\s*([\s\S]*?)\s*```/);

        if (jsonMatch && jsonMatch[1]) {
            const rawJsonString = jsonMatch[1].trim();
            const parsedJson = JSON.parse(rawJsonString);
            // insert feedback in supabase with parsedjson and interview_id, userName, userEmail

            const { data, error } = await supabase
                .from('Feedbacks')
                .insert({
                    ...parsedJson,
                    interview_id,
                    userName,
                    userEmail
                })
                .select();

            if (error) {
                console.error('Error inserting feedback into Supabase:', error);
                return NextResponse.json({ error: 'Failed to insert feedback' }, { status: 500 });
            }
            console.log('******* Inserted feedback data:', data);
            return NextResponse.json({ data }, { status: 200 });
        } else {
            console.error('No JSON code block found in the response.');
            return NextResponse.json({ error: 'Failed to parse JSON response' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error generating interview feedback:', error);
        return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
    }
}
import { supabase } from "@/integrations/supabase/client";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { interview_id: string } }) {
    try {
        const { interview_id } = params;
        console.log("Fetching interviews for user:", interview_id);
        // Fetch interviews for the user from the supabase database
        const { data: interviews, error } = await supabase
            .from('Interviews')
            .select(` *, Feedbacks!inner (*)`)
            .eq('id', interview_id)
            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        console.log("Scheduled interviews in api :", interviews);
        return NextResponse.json(interviews);
    } catch (error) {
        console.error("Error fetching Scheduled interviews:", error);
        return NextResponse.json({ error: "Failed to fetch Scheduled interviews" }, { status: 500 });
    }
}
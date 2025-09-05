import { supabase } from "@/integrations/supabase/client";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { user_id: string } }) {
    try {
        const { user_id } = params;
        console.log("Fetching interviews for user:", user_id);
        // Fetch interviews for the user from the supabase database
        const { data: interviews, error } = await supabase
            .from('Interviews')
            .select('*')
            .eq('userId', user_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        console.log("Fetched interviews in api :", interviews);
        return NextResponse.json(interviews);
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
    }
}
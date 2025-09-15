import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { interview_id: string } }
) {
  const { interview_id } = params;

  // Query Supabase
  const { data: interviews, error } = await supabase
    .from("Interviews")
    .select(`*, Feedbacks!inner (*)`)
    .eq("id", interview_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(interviews);
}

import { type NextRequest, NextResponse } from "next/server"
import { ContentAnalyzer } from "@/components/content-analyzer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Invalid input",
          message: "Text content is required and must be a non-empty string",
        },
        { status: 400 },
      )
    }

    const analysis = ContentAnalyzer.analyzeText(text)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      content_analysis: {
        tone: analysis.tone,
        clickbait_score: analysis.clickbait_score,
        entities: analysis.entities,
        suspicious_patterns: analysis.suspicious_patterns,
        text_length: text.length,
        word_count: text.split(/\s+/).length,
      },
    })
  } catch (error) {
    console.error("Content analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Content analysis failed",
        message: "An error occurred during content analysis",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

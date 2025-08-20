import { type NextRequest, NextResponse } from "next/server"
import { CredibilityScorer } from "@/components/credibility-scorer"
import { SourceChecker } from "@/components/source-checker"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { texts, options = {} } = body

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid input",
          message: "An array of text content is required",
        },
        { status: 400 },
      )
    }

    if (texts.length > 10) {
      return NextResponse.json(
        {
          error: "Too many texts",
          message: "Maximum 10 texts allowed per batch request",
        },
        { status: 400 },
      )
    }

    // Validate each text
    for (let i = 0; i < texts.length; i++) {
      if (!texts[i] || typeof texts[i] !== "string" || texts[i].trim().length === 0) {
        return NextResponse.json(
          {
            error: "Invalid text content",
            message: `Text at index ${i} is invalid or empty`,
          },
          { status: 400 },
        )
      }
    }

    const startTime = Date.now()
    const results = []

    // Process each text
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i]
      const urls = SourceChecker.extractUrls(text)

      try {
        const credibilityScore = await CredibilityScorer.calculateCredibilityScore(text, urls, options.weights)

        results.push({
          index: i,
          success: true,
          text_preview: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          credibility_score: credibilityScore.overall_score,
          classification: credibilityScore.classification,
          confidence_level: Math.round(credibilityScore.confidence_level * 100),
          risk_level: credibilityScore.risk_assessment.level,
          urls_found: urls.length,
        })
      } catch (error) {
        results.push({
          index: i,
          success: false,
          error: "Analysis failed for this text",
          text_preview: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        })
      }
    }

    const processingTime = Date.now() - startTime

    // Calculate batch statistics
    const successfulResults = results.filter((r) => r.success)
    const averageScore =
      successfulResults.length > 0
        ? successfulResults.reduce((sum, r) => sum + (r.credibility_score || 0), 0) / successfulResults.length
        : 0

    const classificationCounts = successfulResults.reduce(
      (acc, r) => {
        if (r.classification) {
          acc[r.classification.toLowerCase() as keyof typeof acc]++
        }
        return acc
      },
      { reliable: 0, suspicious: 0, fake: 0 },
    )

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      batch_summary: {
        total_texts: texts.length,
        successful_analyses: successfulResults.length,
        failed_analyses: results.length - successfulResults.length,
        average_credibility_score: Math.round(averageScore),
        classification_distribution: classificationCounts,
        processing_time_ms: processingTime,
      },
      detailed_results: results,
    })
  } catch (error) {
    console.error("Batch analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Batch analysis failed",
        message: "An error occurred during batch processing",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

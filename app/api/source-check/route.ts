import { type NextRequest, NextResponse } from "next/server"
import { SourceChecker } from "@/components/source-checker"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, text } = body

    let urlsToCheck = urls || []

    // If text is provided, extract URLs from it
    if (text && typeof text === "string") {
      const extractedUrls = SourceChecker.extractUrls(text)
      urlsToCheck = [...new Set([...urlsToCheck, ...extractedUrls])]
    }

    if (!urlsToCheck || urlsToCheck.length === 0) {
      return NextResponse.json(
        {
          error: "No URLs provided",
          message: "At least one URL is required for source analysis",
        },
        { status: 400 },
      )
    }

    if (urlsToCheck.length > 20) {
      return NextResponse.json(
        {
          error: "Too many URLs",
          message: "Maximum 20 URLs allowed per request",
        },
        { status: 400 },
      )
    }

    const sourceReliabilities = await SourceChecker.performBulkSourceCheck(urlsToCheck)
    const overallAssessment = SourceChecker.calculateOverallSourceCredibility(sourceReliabilities)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source_analysis: {
        urls_analyzed: urlsToCheck.length,
        average_reliability: overallAssessment.average_score,
        high_reliability_count: overallAssessment.high_reliability_count,
        medium_reliability_count: overallAssessment.medium_reliability_count,
        low_reliability_count: overallAssessment.low_reliability_count,
        risk_assessment: overallAssessment.risk_assessment,
        detailed_sources: sourceReliabilities,
      },
    })
  } catch (error) {
    console.error("Source check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Source check failed",
        message: "An error occurred during source analysis",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

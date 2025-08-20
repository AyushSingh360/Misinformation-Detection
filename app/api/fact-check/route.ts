import { type NextRequest, NextResponse } from "next/server"
import { FactVerifier } from "@/components/fact-verifier"

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

    const factCheckResults = await FactVerifier.performRealTimeFactCheck(text)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      fact_check: {
        overall_credibility: factCheckResults.overall_credibility,
        verified_claims: factCheckResults.verified_claims,
        disputed_claims: factCheckResults.disputed_claims,
        unverified_claims: factCheckResults.unverified_claims,
        false_claims: factCheckResults.false_claims,
        total_claims: factCheckResults.detailed_results.length,
        detailed_results: factCheckResults.detailed_results,
      },
    })
  } catch (error) {
    console.error("Fact check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Fact check failed",
        message: "An error occurred during fact checking",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

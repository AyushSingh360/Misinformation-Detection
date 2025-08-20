import { type NextRequest, NextResponse } from "next/server"
import { CredibilityScorer } from "@/components/credibility-scorer"
import { ContentAnalyzer } from "@/components/content-analyzer"
import { FactVerifier } from "@/components/fact-verifier"
import { SourceChecker } from "@/components/source-checker"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, urls = [], options = {} } = body

    // Validate input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Invalid input",
          message: "Text content is required and must be a non-empty string",
        },
        { status: 400 },
      )
    }

    if (text.length > 50000) {
      return NextResponse.json(
        {
          error: "Content too long",
          message: "Text content must be less than 50,000 characters",
        },
        { status: 400 },
      )
    }

    // Extract URLs from text and combine with provided URLs
    const extractedUrls = SourceChecker.extractUrls(text)
    const allUrls = [...new Set([...extractedUrls, ...urls])]

    // Perform comprehensive analysis
    const [credibilityScore, factCheckResults, sourceReliabilities] = await Promise.all([
      CredibilityScorer.calculateCredibilityScore(text, allUrls, options.weights),
      FactVerifier.performRealTimeFactCheck(text),
      allUrls.length > 0 ? SourceChecker.performBulkSourceCheck(allUrls) : Promise.resolve([]),
    ])

    // Content analysis
    const contentAnalysis = ContentAnalyzer.analyzeText(text)

    // Source assessment
    const sourceAssessment = SourceChecker.calculateOverallSourceCredibility(sourceReliabilities)

    // Generate explanation
    const explanation = CredibilityScorer.generateScoreExplanation(credibilityScore)

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        credibility_score: credibilityScore.overall_score,
        classification: credibilityScore.classification,
        confidence_level: Math.round(credibilityScore.confidence_level * 100),
        explanation,
        breakdown: credibilityScore.breakdown,
        risk_assessment: credibilityScore.risk_assessment,
        detailed_analysis: credibilityScore.detailed_analysis,
      },
      fact_check: {
        overall_credibility: factCheckResults.overall_credibility,
        verified_claims: factCheckResults.verified_claims,
        disputed_claims: factCheckResults.disputed_claims,
        unverified_claims: factCheckResults.unverified_claims,
        false_claims: factCheckResults.false_claims,
        detailed_results: factCheckResults.detailed_results,
      },
      content_analysis: {
        tone: contentAnalysis.tone,
        clickbait_score: contentAnalysis.clickbait_score,
        entities: contentAnalysis.entities,
        suspicious_patterns: contentAnalysis.suspicious_patterns,
      },
      source_analysis: {
        sources_analyzed: sourceReliabilities.length,
        average_reliability: sourceAssessment.average_score,
        high_reliability_count: sourceAssessment.high_reliability_count,
        medium_reliability_count: sourceAssessment.medium_reliability_count,
        low_reliability_count: sourceAssessment.low_reliability_count,
        risk_assessment: sourceAssessment.risk_assessment,
        detailed_sources: sourceReliabilities,
      },
      metadata: {
        text_length: text.length,
        urls_found: extractedUrls.length,
        urls_provided: urls.length,
        total_urls_analyzed: allUrls.length,
        processing_time_ms: Date.now() - Date.now(), // Would be calculated properly in real implementation
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Analysis failed",
        message: "An error occurred during content analysis",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "TruthGuard AI - Comprehensive Content Analysis API",
    version: "1.0.0",
    endpoints: {
      analyze: "POST /api/analyze - Comprehensive content analysis",
      "content-analysis": "POST /api/content-analysis - Content pattern analysis only",
      "fact-check": "POST /api/fact-check - Fact verification only",
      "source-check": "POST /api/source-check - Source reliability only",
      batch: "POST /api/batch - Batch analysis of multiple texts",
    },
    documentation: "https://truthguard-ai.vercel.app/docs",
  })
}

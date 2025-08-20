import { NextResponse } from "next/server"

export async function GET() {
  const documentation = {
    title: "TruthGuard AI - Fake News Detection API",
    version: "1.0.0",
    description: "Comprehensive API for detecting fake news, misinformation, and assessing content credibility",
    base_url: "https://truthguard-ai.vercel.app/api",
    endpoints: {
      "/analyze": {
        method: "POST",
        description: "Comprehensive content analysis combining all detection methods",
        parameters: {
          text: {
            type: "string",
            required: true,
            description: "Content to analyze (max 50,000 characters)",
          },
          urls: {
            type: "array",
            required: false,
            description: "Additional URLs for source verification",
          },
          options: {
            type: "object",
            required: false,
            description: "Analysis options including custom weights",
            properties: {
              weights: {
                type: "object",
                description: "Custom scoring weights",
                properties: {
                  content_analysis: { type: "number", default: 0.3 },
                  fact_verification: { type: "number", default: 0.45 },
                  source_reliability: { type: "number", default: 0.25 },
                },
              },
            },
          },
        },
        response: {
          credibility_score: "number (0-100)",
          classification: "string (Reliable|Suspicious|Fake)",
          confidence_level: "number (0-100)",
          explanation: "string",
          detailed_analysis: "object",
        },
      },
      "/content-analysis": {
        method: "POST",
        description: "Content pattern analysis only",
        parameters: {
          text: { type: "string", required: true },
        },
        response: {
          tone: "string",
          clickbait_score: "number",
          entities: "array",
          suspicious_patterns: "array",
        },
      },
      "/fact-check": {
        method: "POST",
        description: "Fact verification only",
        parameters: {
          text: { type: "string", required: true },
        },
        response: {
          overall_credibility: "number",
          verified_claims: "number",
          disputed_claims: "number",
          detailed_results: "array",
        },
      },
      "/source-check": {
        method: "POST",
        description: "Source reliability analysis",
        parameters: {
          urls: { type: "array", required: false },
          text: { type: "string", required: false, description: "Extract URLs from text" },
        },
        response: {
          average_reliability: "number",
          risk_assessment: "string",
          detailed_sources: "array",
        },
      },
      "/batch": {
        method: "POST",
        description: "Batch analysis of multiple texts (max 10)",
        parameters: {
          texts: { type: "array", required: true, max_items: 10 },
          options: { type: "object", required: false },
        },
        response: {
          batch_summary: "object",
          detailed_results: "array",
        },
      },
    },
    rate_limits: {
      "/analyze": "100 requests per hour",
      "/batch": "20 requests per hour",
      others: "200 requests per hour",
    },
    examples: {
      analyze_request: {
        text: "Breaking: Scientists discover new planet that could support life!",
        urls: ["https://example-news.com/article"],
        options: {
          weights: {
            fact_verification: 0.5,
            content_analysis: 0.3,
            source_reliability: 0.2,
          },
        },
      },
      analyze_response: {
        success: true,
        analysis: {
          credibility_score: 75,
          classification: "Reliable",
          confidence_level: 85,
          explanation: "Content shows good credibility with verified facts and reliable sources.",
        },
      },
    },
    error_codes: {
      400: "Bad Request - Invalid input parameters",
      429: "Too Many Requests - Rate limit exceeded",
      500: "Internal Server Error - Analysis failed",
    },
  }

  return NextResponse.json(documentation, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

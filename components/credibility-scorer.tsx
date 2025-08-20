"use client"

import { ContentAnalyzer } from "./content-analyzer"
import { FactVerifier } from "./fact-verifier"
import { SourceChecker } from "./source-checker"

interface CredibilityScore {
  overall_score: number
  classification: "Reliable" | "Suspicious" | "Fake"
  confidence_level: number
  breakdown: {
    content_analysis_score: number
    fact_verification_score: number
    source_reliability_score: number
    weighted_scores: {
      content_weight: number
      fact_weight: number
      source_weight: number
    }
  }
  risk_assessment: {
    level: "low" | "medium" | "high" | "critical"
    factors: string[]
    recommendations: string[]
  }
  detailed_analysis: {
    content_flags: string[]
    fact_check_summary: string
    source_assessment: string
    credibility_indicators: string[]
    warning_signs: string[]
  }
}

interface ScoringWeights {
  content_analysis: number
  fact_verification: number
  source_reliability: number
  bias_penalty: number
  recency_bonus: number
}

export class CredibilityScorer {
  private static defaultWeights: ScoringWeights = {
    content_analysis: 0.3, // 30% weight for content analysis
    fact_verification: 0.45, // 45% weight for fact verification (most important)
    source_reliability: 0.25, // 25% weight for source reliability
    bias_penalty: 0.1, // Penalty for strong bias
    recency_bonus: 0.05, // Bonus for recent, up-to-date information
  }

  static async calculateCredibilityScore(
    text: string,
    urls: string[] = [],
    customWeights?: Partial<ScoringWeights>,
  ): Promise<CredibilityScore> {
    const weights = { ...this.defaultWeights, ...customWeights }

    // Perform all analyses
    const contentAnalysis = ContentAnalyzer.analyzeText(text)
    const factCheckResults = await FactVerifier.performRealTimeFactCheck(text)
    const sourceReliabilities = urls.length > 0 ? await SourceChecker.performBulkSourceCheck(urls) : []
    const sourceAssessment = SourceChecker.calculateOverallSourceCredibility(sourceReliabilities)

    // Calculate individual component scores
    const contentScore = this.calculateContentAnalysisScore(contentAnalysis)
    const factScore = this.calculateFactVerificationScore(factCheckResults)
    const sourceScore = sourceReliabilities.length > 0 ? sourceAssessment.average_score : 50 // Neutral if no sources

    // Apply weighting and calculate final score
    const weightedScore = this.calculateWeightedScore(contentScore, factScore, sourceScore, weights)

    // Apply penalties and bonuses
    const adjustedScore = this.applyAdjustments(weightedScore, contentAnalysis, sourceReliabilities, weights)

    // Determine classification and confidence
    const classification = this.determineClassification(adjustedScore)
    const confidenceLevel = this.calculateConfidenceLevel(contentAnalysis, factCheckResults, sourceReliabilities)

    // Generate risk assessment
    const riskAssessment = this.generateRiskAssessment(
      adjustedScore,
      contentAnalysis,
      factCheckResults,
      sourceAssessment,
    )

    // Create detailed analysis
    const detailedAnalysis = this.generateDetailedAnalysis(
      contentAnalysis,
      factCheckResults,
      sourceReliabilities,
      adjustedScore,
    )

    return {
      overall_score: Math.round(adjustedScore),
      classification,
      confidence_level: confidenceLevel,
      breakdown: {
        content_analysis_score: Math.round(contentScore),
        fact_verification_score: Math.round(factScore),
        source_reliability_score: Math.round(sourceScore),
        weighted_scores: {
          content_weight: weights.content_analysis,
          fact_weight: weights.fact_verification,
          source_weight: weights.source_reliability,
        },
      },
      risk_assessment: riskAssessment,
      detailed_analysis: detailedAnalysis,
    }
  }

  private static calculateContentAnalysisScore(analysis: any): number {
    let score = 70 // Base score

    // Penalize sensational tone
    if (analysis.tone === "sensational") score -= 20
    if (analysis.tone === "manipulative") score -= 35

    // Penalize clickbait
    score -= analysis.clickbait_score * 0.3

    // Penalize suspicious patterns
    score -= analysis.suspicious_patterns.length * 8

    // Bonus for neutral tone and factual language
    if (analysis.tone === "neutral") score += 10

    return Math.max(0, Math.min(100, score))
  }

  private static calculateFactVerificationScore(factResults: any): number {
    if (factResults.detailed_results.length === 0) return 50 // Neutral if no claims to verify

    const { verified_claims, disputed_claims, unverified_claims, false_claims } = factResults
    const totalClaims = verified_claims + disputed_claims + unverified_claims + false_claims

    if (totalClaims === 0) return 50

    // Calculate weighted score based on claim verification status
    const score =
      (verified_claims * 100 + disputed_claims * 40 + unverified_claims * 20 + false_claims * 0) / totalClaims

    return Math.round(score)
  }

  private static calculateWeightedScore(
    contentScore: number,
    factScore: number,
    sourceScore: number,
    weights: ScoringWeights,
  ): number {
    return (
      contentScore * weights.content_analysis +
      factScore * weights.fact_verification +
      sourceScore * weights.source_reliability
    )
  }

  private static applyAdjustments(
    baseScore: number,
    contentAnalysis: any,
    sourceReliabilities: any[],
    weights: ScoringWeights,
  ): number {
    let adjustedScore = baseScore

    // Apply bias penalty
    const strongBiasSources = sourceReliabilities.filter(
      (source) => source.bias_rating === "left" || source.bias_rating === "right",
    ).length
    if (strongBiasSources > sourceReliabilities.length * 0.5) {
      adjustedScore -= weights.bias_penalty * 100
    }

    // Apply recency bonus (simulated - in real implementation, would check publication dates)
    const hasRecentSources = sourceReliabilities.some((source) => source.metadata.domain_age < 1)
    if (hasRecentSources && baseScore > 60) {
      adjustedScore += weights.recency_bonus * 100
    }

    // Additional penalties for high-risk content
    if (contentAnalysis.suspicious_patterns.length > 3) {
      adjustedScore -= 15
    }

    return Math.max(0, Math.min(100, adjustedScore))
  }

  private static determineClassification(score: number): "Reliable" | "Suspicious" | "Fake" {
    if (score >= 70) return "Reliable"
    if (score >= 40) return "Suspicious"
    return "Fake"
  }

  private static calculateConfidenceLevel(contentAnalysis: any, factResults: any, sourceReliabilities: any[]): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence with more data points
    if (factResults.detailed_results.length > 3) confidence += 0.2
    if (sourceReliabilities.length > 2) confidence += 0.15

    // Increase confidence with high-quality sources
    const highQualitySources = sourceReliabilities.filter((source) => source.reliability_score > 80).length
    confidence += highQualitySources * 0.1

    // Decrease confidence with conflicting information
    const disputedClaims = factResults.disputed_claims
    const totalClaims = factResults.detailed_results.length
    if (totalClaims > 0 && disputedClaims / totalClaims > 0.3) {
      confidence -= 0.2
    }

    return Math.max(0.1, Math.min(1.0, confidence))
  }

  private static generateRiskAssessment(
    score: number,
    contentAnalysis: any,
    factResults: any,
    sourceAssessment: any,
  ): {
    level: "low" | "medium" | "high" | "critical"
    factors: string[]
    recommendations: string[]
  } {
    const factors = []
    const recommendations = []
    let level: "low" | "medium" | "high" | "critical" = "low"

    // Determine risk level
    if (score < 30) {
      level = "critical"
      factors.push("Extremely low credibility score")
      recommendations.push("Do not share or rely on this information")
    } else if (score < 50) {
      level = "high"
      factors.push("Low credibility score")
      recommendations.push("Verify through multiple independent sources")
    } else if (score < 70) {
      level = "medium"
      factors.push("Moderate credibility concerns")
      recommendations.push("Cross-reference key claims before sharing")
    } else {
      level = "low"
      recommendations.push("Generally reliable, but always good to verify important claims")
    }

    // Add specific risk factors
    if (contentAnalysis.suspicious_patterns.length > 0) {
      factors.push(`${contentAnalysis.suspicious_patterns.length} suspicious content patterns detected`)
    }

    if (factResults.false_claims > 0) {
      factors.push(`${factResults.false_claims} false claims identified`)
      recommendations.push("Be especially cautious of factual claims")
    }

    if (sourceAssessment.low_reliability_count > 0) {
      factors.push(`${sourceAssessment.low_reliability_count} low-reliability sources`)
      recommendations.push("Seek additional sources for verification")
    }

    if (contentAnalysis.tone === "sensational") {
      factors.push("Sensational language detected")
      recommendations.push("Look for more neutral reporting on the same topic")
    }

    return { level, factors, recommendations }
  }

  private static generateDetailedAnalysis(
    contentAnalysis: any,
    factResults: any,
    sourceReliabilities: any[],
    finalScore: number,
  ): {
    content_flags: string[]
    fact_check_summary: string
    source_assessment: string
    credibility_indicators: string[]
    warning_signs: string[]
  } {
    const contentFlags = []
    const credibilityIndicators = []
    const warningSigns = []

    // Content flags
    if (contentAnalysis.clickbait_score > 50) {
      contentFlags.push(`High clickbait score: ${contentAnalysis.clickbait_score}%`)
    }
    if (contentAnalysis.tone !== "neutral") {
      contentFlags.push(`Non-neutral tone detected: ${contentAnalysis.tone}`)
    }
    contentFlags.push(...contentAnalysis.suspicious_patterns)

    // Credibility indicators
    if (factResults.verified_claims > 0) {
      credibilityIndicators.push(`${factResults.verified_claims} claims verified against trusted sources`)
    }
    if (sourceReliabilities.some((source) => source.reliability_score > 90)) {
      credibilityIndicators.push("High-reliability sources present")
    }
    if (contentAnalysis.tone === "neutral") {
      credibilityIndicators.push("Neutral, factual tone")
    }

    // Warning signs
    if (factResults.false_claims > 0) {
      warningSigns.push(`${factResults.false_claims} false claims detected`)
    }
    if (sourceReliabilities.some((source) => source.reliability_score < 30)) {
      warningSigns.push("Low-reliability sources present")
    }
    if (contentAnalysis.suspicious_patterns.length > 2) {
      warningSigns.push("Multiple suspicious content patterns")
    }

    // Generate summaries
    const factCheckSummary = `${factResults.verified_claims} verified, ${factResults.disputed_claims} disputed, ${factResults.unverified_claims} unverified, ${factResults.false_claims} false claims out of ${factResults.detailed_results.length} total claims analyzed.`

    const sourceAssessment =
      sourceReliabilities.length > 0
        ? `${sourceReliabilities.length} sources analyzed with average reliability of ${Math.round(
            sourceReliabilities.reduce((sum, source) => sum + source.reliability_score, 0) / sourceReliabilities.length,
          )}%.`
        : "No sources provided for analysis."

    return {
      content_flags: contentFlags,
      fact_check_summary: factCheckSummary,
      source_assessment: sourceAssessment,
      credibility_indicators: credibilityIndicators,
      warning_signs: warningSigns,
    }
  }

  static generateScoreExplanation(score: CredibilityScore): string {
    const { overall_score, classification, breakdown } = score

    let explanation = `This content received a credibility score of ${overall_score}/100, classified as "${classification}". `

    explanation += `The score is based on content analysis (${breakdown.content_analysis_score}/100, ${Math.round(
      breakdown.weighted_scores.content_weight * 100,
    )}% weight), `

    explanation += `fact verification (${breakdown.fact_verification_score}/100, ${Math.round(
      breakdown.weighted_scores.fact_weight * 100,
    )}% weight), `

    explanation += `and source reliability (${breakdown.source_reliability_score}/100, ${Math.round(
      breakdown.weighted_scores.source_weight * 100,
    )}% weight). `

    if (score.risk_assessment.level === "high" || score.risk_assessment.level === "critical") {
      explanation += `This content poses a ${score.risk_assessment.level} risk and should be treated with caution.`
    } else {
      explanation += `The risk level is assessed as ${score.risk_assessment.level}.`
    }

    return explanation
  }

  static compareCredibilityScores(scores: CredibilityScore[]): {
    most_reliable: CredibilityScore
    least_reliable: CredibilityScore
    average_score: number
    reliability_distribution: {
      reliable: number
      suspicious: number
      fake: number
    }
  } {
    if (scores.length === 0) {
      throw new Error("No scores to compare")
    }

    const sortedScores = [...scores].sort((a, b) => b.overall_score - a.overall_score)
    const averageScore = scores.reduce((sum, score) => sum + score.overall_score, 0) / scores.length

    const distribution = scores.reduce(
      (acc, score) => {
        acc[score.classification.toLowerCase() as keyof typeof acc]++
        return acc
      },
      { reliable: 0, suspicious: 0, fake: 0 },
    )

    return {
      most_reliable: sortedScores[0],
      least_reliable: sortedScores[sortedScores.length - 1],
      average_score: Math.round(averageScore),
      reliability_distribution: distribution,
    }
  }
}

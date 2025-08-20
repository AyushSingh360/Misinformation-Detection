"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle, Shield, TrendingUp, TrendingDown, Info, AlertCircle } from "lucide-react"

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

interface CredibilityScoreDisplayProps {
  score: CredibilityScore
  explanation?: string
}

export function CredibilityScoreDisplay({ score, explanation }: CredibilityScoreDisplayProps) {
  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "Reliable":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "Suspicious":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case "Fake":
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 70) return "text-green-600"
    if (scoreValue >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              {getClassificationIcon(score.classification)}
              Overall Credibility Assessment
            </CardTitle>
            <Badge
              variant={
                score.classification === "Reliable"
                  ? "default"
                  : score.classification === "Suspicious"
                    ? "secondary"
                    : "destructive"
              }
              className="text-sm px-3 py-1"
            >
              {score.classification}
            </Badge>
          </div>
          <CardDescription>
            Comprehensive analysis with {Math.round(score.confidence_level * 100)}% confidence level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold ${getScoreColor(score.overall_score)} mb-2`}>{score.overall_score}</div>
            <div className="text-lg text-muted-foreground">Credibility Score</div>
            <Progress value={score.overall_score} className="mt-4 h-3" />
          </div>

          {explanation && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>{explanation}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>Detailed analysis of each component</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Content Analysis ({Math.round(score.breakdown.weighted_scores.content_weight * 100)}% weight)
                </span>
                <span className="text-sm font-bold">{score.breakdown.content_analysis_score}/100</span>
              </div>
              <Progress value={score.breakdown.content_analysis_score} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Fact Verification ({Math.round(score.breakdown.weighted_scores.fact_weight * 100)}% weight)
                </span>
                <span className="text-sm font-bold">{score.breakdown.fact_verification_score}/100</span>
              </div>
              <Progress value={score.breakdown.fact_verification_score} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Source Reliability ({Math.round(score.breakdown.weighted_scores.source_weight * 100)}% weight)
                </span>
                <span className="text-sm font-bold">{score.breakdown.source_reliability_score}/100</span>
              </div>
              <Progress value={score.breakdown.source_reliability_score} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon(score.risk_assessment.level)}
            Risk Assessment
          </CardTitle>
          <CardDescription>
            Risk Level:{" "}
            <span className={`font-semibold ${getRiskColor(score.risk_assessment.level)}`}>
              {score.risk_assessment.level.toUpperCase()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {score.risk_assessment.factors.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Risk Factors</h4>
              <ul className="space-y-1">
                {score.risk_assessment.factors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {score.risk_assessment.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Credibility Indicators */}
        {score.detailed_analysis.credibility_indicators.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                Credibility Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {score.detailed_analysis.credibility_indicators.map((indicator, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Warning Signs */}
        {score.detailed_analysis.warning_signs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <TrendingDown className="h-4 w-4" />
                Warning Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {score.detailed_analysis.warning_signs.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-3 w-3 text-red-600 mt-1 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">Fact Check Summary</h4>
            <p className="text-sm text-muted-foreground">{score.detailed_analysis.fact_check_summary}</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">Source Assessment</h4>
            <p className="text-sm text-muted-foreground">{score.detailed_analysis.source_assessment}</p>
          </div>

          {score.detailed_analysis.content_flags.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">Content Flags</h4>
              <div className="flex flex-wrap gap-2">
                {score.detailed_analysis.content_flags.map((flag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

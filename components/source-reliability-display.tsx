"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Globe, Lock, Users } from "lucide-react"

interface SourceReliability {
  domain: string
  reliability_score: number
  bias_rating: "left" | "center" | "right" | "unknown"
  factual_reporting: "very-high" | "high" | "mixed" | "low" | "very-low"
  notes: string[]
  metadata: {
    domain_age: number
    ssl_certificate: boolean
    social_media_presence: boolean
    editorial_transparency: boolean
    correction_policy: boolean
    funding_transparency: boolean
  }
  risk_factors: string[]
  trust_indicators: string[]
}

interface SourceReliabilityDisplayProps {
  sources: SourceReliability[]
  overallAssessment: {
    average_score: number
    high_reliability_count: number
    medium_reliability_count: number
    low_reliability_count: number
    risk_assessment: "low" | "medium" | "high"
  }
}

export function SourceReliabilityDisplay({ sources, overallAssessment }: SourceReliabilityDisplayProps) {
  const getReliabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getReliabilityBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case "left":
        return <div className="w-3 h-3 bg-blue-500 rounded-full" />
      case "right":
        return <div className="w-3 h-3 bg-red-500 rounded-full" />
      case "center":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  const getRiskAssessmentColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Source Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Source Reliability Assessment
          </CardTitle>
          <CardDescription>
            Analysis of {sources.length} source{sources.length !== 1 ? "s" : ""} found in the content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallAssessment.high_reliability_count}</div>
              <div className="text-sm text-muted-foreground">High Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{overallAssessment.medium_reliability_count}</div>
              <div className="text-sm text-muted-foreground">Medium Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overallAssessment.low_reliability_count}</div>
              <div className="text-sm text-muted-foreground">Low Reliability</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRiskAssessmentColor(overallAssessment.risk_assessment)}`}>
                {overallAssessment.risk_assessment.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Average Source Reliability</span>
            <span className="text-lg font-bold">{overallAssessment.average_score}%</span>
          </div>
          <Progress value={overallAssessment.average_score} className="mb-4" />
        </CardContent>
      </Card>

      {/* Individual Source Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Individual Source Analysis</h3>
        {sources.map((source, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {source.domain}
                </CardTitle>
                <Badge className={getReliabilityBadge(source.reliability_score)}>
                  {source.reliability_score}% Reliable
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Reliability Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Reliability Score</span>
                  <span className={`text-lg font-bold ${getReliabilityColor(source.reliability_score)}`}>
                    {source.reliability_score}/100
                  </span>
                </div>
                <Progress value={source.reliability_score} className="h-2" />
              </div>

              {/* Bias and Factual Reporting */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getBiasIcon(source.bias_rating)}
                    <span className="text-sm font-medium">Political Bias</span>
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">{source.bias_rating}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    <span className="text-sm font-medium">Factual Reporting</span>
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">
                    {source.factual_reporting.replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
              {source.trust_indicators.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Trust Indicators
                  </h4>
                  <ul className="space-y-1">
                    {source.trust_indicators.map((indicator, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Factors */}
              {source.risk_factors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-1">
                    {source.risk_factors.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Metadata */}
              <div>
                <h4 className="font-medium mb-2">Technical Assessment</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Lock
                      className={`h-3 w-3 ${source.metadata.ssl_certificate ? "text-green-600" : "text-red-600"}`}
                    />
                    <span>SSL: {source.metadata.ssl_certificate ? "Valid" : "Invalid"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users
                      className={`h-3 w-3 ${source.metadata.social_media_presence ? "text-green-600" : "text-gray-400"}`}
                    />
                    <span>Social: {source.metadata.social_media_presence ? "Present" : "Limited"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield
                      className={`h-3 w-3 ${source.metadata.editorial_transparency ? "text-green-600" : "text-gray-400"}`}
                    />
                    <span>Editorial: {source.metadata.editorial_transparency ? "Transparent" : "Limited"}</span>
                  </div>
                  <div className="text-muted-foreground">Domain Age: {source.metadata.domain_age} years</div>
                  <div className="text-muted-foreground">
                    Corrections: {source.metadata.correction_policy ? "Yes" : "No"}
                  </div>
                  <div className="text-muted-foreground">
                    Funding: {source.metadata.funding_transparency ? "Transparent" : "Unclear"}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium mb-2">Assessment Notes</h4>
                <ul className="space-y-1">
                  {source.notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* External Link */}
              <div className="pt-2 border-t">
                <a
                  href={`https://${source.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Visit {source.domain}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

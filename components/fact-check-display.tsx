"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, HelpCircle, ExternalLink } from "lucide-react"

interface FactCheckResult {
  claim: string
  status: "verified" | "disputed" | "unverified" | "false"
  sources: string[]
  confidence: number
  evidence: string[]
  contradictions: string[]
}

interface FactCheckDisplayProps {
  results: FactCheckResult[]
  overallCredibility: number
}

export function FactCheckDisplay({ results, overallCredibility }: FactCheckDisplayProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "disputed":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "false":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "disputed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "false":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Fact Check Summary</CardTitle>
          <CardDescription>Overall credibility assessment based on {results.length} claims analyzed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Overall Credibility</span>
            <span className="text-2xl font-bold">{overallCredibility}%</span>
          </div>
          <Progress value={overallCredibility} className="mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.status === "verified").length}
              </div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {results.filter((r) => r.status === "disputed").length}
              </div>
              <div className="text-sm text-muted-foreground">Disputed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {results.filter((r) => r.status === "unverified").length}
              </div>
              <div className="text-sm text-muted-foreground">Unverified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {results.filter((r) => r.status === "false").length}
              </div>
              <div className="text-sm text-muted-foreground">False</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Claim Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detailed Fact Check Results</h3>
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  Claim {index + 1}
                </CardTitle>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Claim</h4>
                <p className="text-sm text-muted-foreground italic">"{result.claim}"</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence Level</span>
                <span className="text-sm font-bold">{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress value={result.confidence * 100} className="h-2" />

              {result.evidence.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Supporting Evidence</h4>
                  <ul className="space-y-1">
                    {result.evidence.map((evidence, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        {evidence}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.contradictions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Contradictions Found</h4>
                  <ul className="space-y-1">
                    {result.contradictions.map((contradiction, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-3 w-3 text-red-600 mt-1 flex-shrink-0" />
                        {contradiction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Verified Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={`https://${source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {source}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Shield, Search, Globe, BarChart3, FileText, Link, Zap, TrendingUp } from "lucide-react"

import { CredibilityScorer } from "@/components/credibility-scorer"
import { CredibilityScoreDisplay } from "@/components/credibility-score-display"
import { FactCheckDisplay } from "@/components/fact-check-display"
import { SourceReliabilityDisplay } from "@/components/source-reliability-display"
import { ContentAnalyzer } from "@/components/content-analyzer"
import { FactVerifier } from "@/components/fact-verifier"
import { SourceChecker } from "@/components/source-checker"
import { StarfallBackground } from "@/components/starfall-background"
import { ThemeToggle } from "@/components/theme-toggle"

interface AnalysisResults {
  credibilityScore: any
  factCheckResults: any
  sourceReliabilities: any[]
  sourceAssessment: any
  contentAnalysis: any
  urls: string[]
}

export default function FakeNewsDetector() {
  const [inputText, setInputText] = useState("")
  const [inputUrls, setInputUrls] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const performComprehensiveAnalysis = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    setResults(null)

    try {
      // Extract URLs from text and manual input
      const extractedUrls = SourceChecker.extractUrls(inputText)
      const manualUrls = inputUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
      const allUrls = [...new Set([...extractedUrls, ...manualUrls])]

      // Perform all analyses in parallel for better performance
      const [factCheckResults, sourceReliabilities] = await Promise.all([
        FactVerifier.performRealTimeFactCheck(inputText),
        allUrls.length > 0 ? SourceChecker.performBulkSourceCheck(allUrls) : Promise.resolve([]),
      ])

      // Analyze content
      const contentAnalysis = ContentAnalyzer.analyzeText(inputText)

      // Calculate source assessment
      const sourceAssessment = SourceChecker.calculateOverallSourceCredibility(sourceReliabilities)

      // Calculate comprehensive credibility score
      const credibilityScore = await CredibilityScorer.calculateCredibilityScore(inputText, allUrls)

      // Generate explanation
      const explanation = CredibilityScorer.generateScoreExplanation(credibilityScore)

      setResults({
        credibilityScore: { ...credibilityScore, explanation },
        factCheckResults,
        sourceReliabilities,
        sourceAssessment,
        contentAnalysis,
        urls: allUrls,
      })

      setActiveTab("overview")
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated starfall background */}
      <StarfallBackground />

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">TruthGuard AI</h1>
                <p className="text-sm text-muted-foreground">Advanced Fake News Detection System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </nav>
              {/* Theme toggle button */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">AI-Powered Misinformation Detection</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive analysis using advanced NLP, fact-checking algorithms, and source reliability assessment to
            detect fake news, misinformation, and misleading content in real-time.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Content Analysis</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border">
              <Search className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Fact Verification</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border">
              <Globe className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Source Checking</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Credibility Scoring</span>
            </div>
          </div>
        </div>

        {/* Analysis Input */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Content Analysis
            </CardTitle>
            <CardDescription>
              Enter news article text, social media post, or any content you want to verify for credibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content to Analyze</label>
              <Textarea
                placeholder="Paste the news article, social media post, or any text content you want to analyze for credibility and misinformation..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Sources (Optional)</label>
              <Input
                placeholder="Enter URLs (one per line) for additional source verification..."
                value={inputUrls}
                onChange={(e) => setInputUrls(e.target.value)}
                className="min-h-20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URLs will be automatically extracted from content, but you can add more here
              </p>
            </div>

            <Button
              onClick={performComprehensiveAnalysis}
              disabled={!inputText.trim() || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Content...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start Comprehensive Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {results && (
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>Quick overview of the credibility assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{results.credibilityScore.overall_score}</div>
                    <div className="text-sm text-muted-foreground">Credibility Score</div>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={
                        results.credibilityScore.classification === "Reliable"
                          ? "default"
                          : results.credibilityScore.classification === "Suspicious"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-sm px-3 py-1"
                    >
                      {results.credibilityScore.classification}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">Classification</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {results.factCheckResults.verified_claims}
                    </div>
                    <div className="text-sm text-muted-foreground">Verified Claims</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{results.sourceReliabilities.length}</div>
                    <div className="text-sm text-muted-foreground">Sources Analyzed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Detailed Results Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="facts">Fact Check</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <CredibilityScoreDisplay
                  score={results.credibilityScore}
                  explanation={results.credibilityScore.explanation}
                />
              </TabsContent>

              <TabsContent value="facts" className="space-y-6">
                <FactCheckDisplay
                  results={results.factCheckResults.detailed_results}
                  overallCredibility={results.factCheckResults.overall_credibility}
                />
              </TabsContent>

              <TabsContent value="sources" className="space-y-6">
                {results.sourceReliabilities.length > 0 ? (
                  <SourceReliabilityDisplay
                    sources={results.sourceReliabilities}
                    overallAssessment={results.sourceAssessment}
                  />
                ) : (
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="text-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Sources Found</h3>
                      <p className="text-muted-foreground">
                        No URLs were detected in the content. Add source URLs to get source reliability analysis.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid gap-6">
                  {/* Content Analysis Details */}
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Content Analysis Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium">Tone</div>
                          <div className="text-sm text-muted-foreground capitalize">{results.contentAnalysis.tone}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Clickbait Score</div>
                          <div className="text-sm text-muted-foreground">
                            {results.contentAnalysis.clickbait_score}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Entities Found</div>
                          <div className="text-sm text-muted-foreground">{results.contentAnalysis.entities.length}</div>
                        </div>
                      </div>

                      {results.contentAnalysis.entities.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Key Entities</div>
                          <div className="flex flex-wrap gap-2">
                            {results.contentAnalysis.entities.map((entity: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {entity.text} ({entity.type})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.contentAnalysis.suspicious_patterns.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Suspicious Patterns</div>
                          <ul className="space-y-1">
                            {results.contentAnalysis.suspicious_patterns.map((pattern: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {pattern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* URLs Found */}
                  {results.urls.length > 0 && (
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          URLs Analyzed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {results.urls.map((url, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Link className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate"
                              >
                                {url}
                              </a>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Call to Action */}
        {!results && (
          <Card className="text-center bg-card/80 backdrop-blur-sm">
            <CardContent className="py-12">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Ready to Analyze Content?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI-powered system combines multiple analysis techniques to provide comprehensive credibility
                assessment. Enter your content above to get started.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span>✓ Real-time fact checking</span>
                <span>✓ Source reliability analysis</span>
                <span>✓ Content pattern detection</span>
                <span>✓ Comprehensive scoring</span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

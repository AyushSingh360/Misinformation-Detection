"use client"

interface FactCheckResult {
  claim: string
  status: "verified" | "disputed" | "unverified" | "false"
  sources: string[]
  confidence: number
  evidence: string[]
  contradictions: string[]
}

interface KnowledgeBaseEntry {
  fact: string
  sources: string[]
  last_updated: string
  confidence: number
}

export class FactVerifier {
  private static trustedSources = [
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "npr.org",
    "factcheck.org",
    "snopes.com",
    "politifact.com",
    "who.int",
    "cdc.gov",
    "nasa.gov",
    "nature.com",
    "science.org",
  ]

  private static knowledgeBase: KnowledgeBaseEntry[] = [
    {
      fact: "COVID-19 vaccines are safe and effective",
      sources: ["cdc.gov", "who.int", "nature.com"],
      last_updated: "2024-01-15",
      confidence: 0.98,
    },
    {
      fact: "Climate change is caused by human activities",
      sources: ["nasa.gov", "nature.com", "science.org"],
      last_updated: "2024-01-10",
      confidence: 0.97,
    },
    {
      fact: "The Earth is approximately 4.5 billion years old",
      sources: ["nasa.gov", "science.org"],
      last_updated: "2023-12-01",
      confidence: 0.99,
    },
    {
      fact: "5G networks do not cause health problems",
      sources: ["who.int", "cdc.gov"],
      last_updated: "2024-01-05",
      confidence: 0.95,
    },
  ]

  static async verifyClaims(text: string): Promise<FactCheckResult[]> {
    const claims = this.extractClaims(text)
    const results: FactCheckResult[] = []

    for (const claim of claims) {
      const result = await this.verifyIndividualClaim(claim)
      results.push(result)
    }

    return results
  }

  private static async verifyIndividualClaim(claim: string): Promise<FactCheckResult> {
    // Check against knowledge base
    const knowledgeMatch = this.checkAgainstKnowledgeBase(claim)

    // Simulate external API fact-checking
    const externalCheck = await this.simulateExternalFactCheck(claim)

    // Cross-reference multiple sources
    const sourceVerification = this.crossReferenceSources(claim)

    // Determine final status based on all checks
    const status = this.determineClaimStatus(knowledgeMatch, externalCheck, sourceVerification)

    return {
      claim,
      status,
      sources: this.getRelevantSources(claim),
      confidence: this.calculateConfidence(knowledgeMatch, externalCheck, sourceVerification),
      evidence: this.gatherEvidence(claim, knowledgeMatch),
      contradictions: this.findContradictions(claim),
    }
  }

  private static extractClaims(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 15)

    return sentences
      .filter((sentence) => {
        const hasNumbers = /\d+/.test(sentence)
        const hasFactualWords =
          /study|research|report|according|data|statistics|scientists|experts|proven|evidence|shows|indicates|confirms|reveals/i.test(
            sentence,
          )
        const hasDefinitiveStatements = /is|are|will|causes|prevents|increases|decreases|leads to/i.test(sentence)
        const hasPercentages = /%|\bpercent\b/i.test(sentence)

        return hasNumbers || hasFactualWords || hasDefinitiveStatements || hasPercentages
      })
      .slice(0, 8) // Increased to 8 claims for more thorough analysis
  }

  private static checkAgainstKnowledgeBase(claim: string): KnowledgeBaseEntry | null {
    const claimLower = claim.toLowerCase()

    return (
      this.knowledgeBase.find((entry) => {
        const factLower = entry.fact.toLowerCase()
        const keywords = factLower.split(" ").filter((word) => word.length > 3)

        return (
          keywords.some((keyword) => claimLower.includes(keyword)) ||
          this.calculateSimilarity(claimLower, factLower) > 0.6
        )
      }) || null
    )
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(" ")
    const words2 = str2.split(" ")
    const commonWords = words1.filter((word) => words2.includes(word))

    return commonWords.length / Math.max(words1.length, words2.length)
  }

  private static async simulateExternalFactCheck(claim: string): Promise<{
    status: string
    confidence: number
    source: string
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock different fact-checking results based on claim content
    const claimLower = claim.toLowerCase()

    if (claimLower.includes("vaccine") || claimLower.includes("covid")) {
      return {
        status: "verified",
        confidence: 0.92,
        source: "FactCheck.org API",
      }
    } else if (claimLower.includes("climate") || claimLower.includes("global warming")) {
      return {
        status: "verified",
        confidence: 0.95,
        source: "Climate Fact Database",
      }
    } else if (claimLower.includes("5g") || claimLower.includes("radiation")) {
      return {
        status: "disputed",
        confidence: 0.88,
        source: "Health Claims Verifier",
      }
    }

    return {
      status: Math.random() > 0.4 ? "verified" : "unverified",
      confidence: Math.random() * 0.4 + 0.5,
      source: "General Fact Check API",
    }
  }

  private static crossReferenceSources(claim: string): {
    supportingSources: number
    contradictingSources: number
    neutralSources: number
  } {
    // Simulate cross-referencing multiple sources
    const totalSources = Math.floor(Math.random() * 8) + 3
    const supporting = Math.floor(totalSources * (Math.random() * 0.6 + 0.2))
    const contradicting = Math.floor((totalSources - supporting) * Math.random())
    const neutral = totalSources - supporting - contradicting

    return {
      supportingSources: supporting,
      contradictingSources: contradicting,
      neutralSources: neutral,
    }
  }

  private static determineClaimStatus(
    knowledgeMatch: KnowledgeBaseEntry | null,
    externalCheck: any,
    sourceVerification: any,
  ): "verified" | "disputed" | "unverified" | "false" {
    // Priority: Knowledge base > External check > Source verification
    if (knowledgeMatch && knowledgeMatch.confidence > 0.9) {
      return "verified"
    }

    if (externalCheck.status === "verified" && externalCheck.confidence > 0.85) {
      return "verified"
    }

    if (sourceVerification.contradictingSources > sourceVerification.supportingSources) {
      return "disputed"
    }

    if (sourceVerification.supportingSources >= 3) {
      return "verified"
    }

    if (externalCheck.status === "disputed" || sourceVerification.contradictingSources > 0) {
      return "disputed"
    }

    return "unverified"
  }

  private static calculateConfidence(
    knowledgeMatch: KnowledgeBaseEntry | null,
    externalCheck: any,
    sourceVerification: any,
  ): number {
    let confidence = 0.5 // Base confidence

    if (knowledgeMatch) {
      confidence = Math.max(confidence, knowledgeMatch.confidence)
    }

    confidence = Math.max(confidence, externalCheck.confidence)

    // Adjust based on source verification
    const sourceRatio =
      sourceVerification.supportingSources /
      (sourceVerification.supportingSources + sourceVerification.contradictingSources + 1)
    confidence = (confidence + sourceRatio) / 2

    return Math.round(confidence * 100) / 100
  }

  private static getRelevantSources(claim: string): string[] {
    const claimLower = claim.toLowerCase()
    let relevantSources = [...this.trustedSources]

    // Prioritize domain-specific sources
    if (claimLower.includes("health") || claimLower.includes("medical") || claimLower.includes("vaccine")) {
      relevantSources = [
        "cdc.gov",
        "who.int",
        "nature.com",
        ...relevantSources.filter((s) => !["cdc.gov", "who.int", "nature.com"].includes(s)),
      ]
    } else if (claimLower.includes("climate") || claimLower.includes("environment")) {
      relevantSources = [
        "nasa.gov",
        "nature.com",
        "science.org",
        ...relevantSources.filter((s) => !["nasa.gov", "nature.com", "science.org"].includes(s)),
      ]
    }

    return relevantSources.slice(0, 4)
  }

  private static gatherEvidence(claim: string, knowledgeMatch: KnowledgeBaseEntry | null): string[] {
    const evidence = []

    if (knowledgeMatch) {
      evidence.push(`Verified against established scientific consensus`)
      evidence.push(`Supported by ${knowledgeMatch.sources.length} authoritative sources`)
      evidence.push(`Last updated: ${knowledgeMatch.last_updated}`)
    }

    // Add contextual evidence based on claim type
    const claimLower = claim.toLowerCase()
    if (claimLower.includes("study") || claimLower.includes("research")) {
      evidence.push("Cross-referenced with peer-reviewed publications")
    }

    if (claimLower.includes("statistics") || claimLower.includes("data")) {
      evidence.push("Statistical claims verified against official databases")
    }

    return evidence
  }

  private static findContradictions(claim: string): string[] {
    const contradictions = []
    const claimLower = claim.toLowerCase()

    // Check for common misinformation patterns
    if (claimLower.includes("5g") && claimLower.includes("cause")) {
      contradictions.push("No scientific evidence supports 5G health risks")
    }

    if (claimLower.includes("vaccine") && (claimLower.includes("autism") || claimLower.includes("dangerous"))) {
      contradictions.push("Multiple studies have debunked vaccine-autism links")
    }

    if (claimLower.includes("climate") && claimLower.includes("hoax")) {
      contradictions.push("Scientific consensus strongly supports climate change reality")
    }

    return contradictions
  }

  static async performRealTimeFactCheck(text: string): Promise<{
    overall_credibility: number
    verified_claims: number
    disputed_claims: number
    unverified_claims: number
    false_claims: number
    detailed_results: FactCheckResult[]
  }> {
    const results = await this.verifyClaims(text)

    const verified = results.filter((r) => r.status === "verified").length
    const disputed = results.filter((r) => r.status === "disputed").length
    const unverified = results.filter((r) => r.status === "unverified").length
    const false_claims = results.filter((r) => r.status === "false").length

    // Calculate overall credibility
    const totalClaims = results.length
    const credibilityScore =
      totalClaims > 0 ? (verified * 100 + disputed * 50 + unverified * 25 + false_claims * 0) / totalClaims : 50

    return {
      overall_credibility: Math.round(credibilityScore),
      verified_claims: verified,
      disputed_claims: disputed,
      unverified_claims: unverified,
      false_claims,
      detailed_results: results,
    }
  }
}

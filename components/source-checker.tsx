"use client"

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

interface DomainAnalysis {
  whois_data: {
    creation_date: string
    registrar: string
    country: string
  }
  technical_analysis: {
    ssl_valid: boolean
    security_headers: boolean
    mobile_friendly: boolean
    page_speed: number
  }
  content_analysis: {
    has_about_page: boolean
    has_contact_info: boolean
    has_privacy_policy: boolean
    editorial_standards: boolean
  }
}

export class SourceChecker {
  private static reliableDomains = new Map([
    // Tier 1: Highest Reliability (90-100)
    ["reuters.com", { score: 98, bias: "center", factual: "very-high", tier: 1 }],
    ["apnews.com", { score: 97, bias: "center", factual: "very-high", tier: 1 }],
    ["bbc.com", { score: 94, bias: "center", factual: "very-high", tier: 1 }],
    ["npr.org", { score: 92, bias: "center", factual: "very-high", tier: 1 }],
    ["pbs.org", { score: 91, bias: "center", factual: "very-high", tier: 1 }],

    // Tier 2: High Reliability (80-89)
    ["cnn.com", { score: 83, bias: "left", factual: "high", tier: 2 }],
    ["foxnews.com", { score: 65, bias: "right", factual: "mixed", tier: 3 }],
    ["wsj.com", { score: 87, bias: "center", factual: "high", tier: 2 }],
    ["nytimes.com", { score: 85, bias: "left", factual: "high", tier: 2 }],
    ["washingtonpost.com", { score: 84, bias: "left", factual: "high", tier: 2 }],

    // Tier 3: Moderate Reliability (60-79)
    ["usatoday.com", { score: 78, bias: "center", factual: "high", tier: 3 }],
    ["cbsnews.com", { score: 76, bias: "center", factual: "high", tier: 3 }],
    ["abcnews.go.com", { score: 75, bias: "center", factual: "high", tier: 3 }],

    // Scientific/Academic Sources
    ["nature.com", { score: 99, bias: "center", factual: "very-high", tier: 1 }],
    ["science.org", { score: 98, bias: "center", factual: "very-high", tier: 1 }],
    ["nejm.org", { score: 97, bias: "center", factual: "very-high", tier: 1 }],

    // Government Sources
    ["cdc.gov", { score: 96, bias: "center", factual: "very-high", tier: 1 }],
    ["who.int", { score: 95, bias: "center", factual: "very-high", tier: 1 }],
    ["nasa.gov", { score: 97, bias: "center", factual: "very-high", tier: 1 }],
  ])

  private static suspiciousDomains = new Map([
    // Known Misinformation Sites
    ["naturalnews.com", { score: 15, reason: "Promotes pseudoscience and conspiracy theories" }],
    ["infowars.com", { score: 10, reason: "Known for spreading conspiracy theories and misinformation" }],
    ["breitbart.com", { score: 35, reason: "Mixed factual reporting with strong bias" }],
    ["beforeitsnews.com", { score: 20, reason: "User-generated content with no editorial oversight" }],
    ["worldnewsdailyreport.com", { score: 5, reason: "Satirical fake news site" }],
    ["theonion.com", { score: 100, reason: "Legitimate satirical news (clearly labeled)" }],
    ["clickhole.com", { score: 95, reason: "Legitimate satirical content" }],

    // Questionable Sources
    ["dailymail.co.uk", { score: 45, reason: "Sensationalized reporting, mixed factual accuracy" }],
    ["rt.com", { score: 30, reason: "State-controlled media with propaganda concerns" }],
    ["sputniknews.com", { score: 25, reason: "State-controlled media with bias issues" }],
  ])

  private static blacklistedDomains = [
    "fake-news-generator.com",
    "totally-real-news.net",
    "conspiracy-central.org",
    "miracle-cures-daily.com",
    "political-rage-bait.info",
  ]

  static async checkSourceReliability(url: string): Promise<SourceReliability> {
    try {
      const domain = new URL(url).hostname.replace("www.", "")

      // Check if blacklisted
      if (this.blacklistedDomains.includes(domain)) {
        return this.createBlacklistedResult(domain)
      }

      // Check known domains
      const domainInfo = this.reliableDomains.get(domain)
      const suspiciousInfo = this.suspiciousDomains.get(domain)

      if (domainInfo) {
        return this.createReliableSourceResult(domain, domainInfo)
      }

      if (suspiciousInfo) {
        return this.createSuspiciousSourceResult(domain, suspiciousInfo)
      }

      // Analyze unknown domain
      return await this.analyzeUnknownDomain(domain, url)
    } catch (error) {
      return this.createInvalidUrlResult()
    }
  }

  private static createBlacklistedResult(domain: string): SourceReliability {
    return {
      domain,
      reliability_score: 0,
      bias_rating: "unknown",
      factual_reporting: "very-low",
      notes: ["Domain is blacklisted for spreading misinformation", "Avoid this source entirely"],
      metadata: {
        domain_age: 0,
        ssl_certificate: false,
        social_media_presence: false,
        editorial_transparency: false,
        correction_policy: false,
        funding_transparency: false,
      },
      risk_factors: ["Blacklisted domain", "Known misinformation source", "No editorial standards"],
      trust_indicators: [],
    }
  }

  private static createReliableSourceResult(domain: string, info: any): SourceReliability {
    const trustIndicators = []
    const riskFactors = []

    if (info.tier === 1) {
      trustIndicators.push("Top-tier journalism", "Strong editorial standards", "Fact-checking protocols")
    } else if (info.tier === 2) {
      trustIndicators.push("Established newsroom", "Professional journalism", "Editorial oversight")
    }

    if (info.bias !== "center") {
      riskFactors.push(`${info.bias.charAt(0).toUpperCase() + info.bias.slice(1)} political bias`)
    }

    return {
      domain,
      reliability_score: info.score,
      bias_rating: info.bias,
      factual_reporting: info.factual,
      notes: this.generateNotes(domain, info.score, info.tier),
      metadata: {
        domain_age: this.estimateDomainAge(domain),
        ssl_certificate: true,
        social_media_presence: true,
        editorial_transparency: info.tier <= 2,
        correction_policy: info.tier <= 2,
        funding_transparency: info.tier <= 2,
      },
      risk_factors: riskFactors,
      trust_indicators: trustIndicators,
    }
  }

  private static createSuspiciousSourceResult(domain: string, info: any): SourceReliability {
    return {
      domain,
      reliability_score: info.score,
      bias_rating: "unknown",
      factual_reporting: info.score > 40 ? "mixed" : "low",
      notes: [info.reason, "Verify claims independently", "Consider alternative sources"],
      metadata: {
        domain_age: this.estimateDomainAge(domain),
        ssl_certificate: info.score > 30,
        social_media_presence: info.score > 20,
        editorial_transparency: false,
        correction_policy: false,
        funding_transparency: false,
      },
      risk_factors: ["Questionable editorial standards", "Potential bias", "Mixed factual accuracy"],
      trust_indicators: info.score > 40 ? ["Some legitimate content"] : [],
    }
  }

  private static async analyzeUnknownDomain(domain: string, url: string): Promise<SourceReliability> {
    // Simulate domain analysis
    const analysis = await this.performDomainAnalysis(domain, url)
    const score = this.calculateUnknownDomainScore(analysis)

    const riskFactors = []
    const trustIndicators = []

    if (!analysis.technical_analysis.ssl_valid) {
      riskFactors.push("No valid SSL certificate")
    }

    if (!analysis.content_analysis.has_about_page) {
      riskFactors.push("Missing about page")
    }

    if (!analysis.content_analysis.has_contact_info) {
      riskFactors.push("No contact information")
    }

    if (analysis.content_analysis.editorial_standards) {
      trustIndicators.push("Editorial standards present")
    }

    if (analysis.technical_analysis.security_headers) {
      trustIndicators.push("Good security practices")
    }

    return {
      domain,
      reliability_score: score,
      bias_rating: "unknown",
      factual_reporting: score > 70 ? "mixed" : score > 40 ? "low" : "very-low",
      notes: [
        "Unknown source - limited information available",
        "Verify claims through multiple sources",
        `Domain analysis score: ${score}/100`,
      ],
      metadata: {
        domain_age: this.parseDomainAge(analysis.whois_data.creation_date),
        ssl_certificate: analysis.technical_analysis.ssl_valid,
        social_media_presence: Math.random() > 0.5, // Simulated
        editorial_transparency: analysis.content_analysis.editorial_standards,
        correction_policy: analysis.content_analysis.has_about_page,
        funding_transparency: false,
      },
      risk_factors: riskFactors,
      trust_indicators: trustIndicators,
    }
  }

  private static createInvalidUrlResult(): SourceReliability {
    return {
      domain: "Invalid URL",
      reliability_score: 0,
      bias_rating: "unknown",
      factual_reporting: "very-low",
      notes: ["Invalid or malformed URL", "Cannot assess reliability"],
      metadata: {
        domain_age: 0,
        ssl_certificate: false,
        social_media_presence: false,
        editorial_transparency: false,
        correction_policy: false,
        funding_transparency: false,
      },
      risk_factors: ["Invalid URL format"],
      trust_indicators: [],
    }
  }

  private static async performDomainAnalysis(domain: string, url: string): Promise<DomainAnalysis> {
    // Simulate comprehensive domain analysis
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      whois_data: {
        creation_date: this.generateRandomDate(),
        registrar: "Random Registrar Inc.",
        country: "US",
      },
      technical_analysis: {
        ssl_valid: Math.random() > 0.2,
        security_headers: Math.random() > 0.4,
        mobile_friendly: Math.random() > 0.3,
        page_speed: Math.floor(Math.random() * 100),
      },
      content_analysis: {
        has_about_page: Math.random() > 0.3,
        has_contact_info: Math.random() > 0.4,
        has_privacy_policy: Math.random() > 0.5,
        editorial_standards: Math.random() > 0.6,
      },
    }
  }

  private static calculateUnknownDomainScore(analysis: DomainAnalysis): number {
    let score = 50 // Base score for unknown domains

    // Technical factors
    if (analysis.technical_analysis.ssl_valid) score += 10
    if (analysis.technical_analysis.security_headers) score += 5
    if (analysis.technical_analysis.mobile_friendly) score += 3
    if (analysis.technical_analysis.page_speed > 70) score += 5

    // Content factors
    if (analysis.content_analysis.has_about_page) score += 8
    if (analysis.content_analysis.has_contact_info) score += 7
    if (analysis.content_analysis.has_privacy_policy) score += 5
    if (analysis.content_analysis.editorial_standards) score += 12

    // Domain age factor
    const domainAge = this.parseDomainAge(analysis.whois_data.creation_date)
    if (domainAge > 5) score += 8
    else if (domainAge > 2) score += 4
    else if (domainAge < 0.5) score -= 10 // Very new domains are suspicious

    return Math.min(Math.max(score, 0), 100)
  }

  private static generateNotes(domain: string, score: number, tier?: number): string[] {
    const notes = []

    if (tier === 1) {
      notes.push("Tier 1: Highest reliability and editorial standards")
      notes.push("Minimal bias, strong fact-checking protocols")
    } else if (tier === 2) {
      notes.push("Tier 2: High reliability with professional journalism")
      notes.push("Generally trustworthy with some potential bias")
    } else if (tier === 3) {
      notes.push("Tier 3: Moderate reliability")
      notes.push("Cross-reference important claims")
    }

    if (score >= 90) {
      notes.push("Excellent source for factual information")
    } else if (score >= 70) {
      notes.push("Generally reliable source")
    } else if (score >= 50) {
      notes.push("Mixed reliability - verify claims")
    } else {
      notes.push("Low reliability - use with caution")
    }

    return notes
  }

  private static estimateDomainAge(domain: string): number {
    // Simulate domain age based on known information
    const establishedDomains = {
      "reuters.com": 25,
      "bbc.com": 28,
      "cnn.com": 26,
      "nytimes.com": 27,
    }

    return establishedDomains[domain as keyof typeof establishedDomains] || Math.floor(Math.random() * 15) + 1
  }

  private static parseDomainAge(creationDate: string): number {
    const created = new Date(creationDate)
    const now = new Date()
    return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365)
  }

  private static generateRandomDate(): string {
    const start = new Date(2000, 0, 1)
    const end = new Date()
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split("T")[0]
  }

  static extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/g
    return text.match(urlRegex) || []
  }

  static async performBulkSourceCheck(urls: string[]): Promise<SourceReliability[]> {
    const results = []
    for (const url of urls) {
      const result = await this.checkSourceReliability(url)
      results.push(result)
    }
    return results
  }

  static calculateOverallSourceCredibility(sources: SourceReliability[]): {
    average_score: number
    high_reliability_count: number
    medium_reliability_count: number
    low_reliability_count: number
    risk_assessment: "low" | "medium" | "high"
  } {
    if (sources.length === 0) {
      return {
        average_score: 0,
        high_reliability_count: 0,
        medium_reliability_count: 0,
        low_reliability_count: 0,
        risk_assessment: "high",
      }
    }

    const averageScore = sources.reduce((sum, source) => sum + source.reliability_score, 0) / sources.length

    const highReliability = sources.filter((s) => s.reliability_score >= 80).length
    const mediumReliability = sources.filter((s) => s.reliability_score >= 50 && s.reliability_score < 80).length
    const lowReliability = sources.filter((s) => s.reliability_score < 50).length

    let riskAssessment: "low" | "medium" | "high" = "medium"
    if (averageScore >= 80 && lowReliability === 0) {
      riskAssessment = "low"
    } else if (averageScore < 50 || lowReliability > sources.length / 2) {
      riskAssessment = "high"
    }

    return {
      average_score: Math.round(averageScore),
      high_reliability_count: highReliability,
      medium_reliability_count: mediumReliability,
      low_reliability_count: lowReliability,
      risk_assessment: riskAssessment,
    }
  }
}

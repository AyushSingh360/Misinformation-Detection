"use client"

interface ContentAnalysisResult {
  tone: "neutral" | "sensational" | "manipulative"
  clickbait_score: number
  entities: Array<{
    text: string
    type: "PERSON" | "ORG" | "GPE" | "DATE" | "MONEY"
    confidence: number
  }>
  suspicious_patterns: string[]
}

export class ContentAnalyzer {
  static analyzeText(text: string): ContentAnalysisResult {
    // Simulate NLP analysis
    const words = text.toLowerCase().split(/\s+/)

    // Detect sensational language
    const sensationalWords = ["shocking", "unbelievable", "breaking", "exclusive", "urgent", "must see"]
    const sensationalCount = words.filter((word) => sensationalWords.includes(word)).length

    // Detect clickbait patterns
    const clickbaitPatterns = [/you won't believe/i, /doctors hate/i, /this one trick/i, /number \d+ will shock you/i]
    const clickbaitScore = clickbaitPatterns.reduce((score, pattern) => {
      return score + (pattern.test(text) ? 25 : 0)
    }, 0)

    // Extract entities (simplified)
    const entities = this.extractEntities(text)

    // Detect suspicious patterns
    const suspicious_patterns = []
    if (sensationalCount > 3) suspicious_patterns.push("High use of sensational language")
    if (clickbaitScore > 50) suspicious_patterns.push("Clickbait patterns detected")
    if (text.includes("!!!")) suspicious_patterns.push("Excessive punctuation")

    return {
      tone: sensationalCount > 2 ? "sensational" : "neutral",
      clickbait_score: Math.min(clickbaitScore, 100),
      entities,
      suspicious_patterns,
    }
  }

  private static extractEntities(text: string): ContentAnalysisResult["entities"] {
    // Simplified entity extraction
    const entities: ContentAnalysisResult["entities"] = []

    // Extract years (dates)
    const yearMatches = text.match(/\b(19|20)\d{2}\b/g)
    if (yearMatches) {
      yearMatches.forEach((year) => {
        entities.push({
          text: year,
          type: "DATE",
          confidence: 0.9,
        })
      })
    }

    // Extract organizations (simplified)
    const orgPatterns = ["NASA", "WHO", "CDC", "FBI", "CIA", "UN", "EU"]
    orgPatterns.forEach((org) => {
      if (text.includes(org)) {
        entities.push({
          text: org,
          type: "ORG",
          confidence: 0.95,
        })
      }
    })

    return entities
  }
}

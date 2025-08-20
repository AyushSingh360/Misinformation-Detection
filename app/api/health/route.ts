import { NextResponse } from "next/server"

export async function GET() {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      content_analyzer: "operational",
      fact_verifier: "operational",
      source_checker: "operational",
      credibility_scorer: "operational",
    },
    uptime: process.uptime(),
    memory_usage: process.memoryUsage(),
  }

  return NextResponse.json(healthCheck)
}

"use client"

import { TrendingUp, Clock, Eye, BarChart3, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { SearchBar } from "@/shared/components/search-bar"
import { TrendingSearches } from "@/shared/components/trending-searches"
import { AnalyticsChart } from "@/shared/components/analytics-chart"
import { RecentQueries } from "@/shared/components/recent-queries"
import { Header } from "@/shared/components/header"
import AnimatedParticlesBg from "@/shared/components/animated-bg"
import { useState } from "react"

interface KeywordResult {
  keyword: string
  estimated_volume: number
  difficulty: number
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<KeywordResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:8000/keywords/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seed: query, limit: 10 }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch results")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen">
      <Header />

      {/* Main Hero Section */}
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-400">Advanced Search Analytics</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Search Intelligence Dashboard
            </h1>
            <p className="text-lg text-cyan-1200 max-w-2xl mx-auto">
              Real-time insights into search trends, user behavior, and query performance metrics
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Search Results Section */}
      {(isLoading || searchResults.length > 0 || error) && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                {isLoading ? "Searching..." : "Keyword Suggestions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              )}

              {error && (
                <div className="text-red-400 py-4">
                  Error: {error}
                </div>
              )}

              {!isLoading && !error && searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{result.keyword}</h3>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-muted-foreground text-xs">Volume</div>
                          <div className="text-cyan-400 font-semibold">
                            {result.estimated_volume.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground text-xs">Difficulty</div>
                          <div className={`font-semibold ${result.difficulty < 30 ? 'text-green-400' :
                            result.difficulty < 60 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                            {result.difficulty}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && !error && searchResults.length === 0 && (
                <div className="text-muted-foreground py-4 text-center">
                  No results yet. Try searching for a keyword above.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Key Metrics */}
          <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Total Impressions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2.4M</div>
              <p className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">142ms</div>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                -8.2% improvement
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                CTR Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">4.8%</div>
              <p className="text-xs text-orange-400 mt-2">Stable performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart />
          <TrendingSearches />
        </div>

        {/* Recent Queries */}
        <RecentQueries />
      </div>
    </div>
  )
}

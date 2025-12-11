"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { TrendingUp, Activity } from "lucide-react"

const trendingTopics = [
  { rank: 1, query: "AI and machine learning", volume: "2.3M", trend: "+45%", change: "up" },
  { rank: 2, query: "Web development 2024", volume: "1.8M", trend: "+28%", change: "up" },
  { rank: 3, query: "Cloud computing", volume: "1.6M", trend: "+12%", change: "up" },
  { rank: 4, query: "Cybersecurity basics", volume: "1.2M", trend: "+8%", change: "up" },
  { rank: 5, query: "React tutorials", volume: "980K", trend: "-2%", change: "down" },
]

export function TrendingSearches() {
  return (
    <Card className="bg-slate-900 border-slate-800 col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Trending Topics
          </CardTitle>
          <Activity className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingTopics.map((topic) => (
            <div
              key={topic.rank}
              className="flex items-start justify-between pb-3 border-b border-slate-800 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-cyan-400 w-6">#{topic.rank}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{topic.query}</p>
                    <p className="text-xs text-muted-foreground">{topic.volume} searches</p>
                  </div>
                </div>
              </div>
              <span className={`text-xs font-semibold ${topic.change === "up" ? "text-green-400" : "text-orange-400"}`}>
                {topic.trend}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

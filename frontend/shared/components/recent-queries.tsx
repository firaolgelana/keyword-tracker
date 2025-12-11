"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Clock, MapPin } from "lucide-react"

const recentQueries = [
  { id: 1, query: "How to learn React", location: "United States", time: "2 min ago", results: "12.4M" },
  { id: 2, query: "Next.js 15 features", location: "United Kingdom", time: "5 min ago", results: "890K" },
  { id: 3, query: "TypeScript best practices", location: "Canada", time: "8 min ago", results: "2.1M" },
  { id: 4, query: "Web performance optimization", location: "Germany", time: "12 min ago", results: "5.3M" },
  { id: 5, query: "Database design patterns", location: "Australia", time: "15 min ago", results: "1.7M" },
]

export function RecentQueries() {
  return (
    <Card className="bg-slate-900 border-slate-800 col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Queries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Query</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Results</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentQueries.map((query) => (
                <tr key={query.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 text-foreground font-medium">{query.query}</td>
                  <td className="py-4 px-4 text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400/60" />
                    {query.location}
                  </td>
                  <td className="py-4 px-4 text-foreground">{query.results}</td>
                  <td className="py-4 px-4 text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400/60" />
                    {query.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

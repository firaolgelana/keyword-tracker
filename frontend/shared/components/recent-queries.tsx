"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface RecentQuery {
  id: number
  query: string
  location: string
  time: string
  results: string
}

export function RecentQueries() {
  const [queries, setQueries] = useState<RecentQuery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchQueries = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/queries/recent")
      if (res.ok) {
        const data = await res.json()
        setQueries(data)
      }
    } catch (e) {
      console.error("Failed to fetch recent queries", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueries()

    // Poll every 30s to keep it fresh
    const interval = setInterval(fetchQueries, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-900 border-slate-800 col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Queries</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No recent searches yet.</div>
        ) : (
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
                {queries.map((query) => (
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
        )}
      </CardContent>
    </Card>
  )
}

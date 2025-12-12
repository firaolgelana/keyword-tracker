"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Header } from "@/shared/components/header"
import { TrendingUp, Plus, Eye, Calendar } from "lucide-react"
import Link from "next/link"

interface TrackedKeyword {
    id: number
    domain: string
    keyword: string
    frequency: string
    created_at: string
}

export default function RankTrackerPage() {
    const [trackings, setTrackings] = useState<TrackedKeyword[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [domain, setDomain] = useState("")
    const [keyword, setKeyword] = useState("")
    const [frequency, setFrequency] = useState("daily")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchTrackings()
    }, [])

    const fetchTrackings = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("http://127.0.0.1:8000/rank/list")
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setTrackings(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch trackings")
            console.error("Fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!domain.trim() || !keyword.trim()) {
            setError("Domain and keyword are required")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch("http://127.0.0.1:8000/rank/track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ domain, keyword, frequency }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Clear form
            setDomain("")
            setKeyword("")
            setFrequency("daily")

            // Refresh list
            await fetchTrackings()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add tracking")
            console.error("Submit error:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <TrendingUp className="w-8 h-8 text-cyan-400" />
                        Rank Tracker
                    </h1>
                    <p className="text-muted-foreground">
                        Track your keyword rankings over time and monitor your SEO performance
                    </p>
                </div>

                {/* Add Tracking Form */}
                <Card className="bg-slate-900 border-slate-800 mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add New Keyword to Track
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">
                                        Domain
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="example.com"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">
                                        Keyword
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="seo tools"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">
                                        Frequency
                                    </label>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-foreground"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                            >
                                {isSubmitting ? "Adding..." : "Add Tracking"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {/* Tracked Keywords List */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground">
                            Tracked Keywords
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            </div>
                        ) : trackings.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No keywords tracked yet. Add your first keyword above to get started!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {trackings.map((tracking) => (
                                    <div
                                        key={tracking.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground text-lg">
                                                {tracking.keyword}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span>🌐 {tracking.domain}</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {tracking.frequency}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/rank-tracker/${tracking.id}`}>
                                            <Button
                                                variant="outline"
                                                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View History
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

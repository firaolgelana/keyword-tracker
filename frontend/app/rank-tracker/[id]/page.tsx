"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Header } from "@/shared/components/header"
import { ArrowLeft, TrendingUp, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import AnimatedParticlesBg from "@/shared/components/animated-bg"
import Link from "next/link"

interface RankHistory {
    position: number | null
    checked_at: string
    serp_snapshot: string | null
}

interface TrackingInfo {
    id: number
    domain: string
    keyword: string
    frequency: string
}

export default function RankHistoryPage() {
    const params = useParams()
    const router = useRouter()
    const trackingId = params.id as string

    const [history, setHistory] = useState<RankHistory[]>([])
    const [tracking, setTracking] = useState<TrackingInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchHistory()
    }, [trackingId])

    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`http://127.0.0.1:8000/rank/history/${trackingId}`)

            if (response.status === 404) {
                setError("Tracking not found")
                setIsLoading(false)
                return
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setHistory(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch history")
            console.error("Fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    // Prepare chart data
    const chartData = history
        .slice()
        .reverse()
        .map((h) => ({
            date: new Date(h.checked_at).toLocaleDateString(),
            position: h.position || 100, // Show 100 if not ranked
            ranked: h.position !== null,
        }))

    // Calculate stats
    const latestPosition = history.length > 0 ? history[0].position : null
    const previousPosition = history.length > 1 ? history[1].position : null
    const positionChange = latestPosition && previousPosition
        ? previousPosition - latestPosition
        : null

    return (
        <div className="min-h-screen">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/rank-tracker">
                    <Button
                        variant="outline"
                        className="mb-6 border-slate-700 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tracker
                    </Button>
                </Link>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                    </div>
                ) : history.length === 0 ? (
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="py-16 text-center">
                            <p className="text-muted-foreground text-lg">
                                No rank history available yet. Check back after the first tracking run.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Current Position
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {latestPosition ? `#${latestPosition}` : "Not Ranked"}
                                    </div>
                                    {positionChange !== null && (
                                        <p className={`text-xs mt-2 flex items-center gap-1 ${positionChange > 0 ? 'text-green-400' : positionChange < 0 ? 'text-red-400' : 'text-muted-foreground'
                                            }`}>
                                            <TrendingUp className={`w-3 h-3 ${positionChange < 0 ? 'rotate-180' : ''}`} />
                                            {positionChange > 0 ? '+' : ''}{positionChange} from last check
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Best Position
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {Math.min(...history.filter(h => h.position !== null).map(h => h.position!))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">All-time best</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Total Checks
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {history.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Historical data points</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart */}
                        <Card className="bg-slate-900 border-slate-800 mb-8">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-foreground">
                                    Rank Position Over Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            reversed
                                            domain={[1, 100]}
                                            stroke="#94a3b8"
                                            style={{ fontSize: '12px' }}
                                            label={{ value: 'Position', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8' } }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px'
                                            }}
                                            labelStyle={{ color: '#e2e8f0' }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="position"
                                            stroke="#06b6d4"
                                            strokeWidth={2}
                                            dot={{ fill: '#06b6d4', r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Rank Position"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* History Table */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-foreground">
                                    History Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {history.map((h, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`text-2xl font-bold ${h.position
                                                    ? h.position <= 10
                                                        ? 'text-green-400'
                                                        : h.position <= 30
                                                            ? 'text-yellow-400'
                                                            : 'text-orange-400'
                                                    : 'text-red-400'
                                                    }`}>
                                                    {h.position ? `#${h.position}` : "—"}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(h.checked_at).toLocaleString()}
                                                    </div>
                                                    {!h.position && (
                                                        <div className="text-xs text-red-400 mt-1">
                                                            Not ranked in top 100
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {index > 0 && history[index - 1].position && h.position && (
                                                <div className={`text-sm font-medium ${history[index - 1].position! - h.position > 0
                                                    ? 'text-green-400'
                                                    : history[index - 1].position! - h.position < 0
                                                        ? 'text-red-400'
                                                        : 'text-muted-foreground'
                                                    }`}>
                                                    {history[index - 1].position! - h.position > 0 ? '+' : ''}
                                                    {history[index - 1].position! - h.position}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}

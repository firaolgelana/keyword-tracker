"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Header } from "@/shared/components/header"
import AnimatedParticlesBg from "@/shared/components/animated-bg"
import { TrendingUp, Plus, Eye, Calendar, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"

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

    // Edit/Delete state
    const [editingTracking, setEditingTracking] = useState<TrackedKeyword | null>(null)
    const [editDomain, setEditDomain] = useState("")
    const [editKeyword, setEditKeyword] = useState("")
    const [editFrequency, setEditFrequency] = useState("daily")
    const [isUpdating, setIsUpdating] = useState(false)

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
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this tracked keyword?")) return

        try {
            const response = await fetch(`http://127.0.0.1:8000/rank/track/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Remove from list
            setTrackings(trackings.filter((t) => t.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete tracking")
            console.error("Delete error:", err)
        }
    }

    const startEditing = (tracking: TrackedKeyword) => {
        setEditingTracking(tracking)
        setEditDomain(tracking.domain)
        setEditKeyword(tracking.keyword)
        setEditFrequency(tracking.frequency)
    }

    const handleUpdate = async () => {
        if (!editingTracking) return
        if (!editDomain.trim() || !editKeyword.trim()) return

        setIsUpdating(true)
        try {
            const response = await fetch(`http://127.0.0.1:8000/rank/track/${editingTracking.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    domain: editDomain,
                    keyword: editKeyword,
                    frequency: editFrequency,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const updated = await response.json()

            // Update list
            setTrackings(trackings.map((t) => (t.id === updated.id ? updated : t)))
            setEditingTracking(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update tracking")
            console.error("Update error:", err)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="min-h-screen">
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
                                        <option value="minutely">Minutely</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
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
                                        <div className="flex items-center gap-2">
                                            <Link href={`/rank-tracker/${tracking.id}`}>
                                                <Button
                                                    variant="outline"
                                                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View History
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-white"
                                                onClick={() => startEditing(tracking)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-red-400"
                                                onClick={() => handleDelete(tracking.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingTracking} onOpenChange={(open) => !open && setEditingTracking(null)}>
                <DialogContent className="bg-slate-900 border-slate-800 text-foreground">
                    <DialogHeader>
                        <DialogTitle>Edit Tracking</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-domain" className="text-right">
                                Domain
                            </Label>
                            <Input
                                id="edit-domain"
                                value={editDomain}
                                onChange={(e) => setEditDomain(e.target.value)}
                                className="col-span-3 bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-keyword" className="text-right">
                                Keyword
                            </Label>
                            <Input
                                id="edit-keyword"
                                value={editKeyword}
                                onChange={(e) => setEditKeyword(e.target.value)}
                                className="col-span-3 bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-freq" className="text-right">
                                Frequency
                            </Label>
                            <select
                                id="edit-freq"
                                value={editFrequency}
                                onChange={(e) => setEditFrequency(e.target.value)}
                                className="col-span-3 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-foreground"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="hourly">Hourly</option>
                                <option value="minutely">Minutely</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTracking(null)} className="border-slate-700 text-foreground hover:bg-slate-800">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

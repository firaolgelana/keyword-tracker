"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "12 AM", searches: 240 },
  { time: "2 AM", searches: 190 },
  { time: "4 AM", searches: 280 },
  { time: "6 AM", searches: 390 },
  { time: "8 AM", searches: 580 },
  { time: "10 AM", searches: 720 },
  { time: "12 PM", searches: 890 },
  { time: "2 PM", searches: 1020 },
  { time: "4 PM", searches: 1250 },
  { time: "6 PM", searches: 1100 },
  { time: "8 PM", searches: 950 },
  { time: "10 PM", searches: 720 },
]

export function AnalyticsChart() {
  return (
    <Card className="bg-slate-900 border-slate-800 col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Search Volume</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="searches"
              stroke="#06b6d4"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

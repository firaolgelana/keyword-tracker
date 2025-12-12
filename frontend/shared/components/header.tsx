import { Search, Settings, Bell, TrendingUp, Home } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-lg">SearchHub</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/rank-tracker">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Rank Tracker
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

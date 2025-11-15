"use client"

import { Activity } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hospital Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time Ambulance Vital Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800 dark:text-green-100">System Active</span>
        </div>
      </div>
    </header>
  )
}

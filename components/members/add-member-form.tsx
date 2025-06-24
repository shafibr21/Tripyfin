"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AddMemberFormProps {
  newMemberName: string
  setNewMemberName: (name: string) => void
  onAddMember: () => void
  loading?: boolean
}

export function AddMemberForm({ newMemberName, setNewMemberName, onAddMember, loading }: AddMemberFormProps) {
  const [error, setError] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMemberName.trim()) {
      setError("Member name is required")
      return
    }

    if (newMemberName.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    setError(undefined)
    onAddMember()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Member name"
            value={newMemberName}
            onChange={(e) => {
              setNewMemberName(e.target.value)
              if (error) setError(undefined)
            }}
            className={error ? "border-red-500" : ""}
            disabled={loading}
          />
        </div>
        <Button type="submit" size="sm" disabled={!newMemberName.trim() || loading}>
          {loading ? <LoadingSpinner size="sm" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  )
}

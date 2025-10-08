"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Shield } from "lucide-react"

interface GateInterfaceProps {
  status: "closed" | "opening" | "open" | "closing"
  accessStatus: "idle" | "scanning" | "authorized" | "denied"
  currentUser: string | null
}

export function GateInterface({ status, accessStatus, currentUser }: GateInterfaceProps) {
  const [animationClass, setAnimationClass] = useState("")

  useEffect(() => {
    if (status === "opening") {
      setAnimationClass("gate-open")
    } else if (status === "closing") {
      setAnimationClass("gate-close")
    } else {
      setAnimationClass("")
    }
  }, [status])

  const getStatusColor = () => {
    switch (accessStatus) {
      case "authorized":
        return "bg-success text-success-foreground"
      case "denied":
        return "bg-destructive text-destructive-foreground"
      case "scanning":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = () => {
    switch (accessStatus) {
      case "authorized":
        return <CheckCircle className="h-4 w-4" />
      case "denied":
        return <XCircle className="h-4 w-4" />
      case "scanning":
        return <Clock className="h-4 w-4 animate-spin" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getStatusText = () => {
    switch (accessStatus) {
      case "authorized":
        return "Accès Autorisé"
      case "denied":
        return "Accès Refusé"
      case "scanning":
        return "Reconnaissance en cours..."
      default:
        return "En attente"
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex justify-center">
        <Badge className={`px-4 py-2 text-sm font-medium ${getStatusColor()}`}>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </div>
        </Badge>
      </div>

      {/* Gate Visualization */}
      <div className="relative mx-auto w-80 h-60 bg-gradient-to-b from-muted/50 to-muted border-2 border-border rounded-lg overflow-hidden">
        {/* Gate Frame */}
        <div className="absolute inset-x-4 top-4 bottom-4 border-2 border-muted-foreground/30 rounded">
          {/* Gate Barrier */}
          <div
            className={`absolute inset-x-0 top-0 h-8 bg-gradient-to-r from-primary via-primary to-primary/80 border-b-2 border-primary-foreground/20 ${animationClass}`}
            style={{
              transform: status === "open" ? "translateY(-100%)" : "translateY(0)",
              transition: animationClass ? "none" : "transform 0.3s ease-in-out",
            }}
          >
            {/* Barrier Pattern */}
            <div className="absolute inset-0 bg-repeating-linear-gradient-45 from-primary-foreground/10 via-transparent to-primary-foreground/10 bg-[length:20px_20px]" />
          </div>

          {/* Sensors */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full animate-pulse" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full animate-pulse" />
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-muted-foreground/20 to-transparent" />

        {/* Access Indicator */}
        {accessStatus !== "idle" && (
          <div
            className={`absolute inset-0 ${
              accessStatus === "authorized" ? "pulse-success" : accessStatus === "denied" ? "pulse-error" : ""
            }`}
          />
        )}
      </div>

      {/* Current User Info */}
      {currentUser && accessStatus === "authorized" && (
        <Card className="p-4 bg-success/10 border-success/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-success">Bienvenue</p>
              <p className="text-sm text-success/80">{currentUser}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Gate Status */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">État de la barrière</p>
        <p className="font-medium capitalize">
          {status === "closed" && "Fermée"}
          {status === "opening" && "Ouverture..."}
          {status === "open" && "Ouverte"}
          {status === "closing" && "Fermeture..."}
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings, History, Scan, Camera } from "lucide-react"
import { GateInterface } from "@/components/gate-interface"
import { RecognitionPanel } from "@/components/recognition-panel"
import { AdminPanel } from "@/components/admin-panel"
import { AccessHistory } from "@/components/access-history"

export default function SmartGatePage() {
  const [gateStatus, setGateStatus] = useState<"closed" | "opening" | "open" | "closing">("closed")
  const [accessStatus, setAccessStatus] = useState<"idle" | "scanning" | "authorized" | "denied">("idle")
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">SmartGate Pro</h1>
                <p className="text-sm text-muted-foreground">Système de Contrôle d'Accès Intelligent</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
              Système Actif
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="control" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Contrôle
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Administration
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gate Interface */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    État de la Barrière
                  </CardTitle>
                  <CardDescription>Visualisation en temps réel du système d'accès</CardDescription>
                </CardHeader>
                <CardContent>
                  <GateInterface status={gateStatus} accessStatus={accessStatus} currentUser={currentUser} />
                </CardContent>
              </Card>

              {/* Recognition Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Reconnaissance IA
                  </CardTitle>
                  <CardDescription>Système de reconnaissance faciale et de plaques</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecognitionPanel
                    onStatusChange={setAccessStatus}
                    onGateStatusChange={setGateStatus}
                    onUserDetected={setCurrentUser}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel />
          </TabsContent>

          <TabsContent value="history">
            <AccessHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

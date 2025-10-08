"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Car,
  TrendingUp,
  Activity,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AccessEvent {
  id: string
  timestamp: string
  type: "person" | "vehicle"
  name: string
  result: "authorized" | "denied" | "error"
  confidence?: number
  duration?: number
  image?: string
  notes?: string
}

// Simulated access history data
const generateAccessHistory = (): AccessEvent[] => {
  const events: AccessEvent[] = []
  const names = {
    person: ["Jean Dupont", "Marie Martin", "Pierre Durand", "Sophie Leroy", "Utilisateur Inconnu"],
    vehicle: ["ABC-123-XY", "DEF-456-ZW", "GHI-789-AB", "JKL-012-CD", "Plaque Illisible"],
  }

  for (let i = 0; i < 50; i++) {
    const type = Math.random() > 0.6 ? "person" : "vehicle"
    const isAuthorized = Math.random() > 0.2
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24))
    date.setMinutes(Math.floor(Math.random() * 60))

    events.push({
      id: `event-${i}`,
      timestamp: date.toISOString(),
      type,
      name: names[type][Math.floor(Math.random() * names[type].length)],
      result: isAuthorized ? "authorized" : Math.random() > 0.8 ? "error" : "denied",
      confidence: isAuthorized ? 85 + Math.floor(Math.random() * 15) : 45 + Math.floor(Math.random() * 30),
      duration: isAuthorized ? 3 + Math.floor(Math.random() * 7) : undefined,
      image: type === "person" ? "/professional-man.jpg" : "/generic-license-plate.png",
    })
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function AccessHistory() {
  const [accessHistory] = useState<AccessEvent[]>(generateAccessHistory())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "person" | "vehicle">("all")
  const [filterResult, setFilterResult] = useState<"all" | "authorized" | "denied" | "error">("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const filteredHistory = useMemo(() => {
    return accessHistory.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || event.type === filterType
      const matchesResult = filterResult === "all" || event.result === filterResult
      const matchesDate =
        !dateRange.from ||
        !dateRange.to ||
        (new Date(event.timestamp) >= dateRange.from && new Date(event.timestamp) <= dateRange.to)

      return matchesSearch && matchesType && matchesResult && matchesDate
    })
  }, [accessHistory, searchTerm, filterType, filterResult, dateRange])

  // Analytics data
  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { authorized: number; denied: number; error: number } } = {}

    accessHistory.forEach((event) => {
      const date = format(new Date(event.timestamp), "yyyy-MM-dd")
      if (!stats[date]) {
        stats[date] = { authorized: 0, denied: 0, error: 0 }
      }
      stats[date][event.result]++
    })

    return Object.entries(stats)
      .slice(-7)
      .map(([date, data]) => ({
        date: format(new Date(date), "dd/MM", { locale: fr }),
        ...data,
        total: data.authorized + data.denied + data.error,
      }))
  }, [accessHistory])

  const typeStats = useMemo(() => {
    const stats = { person: 0, vehicle: 0 }
    accessHistory.forEach((event) => {
      stats[event.type]++
    })
    return [
      { name: "Personnes", value: stats.person, color: "#3b82f6" },
      { name: "Véhicules", value: stats.vehicle, color: "#06b6d4" },
    ]
  }, [accessHistory])

  const resultStats = useMemo(() => {
    const stats = { authorized: 0, denied: 0, error: 0 }
    accessHistory.forEach((event) => {
      stats[event.result]++
    })
    return [
      { name: "Autorisés", value: stats.authorized, color: "#10b981" },
      { name: "Refusés", value: stats.denied, color: "#ef4444" },
      { name: "Erreurs", value: stats.error, color: "#f59e0b" },
    ]
  }, [accessHistory])

  const getResultIcon = (result: string) => {
    switch (result) {
      case "authorized":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "denied":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "error":
        return <Clock className="h-4 w-4 text-warning" />
      default:
        return null
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case "authorized":
        return <Badge className="bg-success text-success-foreground">Autorisé</Badge>
      case "denied":
        return <Badge variant="destructive">Refusé</Badge>
      case "error":
        return <Badge className="bg-warning text-warning-foreground">Erreur</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Historique des Accès</TabsTrigger>
          <TabsTrigger value="analytics">Analyses et Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nom ou plaque..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="person">Personnes</SelectItem>
                      <SelectItem value="vehicle">Véhicules</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Résultat</label>
                  <Select value={filterResult} onValueChange={(value: any) => setFilterResult(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="authorized">Autorisés</SelectItem>
                      <SelectItem value="denied">Refusés</SelectItem>
                      <SelectItem value="error">Erreurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Événements Récents
              </CardTitle>
              <CardDescription>{filteredHistory.length} événement(s) trouvé(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nom/Plaque</TableHead>
                      <TableHead>Résultat</TableHead>
                      <TableHead>Confiance</TableHead>
                      <TableHead>Durée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.slice(0, 20).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(event.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {event.type === "person" ? (
                              <User className="h-4 w-4 text-primary" />
                            ) : (
                              <Car className="h-4 w-4 text-accent" />
                            )}
                            {event.type === "person" ? "Personne" : "Véhicule"}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getResultIcon(event.result)}
                            {getResultBadge(event.result)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.confidence && (
                            <Badge variant="outline" className="font-mono">
                              {event.confidence}%
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{event.duration ? `${event.duration}s` : "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Accès</p>
                    <p className="text-2xl font-bold">{accessHistory.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-success">
                      {Math.round((resultStats[0].value / accessHistory.length) * 100)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Accès Refusés</p>
                    <p className="text-2xl font-bold text-destructive">{resultStats[1].value}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Erreurs Système</p>
                    <p className="text-2xl font-bold text-warning">{resultStats[2].value}</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activité des 7 Derniers Jours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="authorized" fill="#10b981" name="Autorisés" />
                    <Bar dataKey="denied" fill="#ef4444" name="Refusés" />
                    <Bar dataKey="error" fill="#f59e0b" name="Erreurs" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Result Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Résultats</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={resultStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resultStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trend Line */}
            <Card>
              <CardHeader>
                <CardTitle>Tendance d'Activité</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

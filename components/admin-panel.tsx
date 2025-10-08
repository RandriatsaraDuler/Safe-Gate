"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { User, Car, Plus, Trash2, Settings, Shield, Camera, Database, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AuthorizedUser {
  id: string
  name: string
  type: "person" | "vehicle"
  image: string
  dateAdded: string
  lastAccess?: string
  status: "active" | "suspended"
  notes?: string
}

interface SystemSettings {
  confidenceThreshold: number
  autoCloseDelay: number
  maxAttempts: number
  enableLogging: boolean
  enableNotifications: boolean
  maintenanceMode: boolean
}

export function AdminPanel() {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([
    {
      id: "1",
      name: "Jean Dupont",
      type: "person",
      image: "/professional-man.jpg",
      dateAdded: "2024-01-15",
      lastAccess: "2024-01-20",
      status: "active",
      notes: "Employé - Département IT",
    },
    {
      id: "2",
      name: "Marie Martin",
      type: "person",
      image: "/professional-woman-diverse.png",
      dateAdded: "2024-01-10",
      lastAccess: "2024-01-19",
      status: "active",
      notes: "Manager - Ressources Humaines",
    },
    {
      id: "3",
      name: "ABC-123-XY",
      type: "vehicle",
      image: "/generic-license-plate.png",
      dateAdded: "2024-01-12",
      lastAccess: "2024-01-18",
      status: "active",
      notes: "Véhicule de service",
    },
    {
      id: "4",
      name: "DEF-456-ZW",
      type: "vehicle",
      image: "/car-license-plate.jpg",
      dateAdded: "2024-01-08",
      status: "suspended",
      notes: "Véhicule temporairement suspendu",
    },
  ])

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    confidenceThreshold: 85,
    autoCloseDelay: 5,
    maxAttempts: 3,
    enableLogging: true,
    enableNotifications: true,
    maintenanceMode: false,
  })

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    type: "person" as "person" | "vehicle",
    notes: "",
  })

  const { toast } = useToast()

  const handleAddUser = () => {
    if (!newUser.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom est requis",
        variant: "destructive",
      })
      return
    }

    const user: AuthorizedUser = {
      id: Date.now().toString(),
      name: newUser.name,
      type: newUser.type,
      image: newUser.type === "person" ? "/professional-man.jpg" : "/generic-license-plate.png",
      dateAdded: new Date().toISOString().split("T")[0],
      status: "active",
      notes: newUser.notes,
    }

    setAuthorizedUsers([...authorizedUsers, user])
    setNewUser({ name: "", type: "person", notes: "" })
    setIsAddUserOpen(false)

    toast({
      title: "Utilisateur ajouté",
      description: `${user.name} a été ajouté avec succès`,
    })
  }

  const handleDeleteUser = (id: string) => {
    const user = authorizedUsers.find((u) => u.id === id)
    setAuthorizedUsers(authorizedUsers.filter((u) => u.id !== id))

    toast({
      title: "Utilisateur supprimé",
      description: `${user?.name} a été supprimé`,
    })
  }

  const handleToggleUserStatus = (id: string) => {
    setAuthorizedUsers(
      authorizedUsers.map((user) =>
        user.id === id ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user,
      ),
    )
  }

  const handleUpdateSettings = (key: keyof SystemSettings, value: any) => {
    setSystemSettings({ ...systemSettings, [key]: value })

    toast({
      title: "Paramètres mis à jour",
      description: "Les modifications ont été sauvegardées",
    })
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Utilisateurs Autorisés</TabsTrigger>
          <TabsTrigger value="settings">Paramètres Système</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Add User Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Gestion des Accès</h3>
              <p className="text-sm text-muted-foreground">
                {authorizedUsers.length} utilisateur{authorizedUsers.length > 1 ? "s" : ""} autorisé
                {authorizedUsers.length > 1 ? "s" : ""}
              </p>
            </div>

            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Nouvel Utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajoutez une personne ou un véhicule à la liste des accès autorisés
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-type">Type</Label>
                    <Select
                      value={newUser.type}
                      onValueChange={(value: "person" | "vehicle") => setNewUser({ ...newUser, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="person">Personne</SelectItem>
                        <SelectItem value="vehicle">Véhicule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-name">{newUser.type === "person" ? "Nom complet" : "Numéro de plaque"}</Label>
                    <Input
                      id="user-name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder={newUser.type === "person" ? "Jean Dupont" : "ABC-123-XY"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-notes">Notes (optionnel)</Label>
                    <Textarea
                      id="user-notes"
                      value={newUser.notes}
                      onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                      placeholder="Informations supplémentaires..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users List */}
          <div className="grid gap-4">
            {authorizedUsers.map((user) => (
              <Card key={user.id} className={user.status === "suspended" ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={user.image || "/placeholder.svg"}
                          alt={user.name}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                        <div className="absolute -top-1 -right-1">
                          {user.type === "person" ? (
                            <User className="h-4 w-4 text-primary bg-background rounded-full p-0.5" />
                          ) : (
                            <Car className="h-4 w-4 text-primary bg-background rounded-full p-0.5" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Actif" : "Suspendu"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ajouté le {new Date(user.dateAdded).toLocaleDateString("fr-FR")}
                          {user.lastAccess &&
                            ` • Dernier accès: ${new Date(user.lastAccess).toLocaleDateString("fr-FR")}`}
                        </p>
                        {user.notes && <p className="text-xs text-muted-foreground italic">{user.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(user.id)}>
                        {user.status === "active" ? "Suspendre" : "Activer"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            {/* Recognition Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Paramètres de Reconnaissance
                </CardTitle>
                <CardDescription>Configuration du système de reconnaissance IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confidence">Seuil de Confiance: {systemSettings.confidenceThreshold}%</Label>
                  <Input
                    id="confidence"
                    type="range"
                    min="50"
                    max="99"
                    value={systemSettings.confidenceThreshold}
                    onChange={(e) => handleUpdateSettings("confidenceThreshold", Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Plus élevé = plus strict, moins de faux positifs</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attempts">Tentatives Maximum</Label>
                  <Select
                    value={systemSettings.maxAttempts.toString()}
                    onValueChange={(value) => handleUpdateSettings("maxAttempts", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 tentative</SelectItem>
                      <SelectItem value="2">2 tentatives</SelectItem>
                      <SelectItem value="3">3 tentatives</SelectItem>
                      <SelectItem value="5">5 tentatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Gate Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Paramètres de la Barrière
                </CardTitle>
                <CardDescription>Configuration du comportement de la barrière</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delay">Délai de Fermeture Automatique: {systemSettings.autoCloseDelay}s</Label>
                  <Input
                    id="delay"
                    type="range"
                    min="3"
                    max="30"
                    value={systemSettings.autoCloseDelay}
                    onChange={(e) => handleUpdateSettings("autoCloseDelay", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres Système
                </CardTitle>
                <CardDescription>Configuration générale du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journalisation</Label>
                    <p className="text-xs text-muted-foreground">Enregistrer tous les événements d'accès</p>
                  </div>
                  <Switch
                    checked={systemSettings.enableLogging}
                    onCheckedChange={(checked) => handleUpdateSettings("enableLogging", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des alertes pour les événements importants</p>
                  </div>
                  <Switch
                    checked={systemSettings.enableNotifications}
                    onCheckedChange={(checked) => handleUpdateSettings("enableNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      Mode Maintenance
                    </Label>
                    <p className="text-xs text-muted-foreground">Désactiver temporairement le système</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleUpdateSettings("maintenanceMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  État du Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {authorizedUsers.filter((u) => u.status === "active").length}
                    </div>
                    <div className="text-xs text-muted-foreground">Utilisateurs Actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">99.2%</div>
                    <div className="text-xs text-muted-foreground">Disponibilité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">1,247</div>
                    <div className="text-xs text-muted-foreground">Accès ce mois</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">3</div>
                    <div className="text-xs text-muted-foreground">Tentatives refusées</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

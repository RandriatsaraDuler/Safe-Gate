"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { User, Car, Camera, Upload, Scan, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RecognitionPanelProps {
  onStatusChange: (status: "idle" | "scanning" | "authorized" | "denied") => void
  onGateStatusChange: (status: "closed" | "opening" | "open" | "closing") => void
  onUserDetected: (user: string | null) => void
}

// Simulated authorized users database
const AUTHORIZED_USERS = [
  { id: "1", name: "Jean Dupont", type: "person", image: "/professional-man.jpg" },
  { id: "2", name: "Mari Martin", type: "person", image: "/professional-woman-diverse.png" },
  { id: "3", name: "ABC-123-XY", type: "vehicle", image: "/generic-license-plate.png" },
  { id: "4", name: "DEF-456-ZW", type: "vehicle", image: "/car-license-plate.jpg" },
]

export function RecognitionPanel({ onStatusChange, onGateStatusChange, onUserDetected }: RecognitionPanelProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [recognitionType, setRecognitionType] = useState<"person" | "vehicle">("person")
  const [isUsingCamera, setIsUsingCamera] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(85)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const simulateRecognition = useCallback(async () => {
    setIsScanning(true)
    onStatusChange("scanning")
    setScanProgress(0)

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Wait for scanning to complete
    await new Promise((resolve) => setTimeout(resolve, 3000))
    clearInterval(progressInterval)
    setScanProgress(100)

    // Simulate recognition result (70% chance of success for demo)
    const isAuthorized = Math.random() > 0.3
    const recognizedUser = isAuthorized
      ? AUTHORIZED_USERS.find((u) => u.type === recognitionType)?.name || "Utilisateur Autorisé"
      : null

    if (isAuthorized && recognizedUser) {
      onStatusChange("authorized")
      onUserDetected(recognizedUser)

      // Open gate sequence
      setTimeout(() => {
        onGateStatusChange("opening")
        toast({
          title: "Accès autorisé",
          description: `Bienvenue ${recognizedUser}`,
        })
      }, 500)

      setTimeout(() => {
        onGateStatusChange("open")
      }, 1500)

      // Auto close after 5 seconds
      setTimeout(() => {
        onGateStatusChange("closing")
      }, 6500)

      setTimeout(() => {
        onGateStatusChange("closed")
        onStatusChange("idle")
        onUserDetected(null)
        setIsScanning(false)
        setScanProgress(0)
        setSelectedImage(null)
      }, 7500)
    } else {
      onStatusChange("denied")
      toast({
        title: "Accès refusé",
        description: "Personne ou véhicule non autorisé",
        variant: "destructive",
      })

      setTimeout(() => {
        onStatusChange("idle")
        setIsScanning(false)
        setScanProgress(0)
        setSelectedImage(null)
      }, 3000)
    }
  }, [recognitionType, onStatusChange, onGateStatusChange, onUserDetected, toast])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setIsUsingCamera(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateCamera = () => {
    setIsUsingCamera(true)
    setSelectedImage("/security-camera-view.png")
    toast({
      title: "Caméra activée",
      description: "Image capturée depuis la webcam",
    })
  }

  const handleApproach = (type: "person" | "vehicle") => {
    setRecognitionType(type)
    setSelectedImage(
      type === "person" ? "/person-approaching-security-gate.jpg" : "/car-approaching-security-barrier.jpg",
    )
    toast({
      title: `${type === "person" ? "Personne" : "Véhicule"} détecté`,
      description: "Approche détectée par les capteurs",
    })
  }

  return (
    <div className="space-y-6">
      {/* Approach Simulation */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleApproach("person")}
          disabled={isScanning}
          className="h-20 flex-col gap-2"
        >
          <User className="h-6 w-6" />
          <span>Approcher une Personne</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleApproach("vehicle")}
          disabled={isScanning}
          className="h-20 flex-col gap-2"
        >
          <Car className="h-6 w-6" />
          <span>Approcher un Véhicule</span>
        </Button>
      </div>

      {/* Recognition Type Badge */}
      <div className="flex justify-center">
        <Badge variant="secondary" className="px-3 py-1">
          Mode: {recognitionType === "person" ? "Reconnaissance Faciale" : "Reconnaissance de Plaque"}
        </Badge>
      </div>

      {/* Image Capture/Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Capture d'Image</CardTitle>
          <CardDescription>Téléversez une photo ou utilisez la webcam pour la reconnaissance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Téléverser
            </Button>
            <Button
              variant="outline"
              onClick={simulateCamera}
              disabled={isScanning}
              className="flex items-center gap-2 bg-transparent"
            >
              <Camera className="h-4 w-4" />
              Webcam
            </Button>
          </div>

          <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          {/* Image Preview */}
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Image à analyser"
                className="w-full h-48 object-cover rounded-lg border"
              />
              {isUsingCamera && (
                <Badge className="absolute top-2 right-2 bg-destructive">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                  LIVE
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scanning Progress */}
      {isScanning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Analyse en cours...</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                {scanProgress < 30 && "Détection des caractéristiques..."}
                {scanProgress >= 30 && scanProgress < 70 && "Comparaison avec la base de données..."}
                {scanProgress >= 70 && scanProgress < 100 && "Vérification finale..."}
                {scanProgress >= 100 && "Analyse terminée"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recognition Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paramètres de Reconnaissance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confidence">Seuil de Confiance: {confidenceThreshold}%</Label>
            <Input
              id="confidence"
              type="range"
              min="50"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <Button onClick={simulateRecognition} disabled={!selectedImage || isScanning} className="w-full" size="lg">
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reconnaissance en cours...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-4 w-4" />
                Lancer la Reconnaissance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Access - Authorized Users Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Utilisateurs Autorisés</CardTitle>
          <CardDescription>Aperçu des personnes et véhicules autorisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {AUTHORIZED_USERS.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.type === "person" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Car className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-xs font-medium truncate">{user.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

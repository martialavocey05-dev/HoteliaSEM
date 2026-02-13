'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import { ArrowLeft, Save, Building2, MapPin, Image as ImageIcon, Star, Plus, Trash2, BedDouble } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Room {
  id: string
  type: string
  price: string
  capacity: string
  quantity: string
  amenities: string
}

export default function AddHotelPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    stars: '3',
    amenities: '',
    imageUrl: '',
  })
  
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', type: 'Standard', price: '', capacity: '2', quantity: '', amenities: '' }
  ])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role !== 'hotelier') {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, user, router])

  const addRoom = () => {
    setRooms([...rooms, {
      id: Date.now().toString(),
      type: '',
      price: '',
      capacity: '2',
      quantity: '',
      amenities: ''
    }])
  }

  const removeRoom = (id: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(room => room.id !== id))
    }
  }

  const updateRoom = (id: string, field: keyof Room, value: string) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    console.log('[v0] Submitting hotel:', formData)
    console.log('[v0] Submitting rooms:', rooms)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    alert('Hôtel ajouté avec succès!')
    router.push('/partner/dashboard')
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <HSEMLogo size="md" animated />
          <p className="mt-4 text-hsem-gold">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="animate-deep-sea-pulse absolute inset-0" />

      <div className="relative">
        <header className="glass border-b border-hsem-silver/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 transition-transform hover:scale-105"
            >
              <HSEMLogo size="sm" />
              <span className="font-serif text-xl font-bold text-hsem-gold">HoteliaSEM</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/partner/dashboard')}
              className="border-hsem-silver/20 text-hsem-alabaster hover:bg-hsem-gold/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au dashboard
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-serif text-4xl font-bold text-hsem-gold">
              Ajouter un hôtel
            </h1>
            <p className="mt-2 text-foreground/70">
              Remplissez les informations de votre établissement
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="glass-card border-hsem-silver/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-hsem-gold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations générales
                </CardTitle>
                <CardDescription className="text-foreground/70">
                  Détails de base de votre hôtel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground/90">
                      Nom de l'hôtel *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      placeholder="Hôtel Royal Palace"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground/90">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Ville *
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50 border-hsem-silver/20 text-foreground">
                        <SelectValue placeholder="Sélectionnez une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="douala">Douala</SelectItem>
                        <SelectItem value="yaounde">Yaoundé</SelectItem>
                        <SelectItem value="kribi">Kribi</SelectItem>
                        <SelectItem value="bafoussam">Bafoussam</SelectItem>
                        <SelectItem value="garoua">Garoua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-foreground/90">
                      Adresse complète *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      placeholder="123 Avenue des Hôtels, Quartier Bonanjo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stars" className="text-foreground/90">
                      <Star className="inline h-4 w-4 mr-2 text-hsem-gold" />
                      Nombre d'étoiles *
                    </Label>
                    <Select
                      value={formData.stars}
                      onValueChange={(value) => setFormData({ ...formData, stars: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50 border-hsem-silver/20 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 étoiles</SelectItem>
                        <SelectItem value="4">4 étoiles</SelectItem>
                        <SelectItem value="5">5 étoiles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-foreground/90">
                      <ImageIcon className="inline h-4 w-4 mr-2" />
                      URL de l'image
                    </Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-foreground/90">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground min-h-[120px]"
                      placeholder="Décrivez votre hôtel, ses points forts et ce qui le rend unique..."
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="amenities" className="text-foreground/90">
                      Équipements et services
                    </Label>
                    <Textarea
                      id="amenities"
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      placeholder="WiFi gratuit, Piscine, Restaurant, Spa, Parking, Salle de sport..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rooms Section */}
            <Card className="glass-card border-hsem-silver/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-hsem-gold flex items-center gap-2">
                      <BedDouble className="h-5 w-5" />
                      Types de chambres
                    </CardTitle>
                    <CardDescription className="text-foreground/70">
                      Définissez les différents types de chambres disponibles
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={addRoom}
                    size="sm"
                    className="bg-hsem-gold/20 text-hsem-gold hover:bg-hsem-gold/30 border border-hsem-gold/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un type
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className="rounded-lg border border-hsem-silver/10 bg-hsem-navy/30 p-4 space-y-4 animate-fade-in-up"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-hsem-gold">Chambre {index + 1}</h3>
                      {rooms.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeRoom(room.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-foreground/90">Type de chambre *</Label>
                        <Select
                          value={room.type}
                          onValueChange={(value) => updateRoom(room.id, 'type', value)}
                          required
                        >
                          <SelectTrigger className="bg-background/50 border-hsem-silver/20 text-foreground">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Supérieure">Supérieure</SelectItem>
                            <SelectItem value="Deluxe">Deluxe</SelectItem>
                            <SelectItem value="Suite">Suite</SelectItem>
                            <SelectItem value="Suite Présidentielle">Suite Présidentielle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground/90">Prix par nuit (XAF) *</Label>
                        <Input
                          type="number"
                          value={room.price}
                          onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
                          className="bg-background/50 border-hsem-silver/20 text-foreground"
                          placeholder="50000"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground/90">Capacité (personnes) *</Label>
                        <Select
                          value={room.capacity}
                          onValueChange={(value) => updateRoom(room.id, 'capacity', value)}
                          required
                        >
                          <SelectTrigger className="bg-background/50 border-hsem-silver/20 text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 personne</SelectItem>
                            <SelectItem value="2">2 personnes</SelectItem>
                            <SelectItem value="3">3 personnes</SelectItem>
                            <SelectItem value="4">4 personnes</SelectItem>
                            <SelectItem value="5">5+ personnes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground/90">Nombre de chambres *</Label>
                        <Input
                          type="number"
                          value={room.quantity}
                          onChange={(e) => updateRoom(room.id, 'quantity', e.target.value)}
                          className="bg-background/50 border-hsem-silver/20 text-foreground"
                          placeholder="10"
                          min="1"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-foreground/90">Équipements spécifiques</Label>
                        <Input
                          value={room.amenities}
                          onChange={(e) => updateRoom(room.id, 'amenities', e.target.value)}
                          className="bg-background/50 border-hsem-silver/20 text-foreground"
                          placeholder="Balcon, Vue mer, Jacuzzi..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <div className="flex gap-4 justify-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/partner/dashboard')}
                className="border-hsem-silver/20 text-foreground"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-hsem-gold text-hsem-navy hover:bg-hsem-gold/90 hover:scale-105 transition-transform"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer l\'hôtel'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

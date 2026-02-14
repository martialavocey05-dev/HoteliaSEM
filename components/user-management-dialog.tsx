'use client'

import { useState, useCallback } from 'react'
import { UserRole } from '@/lib/types/auth'
import {
  getUsersByRole,
  deactivateUser,
  reactivateUser,
  deleteUser,
} from '@/lib/mock-data/users'
import { useAuth } from '@/lib/context/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  UserX,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
  ShieldAlert,
  Users,
  Building2,
} from 'lucide-react'

interface UserManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Exclude<UserRole, 'admin'>
}

export function UserManagementDialog({
  open,
  onOpenChange,
  role,
}: UserManagementDialogProps) {
  const { forceDisconnect } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const users = getUsersByRole(role)

  const roleLabel = role === 'client' ? 'Clients' : 'Hoteliers'
  const RoleIcon = role === 'client' ? Users : Building2

  const handleToggleActive = useCallback(
    (userId: string, currentlyActive: boolean) => {
      if (currentlyActive) {
        const success = deactivateUser(userId)
        if (success) {
          // Force disconnect the user if they are currently logged in
          forceDisconnect(userId)
        }
      } else {
        reactivateUser(userId)
      }
      setRefreshKey((k) => k + 1)
    },
    [forceDisconnect]
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return
    const success = deleteUser(deleteTarget.id)
    if (success) {
      forceDisconnect(deleteTarget.id)
    }
    setDeleteTarget(null)
    setRefreshKey((k) => k + 1)
  }, [deleteTarget, forceDisconnect])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-primary/20 text-foreground sm:max-w-3xl max-h-[85vh] p-0 overflow-hidden" key={refreshKey}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <RoleIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-serif text-xl text-primary">
                  {'Gestion des ' + roleLabel}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {users.length + ' compte' + (users.length !== 1 ? 's' : '') + ' ' + roleLabel.toLowerCase()}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <UserX className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-sm">
                  {'Aucun ' + (role === 'client' ? 'client' : 'hotelier') + ' enregistre'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Utilisateur</TableHead>
                    <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">Contact</TableHead>
                    <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Inscription</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Statut</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-border/20 hover:bg-primary/5 transition-colors"
                    >
                      {/* Name */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {user.firstName + ' ' + user.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground sm:hidden flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 text-primary/60" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 text-primary/60" />
                            {user.phone}
                          </span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3 text-primary/60" />
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>

                      {/* Status Toggle */}
                      <TableCell>
                        <div className="flex flex-col items-center gap-1.5">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() =>
                              handleToggleActive(user.id, user.isActive)
                            }
                            aria-label={
                              user.isActive
                                ? 'Desactiver ' + user.firstName
                                : 'Activer ' + user.firstName
                            }
                          />
                          <Badge
                            variant={user.isActive ? 'default' : 'destructive'}
                            className={
                              user.isActive
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 text-[10px] px-1.5 py-0'
                                : 'bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20 text-[10px] px-1.5 py-0'
                            }
                          >
                            {user.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Delete */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteTarget({
                              id: user.id,
                              name: user.firstName + ' ' + user.lastName,
                            })
                          }
                          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          aria-label={'Supprimer ' + user.firstName + ' ' + user.lastName}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>

          {/* Footer info */}
          <div className="px-6 py-3 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-primary/60" />
            <span>
              La desactivation empeche la connexion et deconnecte les utilisateurs actifs.
            </span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent className="glass-card border-destructive/20 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {'Etes-vous sur de vouloir supprimer le compte de '}
              <strong className="text-foreground">{deleteTarget?.name}</strong>
              {' ? Cette action est irreversible.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

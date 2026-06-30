"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Archive, Trash2, Loader2, MoreHorizontal } from "lucide-react";

interface Props {
  projectId: string;
  projectTitle: string;
  status: string;
}

export default function ProjectActions({ projectId, projectTitle, status }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({ status: status === "archived" ? "draft" : "archived" })
      .eq("id", projectId);

    setLoading(false);
    setOpen(false);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'archiver le projet." });
      return;
    }

    toast({
      variant: "success",
      title: status === "archived" ? "Projet désarchivé" : "Projet archivé",
    });
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", projectId);

    setLoading(false);
    setConfirmDelete(false);
    setOpen(false);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer le projet." });
      return;
    }

    toast({ variant: "success", title: "Projet supprimé" });
    router.refresh();
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.preventDefault(); setOpen(true); }}
        aria-label="Actions du projet"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>

      {/* Menu d'actions */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actions — {projectTitle}</DialogTitle>
            <DialogDescription>
              Choisissez une action pour ce projet.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-2">
            <Button
              variant="ghost"
              className="justify-start gap-3"
              onClick={handleArchive}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
              {status === "archived" ? "Désarchiver le projet" : "Archiver le projet"}
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => { setOpen(false); setConfirmDelete(true); }}
            >
              <Trash2 className="w-4 h-4" />
              Supprimer le projet
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce projet ?</DialogTitle>
            <DialogDescription>
              Le projet <strong>{projectTitle}</strong> sera supprimé définitivement. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Annuler</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Linkedin, Mail, Pencil, Trash2, UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Contact {
  id: string
  name: string
  roleTitle: string | null
  linkedinUrl: string | null
  email: string | null
  notes: string | null
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roleTitle: z.string().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  notes: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

function ContactFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Contact
  onSave: (values: ContactFormValues) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initial?.name ?? "",
      roleTitle: initial?.roleTitle ?? "",
      linkedinUrl: initial?.linkedinUrl ?? "",
      email: initial?.email ?? "",
      notes: initial?.notes ?? "",
    },
  })

  useEffect(() => {
    form.reset({
      name: initial?.name ?? "",
      roleTitle: initial?.roleTitle ?? "",
      linkedinUrl: initial?.linkedinUrl ?? "",
      email: initial?.email ?? "",
      notes: initial?.notes ?? "",
    })
  }, [initial, form])

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true)
    try {
      await onSave(values)
      form.reset()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jamie Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jamie@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. replied to my InMail, connected on LinkedIn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function ContactsSection({ companyId }: { companyId: string }) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)

  const load = async () => {
    const res = await fetch(`/api/contacts?companyId=${companyId}`)
    if (res.ok) setContacts(await res.json())
  }

  useEffect(() => {
    load()
  }, [companyId])

  const handleAdd = async (values: ContactFormValues) => {
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, ...values }),
    })
    await load()
  }

  const handleEdit = async (values: ContactFormValues) => {
    if (!editContact) return
    await fetch(`/api/contacts/${editContact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setEditContact(null)
    await load()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Contacts</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No contacts yet. Add the hiring manager or recruiter you found.
        </p>
      ) : (
        <div className="divide-y rounded-md border">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-4 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{c.name}</p>
                {c.roleTitle && (
                  <p className="text-sm text-muted-foreground">{c.roleTitle}</p>
                )}
                <div className="mt-1 flex flex-wrap gap-3">
                  {c.linkedinUrl && (
                    <a
                      href={c.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Linkedin className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {c.email}
                    </a>
                  )}
                </div>
                {c.notes && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.notes}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setEditContact(c)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleAdd}
      />
      <ContactFormDialog
        open={!!editContact}
        onOpenChange={(open) => !open && setEditContact(null)}
        initial={editContact ?? undefined}
        onSave={handleEdit}
      />
    </div>
  )
}

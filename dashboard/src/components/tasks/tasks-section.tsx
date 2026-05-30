"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, startOfToday } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarClock, ListPlus, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface TaskApplication {
  role: string
  company: { name: string }
}

interface Task {
  id: string
  title: string
  notes: string | null
  dueDate: string | null
  done: boolean
  completedAt: string | null
  applicationId: string | null
  application: TaskApplication | null
}

interface ApplicationOption {
  id: string
  role: string
  companies: { name: string }
}

const NONE_VALUE = "none"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  applicationId: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

function TaskFormDialog({
  open,
  onOpenChange,
  initial,
  showAppSelect,
  applicationOptions,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Task
  showAppSelect: boolean
  applicationOptions: ApplicationOption[]
  onSave: (values: TaskFormValues) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  const buildDefaults = (task?: Task): TaskFormValues => ({
    title: task?.title ?? "",
    dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
    notes: task?.notes ?? "",
    applicationId: task?.applicationId ?? undefined,
  })

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: buildDefaults(initial),
  })

  useEffect(() => {
    form.reset(buildDefaults(initial))
  }, [initial, form])

  const onSubmit = async (values: TaskFormValues) => {
    setLoading(true)
    try {
      await onSave(values)
      form.reset(buildDefaults())
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Follow up with recruiter"
                      className="min-h-0 resize-none"
                      rows={1}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      formatStr="MMM d, yyyy"
                      placeholder="No due date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showAppSelect && (
              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application (optional)</FormLabel>
                    <Select
                      value={field.value ?? NONE_VALUE}
                      onValueChange={(v) =>
                        field.onChange(v === NONE_VALUE ? undefined : v)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="No application" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>
                          No application
                        </SelectItem>
                        {applicationOptions.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.companies.name} — {a.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional details" {...field} />
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

export function TasksSection({ applicationId }: { applicationId?: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [applicationOptions, setApplicationOptions] = useState<
    ApplicationOption[]
  >([])
  const [addOpen, setAddOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const showAppSelect = !applicationId

  const load = async () => {
    const url = applicationId
      ? `/api/tasks?applicationId=${applicationId}`
      : "/api/tasks"
    const res = await fetch(url)
    if (res.ok) setTasks(await res.json())
  }

  useEffect(() => {
    load()
  }, [applicationId])

  useEffect(() => {
    if (!showAppSelect) return
    fetch("/api/applications")
      .then((res) => (res.ok ? res.json() : []))
      .then(setApplicationOptions)
      .catch(() => setApplicationOptions([]))
  }, [showAppSelect])

  const toBody = (values: TaskFormValues) => ({
    title: values.title,
    dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    notes: values.notes ?? "",
    applicationId: applicationId ?? values.applicationId ?? null,
  })

  const handleAdd = async (values: TaskFormValues) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBody(values)),
    })
    await load()
  }

  const handleEdit = async (values: TaskFormValues) => {
    if (!editTask) return
    await fetch(`/api/tasks/${editTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBody(values)),
    })
    setEditTask(null)
    await load()
  }

  const handleToggleDone = async (task: Task) => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    })
    await load()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    await load()
  }

  const today = startOfToday()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Tasks</h2>
        <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
          <ListPlus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks yet. Add a follow-up reminder or to-do.
        </p>
      ) : (
        <div className="divide-y rounded-md border">
          {tasks.map((task) => {
            const due = task.dueDate ? new Date(task.dueDate) : null
            const isOverdue = !!due && !task.done && due < today
            return (
              <div
                key={task.id}
                className="flex items-start justify-between gap-4 p-3"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <Checkbox
                    checked={task.done}
                    onCheckedChange={() => handleToggleDone(task)}
                    className="mt-1"
                    aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "font-medium leading-tight",
                        task.done && "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {due && (
                        <span
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            isOverdue
                              ? "font-medium text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          <CalendarClock className="h-3 w-3" />
                          {format(due, "MMM d, yyyy")}
                          {isOverdue && " · overdue"}
                        </span>
                      )}
                      {showAppSelect && task.application && (
                        <Badge variant="secondary">
                          {task.application.company.name}
                        </Badge>
                      )}
                    </div>
                    {task.notes && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setEditTask(task)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <TaskFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        showAppSelect={showAppSelect}
        applicationOptions={applicationOptions}
        onSave={handleAdd}
      />
      <TaskFormDialog
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        initial={editTask ?? undefined}
        showAppSelect={showAppSelect}
        applicationOptions={applicationOptions}
        onSave={handleEdit}
      />
    </div>
  )
}

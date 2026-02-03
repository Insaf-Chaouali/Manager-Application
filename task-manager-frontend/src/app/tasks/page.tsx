"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import { TaskService, Task } from "../../services/task.service";
import Calendar from "react-calendar";
import { Value } from "react-calendar/dist/shared/types.js";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskService.getAll();
      setTasks(data);
    } catch (err) {
      console.error("Erreur chargement tâches :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/");
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
    loadTasks();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 via-white to-blue-50">
        <div className="animate-pulse text-violet-600">Chargement...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
      };
      console.log("Submitting payload:", payload);

      if (editingId) {
        console.log("Updating task with ID:", editingId);
        await TaskService.update(editingId, payload);
      } else {
        console.log("Creating new task with payload:", payload);
        await TaskService.create(payload);
      }
      await loadTasks();
      resetForm();
    } catch (err: any) {
      console.error("Erreur création/modif tâche :", err.response?.data || err.message);
      alert(err.response?.data?.message || "Une erreur est survenue lors de la création ou modification de la tâche.");
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    try {
      console.log("Deleting task with ID:", id);
      await TaskService.remove(id);
      await loadTasks();
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      console.log("Toggling task completion for ID:", task.id);
      await TaskService.toggleActiveStatus(task.id); 
      await loadTasks();
    } catch (err: any) {
      console.error("Erreur toggle complete :", err.response?.data || err.message);
      alert(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour de la tâche.");
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description || "",
      date: task.date || format(new Date(task.createdAt), "yyyy-MM-dd"),
    });
    setSelectedDate(parseISO(task.date || task.createdAt));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      date: format(selectedDate, "yyyy-MM-dd"),
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const tasksForDate = tasks.filter((task) =>
    isSameDay(parseISO(task.date || task.createdAt), selectedDate)
  );

  const getTaskCount = (date: Date) => {
    return tasks.filter((task) =>
      isSameDay(parseISO(task.date || task.createdAt), date)
    ).length;
  };

  const handleDateChange = (value: Value) => {
    if (!value) return;
    const selected: Date = Array.isArray(value) ? value[0] ?? new Date() : value;
    setSelectedDate(selected);
    setFormData((prev) => ({ ...prev, date: format(selected, "yyyy-MM-dd") }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-blue-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-lg text-white shadow-md">
              📋
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-violet-700 to-blue-700 bg-clip-text text-transparent">
              Mes Tâches
            </h1>
          </div>
          <button
            onClick={logout}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 hover:shadow-md active:scale-95"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column: Form + Task List */}
          <div className="space-y-6 lg:col-span-2">
            {/* Form */}
            <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-md ring-1 ring-violet-100">
              <h2 className="mb-4 text-lg font-bold text-violet-900">
                {editingId ? "✏️ Modifier" : "➕ Nouvelle tâche"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Titre de la tâche..."
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-gray-800 placeholder-violet-300 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-gray-800 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Description (optionnel)..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-gray-800 placeholder-violet-300 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:from-violet-700 hover:to-blue-700 hover:shadow-lg active:scale-[0.98]"
                  >
                    {editingId ? "Modifier" : "Ajouter"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl bg-gray-100 px-6 py-3 font-medium text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-800"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Task List */}
            <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-md ring-1 ring-blue-100">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-blue-900">
                <span>📅</span>
                {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
              </h3>

              <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
                {tasksForDate.length === 0 ? (
                  <div className="rounded-xl bg-blue-50/50 p-4 text-center text-sm text-blue-400">
                    Aucune tâche ce jour 🌟
                  </div>
                ) : (
                  tasksForDate.map((task) => (
                    <div
                      key={task.id}
                      className={`group rounded-xl border-l-4 p-4 transition-all hover:shadow-md ${
                        task.isActive
                          ? "border-violet-400 bg-white shadow-sm"
                          : "border-green-400 bg-green-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${
                              task.isActive
                                ? "text-gray-800"
                                : "text-gray-500 line-through"
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p
                              className={`mt-1 text-sm ${
                                task.isActive ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => toggleComplete(task)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                            task.isActive
                              ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {task.isActive ? "À faire ⏳" : "Fait ✅"}
                        </button>

                        <button
                          onClick={() => startEdit(task)}
                          className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-200"
                        >
                          Modifier ✏️
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-all hover:bg-red-200"
                        >
                          Supprimer 🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-md ring-1 ring-violet-100 h-fit">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-violet-900">Calendrier</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-violet-500"></span>
                    <span className="text-gray-600">Tâches</span>
                  </div>
              
                </div>
              </div>

              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                locale="fr-FR"
                className="w-full border-none bg-transparent!"
                tileContent={({ date }) => {
                  const count = getTaskCount(date);
                  return count > 0 ? (
                    <div className="mt-1 flex justify-center">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-[10px] font-bold text-white shadow-sm">
                        {count}
                      </span>
                    </div>
                  ) : null;
                }}
                tileClassName={({ date }) => {
                  const count = getTaskCount(date);
                  return count > 0 ? "bg-violet-50/50 font-semibold text-violet-700" : "";
                }}
              />

              {loading && (
                <div className="mt-4 text-center text-sm text-violet-400 animate-pulse">
                  Chargement des tâches...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
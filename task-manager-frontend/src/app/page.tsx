"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AuthService } from "../services/auth.service"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await AuthService.login({
        username: username.trim(),
        password: password.trim(),
      })
      router.push("/tasks")
    } catch (err: any) {
      setError(err.message || "Nom d'utilisateur ou mot de passe incorrect")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-violet-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white/60 p-8 shadow-lg backdrop-blur-md ring-1 ring-white/50">
        
        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-auto overflow-hidden rounded-xxl px-9 py-2">
            <Image
              src="/tasklogo.png"
              alt="Logo"
              width={120}
              height={48}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="mb-6 text-center text-2xl font-bold text-purple-900">
          Bienvenue
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50/90 p-3 text-sm text-red-600 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username123"
              className="w-full rounded-lg border border-zinc-300/50 bg-white/80 px-4 py-2.5 text-black outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300/50 bg-white/80 px-4 py-2.5 text-black outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg active:scale-[0.98]"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AuthService } from "../../services/auth.service" 

export default function Register() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [dateBirth, setDateBirth] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") 

    try {
      await AuthService.register({
        firstName,
        lastName,
        username,
        email,
        password,
        dateBirth,
      })

      await AuthService.login({ username, password })

      router.push("/") 
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription")
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
          Créer un compte
        </h1>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50/90 p-3 text-sm text-red-600 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Prénom</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border text-black border-zinc-300/50 bg-white/80 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="Jean"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nom</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border text-black border-zinc-300/50 bg-white/80 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="Dupont"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nom d'utilisateur</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border text-black border-zinc-300/50 bg-white/80 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="username123"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border text-black border-zinc-300/50 bg-white/80 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="vous@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border text-black border-zinc-300/50 bg-white/80 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Date de naissance</label>
            <input
              type="date"
              required
              value={dateBirth}
              onChange={(e) => setDateBirth(e.target.value)}
              className="w-full rounded-lg border text-black border-zinc-300/50 bg-white/80 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg active:scale-[0.98]"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Déjà un compte ?{" "}
          <Link href="/" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

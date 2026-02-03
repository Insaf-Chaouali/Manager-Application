// frontend/services/auth.service.ts
import api from "./api"; // ton instance axios avec baseURL et interceptors

const TOKEN_KEY = "token";
const USER_KEY = "user";

interface SignUpData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  dateBirth: string;
}

interface SignInData {
  username: string;
  password: string;
}

interface SignInResponse {
  accessToken: string;
}

export const AuthService = {
  // 🔹 Inscription
  async register(data: SignUpData): Promise<void> {
    try {
      await api.post("/auth/signup", data);
    } catch (err: any) {
      throw err.response?.data || { message: "Erreur lors de l'inscription" };
    }
  },

  // 🔹 Connexion
  async login(data: SignInData): Promise<void> {
    try {
      const response = await api.post<SignInResponse>("/auth/signin", data);
      const { accessToken } = response.data;

      // Stocker le token dans localStorage
      localStorage.setItem(TOKEN_KEY, accessToken);

      // Décoder le payload JWT pour info frontend (sub=id, username)
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      localStorage.setItem(USER_KEY, JSON.stringify(payload));
    } catch (err: any) {
      throw err.response?.data || { message: "Nom d'utilisateur ou mot de passe incorrect" };
    }
  },

  // 🔹 Déconnexion
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // 🔹 Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 🔹 Récupérer le user décodé du JWT
  getUser(): any | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // 🔹 Vérifier si connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

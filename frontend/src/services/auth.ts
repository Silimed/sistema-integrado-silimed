import axios from "axios";

// Configuração global do Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

// Adiciona headers padrão
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AuthService = {
  setToken() {
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );
    if (authCookie) {
      const token = decodeURIComponent(authCookie.split("=")[1]);
      localStorage.setItem("auth_token", token);
      return true;
    }
    return false;
  },

  getAuthToken() {
    // Primeiro tenta pegar do cookie
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );
    if (authCookie) {
      return decodeURIComponent(authCookie.split("=")[1]);
    }

    // Se não encontrar no cookie, tenta pegar do localStorage
    const token = localStorage.getItem("auth_token");
    if (token) {
      return token;
    }

    return null;
  },

  removeToken() {
    // Remove do localStorage
    localStorage.removeItem("auth_token");

    // Remove o cookie
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
  },

  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  },

  async logout() {
    try {
      await axios.post("/auth/logout", null, {
        withCredentials: true,
      });
      console.log("Logout realizado com sucesso");
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  },

  // Configuração global do Axios para incluir o token em todas as requisições
  setupAxiosInterceptors() {
    // Remove interceptors anteriores
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();

    // Adiciona novos interceptors
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.withCredentials = true;

        console.log("Enviando requisição:", {
          url: config.url,
          withCredentials: config.withCredentials,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        console.error("Erro no interceptor de requisição:", error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        console.log("Resposta recebida:", {
          url: response.config.url,
          status: response.status,
          headers: response.headers,
        });
        return response;
      },
      async (error) => {
        console.error("Erro na resposta:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        if (error.response?.status === 401) {
          console.log("Erro 401: Token inválido ou expirado");
          this.removeToken();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  },
};

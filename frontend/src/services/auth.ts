import axios from "axios";

// Configuração global do Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

// Adiciona headers padrão
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AuthService = {
  setToken() {
    try {
      // Primeiro tenta obter do cookie
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );

      if (authCookie) {
        const encodedToken = authCookie.split("=")[1].trim();
        const token = decodeURIComponent(encodedToken);

        // Armazena no localStorage como backup
        localStorage.setItem("auth_token", token);
        console.log("Token obtido do cookie e salvo no localStorage");
        return true;
      } else {
        console.warn("Cookie auth_token não encontrado");
        return false;
      }
    } catch (error) {
      console.error("Erro ao configurar token:", error);
      return false;
    }
  },

  getAuthToken() {
    try {
      // Primeiro tenta pegar do cookie
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );

      if (authCookie) {
        const encodedToken = authCookie.split("=")[1].trim();
        return decodeURIComponent(encodedToken);
      }

      // Se não encontrar no cookie, tenta pegar do localStorage
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Restaura o cookie a partir do localStorage
        document.cookie = `auth_token=${encodeURIComponent(
          token
        )}; path=/; domain=localhost; max-age=3600`;
        return token;
      }

      console.warn("Token não encontrado em nenhum local de armazenamento");
      return null;
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      return null;
    }
  },

  removeToken() {
    try {
      // Remove do localStorage
      localStorage.removeItem("auth_token");

      // Remove o cookie
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
      console.log("Token removido com sucesso");
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
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
      this.removeToken();
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, remove o token e redireciona
      this.removeToken();
      window.location.href = "/login";
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
          console.log("Token adicionado ao header da requisição");
        } else {
          console.warn("Token não disponível para requisição:", config.url);
        }

        config.withCredentials = true;

        console.log("Enviando requisição:", {
          url: config.url,
          withCredentials: config.withCredentials,
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
        });
        return response;
      },
      async (error) => {
        console.error("Erro na resposta:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
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

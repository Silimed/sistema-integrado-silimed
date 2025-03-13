import axios from "axios";

// Configuração global do Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

// Adiciona headers padrão
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AuthService = {
  setToken() {
    console.log("Token recebido do servidor");
    this.setupAxiosInterceptors();
  },

  isAuthenticated() {
    const cookies = this.getCookies();
    console.log("Verificando autenticação...");
    console.log("Cookies disponíveis:", cookies);

    const hasAuthCookie = cookies.hasOwnProperty("auth_token");
    console.log("Cookie auth_token encontrado?", hasAuthCookie);

    return hasAuthCookie;
  },

  getCookies(): { [key: string]: string } {
    return document.cookie
      .split(";")
      .reduce((cookies: { [key: string]: string }, cookie) => {
        const [name, value] = cookie.trim().split("=");
        // Decodifica o valor do cookie
        cookies[name] = decodeURIComponent(value || "");
        return cookies;
      }, {});
  },

  getAuthToken(): string | null {
    const cookies = this.getCookies();
    const token = cookies["auth_token"];
    if (token) {
      try {
        // Decodifica o token que está em formato URI encoded
        const decodedToken = decodeURIComponent(token);
        console.log("Token decodificado, length:", decodedToken.length);
        return decodedToken;
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
      }
    }
    return null;
  },

  removeToken() {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=localhost";
    console.log("Token removido");
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
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  },
};

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { message } from "antd";
import LoginCard from "@/components/cardLogin";
import { AuthService } from "@/services/auth";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleVisionPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Iniciando tentativa de login...");

      // Validação básica
      if (!matricula.trim() || !password.trim()) {
        throw new Error("Matrícula e senha são obrigatórios");
      }

      const response = await axios.post(
        "/auth/login",
        {
          username: matricula.trim(),
          password: password.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Resposta do servidor:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      if (!response.data?.access_token) {
        throw new Error("Token não recebido do servidor");
      }

      // Configura o AuthService
      AuthService.setToken();

      // Verifica se o cookie foi definido
      const checkCookie = () => {
        const allCookies: Record<string, string> = document.cookie
          .split(";")
          .reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            acc[name] = value;
            return acc;
          }, {} as Record<string, string>);
        console.log("Todos os cookies disponíveis:", allCookies);
        return allCookies["auth_token"] !== undefined;
      };

      // Tenta algumas vezes verificar o cookie
      let attempts = 0;
      let cookieFound = false;
      while (attempts < 3 && !cookieFound) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Aumentado para 500ms
        cookieFound = checkCookie();
        attempts++;
        console.log(`Tentativa ${attempts} de verificar cookie:`, cookieFound);
      }

      if (!cookieFound) {
        console.warn("Cookie auth_token não encontrado após várias tentativas");
        throw new Error("Falha ao salvar o cookie de autenticação");
      }

      // Verifica se o token foi salvo corretamente
      const savedToken = AuthService.getAuthToken();
      if (savedToken) {
        console.log("Token salvo com sucesso, length:", savedToken.length);

        message.success("Login realizado com sucesso!");
        console.log("Aguardando antes de redirecionar...");

        // Aguarda um momento antes de redirecionar
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Redirecionando para o interceptor...");
        try {
          await router.push("/interceptor");
        } catch (navigationError) {
          console.error("Erro na navegação:", navigationError);
          // Tenta novamente com replace
          await router.replace("/interceptor");
        }
      } else {
        console.warn("Falha ao salvar o token");
        throw new Error("Falha ao recuperar o token salvo");
      }
    } catch (error: unknown) {
      console.error(
        "Erro no login:",
        error instanceof AxiosError
          ? {
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers,
            }
          : error
      );

      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            error.response?.data?.error_description ||
            "Erro ao realizar login"
          : error instanceof Error
          ? error.message
          : "Erro ao realizar login";

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginCard
      matricula={matricula}
      setMatricula={setMatricula}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      toggleVisionPassword={toggleVisionPassword}
      handleLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
}

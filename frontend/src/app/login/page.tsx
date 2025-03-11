"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { message } from "antd";
import LoginCard from "@/components/cardLogin";

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
      // Tentativa de login
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        new URLSearchParams({
          username: matricula,
          password: password,
          client_id: "NestJS",
          client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
          grant_type: "password",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data?.access_token;

      if (!token) {
        throw new Error("Token não recebido do servidor");
      }

      // Armazena o token
      localStorage.setItem("access_token", token);

      // Validação do token
      const validationResponse = await axios.post(
        "http://localhost:3000/auth/validate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (validationResponse.data.valid) {
        message.success("Login realizado com sucesso!");
        router.push("/interceptor");
      } else {
        throw new Error("Token inválido");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.status === 401
            ? "Matrícula ou senha incorretos"
            : error.response?.data?.message || "Erro ao realizar login";
        setError(errorMessage);
        message.error(errorMessage);
      } else {
        setError("Erro ao realizar login. Tente novamente.");
        message.error("Erro ao realizar login. Tente novamente.");
      }
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#e9ecef",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoginCard
        matricula={matricula}
        setMatricula={setMatricula}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        toggleVisionPassword={toggleVisionPassword}
        loading={loading}
        error={error}
        onSubmit={handleLogin}
      />
      <footer
        style={{
          color: "#666666",
          fontSize: 12,
          position: "absolute",
          bottom: 16,
          textAlign: "center",
        }}
      >
        2025 © Desenvolvido por Silimed Empresa de Implantes LTDA
      </footer>
    </div>
  );
}

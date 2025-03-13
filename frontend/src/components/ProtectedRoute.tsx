import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message, Spin } from "antd";
import axios from "axios";
import { AuthService } from "@/services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedSetores?: string[];
}

export default function ProtectedRoute({
  children,
  allowedSetores = [],
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        console.log("Verificando autenticação na rota protegida...");
        const isAuthenticated = AuthService.isAuthenticated();

        if (!isAuthenticated) {
          console.log("Usuário não autenticado");
          message.error("Sessão expirada. Por favor, faça login novamente.");
          router.push("/login");
          return;
        }

        const token = AuthService.getAuthToken();
        if (!token) {
          throw new Error("Token não encontrado");
        }

        // Valida o token
        const validationResponse = await axios.post(
          "/auth/validate",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!validationResponse.data.valid) {
          throw new Error("Token inválido");
        }

        // Se há setores permitidos, verifica se o usuário tem acesso
        if (allowedSetores.length > 0) {
          const userSetores = validationResponse.data.setores || [];
          const hasAccess = userSetores.some(
            (setor: string) => allowedSetores.includes(setor) || setor === "TI"
          );

          if (!hasAccess) {
            message.error("Você não tem permissão para acessar esta página");
            router.push("/interceptor");
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Erro na validação de acesso:", error);
        message.error("Sessão expirada. Por favor, faça login novamente.");
        AuthService.removeToken();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [router, allowedSetores]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

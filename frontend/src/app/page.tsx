"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { AuthService } from "@/services/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (AuthService.isAuthenticated()) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spin size="large" tip="Redirecionando..." />
    </div>
  );
}

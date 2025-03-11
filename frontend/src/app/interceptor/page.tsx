"use client";

import { useEffect, useState } from "react";
import { ApplicationCard } from "@/components/ApplicationCard";

interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  sectors: string[];
}

export default function InterceptorPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [userSector, setUserSector] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSector = async () => {
      return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo ao Portal
              </h1>
              <p className="text-xl text-blue-600 mb-2">Setor: {userSector}</p>
              <p className="text-gray-600 mb-8">
                Selecione uma das aplicações disponíveis para o seu setor
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-500">
                  Nenhuma aplicação disponível para o seu setor no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    };
  });
}

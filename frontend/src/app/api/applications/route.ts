import { NextResponse } from "next/server";

const mockApplications = [
  {
    id: "1",
    name: "Sistema de Gestão",
    description: "Sistema integrado para gestão de processos internos",
    url: "/gestao",
    icon: "/icons/gestao.svg",
    sectors: ["Administrativo", "RH", "Financeiro"],
  },
  {
    id: "2",
    name: "Portal do Colaborador",
    description: "Acesse informações e serviços relacionados ao RH",
    url: "/colaborador",
    icon: "/icons/colaborador.svg",
    sectors: ["RH", "Todos"],
  },
  {
    id: "3",
    name: "Sistema Financeiro",
    description: "Controle financeiro e contábil",
    url: "/financeiro",
    icon: "/icons/financeiro.svg",
    sectors: ["Financeiro", "Contabilidade"],
  },
  {
    id: "4",
    name: "Controle de Produção",
    description: "Gestão e acompanhamento da produção",
    url: "/producao",
    icon: "/icons/producao.svg",
    sectors: ["Produção", "Qualidade"],
  },
];

export async function GET() {
  return NextResponse.json(mockApplications);
}

export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  setoresPermitidos: string[];
}

export const applications: Application[] = [
  {
    id: "sistema-silidesk",
    name: "Silidesk",
    description: "Sistema para controle de Gente & Gestão",
    url: "http://localhost:3001/silidesk",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "RH", "Infraestrutura"],
  },
  {
    id: "sistema-financeiro",
    name: "Sistema Financeiro",
    description: "Sistema de gestão financeira e contábil",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Financeiro"],
  },
  {
    id: "sistema-rh",
    name: "Portal RH",
    description: "Sistema de gestão de recursos humanos",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "RH"],
  },
  {
    id: "sistema-comercial",
    name: "Sistema Comercial",
    description: "Sistema de gestão comercial e vendas",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Comercial"],
  },
  {
    id: "dashboard-sistema-integrado",
    name: "Dashboard Sistema Integrado",
    description: "Dashboard para visualização de dados do sistema integrado",
    url: "http://localhost:3001/dashboard",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI"],
  },
  {
    id: "sistema-chamados",
    name: "Sistema de Chamados TI",
    description: "Sistema de chamados para TI",
    url: "/tickets/create",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: [
      "TI",
      "RH",
      "Infraestrutura",
      "Comercial",
      "Financeiro",
      "Produção",
      "Administrativo",
      "Diretoria",
      "Marketing",
    ],
  },
  {
    id: "gerenciamento-chamados",
    name: "Gerenciamento de Chamados",
    description: "Gerenciamento de chamados de TI",
    url: "/tickets",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI"],
  },
  {
    id: "quick-order",
    name: "Quick Order",
    description: "Sistema de pedido rápido",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Comercial"],
  },
  {
    id: "processo-doacao",
    name: "Processo de Doação",
    description: "Processo de doação",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Marketing"],
  },
  {
    id: "processo-exportacao",
    name: "Processo de Exportação",
    description: "Processo de exportação",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Suprimentos"],
  },
  {
    id: "processo-bonificacao",
    name: "Processo de Bonificação",
    description: "Processo de bonificação",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Financeiro"],
  },
  {
    id: "supply",
    name: "Supply",
    description: "Sistema de gestão de suprimentos",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Marketing"],
  },
  {
    id: "gerenciamento-de-eventos",
    name: "Gerenciamento de Eventos",
    description: "Sistema de gerenciamento de eventos",
    url: "#",
    icon: "/logo-sem-nome.png",
    setoresPermitidos: ["TI", "Marketing"],
  },
];

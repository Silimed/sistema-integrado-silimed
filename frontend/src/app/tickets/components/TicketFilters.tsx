"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { format } from "date-fns";

export interface TicketFilters {
  search: string;
  status: string;
  priority: string;
  sector: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface TicketFiltersProps {
  onFilterChange: (filters: TicketFilters) => void;
  sectors: string[];
  totalResults: number;
}

const statusOptions = ["Todos", "Aberto", "Em Andamento", "Fechado"];
const priorityOptions = ["Todas", "Baixa", "Média", "Alta"];

export function TicketFilters({
  onFilterChange,
  sectors,
  totalResults,
}: TicketFiltersProps) {
  const [filters, setFilters] = useState<TicketFilters>({
    search: "",
    status: "Todos",
    priority: "Todas",
    sector: "Todos",
    dateFrom: null,
    dateTo: null,
  });

  const handleFilterChange = (
    key: keyof TicketFilters,
    value: string | Date | null
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (key: "dateFrom" | "dateTo", dateString: string) => {
    const date = dateString ? new Date(dateString) : null;
    handleFilterChange(key, date);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      status: "Todos",
      priority: "Todas",
      sector: "Todos",
      dateFrom: null,
      dateTo: null,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <span className="text-sm text-gray-600">
          {totalResults}{" "}
          {totalResults === 1
            ? "resultado encontrado"
            : "resultados encontrados"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="search"
                >
                  Buscar
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Busque por título ou descrição do chamado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            id="search"
            type="text"
            placeholder="Buscar por título ou descrição"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            aria-label="Buscar chamados"
          />
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="status"
                >
                  Status
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtre chamados por status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="priority"
                >
                  Prioridade
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtre chamados por nível de prioridade</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select
            value={filters.priority}
            onValueChange={(value) => handleFilterChange("priority", value)}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="sector"
                >
                  Setor
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtre chamados por setor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select
            value={filters.sector}
            onValueChange={(value) => handleFilterChange("sector", value)}
          >
            <SelectTrigger id="sector">
              <SelectValue placeholder="Selecione o setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="dateFrom"
                >
                  Data Inicial
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtre chamados a partir desta data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            id="dateFrom"
            type="date"
            value={
              filters.dateFrom ? format(filters.dateFrom, "yyyy-MM-dd") : ""
            }
            onChange={(e) => handleDateChange("dateFrom", e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="dateTo"
                >
                  Data Final
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtre chamados até esta data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo ? format(filters.dateTo, "yyyy-MM-dd") : ""}
            onChange={(e) => handleDateChange("dateTo", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="hover:bg-gray-100"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}

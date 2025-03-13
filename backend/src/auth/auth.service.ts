import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import {
  KeycloakPayload,
  TokenValidationResponse,
} from "./interfaces/keycloak.interface";

@Injectable()
export class AuthService {
  async loginWithKeycloak(credentials: { username: string; password: string }) {
    // Validação mais rigorosa das credenciais
    if (
      !credentials ||
      typeof credentials.username !== "string" ||
      typeof credentials.password !== "string" ||
      credentials.username.trim() === "" ||
      credentials.password.trim() === ""
    ) {
      throw new Error(
        "credenciais inválidas: username e password são obrigatórios"
      );
    }

    // Limpar as credenciais
    const cleanUsername = credentials.username.trim();
    const cleanPassword = credentials.password.trim();

    // Validação adicional após a limpeza
    if (cleanUsername === "" || cleanPassword === "") {
      throw new Error(
        "credenciais inválidas: username e password não podem estar vazios"
      );
    }

    console.log("Tentativa de login para usuário:", cleanUsername);

    try {
      // Primeiro tentamos obter o token
      const params = new URLSearchParams({
        client_id: "NestJS",
        client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
        grant_type: "password",
        username: cleanUsername,
        password: cleanPassword,
        scope: "openid profile email groups roles",
      });

      console.log("Parâmetros da requisição:", params.toString());

      // Adicionar headers para forçar nova autenticação
      const response = await axios.post(
        `http://localhost:8080/realms/Silimed/protocol/openid-connect/token`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          validateStatus: (status) => status < 500, // Para capturar erros 4xx
        }
      );

      // Se a resposta não for 200, significa que houve erro de autenticação
      if (response.status !== 200) {
        console.log("Erro na autenticação:", response.status, response.data);
        throw new Error(
          `Erro na autenticação: ${response.data?.error_description || "Credenciais inválidas"}`
        );
      }

      // Decodificar o token para validação
      const decodedToken = jwt.decode(response.data.access_token);

      // Validação rigorosa do token
      if (!decodedToken || typeof decodedToken !== "object") {
        throw new Error("Token inválido recebido do Keycloak");
      }

      // Verificar se o usuário do token corresponde ao usuário da requisição
      if (decodedToken.preferred_username !== cleanUsername) {
        console.log(
          `Erro de correspondência de usuário: esperado ${cleanUsername}, recebido ${decodedToken.preferred_username}`
        );
        throw new Error("Erro de autenticação: usuário inválido");
      }

      return response.data;
    } catch (error) {
      // Se o erro for "Account is not fully set up", vamos tentar configurar o usuário
      if (
        error.response?.data?.error_description ===
        "Account is not fully set up"
      ) {
        try {
          // Primeiro, obter o token de admin
          const adminToken = await this.getAdminToken();

          // Buscar o usuário pelo username
          const usersResponse = await axios.get(
            `http://localhost:8080/admin/realms/Silimed/users?username=${cleanUsername}&exact=true`,
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );

          if (!usersResponse.data || usersResponse.data.length === 0) {
            throw new Error("Usuário não encontrado no Keycloak");
          }

          const userId = usersResponse.data[0].id;
          console.log("Dados atuais do usuário:", usersResponse.data[0]);

          // Remover todas as required actions
          await axios.put(
            `http://localhost:8080/admin/realms/Silimed/users/${userId}`,
            {
              enabled: true,
              emailVerified: true,
              requiredActions: [],
            },
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          // Aguardar um momento para as alterações serem aplicadas
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Tentar autenticação novamente com um escopo mais limitado
          const retryResponse = await axios.post(
            `http://localhost:8080/realms/Silimed/protocol/openid-connect/token`,
            new URLSearchParams({
              client_id: "NestJS",
              client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
              grant_type: "password",
              username: cleanUsername,
              password: cleanPassword,
              scope: "openid",
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          return retryResponse.data;
        } catch (retryError) {
          console.log(
            "Erro na tentativa de configuração:",
            retryError.response?.data || retryError.message
          );
          throw new Error(
            "Falha ao configurar a conta. Por favor, contate o administrador."
          );
        }
      }

      console.log("Erro completo:", error.response?.data);
      throw new Error(
        `falha na autenticação: ${error.response?.data?.error_description || error.message}`
      );
    }
  }

  private async getAdminToken(): Promise<string> {
    try {
      const response = await axios.post(
        `http://localhost:8080/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: "admin-cli",
          username: "admin",
          password: "admin",
          grant_type: "password",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.log("Erro ao obter token admin:", error.response?.data);
      throw new Error("Falha ao obter token administrativo");
    }
  }

  async validateToken(token: string): Promise<TokenValidationResponse> {
    try {
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHe2U4Zakpj5jzMhF/Wwcsm/FvyCUxD0g4d8y154Zwopgceb5l59lxpcY49Oc9aOf2l1mvFiypQZnqIBAXGsZnlOuV1JnizSagtubCgoYdR3zXq7Jg2bSLr95xqZLSTZtDUELyJznY8Ph0MrsZQPYVmwl5DAqz/m7QSWSmHhkXxI15pl2rEYlv+xoZdHd8QZT7vUDV7donIyxVDfAw/8PmbmP75KGXr9CuZl/mvl79eXKRGCNfuY4e2i2Txf0OwzC2VlMEvJPBJH47Rfs/jpHU2lTmhogLzYNHXsUkfuZzgGt97U3NdnkeUsQ5uarfEQpn6DBNDKbOf5Xhu26dkdQIDAQAB
-----END PUBLIC KEY-----`;

      console.log("Iniciando validação do token");
      const payload = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      }) as KeycloakPayload;

      console.log("Token decodificado:", JSON.stringify(payload, null, 2));
      console.log("Grupos originais:", payload.groups);

      // Extrair os setores dos grupos
      const setores = (payload.groups || []).map((group) => {
        const setor = group.replace(/^\/Setores\//, "");
        console.log(`Processando grupo: ${group} -> setor: ${setor}`);
        return setor;
      });

      console.log("Setores extraídos:", setores);

      const response = {
        payload,
        groups: payload.groups || [],
        realm_access: {
          roles: payload.realm_access?.roles || [],
          groups: payload.groups || [],
        },
        setores,
      };

      console.log("Resposta final:", JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error("Erro na validação do token:", error);
      throw new Error(`token inválido: ${error.message}`);
    }
  }

  getHello(): string {
    return "Hello World!";
  }
}

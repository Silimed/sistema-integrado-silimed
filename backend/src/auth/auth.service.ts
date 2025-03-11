import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as jwt from "jsonwebtoken"; // Importe a biblioteca jsonwebtoken

@Injectable()
export class AuthService {
  async loginWithKeycloak(credentials: { username: string; password: string }) {
    if (!credentials || !credentials.password || !credentials.username) {
      throw new Error("credenciais inválidas");
    }

    console.log("dados enviados para o Keycloak: ", {
      client_id: "NestJS",
      client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
      grant_type: "password",
      username: credentials.username,
      password: credentials.password,
    });

    try {
      const response = await axios.post(
        `http://localhost:8080/realms/Silimed/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: "NestJS",
          client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
          grant_type: "password",
          username: credentials.username,
          password: credentials.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.response?.data);
      throw new Error(
        `falha na autenticação: ${error.response?.data?.error_description || error.message}`
      );
    }
  }

  async validateToken(token: string) {
    try {
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHe2U4Zakpj5jzMhF/Wwcsm/FvyCUxD0g4d8y154Zwopgceb5l59lxpcY49Oc9aOf2l1mvFiypQZnqIBAXGsZnlOuV1JnizSagtubCgoYdR3zXq7Jg2bSLr95xqZLSTZtDUELyJznY8Ph0MrsZQPYVmwl5DAqz/m7QSWSmHhkXxI15pl2rEYlv+xoZdHd8QZT7vUDV7donIyxVDfAw/8PmbmP75KGXr9CuZl/mvl79eXKRGCNfuY4e2i2Txf0OwzC2VlMEvJPBJH47Rfs/jpHU2lTmhogLzYNHXsUkfuZzgGt97U3NdnkeUsQ5uarfEQpn6DBNDKbOf5Xhu26dkdQIDAQAB
-----END PUBLIC KEY-----`;

      const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] }); // Valida o token com a chave pública
      return { payload };
    } catch (error) {
      throw new Error(`token inválido: ${error.message}`);
    }
  }

  getHello(): string {
    return "Hello World!";
  }
}

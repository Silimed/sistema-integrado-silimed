"use client";
import { Dispatch, SetStateAction } from "react";
import { Input, Button, Form, Card } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Image from "next/image";
import LogoSilimed from "../../public/logo-silimed.png";

interface CardLoginProps {
  matricula: string;
  setMatricula: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  showPassword: boolean;
  toggleVisionPassword: () => void;
  loading: boolean;
  error: string;
  handleLogin: () => Promise<void>;
}

export default function LoginCard({
  matricula,
  setMatricula,
  password,
  setPassword,
  showPassword,
  toggleVisionPassword,
  loading,
  error,
  handleLogin,
}: CardLoginProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#D9E1E2",
      }}
    >
      <Card
        variant="borderless"
        style={{
          width: 400,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Cabeçalho laranja com logo */}
        <div
          style={{
            backgroundColor: "#FF6A39",
            paddingTop: 36,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "400px",
            marginTop: -24,
            paddingBottom: 8,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginBottom: 24,
          }}
        >
          <Image src={LogoSilimed} width={90} height={30} alt="Logo Silimed" />
        </div>

        {/* Corpo branco do cartão */}
        <div
          style={{
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Título e subtítulo */}
          <h2
            style={{
              fontSize: 24,
              fontWeight: 500,
              textAlign: "center",
              color: "#333333",
              marginBottom: 8,
            }}
          >
            Login
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#666666",
              textAlign: "center",
              marginBottom: 24,
              marginTop: 8,
            }}
          >
            Entre com sua matricula e sua senha
            <br />
            para realizar o acesso ao novo
            <br />
            Sistema Integrado Silimed
          </p>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Campo Email Corporativo */}
            <Form.Item
              label={
                <span
                  style={{
                    fontSize: 14,
                    color: "#666666",
                    fontWeight: 500,
                  }}
                >
                  Matricula
                </span>
              }
              style={{ marginBottom: 8, width: 350 }}
            >
              <Input
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="
              digite aqui sua matricula"
                style={{ height: 40, borderRadius: 4, width: "100%" }}
              />
            </Form.Item>

            {/* Campo Senha */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    fontSize: 14,
                    color: "#666666",
                    fontWeight: 500,
                  }}
                >
                  Senha
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#666666",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="
              digite aqui sua senha"
                style={{ height: 40, borderRadius: 4, width: "100%" }}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: toggleVisionPassword,
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  color: "#FF0000",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {error}
              </div>
            )}

            {/* Botão Entrar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Button
                htmlType="submit"
                loading={loading}
                className="hover:bg-[#d85a2a]"
                style={{
                  backgroundColor: "#f26836",
                  border: "none",
                  padding: "0 2rem",
                  height: "2.25rem",
                  borderRadius: "0.25rem",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#FFFFFF",
                }}
              >
                Entrar
              </Button>
            </div>
          </Form>
        </div>
      </Card>

      <footer
        style={{
          position: "absolute",
          bottom: "16px",
          color: "#666666",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        2025 © Desenvolvido por Silimed Empresa de Implantes LTDA
      </footer>
    </div>
  );
}

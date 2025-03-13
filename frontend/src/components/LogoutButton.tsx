import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { AuthService } from "@/services/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", null, {
        withCredentials: true,
      });
      AuthService.removeToken();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, remove o token e redireciona
      AuthService.removeToken();
      router.push("/login");
    }
  };

  return (
    <Button
      type="primary"
      danger
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      style={{ position: "relative", left: "93%", bottom: "50px" }}
    >
      Sair
    </Button>
  );
}

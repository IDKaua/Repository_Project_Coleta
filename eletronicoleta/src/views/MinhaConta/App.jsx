import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProfileCard from "./components/ProfileCard";
import ProfileForm from "./components/ProfileForm";
import "./index.css";

function App() {
  const [nome, setNome] = useState("João Silva");
  const [email, setEmail] = useState("joao@email.com");

  return (
    <>
      <div className="container">
        <Sidebar />

        <div className="content">
          <ProfileCard nome={nome} email={email} />
          <ProfileForm setNome={setNome} setEmail={setEmail} />
        </div>
      </div>

      <footer>
        <p>© 2026 Minha Conta. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default App;
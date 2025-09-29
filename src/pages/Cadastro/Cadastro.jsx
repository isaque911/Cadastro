import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/trash.svg";
import api from "../../services/api.js";

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();

  async function getUsers() {
    try {
      let res = await api.get("/usuario");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  }

  async function createUsers() {
    if (
      !inputName.current.value.trim() ||
      !inputEmail.current.value.trim() ||
      !inputPassword.current.value.trim()
    ) {
      // eslint-disable-next-line no-undef
      return (res.json().message = "Por favor, preencha todos os campos!");
    }
    try {
      await api.post("/usuario", {
        name: inputName.current.value,
        email: inputEmail.current.value,
        password: inputPassword.current.value,
      });

      getUsers();
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
    }
  }

  async function deleteUsers(id) {
    try {
      await api.delete(`/usuario/${id}`);

      getUsers();
    } catch (err) {
      console.log("Erro ao deletar o usuário tente novamente", err);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="conteiner">
      <form>
        <h1>Cadastro</h1>
        <input placeholder="Nome" name="name" type="text" ref={inputName} />
        <input placeholder="Email" name="email" type="email" ref={inputEmail} />
        <input
          placeholder="Senha"
          name="password"
          type="password"
          ref={inputPassword}
        />
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div className="cart">
            <p>
              Nome: <span> {user.name} </span>
            </p>
            <p>
              Email: <span> {user.email} </span>
            </p>
            <p>
              Senha: <span>{user.password}</span>
            </p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;

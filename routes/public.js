import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();
router.use(express.json());

// Ler usuario

router.get("/usuario", async (req, res) => {
  let users = [];

  if (req.query) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        password: req.query.password,
      },
    });
  } else {
    users = await prisma.user.findMany({});
  }

  res.status(200).json(users);
});

// Cadastro

router.post("/usuario", async (req, res) => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hasPassword,
      },
    });
    res.status(201).json(userDB);
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor, tente novamente" });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const infoUser = req.body;

    const user = await prisma.user.findUnique({
      where: { email: infoUser.email },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const descrypt = await bcrypt.compare(infoUser.password, user.password);

    if (!descrypt) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // Apenas retorna o usuário autenticado (sem token)
    res.status(200).json({ message: "Login realizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro usuário já cadastrado" });
  }
});

// Atualizar Cadastro
router.put("/usuario/:id", async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const autUser = req.params.id;
    await prisma.user.update({
      where: { id: autUser },
      data: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    res.status(200).json({ message: "Dados atualizados com sucesso!" });
  } catch (error) {
    res.status(400).json({ message: "Erro, os dados não foram  modificados" });
  }
});

//  Deletar Cadastro
router.delete("/usuario/:id", async (req, res) => {
  try {
    const User = req.params.id;
    await prisma.user.delete({
      where: { id: User },
    });
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(400).json({ message: "Erro, o usuário não foi encontrado" });
  }
});

export default router;

import express from "express";
import bcrypt from "bcrypt";
// import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json());

app.get("/", (request, response) => {
  return response.json("OK");
});

app.listen(port, () =>
  console.log(`Servidor iniciado rodando na porta ${port}`)
);

// cadastro veículos

const veiculos = [];
let contador = 1;

const alunos = [];

app.post("/alunos", async(req, res)=> {
  //Criar Login

const senha = req.body.senha;
const email = req.body.email;
const nomeDeUsuario = req.body.nomeDeUsuario;

const hashedSenha = await bcrypt.hash(senha, 10); //criptografa senha

const novoAluno = {
  nomeDeUsuario,
  email,
  hashedSenha,
};

alunos.push(novoAluno);

res.status(200).send("Aluno cadastrado");
})

app.get("/alunos", (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Lista de veículos retornado com sucesso.",
    lista: alunos,
  });
});

// verificar e-mail
app.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const alunoFiltrado = alunos.find((aluno) => aluno.email === email);

  if (alunoFiltrado) {
    bcrypt.compare(senha, alunoFiltrado.hashedSenha, (error, result) => {
      if (result){
        res.status(200).json({ success: true, message: "Login bem-sucedido!"});
      }else{
        res.status(400).json({ success: false, message: "Usuário ou Senha incorretos!", error: error});
      }
    })
  }else{
    res.status(404).send("Aluno não encontrado.");
  }
})

// verificar senha






app.post("/veiculos", (req, res) => {
  const data = req.body;
  veiculos.push({
    id: contador,
    marca: data.marca,
    modelo: data.modelo,
    ano: data.ano,
    cor: data.cor,
    preco: data.preco,
    email: data.email,
    senha: data.senha,
  });
  contador++;
  res.status(201).json({ message: "Veículo Cadastrado!" });
});

//Lista os Veículos

app.get("/veiculos", (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Lista de veículos retornado com sucesso.",
    lista: veiculos,
  });
});

// Filtrar Veículos

app.get("/veiculos/:marcaVeiculo", (req, res) => {
  const marcaVeiculo = req.params.marcaVeiculo;

  const veiculoFiltrado = veiculos.filter(
    (veiculo) => veiculo.marca === marcaVeiculo
  );

  if (veiculoFiltrado){
    res
    .status(200)
    .json({ message: "Veículo localizado com sucesso", data: veiculoFiltrado });
  }else{
    res.status(404).json({
      message: "Veículo não localizado!"
    })
  }
});

// Atualiza os Veículos

app.put("/veiculos/:veiculosId", (req, res) => {
  const data = req.body;

  const veiculoId = parseInt(req.params.veiculosId);
  const cor = data.cor;
  const preco = data.preco;

  const veiculoIndex = veiculos.findIndex(
    (veiculo) => veiculo.id === veiculoId
  );

  if (veiculoIndex !== -1) {
    const veiculo = veiculos[veiculoIndex];
    veiculo.cor = cor;
    veiculo.preco = preco;

    res.status(200).json({
      message: "Veículo Atualizado com Sucesso!",
    });
  } else {
    return res.status(404).json({
      message: "Veículo não encontrado!",
    });
  }
});

// Deleta Veículo

app.delete("/veiculos/:veiculosId", (req, res) => {
  const veiculoId = parseInt(req.params.veiculosId);
  const veiculoIndex = veiculos.findIndex(
    (veiculos) => veiculos.id === veiculoId
  );

  if (veiculoIndex !== -1) {
    veiculos.splice(veiculoIndex, 1);
    res.status(200).json({
      message: "Veículo deletado!",
    });
  } else {
    return res.status(404).json({
      message: "Veículo não encontrado!",
    });
  }
});


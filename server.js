const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, "./databases/products-db.json");
const categoryFilePath = path.join(__dirname, "./databases/category-db.json");

app.use(cors()); // Adiciona o middleware CORS
app.use(express.json());

// Função para ler o JSON do arquivo
function readJSONFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Função para escrever o JSON no arquivo
function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET para obter todos os itens ou filtrados por ownerId
app.get("/items", (req, res) => {
  const ownerId = parseInt(req.query.ownerId);
  const items = readJSONFile(dataFilePath);

  if (ownerId) {
    const filteredItems = items.filter((item) => item.ownerId === ownerId);
    res.json(filteredItems);
  } else {
    res.json(items);
  }
});

// GET para obter todas as categorias ou filtradas por ownerId
app.get("/categories", (req, res) => {
  const ownerId = parseInt(req.query.ownerId);
  const categories = readJSONFile(categoryFilePath);

  if (ownerId) {
    const filteredCategories = categories.filter(
      (category) => category.ownerId === ownerId
    );
    res.json(filteredCategories);
  } else {
    res.json(categories);
  }
});

// Outras rotas e funções de manipulação de dados (POST, PUT, DELETE)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

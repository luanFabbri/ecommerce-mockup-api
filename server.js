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

// POST para criar um novo item
app.post("/items", (req, res) => {
  const newItem = req.body;
  const items = readJSONFile(dataFilePath);
  newItem.id = items.length ? items[items.length - 1].id + 1 : 1; // Atribui um novo ID
  items.push(newItem);
  writeJSONFile(dataFilePath, items);
  res.status(201).json(newItem);
});

// PUT para atualizar um item existente
app.put("/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const items = readJSONFile(dataFilePath);
  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    items[itemIndex] = { ...items[itemIndex], ...updatedItem };
    writeJSONFile(dataFilePath, items);
    res.json(items[itemIndex]);
  } else {
    res.status(404).json({ message: "Item não encontrado" });
  }
});

// DELETE para remover um item
app.delete("/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const items = readJSONFile(dataFilePath);
  const newItems = items.filter((item) => item.id !== itemId);

  if (newItems.length === items.length) {
    res.status(404).json({ message: "Item não encontrado" });
  } else {
    writeJSONFile(dataFilePath, newItems);
    res.status(204).end();
  }
});

// POST para criar uma nova categoria
app.post("/categories", (req, res) => {
  const newCategory = req.body;
  const categories = readJSONFile(categoryFilePath);
  newCategory.id = categories.length
    ? categories[categories.length - 1].id + 1
    : 1; // Atribui um novo ID
  categories.push(newCategory);
  writeJSONFile(categoryFilePath, categories);
  res.status(201).json(newCategory);
});

// PUT para atualizar uma categoria existente
app.put("/categories/:id", (req, res) => {
  const categoryId = parseInt(req.params.id);
  const updatedCategory = req.body;
  const categories = readJSONFile(categoryFilePath);
  const categoryIndex = categories.findIndex(
    (category) => category.id === categoryId
  );

  if (categoryIndex !== -1) {
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...updatedCategory,
    };
    writeJSONFile(categoryFilePath, categories);
    res.json(categories[categoryIndex]);
  } else {
    res.status(404).json({ message: "Categoria não encontrada" });
  }
});
// DELETE para remover uma categoria
app.delete("/categories/:id", (req, res) => {
  const categoryId = parseInt(req.params.id);
  const ownerId = parseInt(req.query.ownerId);

  if (isNaN(ownerId)) {
    return res
      .status(400)
      .json({ message: "ownerId é obrigatório e deve ser um número" });
  }

  const categories = readJSONFile(categoryFilePath);
  const newCategories = categories.filter(
    (category) => !(category.id === categoryId && category.ownerId === ownerId)
  );

  if (newCategories.length === categories.length) {
    res.status(404).json({ message: "Categoria não encontrada" });
  } else {
    writeJSONFile(categoryFilePath, newCategories);
    res.status(204).end(); // Apenas envia um status 204 No Content
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

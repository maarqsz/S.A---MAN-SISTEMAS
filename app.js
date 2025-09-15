const express = require("express");
const fs = require("fs").promises; 
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json({ limit: "1mb" })); 

app.use((req, res, next) => {
  console.log("REQ", new Date().toISOString(), req.method, req.url);
  next();
});

const DB_FILE = path.join(__dirname, "tickets.json");

async function readDb() {
  try {
    const txt = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(txt);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2)); 
}

app.get("/tickets", async (req, res) => {
  try {
    let list = await readDb();

    if (req.query.filter) {
      const filterKey = req.query.filter;
      list = list.filter((t) => t[filterKey]);
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).send("Erro ao ler o banco de dados");
  }
});

app.post("/tickets", async (req, res) => {
  if (!req.body.title || !req.body.customer) {
    return res.status(400).send("Campos 'title' e 'customer' são obrigatórios.");
  }

  try {
    const db = await readDb();
    const newTicket = {
      id: uuidv4(), 
      title: req.body.title, 
      customer: req.body.customer,
      status: req.body.status || "open",
      createdAt: new Date().toISOString(),
    };

    db.push(newTicket);
    await writeDb(db);

    res.status(201).json({ ok: true, id: newTicket.id });
  } catch (error) {
    res.status(500).send("Erro ao criar o ticket");
  }
});

app.put("/tickets/:id/status", async (req, res) => {
  try {
    const db = await readDb();
    const t = db.find((x) => x.id === req.params.id);

    if (!t) {
      return res.status(404).send("Ticket não encontrado");
    }

    t.status = req.body.status;

    await writeDb(db);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).send("Erro ao atualizar o status");
  }
});

app.listen(3000, () => console.log("HelpDesk+ rodando na porta 3000"));
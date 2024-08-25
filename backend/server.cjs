const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = path.join(__dirname, '..', 'client', 'src', 'data', 'data.json');

function getPossessions() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        const patrimoine = jsonData.find(item => item.model === 'Patrimoine');
        return patrimoine.data.possessions;
    }
    catch (err) {
        console.error('Erreur de lecture du fichier JSON:', err);
        return [];
    }
}


/**
 * 
 * @example
 * utilisation:
 * 
 * 
 * curl -X POST http://localhost:3000/possession \
  -H "Content-Type: application/json" \
  -d '{
    "possesseur": {
      "nom": "John Doe"
    },
    "libelle": "MacBook Pro",
    "valeur": 4000000,
    "dateDebut": "2023-12-25T00:00:00.000Z",
    "dateFin": null,
    "tauxAmortissement": 30
  }'

 */

function addPossession(newPossession) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        const patrimoine = jsonData.find(item => item.model === 'Patrimoine');

        patrimoine.data.possessions.push(newPossession);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        return patrimoine.data.possessions;
    }
    catch (err) {
        console.error("Erreur dans l'édition du fichier JSON:", err);
        throw err;
    }
}


app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur Express!');
});

app.get('/possession', (req, res) => {
    const possessions = getPossessions();
    res.json(possessions);
});

app.post('/possession', (req, res) => {
    const newPossession = req.body;
    try {
        const possessions = addPossession(newPossession);
        res.status(201).json(possessions);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de la possession.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

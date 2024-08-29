const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173' 
}));


/*
const date = new Date();
console.log (date);*/

app.use(express.json());

const filePath = path.join(__dirname, '..', 'client', 'src', 'data', 'data.json');


/**
 * 
 * juste mettre http://localhost:PORT/possession
 */
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
 *exemple  d'utilisation:
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

/**
 * 
 * exemple d'utilisation:
`curl -X PATCH "http://localhost:3000/possession/libelle de la possession" \
    -H "Content-Type: application/json" \
    -d '{"dateFin": "date de fin celon son format"}' `

 */

function updatePossession(libelle, newValues) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        const patrimoine = jsonData.find(item => item.model === 'Patrimoine');
        const possession = patrimoine.data.possessions.find(p => p.libelle === libelle);

        if (possession) {
            Object.assign(possession, newValues);
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
            return possession;
        } else {
            throw new Error('Possession non trouvée');
        }
    } catch (err) {
        console.error("Erreur lors de la mise à jour du fichier JSON:", err);
        throw err;
    }
}

/**
 * 
 * exemple d'utilisation: 
 * curl -X PATCH "http://localhost:3000/possession/libelle_cible/close"
 */
function closePossession(libelle) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        const patrimoine = jsonData.find(item => item.model === 'Patrimoine');
        if (!patrimoine) throw new Error('Patrimoine non trouvé');

        const possession = patrimoine.data.possessions.find(p => p.libelle === libelle);
        if (possession) {
            possession.dateFin = new Date().toISOString();
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
            return possession.dateFin;
        } else {
            throw new Error('Possession non trouvée');
        }
    } catch (err) {
        console.error("Erreur dans l'édition du fichier JSON:", err);
        throw err;
    }
}






app.get('/', (req, res) => {
    res.send('serveur Express!');
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

app.patch('/possession/:libelle', (req, res) => {
    const libelle = req.params.libelle;
    const newValues = req.body;

    try {
        const updatedPossession = updatePossession(libelle, newValues);
        res.status(200).json(updatedPossession);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la possession.' });
    }
});


app.patch('/possession/:libelle/close', (req, res) => {

    const libelle = req.params.libelle;

    try {
        const closedPossession = closePossession(libelle);
        if (closedPossession) {
            res.status(200).json(closedPossession);
        } else {
            res.status(404).json({ error: 'Possession non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la possession.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

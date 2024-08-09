import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import data from '../src/data/data.json';
import Possession from './models/possessions/Possession';
import './App.css';

const transformDataToPossessions = (data) => {
  const possessionsData = data.find(item => item.model === "Patrimoine").data.possessions;

  return possessionsData.map(item => 
    new Possession(
      item.possesseur.nom,
      item.libelle,
      item.valeur,
      new Date(item.dateDebut),
      item.dateFin ? new Date(item.dateFin) : null,
      item.tauxAmortissement,
      item.jour || null, 
      item.valeurConstante || null  
    )
  );
};

function App() {
  const [info, setInfo] = useState([]);
  const [dateActuelle, setDateActuelle] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const possessions = transformDataToPossessions(data);
    setInfo(possessions);
  }, []);

  const handleDateActuelleChange = (event) => {
    setDateActuelle(event.target.value);
  };

  const currentDate = new Date(dateActuelle);

  const calculerSommeTotale = () => {
    return info.reduce((total, poss) => total + poss.getValeur(currentDate), 0);
  };

  return (
    <>
      <label>
        <h1>Liste de Patrimoine :</h1>
      </label>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur initiale</th>
            <th>Date de debut</th>
            <th>Date de fin</th>
            <th>Amortissement</th>
            <th>
              Valeur à la date T: 
              <label>
                <input
                  type="date"
                  value={dateActuelle}
                  onChange={handleDateActuelleChange}
                />
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          {info.map((poss, index) => (
            <tr key={index}>
              <td>{poss.libelle}</td>
              <td>{poss.valeur.toFixed(2)} Ar</td>
              <td>{poss.dateDebut.toLocaleDateString()}</td>
              <td>{poss.dateFin ? poss.dateFin.toLocaleDateString() : ''}</td>
              <td>{poss.tauxAmortissement ? `${poss.tauxAmortissement}%` : ''}</td>
              <td>{poss.getValeur(currentDate).toFixed(2)} Ar</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h1>
        Estimation du Patrimoine: {calculerSommeTotale().toFixed(2)} Ar
      </h1>
    </>
  );
}

export default App;

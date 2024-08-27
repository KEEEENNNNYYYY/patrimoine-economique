import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import data from '../data/data.json';
import Possession from "../models/possessions/Possession";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './header';
import Patrimoine from './Patrimoine';
import ListeDePossession from './ListPossession';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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


  const chartData = {
    labels: info.map(pos => pos.libelle),
    datasets: [
      {
        label: 'Valeur à la date T',
        data: info.map(pos => pos.getValeur(currentDate)),
        borderColor: 'green',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} Ar`;
          }
        }
      }
    },
    
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3, 
      }
    },
  };

  return (
    <>
      <Router>
        <div className='navbar'>
          <Navbar />
          <Routes>
            <Route path="/patrimoine" element={<Patrimoine />} />
            <Route path="/listePossession" element={<ListeDePossession />} />
          </Routes>
        </div>
      </Router>
      <label>
        <h1>Graphique du Patrimoine :</h1>
      </label>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
        <label>
          <input
            type="date"
            value={dateActuelle}
            onChange={handleDateActuelleChange}
          />
        </label>
      </div>
      <h1>
        Estimation du Patrimoine: {calculerSommeTotale().toFixed(2)} Ar
      </h1>
    </>
  );
}

export default App;

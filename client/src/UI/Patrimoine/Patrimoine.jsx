import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import data from '../../data/data.json';
import Possession from "../../models/possessions/Possession";
import { Line } from 'react-chartjs-2';


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
const Patrimoine = () => {
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


  const chartData = {
    labels: info.map(pos => pos.libelle),
    datasets: [
      {
        label: 'Valeur à la date T',
        data: info.map(pos => pos.getValeur(currentDate)),
        borderColor: 'rgba(75, 192, 192, 1)',
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
          label: function (tooltipItem) {
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
    <div>
      <h1>Graphique du Patrimoine :</h1>
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
    </div>
  )
};

export default Patrimoine;

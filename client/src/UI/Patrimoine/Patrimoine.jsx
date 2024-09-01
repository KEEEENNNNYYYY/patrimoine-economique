import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from '../../data/data.json';
import Possession from "../../models/possessions/Possession";

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
  const [dateDebut, setDateDebut] = useState(() => localStorage.getItem('dateDebut') || new Date().toISOString().split('T')[0]);
  const [dateFin, setDateFin] = useState(() => localStorage.getItem('dateFin') || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const possessions = transformDataToPossessions(data);
    setInfo(possessions);
  }, []);

  useEffect(() => {
    localStorage.setItem('dateDebut', dateDebut);
  }, [dateDebut]);

  useEffect(() => {
    localStorage.setItem('dateFin', dateFin);
  }, [dateFin]);

  const handleDateDebutChange = (event) => {
    setDateDebut(event.target.value);
  };

  const handleDateFinChange = (event) => {
    setDateFin(event.target.value);
  };

  const generateDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dates = generateDatesBetween(dateDebut, dateFin);

  const chartData = {
    labels: dates.map(date => date.toISOString().split('T')[0]),
    datasets: [
      {
        label: 'Estimation du Patrimoine',
        data: dates.map(date =>
          info.reduce((total, pos) => {
            return total + pos.getValeur(date);
          }, 0)
        ),
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
        tension: 0.5,
      },
      point: {
        radius: 2,
      }
    },
  };

  return (
    <div>
      <h1>Graphique du Patrimoine :</h1>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
        <div>
          <label>Date de Début:
            <input
              type="date"
              value={dateDebut}
              onChange={handleDateDebutChange}
            />
          </label>
          <label>Date de Fin:
            <input
              type="date"
              value={dateFin}
              onChange={handleDateFinChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Patrimoine;

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from '../../data/data.json';
import Possession from "../../models/possessions/Possession";
import './Patrimoine.css';


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
  const [dateActuelle, setDateActuelle] = useState(new Date().toISOString().split('T')[0]);
  const handleDateActuelleChange = (event) => {
    setDateActuelle(event.target.value);
  };

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
  const calculerSommeTotale = () => {
    return info.reduce((total, poss) => total + poss.getValeur(dateActuelle), 0);
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
        borderColor: '#d2a8ff',
        backgroundColor: ' #a5d6ff',
        fill: true,
        tension: 0.5,
        stepped: false,
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
        borderCapStyle: "round",
        borderJoinStyle: "round",
        stepped: false,
      },
      point: {
        radius: 2,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0)'
        }
      },
      y: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    }
  };



  return (
    <div>
      <div className="headContainer">
        <h1 className='patrimoineIntro'>Graphique du Patrimoine :</h1>
        <div className='mainContainer'>
          <div className="pseudoContainer">
            <label>Date de Début:
              <div className="date-wrapper">
                <input
                  type="date"
                  value={dateDebut}
                  onChange={handleDateDebutChange}
                  className='date-input'
                />
              </div>
            </label>
          </div>
          <div className="pseudoContainer">
            <label>Date de Fin:
              <div className="date-wrapper">
                <input
                  type="date"
                  value={dateFin}
                  onChange={handleDateFinChange}
                  className='date-input'
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
      <hr className='hr'/>
      <h1 className='Value pT5'>
        Date de calcule :
      </h1>
      <div className="pseudoContainer">
        <label>Date de Début:
          <div className="date-wrapper">
            <input
              type="date"
              value={dateActuelle}
              onChange={handleDateActuelleChange}
              className="date-input"
            />
          </div>
        </label>
      </div>
      <h1 className='Value'>
        Estimation actuelle du Patrimoine: {calculerSommeTotale().toFixed(2)} Ar
      </h1>
    </div>
  );
};

export default Patrimoine;

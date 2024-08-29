import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import data from '../data/data.json';
import Possession from "../models/possessions/Possession";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './header';
import Patrimoine from './Patrimoine';
import ListeDePossession from './ListPossession';
import { Line } from 'react-chartjs-2';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
  const [editingPossession, setEditingPossession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPossession, setNewPossession] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: ''
  });

  const handleAddModalChange = (event) => {
    const { name, value } = event.target;
    setNewPossession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSave = async () => {
    try {
      const valeur = parseFloat(newPossession.valeur); 
      if (isNaN(valeur)) {
        throw new Error('La valeur doit être un nombre');
      }

      const response = await fetch('http://localhost:3000/possession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          possesseur: { nom: 'John Doe' },
          ...newPossession,
          valeur,
          dateDebut: new Date(newPossession.dateDebut).toISOString(),
          dateFin: newPossession.dateFin ? new Date(newPossession.dateFin).toISOString() : null
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const addedPossession = await response.json();
      setInfo(prevInfo => [...prevInfo, addedPossession]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la possession:', error);
    }
  };



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

  const handleEdit = (possession) => {
    setEditingPossession(possession);
    setShowModal(true);
  };

  const handleClose = (index) => {
    const updatedInfo = [...info];
    updatedInfo[index].dateFin = new Date();
    setInfo(updatedInfo);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/possession/${encodeURIComponent(editingPossession.libelle)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateFin: editingPossession.dateFin,
          valeur: editingPossession.valeur,
          tauxAmortissement: editingPossession.tauxAmortissement
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const updatedPossession = await response.json();
      const updatedInfo = info.map(poss => (poss.libelle === editingPossession.libelle ? updatedPossession : poss));
      setInfo(updatedInfo);
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des modifications:', error);
    }
  };


  const handleModalChange = (event) => {
    const { name, value } = event.target;
    setEditingPossession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/patrimoine" element={
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
          } />
          <Route path="/possession" element={
            <div>
              <h1>Liste de Patrimoine :</h1>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {info.map((poss, index) => (
                    <tr key={index}>
                      <td>{poss.libelle}</td>
                      <td>{typeof poss.valeur === 'number' ? poss.valeur.toFixed(2) : 'N/A'} Ar</td>
                      <td>{poss.dateDebut.toLocaleDateString()}</td>
                      <td>{poss.dateFin ? poss.dateFin.toLocaleDateString() : ''}</td>
                      <td>{poss.tauxAmortissement ? `${poss.tauxAmortissement}%` : ''}</td>
                      <td>{typeof poss.getValeur(currentDate) === 'number' ? poss.getValeur(currentDate).toFixed(2) : 'N/A'} Ar</td>
                      <td>
                        <Button variant="primary" onClick={() => handleEdit(poss)}>Edit</Button>
                        <Button variant="secondary" onClick={() => handleClose(index)}>Close</Button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </Table>
              <h1>
                Estimation du Patrimoine: {calculerSommeTotale().toFixed(2)} Ar
              </h1>
            </div>
          } />
          <Route path="/" element={<div>page d'accueil</div>} />
        </Routes>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Possession</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingPossession && (
              <form>
                <div className="mb-3">
                  <label htmlFor="libelle" className="form-label">Libelle</label>
                  <input
                    type="text"
                    className="form-control"
                    id="libelle"
                    name="libelle"
                    value={editingPossession.libelle}
                    onChange={handleModalChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="valeur" className="form-label">Valeur</label>
                  <input
                    type="number"
                    className="form-control"
                    id="valeur"
                    name="valeur"
                    value={editingPossession.valeur}
                    onChange={handleModalChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tauxAmortissement" className="form-label">Taux d'Amortissement</label>
                  <input
                    type="number"
                    className="form-control"
                    id="tauxAmortissement"
                    name="tauxAmortissement"
                    value={editingPossession.tauxAmortissement}
                    onChange={handleModalChange}
                  />
                </div>
              </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Button variant="success" onClick={() => setShowAddModal(true)}>
        Ajouter une nouvelle possession
      </Button>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Nouvelle Possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="libelle" className="form-label">Libelle</label>
              <input
                type="text"
                className="form-control"
                id="libelle"
                name="libelle"
                value={newPossession.libelle}
                onChange={handleAddModalChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="valeur" className="form-label">Valeur</label>
              <input
                type="number"
                className="form-control"
                id="valeur"
                name="valeur"
                value={newPossession.valeur}
                onChange={handleAddModalChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dateDebut" className="form-label">Date de début</label>
              <input
                type="date"
                className="form-control"
                id="dateDebut"
                name="dateDebut"
                value={newPossession.dateDebut}
                onChange={handleAddModalChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dateFin" className="form-label">Date de fin (optionnelle)</label>
              <input
                type="date"
                className="form-control"
                id="dateFin"
                name="dateFin"
                value={newPossession.dateFin}
                onChange={handleAddModalChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tauxAmortissement" className="form-label">Taux d'Amortissement</label>
              <input
                type="number"
                className="form-control"
                id="tauxAmortissement"
                name="tauxAmortissement"
                value={newPossession.tauxAmortissement}
                onChange={handleAddModalChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleAddSave}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>


    </Router>
  );
}

export default App;

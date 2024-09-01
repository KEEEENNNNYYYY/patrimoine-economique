import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import data from '../../data/data.json';
import Possession from '../../models/possessions/Possession';

const transformDataToPossessions = (data) => {
  const possessionsData = data.find(item => item.model === "Patrimoine")?.data?.possessions || [];
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

const PossessionT = () => {
  const [dateActuelle, setDateActuelle] = useState(new Date().toISOString().split('T')[0]);
  const [info, setInfo] = useState([]);
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

  useEffect(() => {
    const initialPossessions = transformDataToPossessions(data);
    setInfo(initialPossessions);
  }, []);

  const calculerSommeTotale = () => {
    return info.reduce((total, poss) => total + poss.getValeur(dateActuelle), 0);
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
      console.log('Ajouté:', addedPossession);
      setInfo(prevInfo => [...prevInfo, addedPossession]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la possession:', error);
    }
  };

  const handleEdit = (possession) => {
    setEditingPossession({
      ...possession,
      oldLibelle: possession.libelle
    });
    setShowModal(true);
  };

  const handleClose = async (index) => {
    try {
      const updatedPossession = { ...info[index], dateFin: new Date() };

      const response = await fetch(`http://localhost:3000/possession/${encodeURIComponent(updatedPossession.libelle)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateFin: updatedPossession.dateFin.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const updatedData = await response.json();
      const updatedInfo = info.map((poss, i) => (i === index ? updatedData : poss));
      setInfo(updatedInfo);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la date de fin:', error);
    } finally {
      setShowModal(false); 
    }
  };


  const handleSave = async () => {
    try {
      const { oldLibelle, ...updatedData } = editingPossession;

      const response = await fetch(`http://localhost:3000/possession/${encodeURIComponent(oldLibelle)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const updatedPossession = await response.json();

      const updatedInfo = info.map(poss => (poss.libelle === oldLibelle ? updatedPossession : poss));
      setInfo(updatedInfo);
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des modifications:', error);
    }
  };

  const handleAddModalChange = (event) => {
    const { name, value } = event.target;
    setNewPossession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModalChange = (event) => {
    const { name, value } = event.target;
    setEditingPossession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateActuelleChange = (event) => {
    setDateActuelle(event.target.value);
  };

  return (
    <>
      <Button variant="success" as={Link} to="/possession/create">
        Ajouter une nouvelle possession
      </Button>
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
            {info.length > 0 ? (
              info.map((poss, index) => (
                <tr key={index}>
                  <td>{poss.libelle}</td>
                  <td>{typeof poss.valeur === 'number' ? poss.valeur.toFixed(2) : 'N/A'} Ar</td>
                  <td>{poss.dateDebut instanceof Date ? poss.dateDebut.toLocaleDateString() : 'N/A'}</td>
                  <td>{poss.dateFin instanceof Date ? poss.dateFin.toLocaleDateString() : ''}</td>
                  <td>{poss.tauxAmortissement ? `${poss.tauxAmortissement}%` : ''}</td>
                  <td>{typeof poss.getValeur(dateActuelle) === 'number' ? poss.getValeur(dateActuelle).toFixed(2) : 'N/A'} Ar</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(poss)}>Edit</Button>
                    <Button variant="secondary" onClick={() => handleClose(index)}>Close</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Aucune possession à afficher</td>
              </tr>
            )}
          </tbody>
        </Table>
        <h1>
          Estimation actuelle du Patrimoine: {calculerSommeTotale().toFixed(2)} Ar
        </h1>
      </div>

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

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Nouvelle Possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
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
              <label htmlFor="dateDebut" className="form-label">Date de Début</label>
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
              <label htmlFor="dateFin" className="form-label">Date de Fin</label>
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
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PossessionT;

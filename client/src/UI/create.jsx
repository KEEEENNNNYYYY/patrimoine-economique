import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const CreatePossessionPage = () => {
  const [newPossession, setNewPossession] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: ''
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewPossession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
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

      navigate('/possession');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la possession:', error);
    }
  };

  return (
    <div>
      <h1>Ajouter une Nouvelle Possession</h1>
      <Form>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libelle</Form.Label>
          <Form.Control
            type="text"
            name="libelle"
            value={newPossession.libelle}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formValeur">
          <Form.Label>Valeur</Form.Label>
          <Form.Control
            type="number"
            name="valeur"
            value={newPossession.valeur}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date de Début</Form.Label>
          <Form.Control
            type="date"
            name="dateDebut"
            value={newPossession.dateDebut}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDateFin">
          <Form.Label>Date de Fin (optionnelle)</Form.Label>
          <Form.Control
            type="date"
            name="dateFin"
            value={newPossession.dateFin}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formTauxAmortissement">
          <Form.Label>Taux d'Amortissement</Form.Label>
          <Form.Control
            type="number"
            name="tauxAmortissement"
            value={newPossession.tauxAmortissement}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>
          Ajouter
        </Button>
      </Form>
    </div>
  );
};

export default CreatePossessionPage;

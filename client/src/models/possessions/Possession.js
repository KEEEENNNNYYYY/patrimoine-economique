export default class Possession {
  constructor(nom, libelle, valeur, dateDebut, dateFin, tauxAmortissement, jour = null, valeurConstante = null) {
    this.nom = nom;
    this.libelle = libelle;
    this.valeur = parseFloat(valeur);
    this.dateDebut = new Date(dateDebut);
    this.dateFin = dateFin ? new Date(dateFin) : null;
    this.tauxAmortissement = tauxAmortissement;
    this.jour = jour;
    this.valeurConstante = valeurConstante;
  }

  getValeur(currentDate) {
    if (!(currentDate instanceof Date)) {
      currentDate = new Date(currentDate);
    }

    const dateDebut = this.dateDebut;
    const dateFin = this.dateFin;

    const joursEcoules = Math.floor((currentDate - dateDebut) / (1000 * 60 * 60 * 24));
    if (dateFin && currentDate > dateFin) {
      return 0;
    }

    let valeurActuelle = this.valeur;

    if (this.valeurConstante !== null && this.jour !== null) {
      const debutDuMoisActuel = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const moisEcoulesDepuisDebut = (debutDuMoisActuel.getFullYear() - dateDebut.getFullYear()) * 12 + (debutDuMoisActuel.getMonth() - dateDebut.getMonth());
      
      valeurActuelle += this.valeurConstante * moisEcoulesDepuisDebut;
    }

    if (this.tauxAmortissement) {
      const tauxJournalier = this.tauxAmortissement / 100 / 365;
      valeurActuelle -= valeurActuelle * tauxJournalier * joursEcoules;
    }

    return Math.max(valeurActuelle);
  }
}

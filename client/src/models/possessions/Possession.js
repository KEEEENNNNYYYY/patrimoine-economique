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
    const moisEcoules = (currentDate.getFullYear() - dateDebut.getFullYear()) * 12 + (currentDate.getMonth() - dateDebut.getMonth());

    if (this.dateFin && currentDate > this.dateFin) {
      return 0;
    }

    let valeurActuelle = this.valeur;

    if (this.valeurConstante !== null && this.jour !== null) {
      valeurActuelle += this.valeurConstante * moisEcoules;
    }

    if (this.tauxAmortissement) {
      const anneesEcoulees = moisEcoules / 12;
      valeurActuelle -= valeurActuelle * (this.tauxAmortissement / 100) * anneesEcoulees;
    }

    return Math.max(valeurActuelle); 
  }
}

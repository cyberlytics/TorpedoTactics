new Vue({
  el: '#app',
  data: {
    spielerprofile: [
      {
        //beispielprofile
        id: 1,
        trefferrate: 75,
        gewonneneSpiele: 10,
        verloreneSpiele: 2,
        anteilGewonnen: '',
        anteilVerloren: '',
      },
      {
        id: 2,
        trefferrate: 60,
        gewonneneSpiele: 5,
        verloreneSpiele: 5,
        anteilGewonnen: '',
        anteilVerloren: '',
      }
    ]
  },
  mounted() {
    this.spielerprofile.forEach(spieler => {
      spieler.anteilGewonnen = (spieler.gewonneneSpiele / (spieler.gewonneneSpiele + spieler.verloreneSpiele)).toFixed(3);
      spieler.anteilVerloren = (spieler.verloreneSpiele / (spieler.gewonneneSpiele + spieler.verloreneSpiele)).toFixed(3);

    });
  }
});

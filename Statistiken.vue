<template>
  <div>
    <h1>Spielerstatistiken</h1>
    <div v-for="spieler in spielerprofile" :key="spieler.id">
      <h2>Spieler:  {{ spieler.id }}</h2>
      <p>Trefferrate: {{ spieler.trefferrate }}%</p>
      <p>Gewonnene Spiele: {{ spieler.gewonneneSpiele }}</p>
      <p>Verlorene Spiele: {{ spieler.verloreneSpiele }}</p>
      <div style="display: flex;">
        <div>{{ spieler.anteilGewonnen * 100 + '%' }}</div>
        <div class="gewonnen-balken" :style="{ width: spieler.anteilGewonnen * 90 + '%' }"></div>
        <div class="verloren-balken" :style="{ width: spieler.anteilVerloren * 90 + '%' }"></div>
        <div>{{ spieler.anteilVerloren * 100 + '%' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spielerprofile: [
        {
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
    };
  },
  mounted() {
    this.spielerprofile.forEach(spieler => {
      spieler.anteilGewonnen = (spieler.gewonneneSpiele / (spieler.gewonneneSpiele + spieler.verloreneSpiele)).toFixed(3);
      spieler.anteilVerloren = (spieler.verloreneSpiele / (spieler.gewonneneSpiele + spieler.verloreneSpiele)).toFixed(3);
    });
  }
};
</script>

<style>
.gewonnen-balken {
  background-color: green;
  height: 10px;
}

.verloren-balken {
  background-color: red;
  height: 10px;
}
</style>

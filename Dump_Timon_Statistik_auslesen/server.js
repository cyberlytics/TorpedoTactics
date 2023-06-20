
const express = require('express');
const server = express();
// port muss angepasst werden
const port = 3000;
const { MongoClient } = require('mongodb');

// Passe die Verbindungs-URL entsprechend an
const uri = 'mongodb://localhost:3/deineDatenbank'; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

server.listen(port, () =>{
    console.log('Der Server läuft auf Port ${port}');
});

// Route zur Mongo DB muss angepasst werden
server.get('/daten', async (req, res) => {
  try {
    // Verbindung zur Datenbank herstellen
    await client.connect();

    //die Statistik anpassem
    const collection = client.db().collection('Statistik'); 
    const daten = await collection.find({}).toArray();

    
    res.json(daten);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten aus der MongoDB:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  } finally {
    
    await client.close();
  }
});

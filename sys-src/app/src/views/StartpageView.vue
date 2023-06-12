<template>
  <div>
    <h1>Startpage</h1>
    <button @click="login()">Login</button>
    <button @click="toggleRegisterField()">Register</button>

    <div v-if="showRegisterField">
      <h2>Register</h2>
      <input v-model="username" placeholder="Username" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="registerUser()">Bestätigen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const showRegisterField = ref(false);
const username = ref('');
const password = ref('');

const login = () => {
  // Implementiere hier deine Login-Logik
  // z. B. Anzeigen eines Login-Modals oder Weiterleitung zur Login-Seite
};

const toggleRegisterField = () => {
  showRegisterField.value = !showRegisterField.value;
};

const registerUser = async () => {
  try {
    const newUser = {
      username: username.value,
      password: password.value
    };

    // REST-Aufruf an deine Express-App, um einen Benutzer zu registrieren
    const response = await axios.post('http://deine-express-app-url/register', newUser);
    console.log(response.data); // Hier kannst du die Antwort der Express-App verarbeiten

    // Setze die Eingabefelder zurück
    username.value = '';
    password.value = '';

    // Implementiere hier die entsprechende Logik nach erfolgreicher Registrierung
    // z. B. Anzeigen einer Erfolgsmeldung oder Weiterleitung zur Startseite

  } catch (error) {
    console.error(error);
    // Implementiere hier die entsprechende Fehlerbehandlung
    // z. B. Anzeigen einer Fehlermeldung
  }
};
</script>

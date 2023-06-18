<template>
  <div class="start-page">
    <div class="vertical-center">
      <h1>Willkommen bei Torpedo Tactics</h1>
      <div class="auth-window">
      <div class="auth-bar">
        <button class="login-button" :class="{ active: !showRegisterForm }" @click="showRegisterForm = false">Login</button>
        <button class="register-button" :class="{ active: showRegisterForm }" @click="showRegisterForm = true">Registrieren</button>
      </div>
        <form v-if="showRegisterForm" @submit.prevent="register" class="formfield" :class="{ active: showRegisterForm }">
          <input type="text" v-model="registerData.name" placeholder="Name" required />
          <input type="password" v-model="registerData.password" placeholder="Passwort" required />
          <button class="enter-button" type="submit">Registrieren</button>
        </form>
        <form v-else @submit.prevent="login" class="formfield" :class="{ active: !showRegisterForm }">
          <input type="text" v-model="loginData.name" placeholder="Name" required />
          <input type="password" v-model="loginData.password" placeholder="Passwort" required />
          <button class="enter-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const registerData = ref({
  name: '',
  password: ''
});
const loginData = ref({
  name: '',
  password: ''
});
const showRegisterForm = ref(false);

function register() {
  // this.$router.push('/home');
  // Replace this with your router logic
}

function login() {
  // this.$router.push('/home');
  // Replace this with your router logic

  // axios.post('/api/login', {
  //   name: loginData.value.name,
  //   password: loginData.value.password
  // })
  // .then(response => {
  //   // Überprüfen der Antwort vom Server und weiterleitung
  //   if (response.data.success) {
  //     this.$router.push('/lobby');
  //   } else {
  //     // Hier kann der entsprechende Logik für einen fehlgeschlagenen Login implementiert werden
  //   }
  // })
  // .catch(error => {
  //   // Fehlerbehandlung
  // });
}
</script>

<style scoped>
  .start-page {
    text-align: center;
    margin-top: 100px;
    background-image: url(../assets/startpage-background.jpg);
    background-size: cover;
    color: black;
    margin-top: 0;
    height: 90vh;
  }

  h1 {
    margin-top: 0;
    padding-top: 100px;
    font-size: 48px;
  }

  input[type="text"],
  input[type="password"] {
    padding: 5px;
    margin: 5px;
  }

  button {
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: rgb(111, 111, 111);
  }

  .auth-bar {
    display: flex;
    justify-content: space-evenly;
    margin-top: 5px;
  }

  .login-button {
    background-color: lightgray;
    color: black;
    width: 130px;
    height: 28px;
    border-radius: 10px;
  }

  .register-button {
    background-color: lightgray;
    height: 28px;
    width: 130px;
    color: black;
    border-radius: 10px;
  }

  .auth-window {
    background-color: lightgray;
    height: auto;
    width: 300px;
    margin: auto;
    border-radius: 10px;
    border: 1px solid black;
  }

  .active {
    background-color: darkgrey;
    color: black solid #000;;
  }

  .formfield {
    display: flex;
    flex-direction: column;
    height: auto;
    padding-top: 10px;
    margin-top: 5px;
    border-radius: 10px;
  }

  .enter-button{
    background-color: rgb(143, 141, 141);
    color: black;
    width: 130px;
    height: 28px;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .vertical-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60vh;

  }
</style>

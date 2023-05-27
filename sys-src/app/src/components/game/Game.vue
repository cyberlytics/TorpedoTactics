<template>
    <div class="enemies">
        <h3>enemy: {{ enemy }}</h3>
    </div>
    <div class="table">
        Current player: {{ publicGameMetadata?.currentPlayerName }}
        <button @click="completePreparation()">Ready</button>
    </div>
    <div class="player">
        <h3>player: {{ userName }}</h3>
    </div>
</template>


<script setup lang="ts">
//#region imports
import { PublicGameMetadata } from '@/types/publicGameMetadata';
import { computed } from 'vue';
//#endregion imports

const props = defineProps({
    userName: String,
    publicGameMetadata: PublicGameMetadata
});

const enemy = computed(() => {
    const enemy = props.publicGameMetadata?.players
        .filter((playerName) => playerName != props.userName)[0];
    
    return enemy;
});

const emit = defineEmits(['completePreparation']);


function completePreparation() {
  emit('completePreparation');
}
</script>

<style>
body > div {
    position: absolute;
    inset: 0;
}

.enemies {
    position: absolute;
    inset: 0 0 auto 0;
    
    border: solid 2px turquoise;
    height: 100px;
}

.player {
    position: absolute;
    inset: auto 0 0 0;
    
    border: solid 2px orange;
    height: 100px;
}


.table {
    position: absolute;
    inset: 100px 0 100px 0;
    border: solid 2px green;
}
</style>
import {GameConfig} from "../types/config.ts";
import {GameStages} from "../constants/gamePlay.ts";
import {defineStore} from "pinia";
import {ref} from "vue";

export const useGamePlayStore = defineStore('gamePlay',  () => {
  const config = ref<GameConfig>({
    minBet: 100,
    autoTime: 250,
    deckCount: 6,
    playerCount: 6,
  })
  const gameRound = ref(-1)
  const activeStage = ref(GameStages.Init)
  const activePlayer = ref(-1)

  function setConfig(newConfig: GameConfig) {
    config.value = newConfig
  }

  function nextPlayer() {
    if (activePlayer.value === config.value.playerCount) {
      nextStage()
      activePlayer.value = 0
    } else {
      activePlayer.value += 1
    }
  }
  function nextStage() {
    if (activeStage.value === GameStages.EndRound) {
      gameRound.value += 1
      activeStage.value = GameStages.PlaceBets
    } else {
      activeStage.value += 1
    }
  }

  return {config, setConfig, gameRound, activeStage, activePlayer, nextPlayer, nextStage};
})

import { DEALER_STAND_SCORE, UNKNOWN_CARD } from "~/constants/cards.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import { isBlankCard } from "~/helpers/cards.ts";
import { wait } from "~/helpers/time.ts";
import { useDeckStore } from "~/stores/deckStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";
import { PlayingCard } from "~/types/card.ts";

export function useCardsActions() {
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();

  async function dealCard(
    playerId: number,
    handId?: number,
    dealerMayPeek = false,
  ): Promise<PlayingCard | undefined> {
    await wait(AUTO_TIME_STANDARD);

    const newCard = dealerMayPeek
      ? playersStore.dealerPeekCard()
      : deckStore.drawCard();

    if (newCard) {
      playersStore.setCard(newCard, playerId, handId);
    }

    return newCard;
  }

  async function dealBlank(playerId: number, handId?: number) {
    await wait(AUTO_TIME_STANDARD);
    playersStore.setCard(UNKNOWN_CARD, playerId, handId);
  }

  async function dealAllPlayersCards(dealerMayPeek = false) {
    for (let i = 0; i < playersStore.activePlayers.length; i++) {
      await dealCard(playersStore.activePlayers[i].index);
    }

    // fixme dealer blank card here
    return dealCard(DEALER_ID, 0, dealerMayPeek);
  }

  async function revealDealerBlanks() {
    if (playersStore.dealer.didPeek) {
      playersStore.setCard(playersStore.dealer.didPeek, DEALER_ID);
    }
    let dealerMayContinue = true;
    while (dealerMayContinue) {
      dealerMayContinue =
        playersStore.dealer.hands[0].score < DEALER_STAND_SCORE;
      if (dealerMayContinue) {
        await dealCard(DEALER_ID);
      }
    }
  }

  async function revealPlayerBlanks(playerId: number, handId?: number) {
    const targetHand = playersStore.getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    const cardsToReveal = targetHand.cards.filter(isBlankCard);

    for (let i = 0; i < cardsToReveal.length; i++) {
      await dealCard(playerId, handId);
    }
  }

  async function revealAllBlankCards() {
    await revealDealerBlanks();

    for (let i = 0; i < playersStore.activePlayers.length; i++) {
      await revealPlayerBlanks(playersStore.activePlayers[i].index);
    }
  }

  return {
    dealCard,
    dealBlank,

    dealAllPlayersCards,
    revealAllBlankCards,
  };
}

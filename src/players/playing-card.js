
export default {
  props: ['card'],
  template: '<div class="card" :class="cardFace" >{{value[0]}}</div>',
  computed: {
    cardFace() {
      if (this.card.length === 0) {
        return 'blank';
      }

      const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
      const suitValue = this.card[1];
      return suits[suitValue];
    },
    value() {
      if (this.card.length === 0) {
        return 'blank';
      }

      const faces = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
      const faceValue = this.card[0];

      return (faceValue in faces) ? faces[faceValue] : faceValue;
    },
  },
};

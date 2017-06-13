export default {
  template: `
  <svg viewBox="-50 -50 100 100" >
    <filter id="multiply">
      <feBlend in2="BackgroundImage" in="SourceGraphic" mode="multiply"/>
    </filter>
    <filter id="pink">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="-20"/>
    </filter>
    <filter id="blue">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="240"/>
    </filter>
    <filter id="green">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="120"/>
    </filter>
    <filter id="black">
      <feColorMatrix values=".05 0 1 0 0 .05 0 1 0 0 .05 0 1 0 0 0 0 0 1 0"/>
    </filter>
    <linearGradient id="edge" y2="1" x2="0">
      <stop offset="6.8%" stop-color="#c00"/>
      <stop offset="6.8%" stop-color="#ccc"/>
      <stop offset="25.5%" stop-color="#ccc"/>
      <stop offset="25.5%" stop-color="#c00"/>
      <stop offset="50%" stop-color="#c00"/>
      <stop offset="50%" stop-color="#ccc"/>
      <stop offset="74.5%" stop-color="#ccc"/>
      <stop offset="74.5%" stop-color="#c00"/>
      <stop offset="93.8%" stop-color="#c00"/>
      <stop offset="93.8%" stop-color="#ccc"/>
    </linearGradient>
    <g class="token" transform="scale(.7 1)">
      <path fill="url(#edge)" d="M0-48h9a1 1 0 0 1 0 96H0" opacity="8" filter="url(#multiply)"/>
      <circle r="48" fill="#c00"/>
      <circle r="42" fill="transparent" stroke="#ddd" stroke-width="12" stroke-dasharray="22"/>
      <circle r="40" opacity=".2" filter="url(#multiply)"/>
      <path d="M0-40a1 1 0 1 0 0 80h2a1 1 0 1 1 0-80" opacity=".3" filter="url(#multiply)"/>
    </g>
  </svg>
  `,
};

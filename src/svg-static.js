export default {
  template: `
  <svg height="0" width="0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" >
    <defs>
      <filter id="pink">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="-20"/>
      </filter>
      <filter id="blue">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="240"/>
      </filter>
      <filter id="red">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="0"/>
      </filter>
      <filter id="yellow">
        <feColorMatrix values="1.2 0 .8 0 0 1.2 .8 0 0 0 0 .8 .8 0 0 0 0 0 1 0"/>
      </filter>
      <filter id="green">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="120"/>
      </filter>
      <filter id="black">
        <feColorMatrix values="0.1 1 0 0 0 0.1 1 0 0 0 0.1 1 0 0 0 0 0 0 1 0"/>
      </filter>
      <filter id="grey">
        <feColorMatrix values="1 0 0.5 0 0 1 0 0.5 0 0 1 0 0.5 0 0 0 0 0 1 0"/>
      </filter>
      <mask id="inner" >
        <path d="m-50-50h100v-100h-100" />
        <circle r="40" fill="#fff" />
      </mask>

      <linearGradient id="edge" y2="1" y1="1" >
        <stop offset="6.8%" stop-color="#c00"/>
        <stop offset="6.8%" stop-color="#ccc"/>
        <stop offset="25%" stop-color="#ccc"/>
        <stop offset="25%" stop-color="#c00"/>
        <stop offset="50%" stop-color="#c00"/>
        <stop offset="50%" stop-color="#ccc"/>
        <stop offset="74.5%" stop-color="#ccc"/>
        <stop offset="74.5%" stop-color="#c00"/>
        <stop offset="93.8%" stop-color="#c00"/>
        <stop offset="93.8%" stop-color="#ccc"/>
      </linearGradient>

      <linearGradient id="edge2" x1="1" x2="0" xlink:href="#edge" />

      <symbol id="chip-tilt" viewBox="-50 -30 100 60" >
        <g class="token" transform="scale(1 .5)">
          <path fill="url(#edge)" d="M-48 0v16a1 1 0 0 0 96 0v-16" />
          <circle r="48" fill="#c00"/>
          <g fill="transparent" stroke="#ddd" >
          <circle r="44"  stroke-width="8" stroke-dasharray="23"/>
          <circle cy="4" r="38" stroke-width="4" stroke-dasharray="19.9" mask="url(#inner)"/>
          </g>
          <path fill="url(#edge2)" d="M-40 0a1 1 0 1 1 80 0v4a1 1 0 1 0-80 0" />
          <circle r="40" opacity=".2" />
        </g>
      </symbol>
      <symbol id="chip" viewBox="-60 -60 120 120" >
        <circle r="48" fill="#c00" />
        <circle r="42" fill="transparent" stroke="#ddd" stroke-width="12" stroke-dasharray="22" />
        <circle r="40" opacity="0.2" />
        <path fill="#555" d="m0 -40a1 1 0 1 0 0 80h2a1 1 0 1 1 0 -80" opacity=".2" />
      </symbol>
    </defs>
  </svg>
  `,
};

export default {
  template: `
  <svg >
    <defs>
    <filter id="multiply">
      <feBlend in2="BackgroundImage" in="SourceGraphic" mode="multiply"/>
    </filter>
    <filter id="pink">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="-20"/>
    </filter>
    <filter id="blue">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="240"/>
    </filter>
    <filter id="red">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="0"/>
    </filter>
    <filter id="green">
      <feColorMatrix in="SourceGraphic" type="hueRotate" values="120"/>
    </filter>
    <filter id="black">
      <feColorMatrix values=".05 0 1 0 0 .05 0 1 0 0 .05 0 1 0 0 0 0 0 1 0"/>
    </filter>
    <mask id="inner" >
      <path d="m-50-50h100v-100h-100" />
      <circle r="40" fill="#fff" />
    </mask>
    <linearGradient id="edge" y1="1" x1="1" >
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

    <linearGradient id="edge2" y2="1" y1="0"  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#edge" />


    <symbol id="chip-tilt" viewBox="-50 -50 100 100" >
    <g class="token" transform="scale(.5 1)">
      <path fill="url(#edge)" d="M0-48h-16a1 1 0 0 0 0 96h16" filter="url(#mlt)"/>
      <circle r="48" fill="#c00"/>
      <g fill="transparent" stroke="#ddd" >
      <circle r="44"  stroke-width="8" stroke-dasharray="23"/>
      <circle cx="-4" r="38" stroke-width="4" stroke-dasharray="19.9" mask="url(#inner)"/>
      </g>
      <path filter="url(#mlt)" fill="url(#edge2)" d="M0-40a1 1 0 1 1 0 80h-4a1 1 0 1 0 0-80" />
      <circle filter="url(#mlt)" r="40" opacity=".2" />
    </g>
    </symbol>
    <symbol id="chip" viewBox="-50 -50 100 100" >
    <circle r="48" fill="#c00" />
    <circle r="42" fill="transparent" stroke="#ddd" stroke-width="12" stroke-dasharray="22" />
    <circle r="40" opacity="0.2" filter="url(#multiply)" />
    <path fill="#555" d="m0 -40a1 1 0 1 0 0 80h2a1 1 0 1 1 0 -80" opacity=".2" filter="url(#multiply)" />
    </symbol>
    </defs>
  </svg>
  `,
};

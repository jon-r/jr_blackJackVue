<template>
  <svg
    height="0"
    width="0"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="pink">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="-20" />
      </filter>
      <filter id="blue">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="240" />
      </filter>
      <filter id="red">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="0" />
      </filter>
      <filter id="yellow">
        <feColorMatrix
          values="1.2 0 .8 0 0 1.2 .8 0 0 0 0 .8 .8 0 0 0 0 0 1 0"
        />
      </filter>
      <filter id="green">
        <feColorMatrix in="SourceGraphic" type="hueRotate" values="120" />
      </filter>
      <filter id="black">
        <feColorMatrix values="0.1 1 0 0 0 0.1 1 0 0 0 0.1 1 0 0 0 0 0 0 1 0" />
      </filter>
      <filter id="grey">
        <feColorMatrix values="1 0 0.5 0 0 1 0 0.5 0 0 1 0 0.5 0 0 0 0 0 1 0" />
      </filter>
      <mask id="inner">
        <path d="m-50-50h100v-100h-100" />
        <circle r="40" fill="#fff" />
      </mask>

      <linearGradient id="edge" y2="1" y1="1">
        <stop offset="6.8%" stop-color="#c00" />
        <stop offset="6.8%" stop-color="#ccc" />
        <stop offset="25%" stop-color="#ccc" />
        <stop offset="25%" stop-color="#c00" />
        <stop offset="50%" stop-color="#c00" />
        <stop offset="50%" stop-color="#ccc" />
        <stop offset="74.5%" stop-color="#ccc" />
        <stop offset="74.5%" stop-color="#c00" />
        <stop offset="93.8%" stop-color="#c00" />
        <stop offset="93.8%" stop-color="#ccc" />
      </linearGradient>

      <linearGradient id="edge2" x1="1" x2="0" xlink:href="#edge" />

      <symbol id="chip-tilt" viewBox="-50 -30 100 60">
        <g class="token" transform="scale(1 .5)">
          <path fill="url(#edge)" d="M-48 0v16a1 1 0 0 0 96 0v-16" />
          <circle r="48" fill="#c00" />
          <g fill="transparent" stroke="#ddd">
            <circle r="44" stroke-width="8" stroke-dasharray="23" />
            <circle
              cy="4"
              r="38"
              stroke-width="4"
              stroke-dasharray="19.9"
              mask="url(#inner)"
            />
          </g>
          <path fill="url(#edge2)" d="M-40 0a1 1 0 1 1 80 0v4a1 1 0 1 0-80 0" />
          <circle r="40" opacity=".2" />
        </g>
      </symbol>
      <symbol id="chip" viewBox="-60 -60 120 120">
        <circle r="48" fill="#c00" />
        <circle
          r="42"
          fill="transparent"
          stroke="#ddd"
          stroke-width="12"
          stroke-dasharray="22"
        />
        <circle r="40" opacity="0.2" />
        <path
          fill="#555"
          d="m0 -40a1 1 0 1 0 0 80h2a1 1 0 1 1 0 -80"
          opacity=".2"
        />
      </symbol>

      <pattern id="a" patternUnits="userSpaceOnUse" height="16" width="10">
        <path fill="#bb3838" d="M0 0l5 3v5l-5 -3z M5 8l5 3v5l-5 -3z" />
        <path fill="#8d1010" d="M10 0l-5 3v5l5 -3M0 11l5-3v5l-5 3" />
      </pattern>

      <symbol id="jr-logo" fill="none" stroke-width="2" viewBox="0 0 61 16">
        <path
          stroke-linejoin="round"
          stroke="#bb3838"
          d="M7 -1L2 8l5 9m20 0l5-9-5-9"
        />
        <path
          stroke="#e7e4e4"
          d="M10 1h5v10a4 4 0 0 1-4 4h-2M16.5 1h3a4 4 0 0 1 0 8h-3 2q3 0 4 3t2.5 3"
        />
      </symbol>

      <symbol id="jr-logo" fill="none" stroke-width="2" viewBox="0 0 61 16">
        <path
          stroke-linejoin="round"
          stroke="#bb3838"
          d="M7 -1L2 8l5 9m20 0l5-9-5-9"
        />
        <path
          stroke="#e7e4e4"
          d="M10 1h5v10a4 4 0 0 1-4 4h-2M16.5 1h3a4 4 0 0 1 0 8h-3 2q3 0 4 3t2.5 3"
        />
      </symbol>

      <symbol id="card-blank">
        <path fill="#c97272" d="m0 0h100v140h-100z" />

        <path
          fill="url(#a)"
          stroke="#e7e4e4"
          stroke-width="2"
          d="m5 5h90v130h-90z"
        />

        <circle
          stroke="#8d1010"
          stroke-width="2"
          fill="#c97272"
          cx="50"
          cy="70"
          r="30"
        />

        <use x="22" y="0" xlink:href="#jr-logo" />
      </symbol>

      <symbol id="card-clubs">
        <path
          fill="currentcolor"
          d="m74,113 a20,20 0 1,0 20,-24 a20,20 0 1,0 -36,0 a20,20 0 1,0 20,24 m-2,8 l10,16 h-20 z"
        />
      </symbol>

      <symbol id="card-diamonds">
        <path fill="currentcolor" d="m75,56 l36,42 l-36,42 l-36,-42 z" />
      </symbol>

      <symbol id="card-spades">
        <path
          fill="currentcolor"
          d="m69,107 a1,1 0 0,0 40,0 q0,-14 -18,-28 t-16,-28 q0,14 -18,28 t-16,28 a1,1 0 0,0 40,0 m-6,16 l10,16 h-20 z"
        />
      </symbol>

      <symbol id="card-hearts">
        <path
          fill="currentcolor"
          d="m81 85a1 1 0 0 0-40 0q0 14 18 28t16 28q0-14 18-28t16-28a1 1 0 0 0-40 0z"
        />
      </symbol>

      <path id="curve-lg" d="M33.5 8a1 1 0 1 0 158 0 a1 1 0 1 0-158 0" />
      <path id="curve-sm" d="M50.5 8a1 1 0 1 0 124 0 a1 1 0 1 0-124 0" />

      <symbol id="tabletop">
        <g opacity=".5">
          <g stroke="#f9a825" fill="none">
            <path
              d="M112.6 92.43c35.18 0 65.25-21.88 77.34-52.78.4-1.05-.13-2.22-1.18-2.6l-11.7-4.26c-1.02-.4-2.14.1-2.54 1.1-9.77 24.64-33.8 42.1-61.92 42.1S60.44 58.53 50.68 33.9c-.4-1-1.52-1.5-2.54-1.14L36.44 37c-1.05.4-1.6 1.56-1.18 2.6 12.1 30.9 42.16 52.8 77.34 52.8z"
            />
            <circle cx="25" cy="65" r="12" />
            <circle cx="56" cy="107" r="12" />
            <circle cx="113" cy="116" r="12" />
            <circle cx="168" cy="107" r="12" />
            <circle cx="200" cy="65" r="12" />
          </g>
          <g
            fill="#f9a825"
            text-anchor="middle"
            font-family="Georgia"
            letter-spacing=".8"
          >
            <text>
              <textPath xlink:href="#curve-lg" startOffset="25%" font-size="10">
                BLACKJACK PAYS 3 TO 2
              </textPath>
              <textPath xlink:href="#curve-sm" startOffset="25%" font-size="6">
                DEALER MUST STAND ON 17
              </textPath>
            </text>
          </g>
        </g>
      </symbol>
    </defs>
  </svg>
</template>

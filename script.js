const $ = (selector) =>
  document.querySelector(selector);

const $$ = (selector) =>
  [...document.querySelectorAll(selector)];


/* =====================================================
   PAGE CONTROL
===================================================== */

const cover = $('#cover');
const countryPage = $('#countryPage');
const colorPage = $('#colorPage');
const main = $('#main');

const startBtn = $('#startBtn');
const countryNext = $('#countryNext');
const finishBtn = $('#finishBtn');

let selectedCountry = null;
let selectedColor = null;


/* =====================================================
   START
===================================================== */

startBtn.addEventListener('click', () => {

  cover.classList.remove('active');

  setTimeout(() => {

    cover.style.display = 'none';

    countryPage.classList.add('active');

  }, 500);

});


/* =====================================================
   COUNTRY
===================================================== */

const countryCards =
  $$('.country-card');

const countryResult =
  $('#countryResult');


countryCards.forEach(card => {

  card.addEventListener('click', () => {

    countryCards.forEach(c => {
      c.classList.remove('selected');
    });

    card.classList.add('selected');

    selectedCountry =
      card.dataset.country;

    countryResult.textContent =
      selectedCountry.toUpperCase();

    showToast(
      `ORIGIN SELECTED · ${selectedCountry.toUpperCase()}`
    );

  });

});


countryNext.addEventListener('click', () => {

  if (!selectedCountry) {

    showToast(
      'PLEASE CHOOSE YOUR COUNTRY'
    );

    return;
  }


  countryPage.classList.remove('active');

  setTimeout(() => {

    colorPage.classList.add('active');

    window.scrollTo({
      top:0,
      behavior:'instant'
    });

  },300);

});


/* =====================================================
   COLOR
===================================================== */

const colorCards =
  $$('.color-card');

const colorResult =
  $('#colorResult');


colorCards.forEach(card => {

  card.addEventListener('click', () => {

    colorCards.forEach(c => {
      c.classList.remove('selected');
    });

    card.classList.add('selected');

    selectedColor =
      card.dataset.theme;

    colorResult.textContent =
      card.querySelector('strong').textContent;

    applyTheme(selectedColor);

    showToast(
      `ATMOSPHERE · ${card.querySelector('strong').textContent}`
    );

  });

});


/* =====================================================
   COLOR THEMES
===================================================== */

function applyTheme(theme){

  const root =
    document.documentElement;


  if(theme === 'red'){

    root.style.setProperty(
      '--yellow',
      '#ff3b30'
    );

    root.style.setProperty(
      '--red',
      '#ff1744'
    );

    root.style.setProperty(
      '--blue',
      '#ff8a00'
    );

  }


  if(theme === 'blue'){

    root.style.setProperty(
      '--yellow',
      '#00d9ff'
    );

    root.style.setProperty(
      '--red',
      '#2563eb'
    );

    root.style.setProperty(
      '--blue',
      '#00f0ff'
    );

  }


  if(theme === 'yellow'){

    root.style.setProperty(
      '--yellow',
      '#ffd60a'
    );

    root.style.setProperty(
      '--red',
      '#ff6d00'
    );

    root.style.setProperty(
      '--blue',
      '#ffb000'
    );

  }


  if(theme === 'purple'){

    root.style.setProperty(
      '--yellow',
      '#e879f9'
    );

    root.style.setProperty(
      '--red',
      '#a855f7'
    );

    root.style.setProperty(
      '--blue',
      '#ec4899'
    );

  }

}


/* =====================================================
   ENTER DISCO
===================================================== */

finishBtn.addEventListener('click', () => {

  if (!selectedColor) {

    showToast(
      'PLEASE CHOOSE YOUR ATMOSPHERE'
    );

    return;
  }


  localStorage.setItem(
    'discoCountry',
    selectedCountry
  );

  localStorage.setItem(
    'discoColor',
    selectedColor
  );


  colorPage.classList.remove('active');


  setTimeout(() => {

    colorPage.style.display = 'none';

    main.classList.add('visible');

    window.scrollTo({
      top:0,
      behavior:'instant'
    });

    startMusic();

  },500);

});


/* =====================================================
   MUSIC ENGINE
===================================================== */

const soundToggle =
  $('#soundToggle');

const soundLabel =
  $('#soundLabel');

const mainPlay =
  $('#mainPlay');

const record =
  $('.record');

const eq =
  $('#eq');

const progressBar =
  $('#progressBar');

const trackTime =
  $('#trackTime');

const bpmText =
  $('#bpmText');


let audioCtx = null;
let master = null;

let timer = null;

let playing = false;

let bpm = 120;

let elapsed = 0;

let startedAt = 0;

let beatStep = 0;


function setupAudio(){

  if(audioCtx)
    return;

  audioCtx =
    new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

  master =
    audioCtx.createGain();

  master.gain.value =
    0.16;

  master.connect(
    audioCtx.destination
  );

}


function tone(
  frequency,
  duration,
  type,
  volume,
  when
){

  const osc =
    audioCtx.createOscillator();

  const gain =
    audioCtx.createGain();


  osc.type =
    type || 'sine';

  osc.frequency.setValueAtTime(
    frequency,
    when
  );


  gain.gain.setValueAtTime(
    0.0001,
    when
  );

  gain.gain.exponentialRampToValueAtTime(
    volume || 0.05,
    when + 0.008
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    when + duration
  );


  osc.connect(gain);

  gain.connect(master);


  osc.start(when);

  osc.stop(
    when + duration + 0.02
  );

}


function kick(when){

  const osc =
    audioCtx.createOscillator();

  const gain =
    audioCtx.createGain();


  osc.type =
    'sine';


  osc.frequency.setValueAtTime(
    110,
    when
  );

  osc.frequency.exponentialRampToValueAtTime(
    48,
    when + 0.12
  );


  gain.gain.setValueAtTime(
    0.18,
    when
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    when + 0.16
  );


  osc.connect(gain);

  gain.connect(master);


  osc.start(when);

  osc.stop(
    when + 0.18
  );

}


function hat(when){

  const buffer =
    audioCtx.createBuffer(
      1,
      audioCtx.sampleRate * 0.05,
      audioCtx.sampleRate
    );


  const data =
    buffer.getChannelData(0);


  for(
    let i = 0;
    i < data.length;
    i++
  ){

    data[i] =
      (Math.random() * 2 - 1)
      * 0.45;

  }


  const source =
    audioCtx.createBufferSource();

  const filter =
    audioCtx.createBiquadFilter();

  const gain =
    audioCtx.createGain();


  filter.type =
    'highpass';

  filter.frequency.value =
    5000;


  gain.gain.setValueAtTime(
    0.035,
    when
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    when + 0.045
  );


  source.buffer =
    buffer;


  source.connect(filter);

  filter.connect(gain);

  gain.connect(master);


  source.start(when);

}


const bassNotes = [
  55,
  55,
  65.41,
  73.42,
  82.41,
  73.42,
  65.41,
  55
];


function scheduleBar(){

  const step =
    60 / bpm / 2;

  const now =
    audioCtx.currentTime + 0.03;


  for(
    let i = 0;
    i < 8;
    i++
  ){

    const time =
      now + i * step;


    if(
      i === 0 ||
      i === 4
    ){

      kick(time);

    }


    if(
      i % 2 === 1
    ){

      hat(time);

    }


    if(
      i === 1 ||
      i === 3 ||
      i === 5 ||
      i === 7
    ){

      tone(
        bassNotes[
          (beatStep + i)
          % bassNotes.length
        ],

        .14,

        'sawtooth',

        .045,

        time
      );

    }

  }


  beatStep =
    (beatStep + 8)
    % bassNotes.length;

}


function startMusic(){

  setupAudio();


  if(
    audioCtx.state ===
    'suspended'
  ){

    audioCtx.resume();

  }


  if(playing)
    return;


  playing = true;


  startedAt =
    performance.now()
    - elapsed * 1000;


  record.classList.add(
    'playing'
  );

  eq.classList.add(
    'playing'
  );


  $('.sound-bars')
    .classList
    .remove('paused');


  soundLabel.textContent =
    'LIVE';


  mainPlay.textContent =
    'Ⅱ';


  scheduleBar();


  timer =
    setInterval(() => {

      if(!playing)
        return;


      scheduleBar();


      elapsed =
        (
          performance.now()
          - startedAt
        ) / 1000;


      const seconds =
        Math.floor(
          elapsed % 60
        )
        .toString()
        .padStart(2,'0');


      const minutes =
        Math.floor(
          elapsed / 60
        )
        .toString()
        .padStart(2,'0');


      trackTime.textContent =
        `${minutes}:${seconds}`;


      progressBar.style.width =
        `${((elapsed % 60) / 60) * 100}%`;


    },1000);

}


function stopMusic(){

  playing = false;

  clearInterval(timer);


  record.classList.remove(
    'playing'
  );

  eq.classList.remove(
    'playing'
  );


  $('.sound-bars')
    .classList
    .add('paused');


  soundLabel.textContent =
    'PLAY';


  mainPlay.textContent =
    '▶';

}


function toggleMusic(){

  if(playing){

    stopMusic();

  }else{

    startMusic();

  }

}


/* =====================================================
   PLAYER
===================================================== */

soundToggle.addEventListener(
  'click',
  toggleMusic
);


mainPlay.addEventListener(
  'click',
  toggleMusic
);


$$('.track').forEach(
  track => {

    track.addEventListener(
      'click',
      () => {

        $$('.track')
          .forEach(t =>
            t.classList.remove(
              'active'
            )
          );


        track.classList.add(
          'active'
        );


        bpm =
          Number(
            track.dataset.bpm
          ) || 120;


        bpmText.textContent =
          bpm;


        elapsed = 0;


        showToast(
          `NOW PLAYING · ${
            track.querySelector(
              'strong'
            ).textContent
          }`
        );


        if(!playing){

          startMusic();

        }

      }
    );

  }
);


/* =====================================================
   NAVIGATION
===================================================== */

$$('.nav-links a')
.forEach(link => {

  link.addEventListener(
    'click',
    event => {

      event.preventDefault();


      const target =
        document.querySelector(
          link.getAttribute(
            'href'
          )
        );


      if(target){

        target.scrollIntoView({
          behavior:'smooth'
        });

      }

    }
  );

});


/* =====================================================
   CURSOR
===================================================== */

document.addEventListener(
  'mousemove',
  event => {

    const dot =
      $('.cursor-dot');

    const ring =
      $('.cursor-ring');


    if(!dot || !ring)
      return;


    dot.style.left =
      event.clientX + 'px';

    dot.style.top =
      event.clientY + 'px';


    ring.animate(
      {
        left:
          event.clientX + 'px',

        top:
          event.clientY + 'px'
      },
      {
        duration:350,
        fill:'forwards'
      }
    );

  }
);


/* =====================================================
   TOAST
===================================================== */

const toast =
  $('#toast');


function showToast(text){

  toast.textContent =
    text;

  toast.classList.add(
    'show'
  );


  clearTimeout(
    showToast.timer
  );


  showToast.timer =
    setTimeout(
      () => {

        toast.classList.remove(
          'show'
        );

      },
      1800
    );

}


/* =====================================================
   LOAD SAVED SETTINGS
===================================================== */

const savedColor =
  localStorage.getItem(
    'discoColor'
  );


if(savedColor){

  applyTheme(
    savedColor
  );

}


/* =====================================================
   SCROLL
===================================================== */

window.addEventListener(
  'scroll',
  () => {

    document.documentElement
      .style
      .setProperty(
        '--scroll',
        window.scrollY
      );

  }
);

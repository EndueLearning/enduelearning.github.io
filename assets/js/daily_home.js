// assets/js/daily_home.js
(function(){
  'use strict';
  // load fun facts from /assets/data/dailyfacts.json (we created earlier)
  const FUN_URL = '/assets/data/dailyfacts.json';

  // small highlights list (we'll fetch top quiz topics — for now static examples)
  const highlights = [
    { title: "Physics: Ray Diagrams", href: "/games/quizsets/science/physics.html" },
    { title: "Math: Algebra Basics", href: "/games/quizsets/mathematics/algebra.html" },
    { title: "English: Grammar Quick Check", href: "/games/quizsets/english/grammar.html" }
  ];

  function pickDaily(list){
    if(!Array.isArray(list) || list.length===0) return '';
    const day = new Date(); // local day
    return list[ (Math.floor((new Date(day.getFullYear(),day.getMonth(),day.getDate()).getTime()/(24*60*60*1000))) % list.length) ];
  }

  function renderFact(fact){
    const el = document.getElementById('home-fun-fact');
    if(!el) return;
    el.innerHTML = `<p class="small">${(fact || 'Keep exploring — new facts every day!')}</p>`;
  }

  function renderHighlights(){
    const ul = document.getElementById('quiz-highlights-list');
    if(!ul) return;
    ul.innerHTML = highlights.map(h => `<li><a href="${h.href}">${h.title}</a></li>`).join('');
  }

  fetch(FUN_URL)
    .then(r => r.ok ? r.json() : Promise.reject('no-facts'))
    .then(list => {
      const fact = pickDaily(list);
      renderFact(fact);
      renderHighlights();
    })
    .catch(err => {
      console.warn('daily_home: cannot load facts', err);
      renderFact('Explore quizzes and practice daily!');
      renderHighlights();
    });

})();

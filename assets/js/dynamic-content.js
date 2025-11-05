// dynamic-content.js - shows daily word/thought using library.js
window.addEventListener('load', ()=>{
  if(typeof wordLibrary !== 'undefined'){
    const day=new Date().getDate();
    const w=wordLibrary[day%wordLibrary.length];
    const t=thoughtLibrary[day%thoughtLibrary.length];
    const we=document.getElementById('word-of-day'), te=document.getElementById('thought-of-day');
    if(we) we.innerHTML=`<strong>${w.word}</strong><br>${w.meaning}`;
    if(te) te.textContent = t;
  }
});

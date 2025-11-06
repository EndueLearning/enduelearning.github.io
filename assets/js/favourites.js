// favourites.js
function toggleFavourite(id){ const fav = JSON.parse(localStorage.getItem('endue_favs')||'[]'); const i = fav.indexOf(id); if(i===-1) fav.push(id); else fav.splice(i,1); localStorage.setItem('endue_favs', JSON.stringify(fav)); }
function isFavourite(id){ return (JSON.parse(localStorage.getItem('endue_favs')||'[]')).includes(id); }

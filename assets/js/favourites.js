// assets/js/favourites.js
function toggleFavourite(id){
  const fav = JSON.parse(localStorage.getItem('endue_favs') || '[]');
  const idx = fav.indexOf(id);
  if(idx === -1) fav.push(id); else fav.splice(idx,1);
  localStorage.setItem('endue_favs', JSON.stringify(fav));
}
function isFavourite(id){
  const fav = JSON.parse(localStorage.getItem('endue_favs') || '[]');
  return fav.includes(id);
}

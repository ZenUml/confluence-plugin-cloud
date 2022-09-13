document.addEventListener('keydown', function(e) {
  if (e.code === 'Escape') {
    console.log('Escape key is ignored.')
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
});

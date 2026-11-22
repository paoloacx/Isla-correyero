document.addEventListener('click', (event) => {
  const closeButton = event.target.closest('.poem-close-button');
  if (closeButton) closeButton.closest('details').open = false;
});

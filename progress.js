let progress_timer = null;

function startProgress() {
  const progress = document.getElementById('progress');
  const progress_inner = document.getElementById('progress_inner');

  progress.style.visibility = 'visible';
  let incr = 150;
  let width = 60;
  progress_timer = setInterval(function() {
      width += Math.floor(Math.random()*5 + incr);
      incr *= 0.9;
      progress_inner.style.width = `${width}px`;
  }, 300);
}

function stopProgress() {
  const progress = document.getElementById('progress');
  const progress_inner = document.getElementById('progress_inner');

  progress_inner.style.width = '100%';

  setTimeout(function() {
      progress.style.visibility = 'hidden';
      progress_inner.style.width = '60px';
      if (progress_timer != null) {
          clearTimeout(progress_timer);
          progress_timer = null;
      }
  }, 500);
}

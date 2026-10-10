(function () {
  'use strict';

  var root = document.getElementById('random-quote');
  if (!root) return;

  var records = Array.from(document.querySelectorAll('#random-quote-data [data-quote-record]')).map(function (record) {
    return {
      text: record.querySelector('[data-quote-text]').textContent,
      title: record.querySelector('[data-quote-title]').textContent,
      preview: record.getAttribute('data-preview-url')
    };
  });
  var content = document.getElementById('random-quote-content');
  var text = document.getElementById('random-quote-text');
  var title = document.getElementById('random-quote-title');
  var preview = document.getElementById('random-quote-preview');
  var actions = document.getElementById('random-quote-actions');
  var next = document.getElementById('random-quote-next');
  var empty = document.getElementById('random-quote-empty');
  var currentIndex = -1;

  if (records.length === 0) {
    content.hidden = true;
    actions.hidden = true;
    preview.removeAttribute('href');
    empty.hidden = false;
    return;
  }

  function chooseQuote() {
    // Each eligible record occupies one equal-sized interval of Math.random().
    var excludeCurrent = currentIndex !== -1 && records.length > 1;
    var index = Math.floor(Math.random() * (records.length - (excludeCurrent ? 1 : 0)));
    if (excludeCurrent && index >= currentIndex) index += 1;

    currentIndex = index;
    var quote = records[index];
    text.textContent = quote.text;
    title.textContent = quote.title;
    preview.setAttribute('href', quote.preview);
    content.hidden = false;
    actions.hidden = false;
    empty.hidden = true;
  }

  chooseQuote();
  next.disabled = records.length < 2;
  next.addEventListener('click', chooseQuote);
}());

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = process.argv[2] || path.join(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'assets/javascript/random-idezet.js'), 'utf8');

function run(records, randomValues, hasRoot = true) {
  const elements = {};
  for (const id of ['random-quote', 'random-quote-content', 'random-quote-text', 'random-quote-title', 'random-quote-preview', 'random-quote-actions', 'random-quote-next', 'random-quote-empty']) {
    elements[id] = {
      hidden: false, disabled: true, textContent: '', attributes: { href: '/stale' }, handlers: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      addEventListener(name, fn) { this.handlers[name] = fn; }
    };
  }
  const queue = randomValues.slice();
  vm.runInNewContext(source, {
    document: {
      getElementById(id) { return id === 'random-quote' && !hasRoot ? null : elements[id]; },
      querySelectorAll() {
        return records.map(record => ({
          querySelector(selector) { return { textContent: selector === '[data-quote-text]' ? record.text : record.title }; },
          getAttribute() { return record.preview; }
        }));
      }
    },
    Math: { floor: Math.floor, random() { assert.ok(queue.length, 'Unexpected extra random selection'); return queue.shift(); } },
    Array
  });
  return { elements, queue, click() { elements['random-quote-next'].handlers.click(); } };
}

function displayed(test, expected) {
  assert.equal(test.elements['random-quote-text'].textContent, expected.text);
  assert.equal(test.elements['random-quote-title'].textContent, expected.title);
  assert.equal(test.elements['random-quote-preview'].attributes.href, expected.preview);
}

const records = [
  { text: '„Árvíztűrő”\nMásodik sor <img src=x onerror=alert(1)> </script>', title: 'A', preview: '/teszt/a/beleolvaso' },
  { text: 'Másik idézet ugyanabból a könyvből', title: 'A', preview: '/teszt/a/beleolvaso' },
  { text: 'Harmadik idézet', title: 'B', preview: '/teszt/b/beleolvaso' }
];

const empty = run([], []);
assert.equal(empty.elements['random-quote-content'].hidden, true);
assert.equal(empty.elements['random-quote-actions'].hidden, true);
assert.equal(empty.elements['random-quote-empty'].hidden, false);
assert.equal(empty.elements['random-quote-preview'].attributes.href, undefined);
const single = run([records[0]], [0]);
displayed(single, records[0]);
assert.equal(single.elements['random-quote-next'].disabled, true);
run([], [], false);

// Exercise boundaries of every equal-width initial interval, including 2+1 records per book.
for (let n = 2; n <= 7; n++) {
  const list = Array.from({ length: n }, (_, i) => ({ text: 'Egyedi idézet ' + i, title: i < 2 ? 'A' : 'B' + i, preview: '/teszt/' + i + '/beleolvaso' }));
  for (let i = 0; i < n; i++) {
    for (const random of [i / n, (i + 0.5) / n, (i + 1) / n - 1e-12]) {
      const test = run(list, [random]);
      displayed(test, list[i]);
      assert.equal(test.elements['random-quote-next'].disabled, false);
    }
    // Every next interval selects one other record; title equality does not exclude a record.
    const eligible = list.map((_, j) => j).filter(j => j !== i);
    for (let j = 0; j < n - 1; j++) {
      for (const random of [j / (n - 1), (j + 0.5) / (n - 1), (j + 1) / (n - 1) - 1e-12]) {
        const test = run(list, [(i + 0.5) / n, random]);
        test.click();
        displayed(test, list[eligible[j]]);
      }
    }
  }
}
const sameBook = run(records, [0, 0]);
sameBook.click();
displayed(sameBook, records[1]);

// A sequence, rather than only the first transition, must keep text/title/link paired.
const seq = run(records, [0, 0, 0.999999, 0.999999, 0]);
for (const index of [1, 2, 1, 0]) { seq.click(); displayed(seq, records[index]); }
console.log('PASS: 0/1/2..7 records; initial interval boundaries; all excluded-index choices; 2+1 book distribution; same-book transitions; text/newlines/HTML-like strings; matching links; absent root.');

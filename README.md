# Goldenlane website
 

## Installation
To preview changes, run a local version of the website on your computer (which involves setting up Ruby and the GitHub Pages Gem).

### Requirements
- **Git**: If you have problems cloning and contributing to a private GitHub repository,
you might want to check out [how to add SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent),
to connect your computer with your GitHub account.
- **Jekyll**: To build the website, we use [Jekyll](https://jekyllrb.com/), which is based on Ruby. Since the site is deployed via Github Pages (which does not use the latest version of Jekyll), the best thing to do is to follow the instructions for installing the Github pages Gem (which includes a dependency on the right version of Jekyll) rather than installing Jekyll directly: [GitHub - github/pages-gem](https://github.com/github/pages-gem)
- **Bundler**: If you followed the Jekyll installation guide, you already have the `bundler` Ruby gem,
  but it is worth to note that the system uses this gem, which helps to install all the required gems (packages), to build the website.
  See the list of these important packages in the `Gemfile` of the repository.
- **Gemfile** lists the project's dependencies. The Windows-specific `wdm` line is already commented out.

If you followed these steps, you can start your local website by running the code `bundle exec jekyll serve` in the directory of the repository.
To access the website from your browser, go to `http://localhost:4000`

## Repository structure
Some of the important files, folders in the repository:
```
project
│   README.md
│   Gemfile # Ruby gems to load
|   _config.yml # Includes, defaults
│
└───assets # Photos, pdfs
└───_books # Books in a collection structure
└───_layouts # Page descriptors
└───_includes
│   │   head.html # HTML <head> tags, including SEO meta tags
|   |   header.html # Top menu implementation
|   |   footer.html # Footer implementation
```

### Creating new folder in GitHub Browser
Creating a new folder from a browser is not straightforward. Let's say we want to create the folder `banana` under the existing parent folder `pictures` and later we want to upload `BananaTree.jpg` picture in it. The steps as follows:

1. Inside the picture folder create a new file and name it `banana/temporary`. As you create the file, GitHub will recognize that here the part before the `/` is a folder.
2. Add pictures to the newly created folder.
3. Remove `temporary` file.

## Collections

Add new books in `_books/`.

Update series in `_series/`.

Add preview/read-in in `_previews/`.

Follow the metadata structure of existing examples (eg. `permalink` should be: `konyvek/<series-name>/<book-name>/beleolvaso` to match the internal links between pages correctly)

## Random idézet: bővítés és helyi előnézet

A `/random-idezet` oldal a belső oldalak felső menüjéből és mobilmenüjéből
érhető el. A kezdőlap változatlan. Belépéskor minden idézetrekord azonos eséllyel
kerül kiválasztásra; a „Másik idézet” az aktuális rekordot kizárva választ.
Ugyanahhoz a könyvhöz több idézet is tartozhat, és két külön idézete egymás után
is megjelenhet. JavaScript nélkül az első idézet és beleolvasója használható.

### Új idézet hozzáadása

1. Nyisd meg a `_data/quotes.yml` fájlt, és másolj le egy meglévő rekordot.
   Az induló hét rekord teljes kitöltött mintaként is használható:

   ```yaml
   - id: herceg-josnoje-001
     text: "Nekem mindig iszonyú mázlim volt, amikor nem volt szerencsém."
     book_title: "A herceg jósnője"
     book_permalink: /konyvek/josido/a-herceg-josnoje
     preview_permalink: /konyvek/josido/a-herceg-josnoje/beleolvaso
     source_file: _previews/a-herceg-josnoje-reszlet.md
     source_line: 8
   ```

2. Adj az egész listában egyedi `id` értéket. Ugyanazon könyv következő
   idézete például `herceg-josnoje-002` lehet. A korábbi rekord maradjon meg.
3. A `text` szó szerinti könyvidézet legyen, a `book_title` a könyv címe.
   Csak ellenőrzött, valóban J. Goldenlane-től származó szöveget használj;
   ne találj ki idézetet, és ne vegyél át idegen szerzőtől származó mottót.
4. A `book_permalink` értékét az adott `_books/*.md` fájlból, a
   `preview_permalink` értékét a hozzá tartozó `_previews/*.md` fájlból másold.
   A könyvcím egyszerű szöveg; a könyv útvonala szerkesztői ellenőrzési adat.
   A „Beleolvasok” mindig az adott könyv létező belső beleolvasójára mutasson.
   Vásárlási oldal és másik könyv részlete nem megfelelő. A linket ne az
   idézetszövegből képezd. Beleolvasó nélküli könyvet még ne adj a listához.
5. A `source_file` és `source_line` jelölje az idézet visszakereshető forrását.
   A sorszám később eltolódhat; a szöveg és a forrás azonossága számít.
6. YAML-ban szóközökkel húzz be, tabulátort ne használj. Dupla idézőjeles
   szövegben a belső idézőjelet `\"`, a visszaperjelet `\\` alakban írd.
   Többsoros idézethez `text: |` használható, alatta behúzott sorokkal:

   ```yaml
     text: |
       Nekem mindig iszonyú mázlim volt, amikor nem volt szerencsém.
       Tulajdonképpen ez a történet erről szól.
   ```

   A sortörések a megjelenítésben megmaradnak; az idézet szövege nem HTML-kód.
7. Mentés után ellenőrizd: nincs üres szöveg vagy ismételt ID, a könyvcím és
   mindkét útvonal helyes, a beleolvasó a megadott könyvhöz tartozik, a szöveg
   szerepel a forrásban. Futtass helyi buildet, majd böngészőben próbáld ki a
   váltást, a beleolvasó-linket és a mobilmenüt.

### Helyi futtatás

A munkakönyvtár gyökerében, elérhető Ruby és Bundler mellett:

```powershell
bundle install
bundle exec jekyll build
bundle exec jekyll serve --host 127.0.0.1
```

Nyisd meg a `http://127.0.0.1:4000/random-idezet` címet. A szerver leállítása
a futtató terminálban `Ctrl+C`. Keskeny, például 375 px-es nézetben is ellenőrizd
a két vezérlőt és a felső mobilmenüt. Egy rekordnál a váltógomb letiltott;
üres adatlistánál magyar tájékoztató jelenik meg, beleolvasó-link nélkül.

Az új útvonalak baseurl-ellenőrzéséhez:

```powershell
bundle exec jekyll build --baseurl /teszt
```

Az új menülink, a beleolvasó és az oldal saját scriptje ekkor `/teszt/` előtagot
kap. A régi oldal gyökérhez kötött linkjeinek általános javítása külön feladat.

A funkció fájljai: `_data/quotes.yml`, `pages/random-idezet.html`,
`assets/javascript/random-idezet.js`, `_sass/_random-idezet.scss`;
a menüpont `_includes/header.html`-ben, a Sass-import `assets/main.scss`-ben van.

Az adatfájl szerkesztése és a helyi build nem publikál. Ennél a fejlesztésnél
minden módosítás helyben marad: commit csak külön kifejezett kérésre készülhet
a feature ágon; push, PR és éles deploy nem része a munkának. A GitHub-élesítést
és a végső merge-et külön, a felhasználó intézi.

# Goldenlane website
 

## Installation
If you only want to apply small changes and you are familiar with markdown, you can push your modifications using `git`.
But if you want to see a preview of your changes, you should deploy a local version of the website hosted in your computer (which involves setting up Ruby and the Github pages Gem).

### Requirements
- **Git**: If you have problems cloning and contributing to a private GitHub repository,
you might want to check out [how to add SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent),
to connect your computer with your GitHub account.
- **Jekyll**: To build the website, we use [Jekyll](https://jekyllrb.com/), which is based on Ruby. Since the site is deployed via Github Pages (which does not use the latest version of Jekyll), the best thing to do is to follow the instructions for installing the Github pages Gem (which includes a dependency on the right version of Jekyll) rather than installing Jekyll directly: [GitHub - github/pages-gem](https://github.com/github/pages-gem)
- **Bundler**: If you followed the Jekyll installation guide, you already have the `bundler` Ruby gem,
  but it is worth to note that the system uses this gem, which helps to install all the required gems (packages), to build the website.
  See the list of these important packages in the `Gemfile` of the repository.
- **Gemfile** If you use **linux**, you have to remove the line `gem 'wdm', '~> 0.1.0'` from the file, as this is a windows specific gem. 

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

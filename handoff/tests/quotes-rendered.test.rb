require 'nokogiri'
require 'yaml'
root = File.expand_path('../..', __dir__)
quotes = YAML.safe_load_file(File.join(root, '_data/quotes.yml'))
site = ARGV[0] ? File.expand_path(ARGV[0]) : File.join(root, '_site')
page = Nokogiri::HTML(File.read(File.join(site, 'random-idezet.html'), encoding: 'UTF-8'))
records = page.css('[data-quote-record]')
raise 'Record count mismatch' unless records.length == quotes.length
records.each_with_index do |record, index|
  quote = quotes[index]
  raise 'Text mismatch' unless record.at_css('[data-quote-text]').text == quote['text']
  raise 'Title mismatch' unless record.at_css('[data-quote-title]').text == quote['book_title']
  raise 'Preview mismatch' unless record['data-preview-url'] == quote['preview_permalink']
  %w[book_permalink preview_permalink].each do |key|
    raise 'Missing linked page' unless File.file?(File.join(site, "#{quote[key]}.html"))
  end
end
raise 'No deferred script' unless page.at_css('script[src$="random-idezet.js"]')['defer']
raise 'Missing fallback' unless page.at_css('noscript') && page.at_css('#random-quote-preview')['href'] == quotes.first['preview_permalink']
puts "PASS: #{records.length} rendered records, exact text/title/link pairings, target pages, deferred script, JavaScript-free fallback."

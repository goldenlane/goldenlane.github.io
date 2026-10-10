require 'yaml'
require 'date'

root = ARGV[0] ? File.expand_path(ARGV[0]) : File.expand_path('../..', __dir__)
quotes = YAML.safe_load_file(File.join(root, '_data/quotes.yml'))
required_fields = %w[id text book_title book_permalink preview_permalink]
raise 'Expected a YAML list' unless quotes.is_a?(Array)
quotes.each do |quote|
  raise 'Expected a record mapping' unless quote.is_a?(Hash)
  required_fields.each do |field|
    raise "Missing or invalid #{field}: #{quote['id']}" unless quote[field].is_a?(String) && !quote[field].strip.empty?
  end
  raise "Text exceeds 1000 Unicode characters: #{quote['id']}" if quote['text'].length > 1000
end
raise 'Duplicate IDs' unless quotes.map { |q| q['id'] }.uniq.length == quotes.length

def frontmatter(path)
  YAML.safe_load(File.read(path, encoding: 'UTF-8').split(/^---\s*$\n?/)[1], permitted_classes: [Date, Time], aliases: true)
end

books = Dir[File.join(root, '_books/*.md')].map { |p| [p, frontmatter(p)] }
previews = Dir[File.join(root, '_previews/*.md')].map { |p| [p, frontmatter(p)] }
quotes.each do |quote|
  raise 'Empty text' if quote['text'].strip.empty?
  book = books.find { |_, data| data['permalink'] == quote['book_permalink'] }
  preview = previews.find { |_, data| data['permalink'] == quote['preview_permalink'] }
  raise "Missing book/preview: #{quote['id']}" unless book && preview
  raise 'Title mismatch' unless book[1]['title'] == quote['book_title']
  raise 'Preview mismatch' unless quote['preview_permalink'] == "#{quote['book_permalink']}/beleolvaso"
end
puts "PASS: #{quotes.length} records, unique IDs, five required fields, nonempty text, maximum 1000 Unicode characters, titles, book and preview permalinks and pairings."

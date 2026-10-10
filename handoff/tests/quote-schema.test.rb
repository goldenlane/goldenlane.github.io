require 'yaml'
require 'tmpdir'
require 'fileutils'
require 'open3'
require 'rbconfig'

root = ARGV[0] ? File.expand_path(ARGV[0]) : File.expand_path('../..', __dir__)
validator = File.join(__dir__, 'validate-quotes.rb')
original = YAML.safe_load_file(File.join(root, '_data/quotes.yml'))
Dir.mktmpdir('quote-schema-', File.expand_path('..', __dir__)) do |temp|
  FileUtils.mkdir_p(File.join(temp, '_data'))
  %w[_books _previews].each { |dir| FileUtils.cp_r(File.join(root, dir), temp) }
  cases = {
    '1000 Unicode characters including newline' => [original.first.merge('text' => "😀" * 998 + "\nő"), true],
    '1001 characters' => [original.first.merge('text' => 'ő' * 1001), false],
    'blank text' => [original.first.merge('text' => " \n "), false],
    'missing field' => [original.first.reject { |key, _| key == 'book_title' }, false],
    'wrong title' => [original.first.merge('book_title' => 'Wrong'), false],
    'wrong preview pairing' => [original.first.merge('preview_permalink' => original[1]['preview_permalink']), false]
  }
  cases.each do |name, (record, expected)|
    File.write(File.join(temp, '_data/quotes.yml'), [record].to_yaml)
    output, status = Open3.capture2e(RbConfig.ruby, '--disable-gems', validator, temp)
    raise "#{name}: #{output}" unless status.success? == expected
  end
  File.write(File.join(temp, '_data/quotes.yml'), [original.first, original.first].to_yaml)
  _, status = Open3.capture2e(RbConfig.ruby, '--disable-gems', validator, temp)
  raise 'Duplicate ID accepted' if status.success?
  File.write(File.join(temp, '_data/quotes.yml'), "- text: [\n")
  _, status = Open3.capture2e(RbConfig.ruby, '--disable-gems', validator, temp)
  raise 'Invalid YAML accepted' if status.success?
end
output, status = Open3.capture2e(RbConfig.ruby, '--disable-gems', validator, root)
raise output unless status.success?
puts 'PASS: YAML, duplicate IDs, required fields, blank text, title/preview pairing, 1000/1001 Unicode boundary; preview text membership is not required.'

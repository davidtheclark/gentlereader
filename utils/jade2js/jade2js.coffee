watch = require 'watch'
fs = require 'fs'
path = require 'path'
jade = require 'jade'
argv = require('optimist')
  .boolean(['R','s']) # Use -R flag to create RequireJS files, use -s flag to indicate if all functions should be written to a single file
  .default(
    J: '/static/anthologist/scripts/lib/jade-runtime.js',   # use -J flag to indicate the location of Jade's runtime.js
    w: '../../static/anthologist/scripts/templates/jade',   # use -w flag to indicate the watch directory of Jade files
    o: '../../static/anthologist/scripts/templates'         # use -o flag to indicate the output location for JavaScript files    
  )
  .argv
  
jadePath = path.resolve argv.J.replace(".js","")
watchDir = argv.w
outDir = argv.o
useRequire = argv.R
singleFile = argv.s

# Check if a give path is a Jade file
isJadeFile = (fileOrDir) ->
  stat = fs.statSync fileOrDir
  return stat.isFile() and path.extname(fileOrDir) is '.jade'

# Convert a Jade file into a JavaScript function
compileFile = (filepath) ->
  console.log "\tcompiling #{path.resolve filepath}"
  fileContents = fs.readFileSync filepath, 'utf8'
  return jade.compile fileContents,
    client: true
    compileDebug: false
    filename: filepath
    pretty: true

# Construct a name for a compiled function, based on the Jade file's name
buildFunctionName = (filepath) ->
  ext = path.extname filepath
  fnName = path.basename filepath, ext
  return "#{fnName}"

# Convert a compiled function to a string, and applying the correct function name
functionString = (fn, fnName) ->
  return fn.toString().replace 'function anonymous(', "function #{fnName}("

# Write a function string to a WriteStream
writeFunction = (outStream, filepath) -> 
  console.log "Writing #{path.resolve filepath} to JavaScript"
  fn = compileFile filepath
  fnName = buildFunctionName path.basename filepath
  fnStr = functionString fn, fnName
  outStream.write fnStr
  
# Make sure a folder path exists
createFolders = (folderPath) ->
  fullPath = path.sep
  for folder in folderPath.split path.sep
    fullPath = path.join fullPath, folder
    if not fs.existsSync(fullPath)
      fs.mkdirSync(fullPath)
  
# Determine the correct place for an output file
outFileLocation = (filepath) ->
  fileExt = path.extname filepath
  fileName = path.basename filepath, fileExt
  fileDir = path.dirname filepath
  fileRelDir = path.relative watchDir, fileDir
  if outDir
    fullPath = path.join outDir, fileRelDir
    createFolders path.resolve fullPath
    dir = fullPath
  else
    dir = fileDir
  return path.join(outDir, 'all-templates.js') if singleFile
  return path.join dir, "#{fileName}.js"
  
# Create a JavaScript file without RequireJS syntax
writeJs = (filepath)->
  if isJadeFile filepath
    outFile = outFileLocation filepath
    outStream = fs.createWriteStream outFile,
      flags: 'w'
    writeFunction(outStream, filepath)
    console.log "\twritten to #{path.resolve outFile}\n"
    
# Create a JavaScript file with RequireJS syntax
writeRequireJs = (filepath) ->
  if isJadeFile filepath
    outFile = outFileLocation filepath
    outStream = fs.createWriteStream outFile,
      flags: 'w'
    outStream.write "require.config({paths:{jade:'#{jadePath}'},shim:{jade:{exports:'jade'}}});\n"
    outStream.write "define(['jade'],function(jade){\n"
    writeFunction(outStream, filepath)
    outStream.write "return #{buildFunctionName path.basename filepath}});"
    console.log "\twritten to #{path.resolve outFile}\n"
    
watch.createMonitor watchDir, (monitor) ->
  monitor.on 'created', (filepath, stat) ->
    console.log "CREATED: #{path.resolve filepath}"
    writeRequireJs(filepath) if useRequire
    writeJs(filepath) if not useRequire
    return
  monitor.on 'changed', (filepath, currStat, prevStat) ->
    console.log "CHANGED: #{path.resolve filepath}"
    writeRequireJs(filepath) if useRequire
    writeJs(filepath) if not useRequire
    return
  monitor.on 'removed', (filepath, stat) ->
    console.log "REMOVED: #{path.resolve filepath}"
    
    return
  return
var fs = require('fs');
var path = require('path');

var projectDir = process.cwd();
var moduleDir = __dirname || path.dirname(process.argv[1]);

var filesToCopy = [
  'scopes/scope_settings.xml',
  'encodings.xml',
  'misc.xml',
  'modules.xml',
  'project.iml',
  'vcs.xml',
  'workspace.xml'
];

var args = process.argv.slice(2);

var cmd = args.shift();

switch (cmd) {
  case 'init':
    initProject(args);
    break;
  default:
    throw new Error('Unrecognized command: ' + cmd);
}

function initProject(args) {
  var projectName = args.shift() || path.basename(projectDir);
  var ideaPath = path.join(projectDir, '.idea');

  var mode = parseInt('0644', 8);

  console.log('Creating project files for "' + projectName + '"...');

  fs.mkdirSync(ideaPath);
  fs.writeFileSync(path.join(ideaPath, '.name'), projectName, {mode: mode});
  fs.mkdirSync(path.join(ideaPath, 'scopes'));

  //the file copy operations must be done async
  var copyFiles = function copyNext(callback) {
    var file = filesToCopy.shift();
    var writeStream = fs.createWriteStream(path.join(ideaPath, file), {mode: mode});
    writeStream.on('open', function() {
      var readStream = fs.createReadStream(path.join(moduleDir, 'data', file));
      //we buffer the file to do replacements since it is not large
      var chunks = [];
      readStream.on('data', function(data) {
        chunks.push(data.toString('utf8'));
      });
      readStream.on('end', function() {
        var data = chunks.join('');
        data = data.replace(/project_name/g, projectName);
        data = data.replace(/project_file/g, projectName);
        writeStream.write(new Buffer(data, 'utf8'));
        writeStream.end();
        if (filesToCopy.length) {
          copyNext(callback);
        } else {
          callback();
        }
      });
    });
  };

  copyFiles(function() {
    fs.renameSync(path.join(ideaPath, 'project.iml'), path.join(ideaPath, projectName + '.iml'));
    console.log('done.');
  });
}

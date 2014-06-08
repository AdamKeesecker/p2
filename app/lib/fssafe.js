/* jshint camelcase: false */

'use strict';

var fs = require('fs');
var repo__dirname = `${__dirname}/../static`;

function mkdirSafeSync(repoPath)
{
  var dirs = repoPath.split('/');
  dirs.forEach((dir, i)=>
  {
    var directory = repo__dirname;
    for(var j = 0; j <= i; ++j)
    {
      if(dirs[j])
      {
        directory += `/${dirs[j]}`;
      }
    }

    if(!fs.existsSync(directory))
    {
      fs.mkdirSync(directory);
    }    
  });
}

function rmdirRecursiveSync(localDir)
{
  var directory = `${repo__dirname}/${localDir}`;
  var files = fs.readdirSync(directory);
  files.forEach((file)=>
  {
    var target = `${directory}/${file}`;
    if(file.indexOf('.') !== -1)
    {
      fs.unlinkSync(target);
    }
    else
    {
      rmdirRecursiveSync(target);
    }
  });
  fs.rmdirSync(directory);
}

function renameSafeSync(oldPath, newLocalPath)
{
  fs.renameSync(oldPath, `${repo__dirname}/${newLocalPath}`);
  // fs.renameSync(oldPath, `${newLocalPath}`);
}

function readdirSafeSync(directory)
{
  mkdirSafeSync(directory);
  return fs.readdirSync(`${repo__dirname}/${directory}`);
}

function unlinkSync(target)
{
  fs.unlinkSync(target);
}

exports.mkdirSafeSync = mkdirSafeSync;
exports.rmdirRecursiveSync = rmdirRecursiveSync;
exports.renameSafeSync = renameSafeSync;
exports.readdirSafeSync = readdirSafeSync;
exports.unlinkSync = unlinkSync;
#!/usr/bin/env node

var spawn = require('child_process').spawn
var exec = require('child_process').exec
var path = require('path')

exec('git diff --cached --name-only --diff-filter=ACMR', function (err, gitCachedFiles) {
  gitCachedFiles = gitCachedFiles.toString().trim()

  if (gitCachedFiles) {
    spawn('npm', ['test'], {
      stdio: 'inherit'
    }).on('close', process.exit.bind(process))
  }
})

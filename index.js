#! /usr/bin/env node
const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
// Clone project
let project_name = process.argv[2] || "massa-sc-template"
execSync(`git clone https://github.com/massalabs/massa-sc-template ${project_name}`)
// Fresh git repository
let cwd = `./${project_name}`
execSync('rm -rf .git', { cwd })
execSync('git init', { cwd })
// Edit package.json with user settings
let package_json = JSON.parse(readFileSync(`${cwd}/package.json`))
package_json.name = project_name
package_json.version = "0.1.0"
delete package_json.repository
delete package_json.description
delete package_json.author
delete package_json.license
delete package_json.private
writeFileSync(`${cwd}/package.json`, JSON.stringify(package_json, null, 2))

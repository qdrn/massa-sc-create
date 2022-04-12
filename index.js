#! /usr/bin/env node
const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
// Define some fancy CLI utils
let log = (x) => console.log("\033[32m" + x + "\033[39m");
let err = (x) => {
  console.log("\033[31m" + x + "\033[39m");
  process.exit(1);
};
// Retrieve command line arguments
let argv = require("yargs/yargs")(process.argv.slice(2)).argv;
let project_name = argv._[0] || "massa-sc-template";
let cwd = require("path").join(process.cwd(), project_name);
if (fs.existsSync(cwd)) {
  err(`Directory ${cwd} already exists!`);
}
// Clone project according a given template
log(`Creating a new Massa Smart Contract template project ${cwd}...`);
let templates = {
  react: "https://github.com/massalabs/create-react-app-massa",
  default: "https://github.com/massalabs/massa-sc-template",
};
if (argv.template && !(argv.template in templates)) {
  err(`Template ${argv.template} do not exist!`);
}
let template = templates[argv.template] || templates.default;
execSync(`git clone  ${template} ${project_name}`);
// Give to user a fresh git repository
execSync("rm -rf .git", { cwd });
execSync("git init", { cwd });
// Edit package.json with user defaults
let package_json = JSON.parse(readFileSync(`${cwd}/package.json`));
package_json.name = project_name;
package_json.version = "0.1.0";
delete package_json.repository;
delete package_json.description;
delete package_json.author;
delete package_json.license;
delete package_json.private;
writeFileSync(`${cwd}/package.json`, JSON.stringify(package_json, null, 2));
// Install NPM dependencies
log("Installing packages. This might take a couple of minutes...");
execSync(`cd ${cwd} && npm install`);
log(`Happy hacking! 🤖`);

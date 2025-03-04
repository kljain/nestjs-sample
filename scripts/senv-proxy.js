#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { argv } = require('yargs');
const fs = require('fs');

const SenvActionType = {
  ENCRYPT: 'encrypt',
  DECRYPT: 'decrypt',
};

const rootEnvPath = `.env`;

const getEncryptedEnvFile = (target) => {
  return `./env/${target}.env`;
};

const loadSenvActionSecretKey = (target) => {
  const passwordFilePath = `./env/.env.pass.${target}`;
  return fs.readFileSync(passwordFilePath).toString().trim();
};

const isValidSenvAction = (action) => {
  switch (action) {
    case SenvActionType.ENCRYPT:
    case SenvActionType.DECRYPT:
      return true;
    default:
      return false;
  }
};

const getSenvActionInputPath = (action, target) => {
  switch (action) {
    case SenvActionType.ENCRYPT:
      return rootEnvPath;
    case SenvActionType.DECRYPT:
      return getEncryptedEnvFile(target);
    default:
      return null;
  }
};

const getSenvActionOutputPath = (action, target) => {
  switch (action) {
    case SenvActionType.ENCRYPT:
      return getEncryptedEnvFile(target);
    case SenvActionType.DECRYPT:
      return rootEnvPath;
    default:
      return null;
  }
};

const loadTargetSenvActionFromArgs = (args) => {
  if (args.encrypt) {
    return SenvActionType.ENCRYPT;
  }

  if (args.decrypt) {
    return SenvActionType.DECRYPT;
  }

  return null;
};

const processCliInput = ({ action, target, password, passwordEnvKey }) => {
  if (!isValidSenvAction(action)) {
    console.warn(`ignoring unsupported senv action: ${action}`);
    return;
  }

  const inputFilePath = getSenvActionInputPath(action, target);
  const outputFilePath = getSenvActionOutputPath(action, target);
  const secret =
    password ||
    (passwordEnvKey && process.env[passwordEnvKey]) ||
    loadSenvActionSecretKey(target);

  execSync(
    `senv ${action} "${inputFilePath}" -o "${outputFilePath}" -p "${secret}"`,
  );
};

processCliInput({
  action: loadTargetSenvActionFromArgs(argv),
  target: argv.target,
  password: argv.password,
  passwordEnvKey: argv.passwordEnvKey,
});

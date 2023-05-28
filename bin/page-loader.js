#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
program
  .name('page-loader')
  .version('0.1.0')
  .description('some description');

program.parse();

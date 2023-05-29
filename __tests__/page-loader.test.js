/* eslint-disable jest/no-conditional-expect */
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import os from 'os';
import pageLoad from '../src/index.js';

let beforeFile;
let afterFile;
let testDir;
let image;
let css;
let script;
let htmlLink;

beforeAll(async () => {
  testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  beforeFile = await fs.readFile('./__fixtures__/ru-hexlet-io-courses.html', 'utf-8');
  afterFile = await fs.readFile('./__fixtures__/ru-hexlet-io-coursesComplete.html', 'utf-8');
  image = await fs.readFile('./__fixtures__/page-loader-hexlet-repl-co-assets-professions-nodejs.png', 'utf-8');
  css = await fs.readFile('./__fixtures__/page-loader-hexlet-repl-co-assets-application.css', 'utf-8');
  script = await fs.readFile('./__fixtures__/page-loader-hexlet-repl-co-script.js', 'utf-8');
  htmlLink = await fs.readFile('./__fixtures__/page-loader-hexlet-repl-co-courses.html', 'utf-8');
});

test('pageLoad', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, beforeFile)
    .get('/assets/application.css')
    .reply(200, css)
    .get('/courses')
    .reply(200, htmlLink)
    .get('/assets/professions/nodejs.png')
    .reply(200, image)
    .get('/packs/js/runtime.js')
    .reply(200, script);
  await pageLoad('https://ru.hexlet.io/courses', testDir);
  const getHtml = await fs.readFile(path.join(testDir, 'ru-hexlet-io-courses.html'), 'utf-8');
  expect(getHtml).toBe(afterFile);
});

test('getImage', async () => {
  const getImage = await fs.readFile(path.join(testDir, 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png'), 'utf-8');
  expect(getImage).toBe(image);
});

test('getCss', async () => {
  const getCss = await fs.readFile(path.join(testDir, 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css'), 'utf-8');
  expect(getCss).toBe(css);
});

test('getHtml', async () => {
  const getHtmlLink = await fs.readFile(path.join(testDir, 'ru-hexlet-io-courses_files/ru-hexlet-io-courses.html'), 'utf-8');
  expect(getHtmlLink).toBe(htmlLink);
});

test('getScript', async () => {
  const getScript = await fs.readFile(path.join(testDir, 'ru-hexlet-io-courses_files/ru-hexlet-io-packs-js-runtime.js'), 'utf-8');
  expect(getScript).toBe(script);
});

test('when the filepath fails', async () => {
  await expect(pageLoad('https://ru.hexlet.io/courses', '/undefined')).rejects.toThrow('Access Error! Please, check your output directory and rights to this directory!');
});

test('when the url fails', async () => {
  nock('https://ru.hexlet.io')
    .get('/courfault')
    .replyWithError({
      response: {
        status: 404,
        statusText: 'Not Found',
      },
      config: {
        url: 'https://ru.hexlet.io/courfault',
      },
    });
  await expect(pageLoad('https://ru.hexlet.io/courfault', testDir)).rejects.toThrow('Error 404 Not Found with https://ru.hexlet.io/courfault');
});

afterAll(async () => {
  await fs.rm(testDir, { recursive: true, force: true });
});
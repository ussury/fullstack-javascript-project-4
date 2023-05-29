import axios from 'axios';
import fs from 'fs/promises';
import { cwd } from 'process';
import path from 'path';
import Listr from 'listr';
import FileNameFormatter from './FileNameFormatter.js';
import resourseLoad from './resourseLoader.js';
import ErrorHandler from './ErrorHandler.js';

const pageLoad = (url, pathToDir = cwd()) => {
  const formattedUrl = new FileNameFormatter(url);
  const pathToFiles = path.join(pathToDir, formattedUrl.dataDir());
  const task = new Listr([
    {
      title: url,
      task: () => {
        const promise = fs.mkdir(pathToFiles)
          .then(() => axios.get(url))
          .then((response) => resourseLoad(response.data, pathToFiles, new URL(url)))
          .then((result) => fs.writeFile(path.join(pathToDir, formattedUrl.html()), result.html()))
          .catch((err) => {
            process.exit(console.error(new ErrorHandler(err).message()));
          });
        return promise;
      },
    },
  ]);
  return task.run();
};

export default pageLoad;
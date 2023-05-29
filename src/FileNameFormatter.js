import _ from 'lodash';
import path from 'path';

class FileNameFormatter {
  constructor(url) {
    this.url = url;
  }

  getUrl() {
    return new URL(this.url);
  }

  kebabCaseUrl() {
    return _.kebabCase(this.url.split(`${this.getUrl().protocol}//`));
  }

  html() {
    return `${this.kebabCaseUrl()}.html`;
  }

  dataDir() {
    return `${this.kebabCaseUrl()}_files`;
  }

  resourse() {
    const fullPath = new FileNameFormatter(path.parse(this.url).dir);
    let file = path.parse(this.url).base;
    if (path.parse(this.url).ext === '') {
      file += '.html';
    }
    return `${fullPath.kebabCaseUrl()}-${file}`;
  }
}

export default FileNameFormatter;

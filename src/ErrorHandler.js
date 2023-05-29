class ErrorHandler {
  constructor(err) {
    this.err = err;
  }

  message() {
    if (this.err.config === undefined) {
      throw new Error('Access Error! Please, check your output directory and rights to this directory!');
    }
    throw new Error(`Error ${this.err.response.status} ${this.err.response.statusText} with ${this.err.config.url}`);
  }
}

export default ErrorHandler;

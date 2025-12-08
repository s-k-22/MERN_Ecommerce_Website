export default (errorFn) => (req, res, next) => {
  Promise.resolve(errorFn(req, res, next)).catch(next);
};

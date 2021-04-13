
module.exports = function(context, name) {
  if (context.stats && context.stats.compilation && context.stats.compilation.errors) {
    return context.stats.compilation.errors.filter(error => {
      return error.name === name;
    }).length > 0;
  } else {
    return false;
  }
}

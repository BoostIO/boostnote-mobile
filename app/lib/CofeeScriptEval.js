const CoffeeScript = require('coffeescript/lib/coffeescript/coffeescript')
const compile = CoffeeScript.compile

CoffeeScript.eval = function(code, options = {}) {
    if (options.bare == null) {
        options.bare = true
    }
    return eval(compile(code, options))
}

module.exports = CoffeeScript

Array.prototype.lisc = (function() {
function map(ary, f) {
    for(var i = 0,res = []; i < ary.length; i++) {
        res.push(f(ary[i]));
    }
    return res;
}
  
function flatten(ary) {
    for(var i = 0,res = []; i < ary.length; i++) {
        res = res.concat(ary[i]);
    }
    return res;
}

var product = function() {
    if(arguments.length == 1) return arguments[0];
    var rprod = product.apply(null, Array.prototype.slice.call(arguments,1));
    return flatten(map(arguments[0], function(m){
        return rprod.map(function(n){ return [m].concat(n) });
    }));
};

   
function filter(ary, f) {
    var res = [];
    for(var i = 0; i < ary.length; i++) {
        var exp = f(ary[i]);
        if(exp) res.push(ary[i]);
    }
    return res;
}

function all(ary, f) {
    for(var i = 0; i < ary.length; i++) {
        if (!f(ary[i])) return false;
    }
    return true;
}

function argumentNames(f) {
    var names = f.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",")
    return names.length == 1 && !names[0] ? [] : names;
}

function marge(dest, src) {
    for(var p in src) dest[p] = src[p];
}

function makeEvaluater(e) {
    if (typeof e == "string") {
        return function(obj) {
            with(obj) return eval(e);
        }
    } else if (typeof e == "function") {
        var params = argumentNames(e);
        return function(obj) {
            var args = map(params, function(name) { return obj[name] });
            return e.apply(obj, args);
        };
    } else {
        return function(){};
    }
}

function parse(ary) {
    var bindings = {};
    var filters = map(ary, function(e){
        if (typeof e == "string") {
            var str = e.replace(/\s/g, "");
            var genestr = str.match(/[^,]+<-(?:\[.*?\]|[^,]*)/g);
            if (genestr) {
                var genestr = map(genestr,function(s){ return s.replace(/<-/,":") });
                marge(bindings, eval("({" + genestr.join(",") + "})"));
            }
           
            var filstr = str.replace(/[^,]+<-(?:\[.*?\]|[^,]*),?/g, "");
            if (filstr.length > 0) {
                return function(obj) {
					var ary = makeEvaluater("[" + filstr + "]")(obj);
                    return all(ary, function(b){ return b });
                };
            }
        } else if(typeof e == "function") {
            return makeEvaluater(e);
        } else if(typeof e == "object") {
			marge(bindings, e);
		}
    });
	filters = filter(filters, function(f) { if(f) return f; });
    return {bindings: bindings, filters: filters};
}


function toBindList(bindings) {
    var lists = [], keys = [];
    for(var key in bindings) {
        keys.push(key);
        lists.push(bindings[key]);
    }
    var prod = product.apply(null, lists);

    return map(prod, function(l) {
        var res = {};
        if (!(l instanceof Array)) l = [l];
        for(var i = 0; i < l.length; i++) res[keys[i]] = l[i];
        return res;
    });
}

return function() {
    var e = this[0];
    var gens = this.slice(1);
    if (typeof e == "string") {
        var res = /^(.*)\s*\|\s*(.*)$|.*/.exec(e);
        e = res[1] || res[0];
        if (res[2]) gens = [res[2]].concat(gens);
    }
    e = makeEvaluater(e);
    var obj = parse(gens);
    var targets = toBindList(obj.bindings);
    targets = filter(targets, function(binding) {
        return all(obj.filters, function(f){ return f(binding) });
    });
    return map(targets, e);
}
})();

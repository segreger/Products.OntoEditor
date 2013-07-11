  jq.KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DEL: 8,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    SPACE: 32,
    HOME: 36,
    END: 35,
    ENTER: 13,
    DELETE: 46,
    BACKSPACE: 8
  };
  // jQuery.map from v.1.6
  jq.map = function( elems, callback, arg ) {
    var value, key, ret = [],
        i = 0,
        length = elems.length,
        // jquery objects are treated as arrays
        isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

    // Go through the array, translating each of the items to their
    if ( isArray ) {
        for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
                ret[ ret.length ] = value;
            }
        }

    // Go through every key on the object,
    } else {
        for ( key in elems ) {
            value = callback( elems[ key ], key, arg );

            if ( value != null ) {
                ret[ ret.length ] = value;
            }
        }
    }

    // Flatten any nested arrays
    return ret.concat.apply( [], ret );
  };

  jq.one = function(arr) {
    return jq.isArray(arr) ? (arr[0] || null) : arr;
  };
  jq.val = function(arr) {
    return jq.isArray(arr) && arr.length > 1 ? arr : (arr[0] || arr || null);
  };
  jq.arr = function(obj) {
    return jq.isArray(obj) ? obj.concat([]) : [obj];
  };
  jq.toArray = function(obj, withKeysOrField, withKeys) {
    if (!obj) return [];
    var field = jq.type(withKeysOrField) === 'boolean' ? null : withKeysOrField;
    if (field === null) withKeys = withKeysOrField;
    return jq.map(obj, function(v, k) {
      var val = field ? (jq.dv(v[field], v) || null) : v;
      return withKeys ? {k: k, v: val} : val;
    });
  };
  jq.toObject = function(arr, keyField) {
    if (!arr) return {};
    if (jq.isPlainObject(arr) && !keyField) return arr;
    var obj = {};
    jq.each(arr, function(k, v) {
      var key = keyField ? (v[keyField] || null) : (keyField === null ? v.toString() : k);
      if (key) obj[key] = v;
    });
    if (!keyField && keyField !== null && arr.length) obj.length = arr.length;
    return obj;
  };
  jq.uniqueArray = function(arr, field) {
    return jq.toArray(jq.toObject(arr, field));
  };
  jq.renameKey = function(obj, oldKey, newKey, rewriteKey) {
    if (!jq.isPlainObject(obj)) return false;
    if (typeof obj[oldKey] === 'undefined') return false;
    if (typeof obj[newKey] !== 'undefined' && !rewriteKey) return false;
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
    return true;
  };
  jq.diffArrays = function(first, second, field) {
    var firstDic = {}, secondDir = {},
        addArr = [], remArr = [], i;
    for (i=0, l=first.length; i<l; i++) {
      var obj = first[i], id = field ? (obj[field] || obj) : obj;
      firstDic[id] = obj;
    }
    for (i=0, l=second.length; i<l; i++) {
      var obj = second[i], id = field ? (obj[field] || obj) : obj;
      secondDir[id] = obj;
      if (firstDic[id] !== secondDir[id]) addArr.push(obj);
    }
    for (i=0, l=first.length; i<l; i++) {
      var obj = first[i], id = field ? (obj[field] || obj) : obj;
      if (secondDir[id] !== firstDic[id]) remArr.push(obj);
    }
    return {add: addArr, rem: remArr};
  }
  jq.mergeObjects = function(first, second, field) {
    jq.each(second, function(key, second_val) {
      var first_val = first[key];
      if (typeof first_val === 'undefined') {
        first[key] = second_val;
      } else {
        first[key] = jq.arr(first_val);
        second_val = jq.arr(second_val);
        var diff = jq.diffArrays(first[key], second_val, field);
        Array.prototype.push.apply(first[key], diff.add);
      }
    });
    return first;
  }
  jq.sortOn = function(arr, fields, options) {
    if (!jq.isArray(arr)) return arr;
    var _fields = [],
        _sort = function(a, b) {
          for (var i=0; i<_fields.length; i+=2) {
            if (a[_fields[i]] < b[_fields[i]]) return _fields[i+1] ? 1 : -1;
            if (a[_fields[i]] > b[_fields[i]]) return _fields[i+1] ? -1 : 1;
          }
          return 0;
        };
    if (jq.isArray(fields)) {
      var _options = jq.isArray(options) ? options : false;
      for (var i=0; i<fields.length; i++) {
        _fields.push(fields[i], _options && !!_options[i]);
      }
    } else {
      _fields.push(fields, !!options);
    }
    if (arr[0] && jq.type(arr[0]) == 'object') return arr.sort(_sort);
    return arr;
  };
  jq.escapeRE = function(s) { return s ? s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1') : ''; };
  jq.dv = function(funcOrValue, obj) {
    return jq.isFunction(funcOrValue) ? funcOrValue.apply(obj || window) : funcOrValue;
  };
  
  jq.cssHooks.borderColor = {
    get: function( elem, computed, extra ) {
      return jq.css(elem, 'borderTopColor');
    },
    set: function( elem, value ) {
      elem.style['borderTopColor'] = value;
      elem.style['borderBottomColor'] = value;
      elem.style['borderLeftColor'] = value;
      elem.style['borderRightColor'] = value;
    }
  };
  
  jq.fn.open = function() {
    this.parents('li.tMinus, li.tPlus').removeClass('tPlus').addClass('tMinus');
    return this;
  };
  jq.fn.className = function(cn) {
    if (typeof cn === 'undefined') {
      return this[0] && this[0].className || '';
    }
    return this.each(function() {
      this.className = cn;
    });
  };
  jq.fn.owlSelect = function() {
    jq('li.tNode').removeClass('selected');
    // .open().parent().parent() - open selected class
    // .parent().parent().open() - don't open selected class
    this.open().parent().parent().filter('li.tNode').addClass('selected');
    return this;
  };
  
  jq.fn.blink = function(focusOrSpeed, focus) {
    var _fos_bool = jq.type(focusOrSpeed) === 'boolean',
        _speed = _fos_bool ? 200 : (focusOrSpeed || 200),
        _focus = _fos_bool ? focusOrSpeed : (focus || false),
        css_from = {backgroundColor: '#ffeeee', borderColor: '#ff0000'},
        css_to = {backgroundColor: '#ffffff', borderColor: '#cccccc'};
    return this.css(css_from).animate(css_to, _speed)[_focus ? 'focus' : 'noop']();
  }
  jq.fn.nth = function(index) {
    return this.slice(index, index+1);
  };
  jq.fn.noop = function() {
    return this;
  };
  jq.fn.isVisible = function() {
    return this.css('display') != 'none' && this.css('visibility') != 'hidden';
  };



Function.prototype.bind = function()
{
  if (arguments.length < 1 && typeof arguments[0] != 'undefined') return this;
  var __method = this, args = Array.prototype.slice.apply(arguments);
  var object = args.shift();
  return function() {
    var args_to_apply = []
    for(var i=0;i<args.length;i++){ args_to_apply.push(args[i]); }
    for(var i=0;i<arguments.length;i++){ args_to_apply.push(arguments[i]); }
    return __method.apply(object, args_to_apply);
  }
};
function setTitle(title) {
  var title_tpl = 'ontoEditor | %s';
  document.title = title_tpl.replace('%s', title);
}




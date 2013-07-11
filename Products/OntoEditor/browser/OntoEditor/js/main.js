jq.noConflict();
jq(document).ready(function(){
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
  var ontoEditor = new OntologyEditor(data1);
});


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


function Ontology(name, description) {
  this.name = name || '';
  this.description = description || '';
  this._classes = {};
  this._obj_props = {};
  this._data_props = {};
  this._individuals = {};
  
  this.addClass('Thing');
}
Ontology.safeName = function(name) {
  return name.replace(/ /g, '_') || '';
}
Ontology.realName = function(name) {
  return name.replace(/_/g, ' ') || '';
}
Ontology.getType = function(obj) {
  if (obj instanceof OntoClass) return obj.builtIn ? 'Type' : 'Class';
  if (obj instanceof OntoIndividual) return obj.builtIn ? 'Value' : 'Ind';
  if (obj instanceof ObjectProperty) return 'OProp';
  if (obj instanceof DataProperty) return 'DProp';
  return '';
}
Ontology.prototype.addClass = function(cd) {
  var _name = cd.name || cd;
  if (this._classes[_name]) return null;
  return this._classes[_name] = new OntoClass(_name, this);
}
Ontology.prototype.addObjectProperty = function(opd) {
  var _name = opd.name || opd;
  if (this._obj_props[_name]) return null;
  return this._obj_props[_name] = new ObjectProperty(_name, this);
}
Ontology.prototype.addDataProperty = function(dpd) {
  var _name = dpd.name || dpd;
  if (this._data_props[_name]) return null;
  return this._data_props[_name] = new DataProperty(_name, this);
}
Ontology.prototype.addIndividual = function(id) {
  var _name = id.name || id;
  if (this._individuals[_name]) return null;
  return this._individuals[_name] = new OntoIndividual(id.name || id, this);
}
Ontology.prototype.renameClass = function(obj, newName) {
  obj = this.getClass(obj);
  return obj && jq.renameKey(this._classes, obj.name, newName) || false;
}
Ontology.prototype.renameObjectProperty = function(obj, newName) {
  obj = this.getObjectProperty(obj);
  if (!obj || !jq.renameKey(this._obj_props, obj.name, newName)) return false;
  var domain = obj.getDomain();
  if (domain) {
    domain.renameObjectProperty(obj.name, newName);
  } else {
    jq.each(this.getClasses(), function(i, domain) {
      domain.renameObjectProperty(obj.name, newName);
    });
  }
  return true;
}
Ontology.prototype.renameDataProperty = function(obj, newName) {
  obj = this.getDataProperty(obj);
  if (!obj || !jq.renameKey(this._data_props, obj.name, newName)) return false;
  var domain = obj.getDomain();
  domain && domain.renameDataProperty(obj.name, newName);
  return true;
}
Ontology.prototype.renameIndividual = function(obj, newName) {
  obj = this.getIndividual(obj);
  return obj && jq.renameKey(this._individuals, obj.name, newName) || false;
}
Ontology.prototype.removeClass = function(obj, deleteProps) {
  var _class = this.getClass(obj), that = this;
  if (!_class || _class.name == 'Thing') return null;
  // change subClasses
  var _subClassOf = _class.getSubClassOf();
  jq.each(_class.getSubClasses().concat([]), function(i, _subClass) {
    _subClass.removeSubClassOf(_class);
    jq.each(_subClassOf, function() {
      _subClass.addSubClassOf(this);
    });
  });
  // change propsDomain
  var _domain = _class.getOneParentClass(),
      _props = [], oProps = {}, dProps = {};
  jq.each(_class.getObjectRestrictions(), function(prop, range) {
    var _prop = that.getObjectProperty(prop),
        _domen = _prop && _prop.getDomain() || null;
    if (!_prop) return true;
    if (_domen === _class) {
      _props.push(_prop);
      oProps[_prop.name] = _prop.getRange();
    }
  });
  jq.each(_class.getDataRestrictions(), function(prop, range) {
    var _prop = that.getDataProperty(prop),
        _domen = _prop && _prop.getDomain() || null;
    if (!_prop) return true;
    if (_domen === _class) {
      _props.push(_prop);
      dProps[_prop.name] = _prop.getRange();
    }
  });
  jq.each(_props, function() {
    this.edit({domain: _domain});
  });
  _domain.edit({oProps: oProps, dProps: dProps});
  // change propsRange
  var _range = _domain;
  jq.each(this.getObjectPropertiesByRange(_class), function(i, _prop) {
    _prop.edit({range: _range});
    var domain = _prop.getDomain(), o = {};
    o[_prop.name] = _range;
    domain && domain.edit({oProps: o});
  });
  // change restrictions
  var _classes = jq.uniqueArray(jq.map(this.getClassesWithRange(_class), function(_class) {
    return _class.getAllSubClasses(true);
  }), 'name');
  jq.each(_classes, function(i, domain) {
    var oProps = {};
    jq.each(domain.getObjectRestrictions(), function(prop, range) {
      var _prop = that.getProperty(prop),
          _op_domain = _prop.getDomain();
      if (_op_domain === domain) return true;
      var _range = jq.arr(range).concat([]),
          i = jq.inArray(_class, _range);
      if (i >= 0) {
        _range.splice(i, 1);
        oProps[prop] = _range.length ? _range : null;
      }
    });
    domain.edit({oProps: oProps});
  });
  // change individuals
  jq.each(_class.getIndividuals().concat([]), function(i, _individual) {
    _individual.removeSourceClass(_class);
    jq.each(_subClassOf, function() {
      _individual.addSourceClass(this);
    });
  });
  // delete subClassOf
  jq.each(_subClassOf, function(i, _sco) {
    _sco.removeSubClass(_class);
  });
  // delete class from ontology
  delete this._classes[_class.name];
}
Ontology.prototype.removeObjectProperty = function(obj) {
  var _prop = this.getObjectProperty(obj), that = this;
  if (!_prop) return null;
  // change subProperties
  var _subPropertyOf = _prop.getSubPropertyOf();
  jq.each(_prop.getSubProperties().concat([]), function(i, _subProperty) {
    _subProperty.removeSubPropertyOf(_prop);
    jq.each(_subPropertyOf, function() {
      _subProperty.addSubPropertyOf(this);
    });
  });
  // delete restrictions
  var _domain = _prop.getDomain();
  jq.each(_domain.getAllSubClasses(true), function() {
    var o = {}; o[_prop.name] = null;
    this.edit({oProps: o});
  });
  // delete properties
  jq.each(_domain.getChildren(false, true), function() {
    var o = {}; o[_prop.name] = null;
    this.edit({oProps: o});
  });
  // delete subPropertyOf
  jq.each(_subPropertyOf, function(i, _spo) {
    _spo.removeSubProperty(_prop);
  });
  // delete object property from ontology
  delete this._obj_props[_prop.name];
}
Ontology.prototype.removeDataProperty = function(obj) {
  var _prop = this.getDataProperty(obj), that = this;
  if (!_prop) return null;
  // delete restrictions
  var _domain = _prop.getDomain();
  jq.each(_domain.getAllSubClasses(true), function() {
    var o = {}; o[_prop.name] = null;
    this.edit({dProps: o});
  });
  // delete properties
  jq.each(_domain.getChildren(false, true), function() {
    var o = {}; o[_prop.name] = null;
    this.edit({dProps: o});
  });
  // delete data property from ontology
  delete this._data_props[_prop.name];
}
Ontology.prototype.removeIndividual = function(obj) {
  var _ind = this.getIndividual(obj), that = this;
  if (!_ind) return null;
  // change restrictions
  var _classes = jq.uniqueArray(jq.map(this.getClassesWithRange(_ind), function(_class) {
    return _class.getAllSubClasses(true);
  }), 'name');
  jq.each(_classes, function(i, domain) {
    var oProps = {};
    jq.each(domain.getObjectRestrictions(), function(prop, range) {
      var _prop = that.getProperty(prop),
          _op_domain = _prop.getDomain();
      if (_op_domain === domain) return true;
      var _range = jq.arr(range).concat([]),
          i = jq.inArray(_ind, _range);
      if (i >= 0) {
        _range.splice(i, 1);
        oProps[prop] = _range.length ? _range : null;
      }
    });
    domain.edit({oProps: oProps});
  });
  // delete individuals from sourceClass
  jq.each(_ind.getSourceClass(), function() {
    this.removeIndividual(_ind);
  });
  // delete individual from ontology
  delete this._individuals[_ind.name];
}
Ontology.prototype.getClass = function(obj) {
  if (jq.isArray(obj)) return jq.map(obj, this.getClass.bind(this));
  var name = (obj instanceof OntoClass) ? obj.name : obj;
  return this._classes[name] || null;
}
Ontology.prototype.getObjectProperty = function(obj) {
  if (jq.isArray(obj)) return jq.map(obj, this.getObjectProperty.bind(this));
  var name = (obj instanceof ObjectProperty) ? obj.name : obj;
  return this._obj_props[name] || null;
}
Ontology.prototype.getDataProperty = function(obj) {
  if (jq.isArray(obj)) return jq.map(obj, this.getDataProperty.bind(this));
  var name = (obj instanceof DataProperty) ? obj.name : obj;
  return this._data_props[name] || null;
}
Ontology.prototype.getIndividual = function(obj) {
  if (jq.isArray(obj)) return jq.map(obj, this.getIndividual.bind(this));
  var name = (obj instanceof OntoIndividual) ? obj.name : obj;
  return this._individuals[name] || null;
}
Ontology.prototype.getObject = function(obj) {
  if (jq.isArray(obj)) return jq.map(obj, this.getObject.bind(this));
  return this.getClass(obj)
      || this.getIndividual(obj)
      || null;
}
Ontology.prototype.getProperty = function(obj) {
  if (jq.isArray(obj)) return jq.map(obj, this.getProperty.bind(this));
  return this.getObjectProperty(obj)
      || this.getDataProperty(obj)
      || null;
}
Ontology.prototype.getClasses = function() {
  return jq.grep(jq.toArray(this._classes), function(c){ return c.builtIn; }, true);
}
Ontology.prototype.getClassesWithRange = function(_range) {
  var _parents = _range.getAllParentClasses(),
      _oprops = this.getObjectPropertiesByRange(_parents);
  return jq.uniqueArray(jq.toArray(_oprops, 'getDomain'), 'name');
}
Ontology.prototype.getBuiltInClasses = function() {
  return jq.grep(jq.toArray(this._classes), function(c){ return c.builtIn; });
}
Ontology.prototype.getObjectProperties = function() {
  return jq.toArray(this._obj_props);
}
Ontology.prototype.getObjectPropertiesByRange = function(_range) {
  var _opbyrange = [], _oprops = this.getObjectProperties(),
      ranges = jq.toObject(jq.arr(_range), 'name');
  for (var i=0, l=_oprops.length; i<l; i++) {
    var range = _oprops[i].getRange();
    if (ranges[range.name] && ranges[range.name] === range) _opbyrange.push(_oprops[i]);
  }
  return _opbyrange;
}
Ontology.prototype.getDataProperties = function() {
  return jq.toArray(this._data_props);
}
Ontology.prototype.getIndividuals = function() {
  return jq.grep(jq.toArray(this._individuals), function(i){ return i.builtIn; }, true);
}
Ontology.prototype.getBuiltInIndividuals = function() {
  return jq.grep(jq.toArray(this._individuals), function(i){ return i.builtIn; });
}

function OntoClass(name, onto, builtIn) {
  this._ontology = onto || null;
  this.name = name || '';
  this.description = '';
  this.address = '';
  this.builtIn = builtIn || false;
  this.subClassOf = [];
  
  this._oprops = {};
  this._dprops = {};
  
  this.__name = Ontology.safeName(this.name) || '';
  this.__individuals = [];
  this.__subClasses = [];
}
OntoClass.prototype.getSubClassOf = function() {
  return this.subClassOf;
}
OntoClass.prototype.getOneParentClass = function() {
  var _subClassOf = this.getSubClassOf();
  if (!_subClassOf.length) return null;
  if (_subClassOf.length == 1) return _subClassOf[0];
  var _branch = _subClassOf[0].getAllParentClasses(),
      _branches = [],
      _f = function(k) {
        for (var i=0, l=_branches.length; i<l; i++) {
          if (!_branches[i][k]) return false;
        }
        return true;
      };
  for (var i=1, l=_subClassOf.length; i<l; i++) {
    _branches.push(jq.toObject(_subClassOf[i].getAllParentClasses(), 'name'));
  }
  for (var i=_branch.length; i; ) {
    if (_f(_branch[--i].name)) return _branch[i];
  }
}
OntoClass.prototype.getParentObjectProperties = function() {
  var _ops = {}, _subClassOf = this.getSubClassOf();
  if (_subClassOf.length > 0) {
    var _parent_ops = {};
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      jq.mergeObjects(_parent_ops, _subClassOf[i].getObjectProperties(), 'name');
    }
    jq.each(_parent_ops, function(p, r) {
      if (!jq.isArray(r)) return true;
      var rr = [];
      jq.each(r, function(i, range) {
        if (range instanceof OntoIndividual) {
          rr.push(range);
          return true;
        }
        var _children = jq.toObject(range.getChildren(), 'name'), _has = false;
        jq.each(r, function() {
          if (_children[this.name]) {
            _has = true; return false;
          }
        });
        if (!_has) rr.push(range);
      });
      _parent_ops[p] = rr;
    });
    jq.extend(_ops, _parent_ops);
  }
  return _ops;
}
OntoClass.prototype.getObjectRestrictions = function() {
  return jq.extend({}, this._oprops);
}
OntoClass.prototype.getObjectProperties = function() {
  return jq.extend(this.getParentObjectProperties(), this.getObjectRestrictions());
}
OntoClass.prototype.getParentObjectRestriction = function(prop) {
  var _subClassOf = this.getSubClassOf();
  if (_subClassOf.length > 0) {
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      if (typeof _subClassOf[i].getObjectRestrictions()[prop] !== 'undefined') {
        return _subClassOf[i];
      }
    }
    for (var i=0, l=_subClassOf.length, r; i<l; i++) {
      if (r = _subClassOf[i].getParentObjectRestriction(prop)) {
        return r;
      }
    }
  }
  return null;
}
OntoClass.prototype.getObjectPropertyInfo = function(prop) {
  var _parent = this.getParentObjectProperties(),
      _self = this.getObjectRestrictions(),
      _parent_prop = {}, _self_prop = {},
      _parent_def = {}, _self_def = {},
      that = this;
  jq.each(_parent, function(prop, range) {
    _parent_prop[prop] = range;
    if (_self[prop]) {
      _parent_def[prop] = _self[prop];
      delete _self[prop];
    }
  });
  jq.each(_self, function(prop, range) {
    var _prop = that._ontology.getObjectProperty(prop),
        _domen = _prop && _prop.getDomain() || null,
        _range = _prop && _prop.getRange() || null;
    if (!_prop) return true;
    if (_domen) {
      _parent_prop[prop] = _range;
      if (_range !== jq.val(range)) _parent_def[prop] = range;
    } else {
      _self_prop[prop] = _range;
      _self_def[prop] = range;
    }
  });
  return {
    parent: {
      prop: _parent_prop,
      def: _parent_def
    },
    self: {
      prop: _self_prop,
      def: _self_def
    }
  };
}
OntoClass.prototype.getChildren = function(addSelf, indOnly) {
  var _children = addSelf && !indOnly ? [this] : [],
      _subClasses = this.getAllSubClasses();
  if (!indOnly) jq.merge(_children, _subClasses);
  jq.merge(_children, this.getIndividuals());
  for (var i=0, l=_subClasses.length; i<l; i++) {
    jq.merge(_children, _subClasses[i].getIndividuals());
  }
  return _children;
}
OntoClass.prototype.getParentDataProperties = function() {
  var _dps = {}, _subClassOf = this.getSubClassOf();
  if (_subClassOf.length > 0) {
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      jq.extend(_dps, _subClassOf[i].getDataProperties());
    }
  }
  return _dps;
}
OntoClass.prototype.getDataRestrictions = function() {
  return jq.extend({}, this._dprops);
}
OntoClass.prototype.getDataProperties = function() {
  return jq.extend(this.getParentDataProperties(), this.getDataRestrictions());
}
OntoClass.prototype.getParentDataRestriction = function(prop) {
  var _subClassOf = this.getSubClassOf();
  if (_subClassOf.length > 0) {
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      if (typeof _subClassOf[i].getDataRestrictions()[prop] !== 'undefined') {
        return _subClassOf[i];
      }
    }
    for (var i=0, l=_subClassOf.length, r; i<l; i++) {
      if (r = _subClassOf[i].getParentDataRestriction(prop)) {
        return r;
      }
    }
  }
  return null;
}
OntoClass.prototype.getDataPropertyInfo = function(prop) {
  var _parent = this.getParentDataProperties(),
      _self = this.getDataRestrictions(),
      _parent_prop = {}, _self_prop = {},
      _parent_def = {}, _self_def = {},
      that = this;
  jq.each(_parent, function(prop, range) {
    _parent_prop[prop] = range;
    if (_self[prop]) {
      _parent_def[prop] = _self[prop];
      delete _self[prop];
    }
  });
  jq.each(_self, function(prop, range) {
    var _prop = that._ontology.getDataProperty(prop),
        _domen = _prop && _prop.getDomain() || null,
        _range = _prop && _prop.getRange() || null;
    if (!_prop) return true;
    if (_domen) {
      _parent_prop[prop] = _range;
      if (_range === range) _parent_def[prop] = range;
    } else {
      _self_prop[prop] = _range;
      _self_def[prop] = range;
    }
  });
  return {
    parent: {
      prop: _parent_prop,
      def: _parent_def
    },
    self: {
      prop: _self_prop,
      def: _self_def
    }
  };
}
OntoClass.prototype.getIndividuals = function() {
  return this.__individuals;
}
OntoClass.prototype.getSubClasses = function() {
  return this.__subClasses;
}
OntoClass.prototype.getAllParentClasses = function(addSelf) {
  var _pcs = [], _subClassOf = this.getSubClassOf();
  if (_subClassOf.length > 0) {
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      jq.merge(_pcs, _subClassOf[i].getAllParentClasses());
    }
  }
  return jq.uniqueArray(_pcs.concat(_subClassOf, addSelf ? [this] : []), 'name');
}
OntoClass.prototype.getAllSubClasses = function(addSelf) {
  var _subClasses = this.getSubClasses(),
      _scs = [].concat(addSelf ? [this] : [], _subClasses);
  if (_subClasses.length > 0) {
    for (var i=0, l=_subClasses.length; i<l; i++) {
      jq.merge(_scs, _subClasses[i].getAllSubClasses());
    }
  }
  return jq.uniqueArray(_scs, 'name');
}
OntoClass.prototype.renameObjectProperty = function(oldName, newName) {
  jq.renameKey(this._oprops, oldName, newName);
  var _subClasses = this.__subClasses,
      _individuals = this.__individuals;
  if (_subClasses.length > 0) {
    for (var i=0, l=_subClasses.length; i<l; i++) {
      _subClasses[i].renameObjectProperty(oldName, newName);
    }
  }
  if (_individuals.length > 0) {
    for (var i=0, l=_individuals.length; i<l; i++) {
      _individuals[i].renameObjectProperty(oldName, newName);
    }
  }
}
OntoClass.prototype.renameDataProperty = function(oldName, newName) {
  jq.renameKey(this._dprops, oldName, newName);
  var _subClasses = this.__subClasses,
      _individuals = this.__individuals;
  if (_subClasses.length > 0) {
    for (var i=0, l=_subClasses.length; i<l; i++) {
      _subClasses[i].renameDataProperty(oldName, newName);
    }
  }
  if (_individuals.length > 0) {
    for (var i=0, l=_individuals.length; i<l; i++) {
      _individuals[i].renameDataProperty(oldName, newName);
    }
  }
}
OntoClass.prototype.addSubClassOf = function(_class) {
  var i = jq.inArray(_class, this.getAllParentClasses());
  if (i >= 0) return false;
  this.subClassOf.push(_class);
  _class.addSubClass(this);
  return true;
}
OntoClass.prototype.removeSubClassOf = function(_class) {
  var i = jq.inArray(_class, this.getSubClassOf());
  if (i == -1) return false;
  this.subClassOf.splice(i, 1);
  _class.removeSubClass(this);
  return true;
}
OntoClass.prototype.addSubClass = function(_class) {
  var i = jq.inArray(_class, this.getSubClasses());
  if (i >= 0) return false;
  this.__subClasses.push(_class);
}
OntoClass.prototype.removeSubClass = function(_class) {
  var i = jq.inArray(_class, this.getSubClasses());
  if (i == -1) return false;
  this.__subClasses.splice(i, 1);
}
OntoClass.prototype.addIndividual = function(_ind) {
  var i = jq.inArray(_ind, this.getIndividuals());
  if (i >= 0) return false;
  this.__individuals.push(_ind);
}
OntoClass.prototype.removeIndividual = function(_ind) {
  var i = jq.inArray(_ind, this.getIndividuals());
  if (i == -1) return false;
  this.__individuals.splice(i, 1);
}
OntoClass.prototype.edit = function(data) {
  var that = this;
  if (typeof data.name !== 'undefined' && this.name != data.name) {
    if (this._ontology.renameClass(this, data.name)) {
      this.name = data.name;
      this.__name = Ontology.safeName(this.name) || '';
    }
  }
  if (typeof data.description !== 'undefined') {
    this.description = data.description;
  }
  if (typeof data.address !== 'undefined') {
    this.address = data.address;
  }
  if (typeof data.builtIn !== 'undefined') {
    this.builtIn = data.builtIn;
  }
  if (typeof data.subClassOf !== 'undefined') {
    var _subClassOf = this._ontology.getClass(jq.arr(data.subClassOf)),
        diff = jq.diffArrays(this.subClassOf, _subClassOf, 'name');
    for (var i=0, l=diff.rem.length; i<l; i++) {
      diff.rem[i].removeSubClass(this);
    };
    for (var i=0, l=diff.add.length; i<l; i++) {
      diff.add[i].addSubClass(this);
    };
    this.subClassOf = _subClassOf;
  }
  if (typeof data.oProps !== 'undefined') {
    for (var prop in data.oProps) {
      if (data.oProps[prop]) {
        this._oprops[prop] = this._ontology.getObject(jq.arr(data.oProps[prop]));
      } else {
        if (this._oprops[prop]) delete this._oprops[prop];
      }
    }
  }
  if (typeof data.dProps !== 'undefined') {
    for (var prop in data.dProps) {
      if (data.dProps[prop]) {
        this._dprops[prop] = this._ontology.getObject(jq.arr(data.dProps[prop]));
      } else {
        if (this._dprops[prop]) delete this._dprops[prop];
      }
    }
  }
}

function OntoIndividual(name, onto, builtIn) {
  this._ontology = onto || null;
  this.name = name || '';
  this.description = '';
  this.builtIn = builtIn || false;
  this.sourceClass = [];
  
  this._oprops = {};
  this._dprops = {};
  
  this.__name = Ontology.safeName(this.name) || '';
}
OntoIndividual.prototype.getSourceClass = function() {
  return this.sourceClass;
}
OntoIndividual.prototype.getSourceObjectProperties = function(withValuesOnly) {
  var _source_ops = {}, _ops = {}, _sourceClass = this.getSourceClass();
  if (_sourceClass.length > 0) {
    for (var i=0, l=_sourceClass.length; i<l; i++) {
      jq.extend(_source_ops, _sourceClass[i].getObjectProperties());
    }
  }
  if (withValuesOnly) {
    for (var k in _source_ops) {
      var val = jq.val(_source_ops[k]);
      if (val instanceof OntoIndividual) {
        _ops[k] = val;
      }
    }
  }
  return withValuesOnly ? _ops : _source_ops;
}
OntoIndividual.prototype.getObjectValues = function() {
  return jq.extend({}, this._oprops);
}
OntoIndividual.prototype.getObjectProperties = function(withValuesOnly) {
  return jq.extend(this.getSourceObjectProperties(withValuesOnly), this.getObjectValues());
}
OntoIndividual.prototype.getSourceObjectRestriction = function(prop) {
  var _sourceClass = this.getSourceClass();
  if (_sourceClass.length > 0) {
    for (var i=0, l=_sourceClass.length; i<l; i++) {
      if (typeof _sourceClass[i].getObjectRestrictions()[prop] !== 'undefined') {
        return _sourceClass[i];
      }
    }
    for (var i=0, l=_sourceClass.length, r; i<l; i++) {
      if (r = _sourceClass[i].getParentObjectRestriction(prop)) {
        return r;
      }
    }
  }
  return null;
}
OntoIndividual.prototype.getSourceDataProperties = function(withValuesOnly) {
  var _source_dps = {}, _dps = {}, _sourceClass = this.getSourceClass();
  if (_sourceClass.length > 0) {
    for (var i=0, l=_sourceClass.length; i<l; i++) {
      jq.extend(_source_dps, _sourceClass[i].getDataProperties());
    }
  }
  if (withValuesOnly) {
    for (var k in _source_dps) {
      var val = jq.val(_source_dps[k]);
      if (val instanceof OntoIndividual) {
        _dps[k] = val;
      }
    }
  }
  return withValuesOnly ? _dps : _source_dps;
}
OntoIndividual.prototype.getDataValues = function() {
  return jq.extend({}, this._dprops);
}
OntoIndividual.prototype.getDataProperties = function(withValuesOnly) {
  return jq.extend(this.getSourceDataProperties(withValuesOnly), this.getDataValues());
}
OntoIndividual.prototype.getSourceDataRestriction = function(prop) {
  var _sourceClass = this.getSourceClass();
  if (_sourceClass.length > 0) {
    for (var i=0, l=_sourceClass.length; i<l; i++) {
      if (typeof _sourceClass[i].getDataRestrictions()[prop] !== 'undefined') {
        return _sourceClass[i];
      }
    }
    for (var i=0, l=_sourceClass.length, r; i<l; i++) {
      if (r = _sourceClass[i].getParentDataRestriction(prop)) {
        return r;
      }
    }
  }
  return null;
}
OntoIndividual.prototype.getAllParentClasses = function(addSelf) {
  var _pcs = [], _sourceClass = this.getSourceClass();
  if (_sourceClass.length > 0) {
    for (var i=0, l=_sourceClass.length; i<l; i++) {
      jq.merge(_pcs, _sourceClass[i].getAllParentClasses(true));
    }
  }
  return jq.uniqueArray(_pcs.concat(addSelf ? [this] : []), 'name');
}
OntoIndividual.prototype.renameObjectProperty = function(oldName, newName) {
  jq.renameKey(this._oprops, oldName, newName);
}
OntoIndividual.prototype.renameDataProperty = function(oldName, newName) {
  jq.renameKey(this._dprops, oldName, newName);
}
OntoIndividual.prototype.addSourceClass = function(_class) {
  var i = jq.inArray(_class, this.getAllParentClasses());
  if (i >= 0) return false;
  this.sourceClass.push(_class);
  _class.addIndividual(this);
  return true;
}
OntoIndividual.prototype.removeSourceClass = function(_class) {
  var i = jq.inArray(_class, this.getSourceClass());
  if (i == -1) return false;
  this.sourceClass.splice(i, 1);
  _class.removeIndividual(this);
  return true;
}
OntoIndividual.prototype.edit = function(data) {
  if (typeof data.name !== 'undefined' && this.name != data.name) {
    if (this._ontology.renameIndividual(this, data.name)) {
      this.name = data.name;
      this.__name = Ontology.safeName(this.name) || '';
    }
  }
  if (typeof data.description !== 'undefined') {
    this.description = data.description;
  }
  if (typeof data.builtIn !== 'undefined') {
    this.builtIn = data.builtIn;
  }
  if (typeof data.sourceClass !== 'undefined') {
    var _sourceClass = this._ontology.getClass(jq.arr(data.sourceClass)),
        diff = jq.diffArrays(this.sourceClass, _sourceClass, 'name');
    for (var i=0, l=diff.rem.length; i<l; i++) {
      diff.rem[i].removeIndividual(this);
    };
    for (var i=0, l=diff.add.length; i<l; i++) {
      diff.add[i].addIndividual(this);
    };
    this.sourceClass = _sourceClass;
  }
  if (typeof data.oProps !== 'undefined') {
    for (var prop in data.oProps) {
      if (data.oProps[prop]) {
        this._oprops[prop] = this._ontology.getIndividual(data.oProps[prop]);
      } else {
        if (this._oprops[prop]) delete this._oprops[prop];
      }
    }
  }
  if (typeof data.dProps !== 'undefined') {
    for (var prop in data.dProps) {
      if (data.dProps[prop]) {
        this._dprops[prop] = this._ontology.getIndividual(data.dProps[prop]);
      } else {
        if (this._dprops[prop]) delete this._dprops[prop];
      }
    }
  }
}

function ObjectProperty(name, onto) {
  this._ontology = onto || null;
  this.name = name || '';
  this.description = '';
  this.subPropertyOf = [];
  this.domain = null;
  this.range = null;
  
  this.__name = Ontology.safeName(this.name) || '';
  this.__subProperties = [];
}
ObjectProperty.prototype.getSubPropertyOf = function() {
  return this.subPropertyOf;
}
ObjectProperty.prototype.getDomain = function() {
  var _domain = null, _subPropertyOf = this.getSubPropertyOf();
  if (_subPropertyOf.length > 0) {
    for (var i=0, l=_subPropertyOf.length; i<l; i++) {
      _domain = _subPropertyOf[i].getDomain();
    }
  }
  return this.domain || _domain;
}
ObjectProperty.prototype.getRange = function() {
  var _range = null, _subPropertyOf = this.getSubPropertyOf();
  if (_subPropertyOf.length > 0) {
    for (var i=0, l=_subPropertyOf.length; i<l; i++) {
      _range = _subPropertyOf[i].getRange();
    }
  }
  return this.range || _range;
}
ObjectProperty.prototype.getSubProperties = function() {
  return this.__subProperties;
}
ObjectProperty.prototype.getAllParentProperties = function(addSelf) {
  var _pps = [], _subPropertyOf = this.getSubPropertyOf();
  if (_subPropertyOf.length > 0) {
    for (var i=0, l=_subPropertyOf.length; i<l; i++) {
      jq.merge(_pps, _subPropertyOf[i].getAllParentProperties());
    }
  }
  return jq.uniqueArray(_pps.concat(_subPropertyOf, addSelf ? [this] : []), 'name');
}
ObjectProperty.prototype.getAllSubProperties = function(addSelf) {
  var _subProperties = this.getSubProperties(),
      _sps = [].concat(addSelf ? [this] : [], _subProperties);
  if (_subProperties.length > 0) {
    for (var i=0, l=_subProperties.length; i<l; i++) {
      jq.merge(_sps, _subProperties[i].getAllSubProperties());
    }
  }
  return jq.uniqueArray(_sps, 'name');
}
ObjectProperty.prototype.addSubPropertyOf = function(_prop) {
  var i = jq.inArray(_prop, this.getAllParentProperties());
  if (i >= 0) return false;
  this.subPropertyOf.push(_prop);
  _prop.addSubProperty(this);
  return true;
}
ObjectProperty.prototype.removeSubPropertyOf = function(_prop) {
  var i = jq.inArray(_prop, this.getSubPropertyOf());
  if (i == -1) return false;
  this.subPropertyOf.splice(i, 1);
  _prop.removeSubProperty(this);
  return true;
}
ObjectProperty.prototype.addSubProperty = function(_prop) {
  var i = jq.inArray(_prop, this.__subProperties);
  if (i >= 0) return false;
  this.__subProperties.push(_prop);
}
ObjectProperty.prototype.removeSubProperty = function(_prop) {
  var i = jq.inArray(_prop, this.__subProperties);
  if (i == -1) return false;
  this.__subProperties.splice(i, 1);
}
ObjectProperty.prototype.edit = function(data) {
  if (typeof data.name !== 'undefined' && this.name != data.name) {
    if (this._ontology.renameObjectProperty(this, data.name)) {
      this.name = data.name;
      this.__name = Ontology.safeName(this.name) || '';
    }
  }
  if (typeof data.description !== 'undefined') {
    this.description = data.description;
  }
  if (typeof data.subPropOf !== 'undefined') {
    var _subPropertyOf = this._ontology.getObjectProperty(data.subPropOf),
        diff = jq.diffArrays(this.subPropertyOf, _subPropertyOf, 'name');
    for (var i=0, l=diff.rem.length; i<l; i++) {
      diff.rem[i].removeSubProperty(this);
    };
    for (var i=0, l=diff.add.length; i<l; i++) {
      diff.add[i].addSubProperty(this);
    };
    this.subPropertyOf = _subPropertyOf;
  }
  if (typeof data.domain !== 'undefined') {
    this.domain = this._ontology.getClass(data.domain);
  }
  if (typeof data.range !== 'undefined') {
    this.range = this._ontology.getClass(data.range);
  }
}

function DataProperty(name, onto) {
  this._ontology = onto || null;
  this.name = name || '';
  this.description = '';
  this.domain = null;
  this.range = null;
  
  this.__name = Ontology.safeName(this.name) || '';
}
DataProperty.prototype.getDomain = function() {
  return this.domain || null;
}
DataProperty.prototype.getRange = function() {
  return this.range || null;
}
DataProperty.prototype.edit = function(data) {
  if (typeof data.name !== 'undefined' && this.name != data.name) {
    if (this._ontology.renameDataProperty(this, data.name)) {
      this.name = data.name;
      this.__name = Ontology.safeName(this.name) || '';
    }
  }
  if (typeof data.description !== 'undefined') {
    this.description = data.description;
  }
  if (typeof data.domain !== 'undefined') {
    this.domain = this._ontology.getClass(data.domain);
  }
  if (typeof data.range !== 'undefined') {
    this.range = this._ontology.getClass(data.range);
  }
}

function OntoSelector(_id, _options) {
  var id = _id,
      selector = jq('#'+id),
      default_options = {
        width: 300,
        multiselect: false,
        readonly: false,
        editable: false,
        data: null,
        selected: null,
        onPreSelect: jq.noop,
        onSelect: jq.noop
      },
      options = jq.extend({}, default_options, _options),
      _field = options.editable ? null : 'name',
      data = options.data || [], selected = jq.toObject(options.selected, _field) || {}, selectedArr = [], st, ht;
    
  selector.addClass('select');
  if (options.multiselect) {
    selector.addClass('multi');
  }
  if (options.readonly) {
    selector.addClass('readonly');
  }
  selector.html(
    (options.multiselect ? '<ul class="array"></ul>' : '<div class="value"></div>') + 
    '<input type="text" class="field' + (options.editable ? '' : ' search') + '" /><div class="searchResults"></div>'
  );
  var _sc = selector.children(),
      valueCont = _sc.nth(0),
      field = _sc.nth(1),
      sResults = _sc.nth(2), sResultsEl = sResults.get(0),
      sItems = [], sData = [], sFieldShow = false,
      sSelected = 0, sLastSearch = null;
  selector.width(options.width);
  field.width(options.width - (options.editable ? 6 : 23));
  sResults.width(options.width);
  
  var sItemOver = function(i) {
        if (!sResults.isVisible()) return;
        if (!sItems || !sItems.length) return;
        if (i < -1) i = -1;
        if (i >= sItems.length) i = sItems.length-1;
        if (sSelected>=0 && sItems[sSelected]) sItems.nth(sSelected).removeClass('hover');
        sItems.nth(sSelected = i).addClass('hover');
        var stop = sResultsEl.scrollTop,
            sitem = sItems[sSelected<0 ? 0 : sSelected],
            itop = sitem.offsetTop,
            sheight = sResultsEl.offsetHeight-1,
            iheight = sitem.offsetHeight;
        if (itop<stop) sResultsEl.scrollTop = itop;
        if (itop+iheight>stop+sheight) sResultsEl.scrollTop = itop-sheight+iheight;
      },
      sPrevItemOver = function(n) {
        sItemOver(sSelected-(n||1));
      },
      sNextItemOver = function(n) {
        sItemOver(sSelected+(n||1));
      },
      sSelectedObject = function() {
        return sSelected>=0 && sData[sSelected] ? sData[sSelected] : null;
      },
      sSelectedItem = function() {
        return sSelected>=0 ? sItems[sSelected] : null;
      },
      sUpdate = function(i) {
        sItems = jq('.result', sResults);
        sItemOver(i>=-1 ? i : sSelected);
      },
      sBlockWindowKey = function(e) {
        if (options.readonly) return true;
        if (sResults.isVisible()) {
          var kc = e.keyCode;
          if (kc==jq.KEY.DOWN || kc==jq.KEY.UP
           || kc==jq.KEY.PAGEDOWN || kc==jq.KEY.PAGEUP
           || kc==jq.KEY.END || kc==jq.KEY.HOME
           || kc==jq.KEY.ENTER || kc==jq.KEY.RIGHT) return false;
        }
      },
      sValueTpl = function(_data) {
        var html = '';
        for (var i=0, l=_data.length; i<l; i++) {
          var d = _data[i], _t = options.editable ? 'Value' : Ontology.getType(d);
          html += (options.multiselect ? '<li>' : '');
          html +=   '<a class="o' + _t + '">'
                  + (options.editable ? d : d.name)
                  + (options.multiselect && !options.readonly ? '<em>×</em>' : '')
                  + '</a>';
          html += (options.multiselect ? '</li>' : '');
        }
        html += (options.multiselect ? '<li class="bottom"></li>' : '');
        return html;
      },
      sUpdateValue = function() {
        valueCont.find('a').unbind('click');
        valueCont.html(sValueTpl(selectedArr = jq.toArray(selected)));
        valueCont[selectedArr.length ? 'show' : 'hide']();
        sField(sFieldShow);
        if (!options.readonly) valueCont.find('a').each(function(i){ jq(this).bind('click', sRemove.bind(this, i)); });
      },
      sRemove = function(i) {
        if (options.readonly) return true;
        var obj;
        if ((obj = selectedArr[i]) && selected[options.editable ? obj.toString() : obj.name]) {
          delete selected[options.editable ? obj.toString() : obj.name];
          var newSel = options.onPreSelect(selected, obj);
          if (newSel) selected = jq.toObject(newSel, _field);
          sUpdateValue();
          options.onSelect(options.multiselect ? selectedArr : (selectedArr[0] || null));
        }
        return false;
      },
      sSelect = function(obj) {
        if (obj) {
          if (!options.multiselect) selected = {};
          selected[options.editable ? obj.toString() : obj.name] = obj;
          var newSel = options.onPreSelect(selected, obj);
          if (newSel) selected = jq.toObject(newSel, _field);
          sUpdateValue();
          options.onSelect(options.multiselect ? selectedArr : (selectedArr[0] || null));
          //field.focus();
          if (!options.editable || options.multiselect) field.val('');//.trigger('focus');
        } else if (options.editable && !options.multiselect) {
          obj = selectedArr[0] || null; selected = {};
          var newSel = options.onPreSelect(selected, obj);
          if (newSel) selected = jq.toObject(newSel, _field);
          sUpdateValue();
          options.onSelect(options.multiselect ? selectedArr : (selectedArr[0] || null));
        }
      },
      sFilterData = function(_s) {
        var _fdata = [], s = jq.escapeRE(_s), re = new RegExp('^('+s+')|\\s('+s+')|\\(('+s+')', 'gi');
        for (var i=0, l=data.length; i<l; i++) {
          var d = data[i];
          if (selected[d.name]) continue;
          if (d.name && d.name.search(re) >= 0) {
            _fdata.push(d);
          }
        }
        return _fdata;
      },
      sResultsTpl = function(_fd, _s) {
        if (_fd) {
          var html = '', s = jq.escapeRE(_s), re = new RegExp('^('+s+')|\\s('+s+')|\\(('+s+')', 'gi'),
              ref = function(s, s1, s2, s3) { return ' <em>'+(s1||s2||s3)+'</em>'; };
          for (var i=0, l=_fd.length; i<l; i++) {
            var _o = _fd[i], _t = Ontology.getType(_o);
            html += '<div class="result t' + _t + '">';
            html +=   '<div class="tImg"></div><a class="o' + _t + '">' + (_s ? _o.name.replace(re, ref) : _o.name) + '</a>';
            html += '</div>';
          }
        } else {
          var html = '';
          html += '<div class="result tValue">';
          html +=   '<div class="tImg"></div><a class="oValue">' + _s + '</a>';
          html += '</div>';
        }
        return html;
      },
      sField = function(show, noFocus) {
        sFieldShow = !!show;
        if (show) {
          clearTimeout(ht);
          selector.height('auto');
          field.css('margin-top', -1)[noFocus ? 'noop' : 'trigger']('focus');
          if (options.editable && !options.multiselect) {
            field.val(selectedArr[0] || '');
            valueCont.hide();
          }
        } else {
          selector.height(Math.max(21, valueCont.height() + 2));
          field.css('margin-top', selectedArr.length ? 0 : -1);
          if (options.editable && !options.multiselect) {
            if (selectedArr.length) valueCont.show();
          }
        }
      },
      sHandler = function(e) {
        if (options.readonly) return true;
        clearTimeout(st);
        if (e.type == 'blur') {
          clearTimeout(ht);
          if (options.editable && !options.multiselect) {
            sSelect(field.val()); sField(false);
          }
          ht = setTimeout(function() {
            if (!options.editable || options.multiselect) field.val('');
            sResults.hide(); sField(false);
          }, 150); return false;
        }
        if (e.type == 'click' || e.keyCode == jq.KEY.ENTER || e.keyCode == jq.KEY.RIGHT || e.keyCode == jq.KEY.TAB) {
          if (e.type == 'click') clearTimeout(ht);
          if (e.keyCode != jq.KEY.ENTER && e.keyCode != jq.KEY.RIGHT || !options.multiselect) { 
            field.val(''); sResults.hide(); sField(false);
          }
          var sel = sSelectedObject();
          if (sel) {
            sSelect(sel);
            return e.keyCode == jq.KEY.TAB;
          }
        }
        if (e.keyCode == jq.KEY.UP) {
          sPrevItemOver(); return false;
        }
        if (e.keyCode == jq.KEY.DOWN) {
          sNextItemOver(); return false;
        }
        if (e.keyCode == jq.KEY.PAGEUP) {
          if (sSelected < 10) sItemOver(0);
          else sPrevItemOver(10);
          return false;
        }
        if (e.keyCode == jq.KEY.PAGEDOWN) {
          sNextItemOver(10); return false;
        }
        if (e.keyCode == jq.KEY.HOME) {
          sItemOver(0); return false;
        }
        if (e.keyCode == jq.KEY.END) {
          sItemOver(10000000); return false;
        }
        if (e.type == 'focus') {
          sField(true, true);
        }
        st = setTimeout(function() {
          var _s = jq.trim(field.val());
          if (sLastSearch != _s || e.type == 'focus') {
            var _fd = sFilterData(sLastSearch = _s);
            sItems.unbind('mouseover');
            if (_fd && _fd.length){
              sResults.html(sResultsTpl(_fd, _s)).show();
              sData = _fd;
              sUpdate(e.type == 'focus' ? -2 : 0);
              sItems.each(function(i){ jq(this).bind('mouseover', sItemOver.bind(this, i)); });
            } else {
              if (options.editable && _s) {
                sResults.html(sResultsTpl(null, _s))[options.multiselect ? 'show' : 'hide']();
                sData = [_s];
                sUpdate(e.type == 'focus' ? -2 : 0);
                sItems.each(function(i){ jq(this).bind('mouseover', sItemOver.bind(this, i)); });
              } else {
                sResults.html('').hide();
                sData = [];
                sUpdate();
              }
            }
          }
        }, e.type == 'focus' ? 10 : 50);
      };
  jq(document).unbind(jq.browser.opera ? 'keypress' : 'keydown', sBlockWindowKey);
  jq(document).bind(jq.browser.opera ? 'keypress' : 'keydown', sBlockWindowKey);
  
  field.bind('keydown focus blur', sHandler);
  sResults.click(sHandler);
  valueCont.click(sField.bind(this, true, false));
  
  sUpdate();
  sUpdateValue();
  sField(false);
  
  return selector.get(0).selector = {
    setData: function(_data) {
      data = _data;
    },
    selected: function(_sel) {
      if (_sel && jq.isArray(_sel)) {
        selected = jq.toObject(_sel, _field);
        sUpdateValue();
        options.onSelect(options.multiselect ? selectedArr : (selectedArr[0] || null));
      }
      return options.multiselect ? selectedArr : (selectedArr[0] || null);
    },
    readonly: function() {
      return options.readonly;
    }
  };
}

function OntologyEditor(data) {
  //alert('data:'+data);
  this.ontology = null;
  this.ui = null;
  
  this.mode = OntologyEditor.MODE_VIEW;
  this.cobj = null;
  
  var _init = function(ontology_data) {
    var data = ontology_data.ontology || null;
    this.ontology = new Ontology(data.name, data.description);
    this.ui = new OntoEditorUI();
    
    if (data) {
      // create objects
      if (data.classes) {
        for (var i=0, l=data.classes.length; i<l; i++) {
          this.ontology.addClass(data.classes[i]);
        }
      }
      if (data.oProps) {
        for (var i=0, l=data.oProps.length; i<l; i++) {
          this.ontology.addObjectProperty(data.oProps[i]);
        }
      }
      if (data.dProps) {
        for (var i=0, l=data.dProps.length; i<l; i++) {
          this.ontology.addDataProperty(data.dProps[i]);
        }
      }
      if (data.individuals) {
        for (var i=0, l=data.individuals.length; i<l; i++) {
          this.ontology.addIndividual(data.individuals[i]);
        }
      }
      // fill objects
      var o;
      if (data.classes) {
        for (var i=0, l=data.classes.length; i<l; i++) {
          (o = this.ontology.getClass(data.classes[i].name)) && o.edit(data.classes[i]);
        }
      }
      if (data.oProps) {
        for (var i=0, l=data.oProps.length; i<l; i++) {
          (o = this.ontology.getObjectProperty(data.oProps[i].name)) && o.edit(data.oProps[i]);
        }
      }
      if (data.dProps) {
        for (var i=0, l=data.dProps.length; i<l; i++) {
          (o = this.ontology.getDataProperty(data.dProps[i].name)) && o.edit(data.dProps[i]);
        }
      }
      if (data.individuals) {
        for (var i=0, l=data.individuals.length; i<l; i++) {
          (o = this.ontology.getIndividual(data.individuals[i].name)) && o.edit(data.individuals[i]);
        }
      }
    }
    
    this.ontologyInfo();
    this.refreshClassTree();
    this.refreshObjPropsTree();
    this.refreshDataPropsTree();
    this.refreshIndividualsTree();
    
    var that = this;
    jq('.treeBox').click(function (event) {
      var elem = jq(event.target);
      if (!elem.hasClass('tExp')) {
        return false;
      }
      var node = elem.parent();
      if (node.hasClass('tLeaf')) {
        return false;
      }

      var newClass = node.hasClass('tMinus') ? 'tPlus' : 'tMinus';
      var oldClass = newClass === 'tMinus' ? 'tPlus' : 'tMinus';
      node.removeClass(oldClass).addClass(newClass);
    });
    jq('#ontoEditor dl.tabbedBox > dt').click(function (event) {
      var elem = jq(event.target);
      elem.parents('dl.tabbedBox').find('dd').removeClass('opened');
      elem.nextAll('dd:first').addClass('opened');
    });
    jq.history.init(function(hash) {
      var h = hash.split('/'),
          funcs = {
            'class': that.selectClass.bind(that),
            'property': that.selectProp.bind(that),
            'individual': that.selectInd.bind(that)
          };
      var type = h[0], name = Ontology.realName(h[1] || '');
      if (funcs[type]) {
        funcs[type](name, true);
      }
    });
  }
  _init.call(this, data);
}
OntologyEditor.MODE_VIEW = 0;
OntologyEditor.MODE_NEW = 1;
OntologyEditor.MODE_EDIT = 2;
OntologyEditor.MODE_DELETE = 3;
OntologyEditor.prototype.ontologyInfo = function() {
  jq('#ontoEditor .editorHeader h2').text(this.ontology.name);
  jq('#ontoEditor .editorHeader p').text(this.ontology.description);
}
OntologyEditor.prototype.refreshClassTree = function() {
  var thing_class = this.ontology.getClass('Thing');
  jq('#classesTreeBox').html(this.ui.getClassesTpl([thing_class]));
}
OntologyEditor.prototype.refreshObjPropsTree = function() {
  var oprops = this.ontology.getObjectProperties(), top_oprops = [];
  for (var i=0, l=oprops.length; i<l; i++) {
    if (!oprops[i].getSubPropertyOf().length) top_oprops.push(oprops[i]);
  }
  jq('#opropsTreeBox').html(this.ui.getObjectPropsTpl(top_oprops));
}
OntologyEditor.prototype.refreshDataPropsTree = function() {
  jq('#dpropsTreeBox').html(this.ui.getDataPropsTpl(this.ontology.getDataProperties()));
}
OntologyEditor.prototype.refreshIndividualsTree = function() {
  jq('#individsTreeBox').html(this.ui.getIndividualsTpl(this.ontology.getIndividuals()));
}
OntologyEditor.prototype.newClass = function() {
  this.editClass();
}
OntologyEditor.prototype.editClass = function(class_name) {
  var _class = this.cobj = this.ontology.getClass(class_name);
  this.mode = _class ? OntologyEditor.MODE_EDIT : OntologyEditor.MODE_NEW;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getClassEditTpl());
  jq('#className').val(_class && _class.name || '');
  jq('#classDesc').val(_class && _class.description || '');
  jq('#classAddr').val(_class && _class.address || '');
  var _data = this.ontology.getClasses(),
      i = _class ? jq.inArray(_class, _data) : -1;
  if (i >= 0) _data.splice(i, 1);
  new OntoSelector('classSubClassOf', {
    width: 306,
    multiselect: true,
    data: _data,
    selected: _class && _class.getSubClassOf() || [this.ontology.getClass('Thing')],
    onPreSelect: (function(_selected, _last) {
      var _branch = jq.toObject(jq.merge(_last.getAllParentClasses(), _last.getAllSubClasses()), 'name'),
          _sel = [];
      jq.each(_selected, function() {
        if (!_branch[this.name]) _sel.push(this);
      });
      if (!_sel.length) _sel = [this.ontology.getClass('Thing')];
      return _sel;
    }).bind(this)
  });
}
OntologyEditor.prototype.saveClass = function() {
  var name = jq.trim(jq('#className').val()),
      desc = jq.trim(jq('#classDesc').val()),
      addr = jq.trim(jq('#classAddr').val()),
      scof = jq('#classSubClassOf').get(0).selector.selected(),
      _class;
  if (!name || (_class = this.ontology.getClass(name)) && _class.name != this.cobj.name) {
    jq('#className').blink(true);
    return false;
  }
  if (this.mode == OntologyEditor.MODE_NEW) {
     _class = this.ontology.addClass(name);
  }
  else if (this.mode == OntologyEditor.MODE_EDIT) {
    _class = this.cobj;
  }
  var class_data = {
    name: name,
    description: desc,
    address: addr,
    subClassOf: scof
  };
  if (_class) {
    
    base=document.baseURI
    par=class_data['subClassOf']
    parent_class=par[0]['name'];
    adrr=class_data['address'];
    title=class_data['name'];
    desc=class_data['description'];
    //alert(par);
    //alert(adrr);
    //alert(title);
    //alert(desc);
    url=base+"editor?mode=addcontent&contenttype=OntoClass&id="+addr+"&title="+name+"&desc="+desc+"&par="+parent_class;
    //alert(url);
    jq("#mess").load(url);
    _class.edit(class_data);
    this.refreshClassTree();
    this.selectClass(name);
  }
}
OntologyEditor.prototype.changeDomainPropOption = function(link) {
  var option = jq('#domain_prop_option').val(),
      change = option == 'change',
      new_option = change ? 'delete' : 'change';
  jq(link).html(change ? 'or change domain of properties' : 'or delete properties');
  jq('#domain_prop_h')
    .html(change ? 'Delete properties' : 'Change info')
    .animate({color:'#000000'}, 100).animate({color:'#999999'}, 100);
  jq('#domain_prop_option_'+option).hide();
  jq('#domain_prop_option_'+new_option).show();
  jq('#domain_prop_option').val(new_option);
}
OntologyEditor.prototype.showDeleteClassForm = function(class_name) {
  var _class = this.cobj = this.ontology.getClass(class_name),
      _orest = _class.getObjectRestrictions(),
      _drest = _class.getDataRestrictions(),
      _restrictions = {}, _propsDomain = [],
      _restRangeChange = [], _restRangeDelete = [], that = this;
  jq.each(_orest, function(prop, range) {
    var _prop = that.ontology.getObjectProperty(prop),
        _domen = _prop && _prop.getDomain() || null;
    if (!_prop) return true;
    if (_domen === _class) {
      _propsDomain.push(_prop);
    } else {
      _restrictions[prop] = range;
    }
  });
  jq.each(_drest, function(prop, range) {
    var _prop = that.ontology.getDataProperty(prop),
        _domen = _prop && _prop.getDomain() || null;
    if (!_prop) return true;
    if (_domen === _class) {
      _propsDomain.push(_prop);
    } else {
      _restrictions[prop] = range;
    }
  });
  var _classes = jq.uniqueArray(jq.map(this.ontology.getClassesWithRange(_class), function(_class) {
    return _class.getAllSubClasses(true);
  }), 'name');
  jq.each(_classes, function(i, domain) {
    jq.each(domain.getObjectRestrictions(), function(prop, range) {
      var _prop = that.ontology.getProperty(prop),
          _op_domain = _prop.getDomain();
      if (_op_domain === domain) return true;
      var _range = jq.arr(range).concat([]),
          i = jq.inArray(_class, _range);
      if (i >= 0) {
        if (_range.length > 1) {
          _range.splice(i, 1);
          _restRangeChange.push({domain: domain, prop: _prop, range: _range});
        } else {
          _restRangeDelete.push({domain: domain, prop: _prop, range: _range});
        }
      }
    });
  });
  var delete_info = {
        _class: _class,
        subClasses: {
          classes: _class.getSubClasses(),
          subClassOf: _class.getSubClassOf()
        },
        restrictions: _restrictions,
        propsDomain: {
          props: _propsDomain,
          domain: _class.getOneParentClass()
        },
        propsRange: {
          props: this.ontology.getObjectPropertiesByRange(_class),
          range: _class.getOneParentClass()
        },
        restRangeChange: _restRangeChange,
        restRangeDelete: _restRangeDelete,
        individuals: {
          inds: _class.getIndividuals(),
          source: _class.getSubClassOf()
        }
      };
  this.mode = OntologyEditor.MODE_DELETE;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getClassDeleteTpl(delete_info));
}
OntologyEditor.prototype.deleteClass = function() {
  var _class = this.cobj,
      _props_delete = jq('#domain_prop_option').val() == 'delete',
      _subClassOf = jq.one(_class.getSubClassOf());
  if (_class) {
    this.ontology.removeClass(_class, _props_delete);
    this.refreshClassTree();
    this.selectClass(_subClassOf ? _subClassOf.name : '');
  }
}
OntologyEditor.prototype.editClassRestrictions = function(class_name) {
  var _class = this.cobj = this.ontology.getClass(class_name),
      _oprop_info = _class.getObjectPropertyInfo(),
      _dprop_info = _class.getDataPropertyInfo();
  this.mode = OntologyEditor.MODE_EDIT;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getClassRestrictionsEditTpl(_class, _oprop_info, _dprop_info));
  var _poprops = jq.toArray(_oprop_info.parent.prop, true),
      _podefs = _oprop_info.parent.def,
      _oprops = jq.toArray(_oprop_info.self.prop, true),
      _odefs = _oprop_info.self.def,
      _pdprops = jq.toArray(_dprop_info.parent.prop, true),
      _pddefs = _dprop_info.parent.def,
      _dprops = jq.toArray(_dprop_info.self.prop, true),
      _ddefs = _dprop_info.self.def;
  for (var i=0, l=_poprops.length; i<l; i++) {
    var prop = _poprops[i].k, range = jq.arr(_poprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        _readonly = range.length==1 && range[0] instanceof OntoIndividual,
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren());
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: true,
      readonly: _readonly,
      data: _children,
      selected: _readonly ? range : (_podefs[prop] || []),
      onPreSelect: (function(_selected, _last) {
        var _ind = _last instanceof OntoIndividual,
            _branch = _ind
              ? jq.toObject(_last.getAllParentClasses(), 'name')
              : jq.toObject(jq.merge(_last.getAllParentClasses(), _last.getChildren()), 'name'),
            _sel = [];
        jq.each(_selected, function() {
          if (!_branch[this.name]) _sel.push(this);
        });
        return _sel;
      }).bind(this)
    });
  }
  /*for (var i=0, l=_oprops.length; i<l; i++) {
    var prop = _oprops[i].k, range = jq.arr(_oprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren(true));
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_prop', {
      width: 160,
      multiselect: false,
      data: this.ontology.getObjectProperties(),
      selected: [_prop]
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: true,
      data: _children,
      selected: _odefs[prop] || []
    });
  }*/
  for (var i=0, l=_pdprops.length; i<l; i++) {
    var prop = _pdprops[i].k, range = jq.arr(_pdprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _readonly = range.length==1 && range[0] instanceof OntoIndividual,
        _editable = range.length==1 && range[0] instanceof OntoClass,
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren());
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: true,
      readonly: _readonly,
      editable: _editable,
      data: _editable ? [] : _children,
      selected: _readonly ? range : (_editable ? jq.toArray(_pddefs[prop], 'name') : (_pddefs[prop] || [])),
      onPreSelect: (function(_selected, _last) {
        if (_editable) return false;
        var _ind = _last instanceof OntoIndividual,
            _branch = _ind
              ? jq.toObject(_last.getAllParentClasses(), 'name')
              : jq.toObject(jq.merge(_last.getAllParentClasses(), _last.getChildren()), 'name'),
            _sel = [];
        jq.each(_selected, function() {
          if (!_branch[this.name]) _sel.push(this);
        });
        return _sel;
      }).bind(this)
    });
  }
  /*for (var i=0, l=_dprops.length; i<l; i++) {
    var prop = _dprops[i].k, range = jq.arr(_dprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren(true));
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_prop', {
      width: 160,
      multiselect: false,
      data: this.ontology.getDataProperties(),
      selected: [_prop]
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: true,
      data: _children,
      selected: _ddefs[prop] || []
    });
  }*/
}
OntologyEditor.prototype.saveClassProperties = function() {
  var _class = this.cobj,
      _oprop_info = _class.getObjectPropertyInfo(),
      _dprop_info = _class.getDataPropertyInfo();
  var _poprops = jq.toArray(_oprop_info.parent.prop, true),
      _podefs = _oprop_info.parent.def,
      _oprops = jq.toArray(_oprop_info.self.prop, true),
      _odefs = _oprop_info.self.def,
      _pdprops = jq.toArray(_dprop_info.parent.prop, true),
      _pddefs = _dprop_info.parent.def,
      _dprops = jq.toArray(_dprop_info.self.prop, true),
      _ddefs = _dprop_info.self.def,
      class_data = {
        oProps: {},
        dProps: {}
      };
  for (var i=0, l=_poprops.length; i<l; i++) {
    var prop = _poprops[i].k, range = jq.arr(_poprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        selector = jq('#' + _prop.__name + '_range').get(0).selector,
        sel_range = selector.selected();
    if (selector.readonly()) continue;
    if (!sel_range.length) {
      class_data.oProps[_prop.name] = _prop.getDomain() === _class ? _prop.getRange() : null;
    } else if (range.length>1 && range.length == sel_range.length) {
      class_data.oProps[_prop.name] = null;
    } else {
      class_data.oProps[_prop.name] = this.ontology.getObject(sel_range);
    }
  }
  for (var i=0, l=_pdprops.length; i<l; i++) {
    var prop = _pdprops[i].k, range = jq.arr(_pdprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _editable = range.length==1 && range[0] instanceof OntoClass,
        selector = jq('#' + _prop.__name + '_range').get(0).selector,
        sel_range = selector.selected();
    if (selector.readonly()) continue;
    if (!sel_range.length) {
      class_data.dProps[_prop.name] = _prop.getDomain() === _class ? _prop.getRange() : null;
    } else if (range.length>1 && range.length == sel_range.length) {
      class_data.dProps[_prop.name] = null;
    } else {
      if (_editable) {
        for (var i=0, l=sel_range.length; i<l; i++) {
          var v = sel_range[i], val = this.ontology.getIndividual(v);
          if (val) {
            sel_range[i] = val;
          } else {
            sel_range[i] = this.ontology.addIndividual(v);
            sel_range[i].edit({builtIn: true, sourceClass: [range[0]]});
          }
        }
        class_data.dProps[_prop.name] = sel_range;
      } else {
        class_data.dProps[_prop.name] = this.ontology.getObject(sel_range);
      }
    }
  }
  if (_class) {
    _class.edit(class_data);
    this.selectClass(_class.name);
  }
}
OntologyEditor.prototype.newIndividual = function() {
  this.editIndividual();
}
OntologyEditor.prototype.editIndividual = function(ind_name) {
  var _ind = this.cobj = this.ontology.getIndividual(ind_name);
  this.mode = _ind ? OntologyEditor.MODE_EDIT : OntologyEditor.MODE_NEW;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getIndividualEditTpl());
  jq('#individualName').val(_ind && _ind.name || '');
  jq('#individualDesc').val(_ind && _ind.description || '');
  new OntoSelector('individualSourceClass', {
    width: 306,
    multiselect: true,
    data: this.ontology.getClasses(),
    selected: _ind && _ind.getSourceClass() || [this.ontology.getClass('Thing')],
    onPreSelect: (function(_selected, _last) {
      var _branch = jq.toObject(jq.merge(_last.getAllParentClasses(), _last.getAllSubClasses()), 'name'),
          _sel = [];
      jq.each(_selected, function() {
        if (!_branch[this.name]) _sel.push(this);
      });
      if (!_sel.length) _sel = [this.ontology.getClass('Thing')];
      return _sel;
    }).bind(this)
  });
}
OntologyEditor.prototype.saveIndividual = function() {
  var name = jq.trim(jq('#individualName').val()),
      desc = jq.trim(jq('#individualDesc').val()),
      source = jq('#individualSourceClass').get(0).selector.selected(),
      _ind;
  if (!name || (_ind = this.ontology.getIndividual(name)) && _ind.name != this.cobj.name) {
    jq('#individualName').blink(true);
    return false;
  }
  if (!source.length) {
    jq('#individualSourceClass').find('.field').andSelf().blink(true);
    return false;
  }
  if (this.mode == OntologyEditor.MODE_NEW) {
    _ind = this.ontology.addIndividual(name);
  } else if (this.mode == OntologyEditor.MODE_EDIT) {
    _ind = this.cobj;
  }
  var ind_data = {
        name: name,
        description: desc,
        sourceClass: source
      };
  if (_ind) {
    _ind.edit(ind_data);
    this.refreshIndividualsTree();
    this.selectInd(name);
  }
}
OntologyEditor.prototype.showDeleteIndividualForm = function(ind_name) {
  var _ind = this.cobj = this.ontology.getIndividual(ind_name),
      _restRangeChange = [], _restRangeDelete = [], that = this;
  var _classes = jq.uniqueArray(jq.map(this.ontology.getClassesWithRange(_ind), function(_class) {
    return _class.getAllSubClasses(true);
  }), 'name');
  jq.each(_classes, function(i, domain) {
    jq.each(domain.getObjectRestrictions(), function(prop, range) {
      var _prop = that.ontology.getProperty(prop),
          _op_domain = _prop.getDomain();
      if (_op_domain === domain) return true;
      var _range = jq.arr(range).concat([]),
          i = jq.inArray(_ind, _range);
      if (i >= 0) {
        if (_range.length > 1) {
          _range.splice(i, 1);
          _restRangeChange.push({domain: domain, prop: _prop, range: _range});
        } else {
          _restRangeDelete.push({domain: domain, prop: _prop, range: _range});
        }
      }
    });
  });
  var delete_info = {
        _ind: _ind,
        properties: jq.extend(_ind.getObjectValues(), _ind.getDataValues()),
        restRangeChange: _restRangeChange,
        restRangeDelete: _restRangeDelete
      };
  this.mode = OntologyEditor.MODE_DELETE;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getIndividualDeleteTpl(delete_info));
}
OntologyEditor.prototype.deleteIndividual = function() {
  var _ind = this.cobj;
  if (_ind) {
    this.ontology.removeIndividual(_ind);
    this.refreshIndividualsTree();
    var _ind = jq.one(this.ontology.getIndividuals());
    this.selectInd(_ind ? _ind.name : '');
  }
}
OntologyEditor.prototype.editIndProperties = function(ind_name) {
  var _ind = this.cobj = this.ontology.getIndividual(ind_name),
      _oprop_info = _ind.getSourceObjectProperties(),
      _dprop_info = _ind.getSourceDataProperties();
  this.mode = OntologyEditor.MODE_EDIT;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getIndPropertiesEditTpl(_ind, _oprop_info, _dprop_info));
  var _poprops = jq.toArray(_oprop_info, true),
      _podefs = _ind.getObjectValues(),
      _pdprops = jq.toArray(_dprop_info, true),
      _pddefs = _ind.getDataValues();
  for (var i=0, l=_poprops.length; i<l; i++) {
    var prop = _poprops[i].k, range = jq.arr(_poprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        _readonly = range.length==1 && range[0] instanceof OntoIndividual,
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren(false, true));
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: false,
      readonly: _readonly,
      data: _children,
      selected: _readonly ? range : (jq.arr(_podefs[prop] || []) || [])
    });
  }
  for (var i=0, l=_pdprops.length; i<l; i++) {
    var prop = _pdprops[i].k, range = jq.arr(_pdprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _readonly = range.length==1 && range[0] instanceof OntoIndividual,
        _editable = range.length==1 && range[0] instanceof OntoClass,
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren(false, true));
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: false,
      readonly: _readonly,
      editable: _editable,
      data: _editable ? [] : _children,
      selected: _readonly ? range : (_editable ? jq.toArray(jq.arr(_pddefs[prop] || []), 'name') : (_pddefs[prop] || []))
    });
  }
}
OntologyEditor.prototype.saveIndProperties = function() {
  var _ind = this.cobj,
      _oprop_info = _ind.getSourceObjectProperties(),
      _dprop_info = _ind.getSourceDataProperties();
  var _poprops = jq.toArray(_oprop_info, true),
      _podefs = _ind.getObjectValues(),
      _pdprops = jq.toArray(_dprop_info, true),
      _pddefs = _ind.getDataValues(),
      ind_data = {
        oProps: {},
        dProps: {}
      };
  for (var i=0, l=_poprops.length; i<l; i++) {
    var prop = _poprops[i].k, range = jq.arr(_poprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        selector = jq('#' + _prop.__name + '_range').get(0).selector,
        sel_range = selector.selected();
    if (selector.readonly()) continue;
    if (sel_range) {
      ind_data.oProps[_prop.name] = this.ontology.getIndividual(sel_range);
    } else {
      ind_data.oProps[_prop.name] = null;
    }
  }
  for (var i=0, l=_pdprops.length; i<l; i++) {
    var prop = _pdprops[i].k, range = jq.arr(_pdprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _editable = range.length==1 && range[0] instanceof OntoClass,
        selector = jq('#' + _prop.__name + '_range').get(0).selector,
        sel_range = selector.selected();
    if (selector.readonly()) continue;
    if (sel_range) {
      if (_editable) {
        var v = sel_range, val = this.ontology.getIndividual(v);
        if (val) {
          sel_range = val;
        } else {
          sel_range = this.ontology.addIndividual(v);
          sel_range.edit({builtIn: true, sourceClass: [range[0]]});
        }
        ind_data.dProps[_prop.name] = sel_range;
      } else {
        ind_data.dProps[_prop.name] = this.ontology.getIndividual(sel_range);
      }
    } else {
      ind_data.dProps[_prop.name] = null;
    }
  }
  if (_ind) {
    _ind.edit(ind_data);
    this.selectInd(_ind.name);
  }
}
OntologyEditor.prototype.showCreateIndividualForm = function(class_name) {
  var _class = this.cobj = this.ontology.getClass(class_name),
      _oprop_info = _class.getObjectProperties(),
      _dprop_info = _class.getDataProperties();
  this.mode = OntologyEditor.MODE_NEW;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getCreateIndividualTpl(_class, _oprop_info, _dprop_info));
  new OntoSelector('individualSourceClass', {
    width: 306,
    multiselect: true,
    readonly: true,
    data: this.ontology.getClasses(),
    selected: [_class]
  });
  var _poprops = jq.toArray(_oprop_info, true),
      _pdprops = jq.toArray(_dprop_info, true);
  for (var i=0, l=_poprops.length; i<l; i++) {
    var prop = _poprops[i].k, range = jq.arr(_poprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        _readonly = range.length==1 && range[0] instanceof OntoIndividual,
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren(false, true));
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: false,
      readonly: _readonly,
      data: _children,
      selected: _readonly ? range : {}
    });
  }
  for (var i=0, l=_pdprops.length; i<l; i++) {
    var prop = _pdprops[i].k, range = jq.arr(_pdprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _readonly = range.length==1 && range[0] instanceof OntoIndividual,
        _editable = range.length==1 && range[0] instanceof OntoClass,
        _children = [];
    jq.each(range, function() {
      if (this instanceof OntoClass) {
        jq.merge(_children, this.getChildren(false, true));
      }
      if (this instanceof OntoIndividual) {
        _children.push(this);
      }
    });
    new OntoSelector(_prop.__name+'_range', {
      width: 306,
      multiselect: false,
      readonly: _readonly,
      editable: _editable,
      data: _editable ? [] : _children,
      selected: _readonly ? range : {}
    });
  }
}
OntologyEditor.prototype.createIndividual = function() {
  var name = jq.trim(jq('#individualName').val()),
      desc = jq.trim(jq('#individualDesc').val()),
      source = jq('#individualSourceClass').get(0).selector.selected();
  if (!name || this.ontology.getIndividual(name)) {
    jq('#individualName').blink(true);
    return false;
  }
  var _ind = this.ontology.addIndividual(name),
      _class = this.cobj,
      _oprop_info = _class.getObjectProperties(),
      _dprop_info = _class.getDataProperties();
  var _poprops = jq.toArray(_oprop_info, true),
      _pdprops = jq.toArray(_dprop_info, true),
      ind_data = {
        name: name,
        description: desc,
        sourceClass: source,
        oProps: {},
        dProps: {}
      };
  for (var i=0, l=_poprops.length; i<l; i++) {
    var prop = _poprops[i].k, range = jq.arr(_poprops[i].v),
        _prop = this.ontology.getObjectProperty(prop),
        selector = jq('#' + _prop.__name + '_range').get(0).selector,
        sel_range = selector.selected();
    if (selector.readonly()) continue;
    if (sel_range) {
      ind_data.oProps[_prop.name] = this.ontology.getIndividual(sel_range);
    }
  }
  for (var i=0, l=_pdprops.length; i<l; i++) {
    var prop = _pdprops[i].k, range = jq.arr(_pdprops[i].v),
        _prop = this.ontology.getDataProperty(prop),
        _editable = range.length==1 && range[0] instanceof OntoClass,
        selector = jq('#' + _prop.__name + '_range').get(0).selector,
        sel_range = selector.selected();
    if (selector.readonly()) continue;
    if (sel_range) {
      if (_editable) {
        var v = sel_range, val = this.ontology.getIndividual(v);
        if (val) {
          sel_range = val;
        } else {
          sel_range = this.ontology.addIndividual(v);
          sel_range.edit({builtIn: true, sourceClass: [range[0]]});
        }
        ind_data.dProps[_prop.name] = sel_range;
      } else {
        ind_data.dProps[_prop.name] = this.ontology.getIndividual(sel_range);
      }
    }
  }
  if (_ind) {
    _ind.edit(ind_data);
    this.refreshIndividualsTree();
    this.selectInd(name);
  }
}
OntologyEditor.prototype.newObjectProperty = function() {
  this.editObjectProperty();
}
OntologyEditor.prototype.editObjectProperty = function(prop_name) {
  var _prop = this.cobj = this.ontology.getObjectProperty(prop_name),
      domainSelector, rangeSelector;
  this.mode = _prop ? OntologyEditor.MODE_EDIT : OntologyEditor.MODE_NEW;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getObjectPropertyEditTpl());
  jq('#objectPropertyName').val(_prop && _prop.name || '');
  jq('#objectPropertyDesc').val(_prop && _prop.desc || '');
  var _data = this.ontology.getObjectProperties(),
      i = _prop ? jq.inArray(_prop, _data) : -1;
  if (i >= 0) _data.splice(i, 1);
  new OntoSelector('objectPropertySubPropertyOf', {
    width: 306,
    multiselect: false,
    data: _data,
    selected: _prop && _prop.getSubPropertyOf() || [],
    /*onPreSelect: (function(_selected, _last) {
      var _branch = jq.toObject(jq.merge(_last.getAllParentProperties(), _last.getAllSubProperties()), 'name'),
          _sel = [];
      jq.each(_selected, function() {
        if (!_branch[this.name]) _sel.push(this);
      });
      return _sel;
    }).bind(this),*/
    onSelect: (function(_selected) {
      var _domain = _selected && _selected.getDomain() || null,
          _range = _selected && _selected.getRange() || null,
          _domainData, _rangeData,
          _domainSelected, _rangeSelected;
      _domainData = _domain ? _domain.getAllSubClasses() : this.ontology.getClasses();
      domainSelector.setData(_domainData);
      _domainSelected = domainSelector.selected();
      if (jq.inArray(_domainSelected, _domainData) == -1) {
        domainSelector.selected([]);
      }
      _rangeData = _range ? _range.getAllSubClasses() : this.ontology.getClasses();
      rangeSelector.setData(_rangeData);
      _rangeSelected = rangeSelector.selected();
      if (jq.inArray(_rangeSelected, _rangeData) == -1) {
        rangeSelector.selected([]);
      }
      jq('#domainRightTip, #rangeRightTip')
        .html(_selected ? ''
          + '<a class="oClass" onclick="return false;">' + _selected.getDomain().name + '</a>'
          + '<a class="oOProp" onclick="return false;">' + _selected.name + '</a>'
          + '<a class="oClass" onclick="return false;">' + _selected.getRange().name + '</a>'
          + '<div class="cf"></div>'
        : '')
        [_selected ? 'show' : 'hide']();
    }).bind(this)
  });
  var _parent = _prop && jq.one(_prop.getSubPropertyOf()) || null;
      _domain = _parent && _parent.getDomain() || null,
      _range = _parent && _parent.getRange() || null;
  domainSelector = new OntoSelector('objectPropertyDomain', {
    width: 306,
    multiselect: false,
    data: _domain ? _domain.getAllSubClasses() : this.ontology.getClasses(),
    selected: _prop && (_prop.domain ? [_prop.domain] : []) || []
  });
  rangeSelector = new OntoSelector('objectPropertyRange', {
    width: 306,
    multiselect: false,
    data: _range ? _range.getAllSubClasses() : this.ontology.getClasses(),
    selected: _prop && (_prop.range ? [_prop.range] : []) || []
  });
  jq('#domainRightTip, #rangeRightTip')
    .html(_parent ? ''
      + '<a class="oClass" onclick="return false;">' + _parent.getDomain().name + '</a>'
      + '<a class="oOProp" onclick="return false;">' + _parent.name + '</a>'
      + '<a class="oClass" onclick="return false;">' + _parent.getRange().name + '</a>'
      + '<div class="cf"></div>'
    : '')
    [_parent ? 'show' : 'hide']();
}
OntologyEditor.prototype.saveObjectProperty = function() {
  var name = jq.trim(jq('#objectPropertyName').val()),
      desc = jq.trim(jq('#objectPropertyDesc').val()),
      domain = jq('#objectPropertyDomain').get(0).selector.selected(),
      range = jq('#objectPropertyRange').get(0).selector.selected(),
      spof = jq('#objectPropertySubPropertyOf').get(0).selector.selected(),
      _prop;
  if (!name || (_prop = this.ontology.getObjectProperty(name)) && _prop.name != this.cobj.name) {
    jq('#objectPropertyName').blink(true);
    return false;
  }
  if (this.mode == OntologyEditor.MODE_NEW) {
    _prop = this.ontology.addObjectProperty(name);
  } else if (this.mode == OntologyEditor.MODE_EDIT) {
    _prop = this.cobj;
  }
  var domain_prop = {},
      oprop_data = {
        name: name,
        description: desc,
        domain: domain,
        range: (domain_prop[name] = range),
        subPropOf: [spof]
      };
  if (_prop) {
    base=document.baseURI
    dom=opt_prop['subClassOf']
    parent_class=par[0]['name'];
    adrr=class_data['address'];
    title=class_data['name'];
    desc=class_data['description'];
    //alert(par);
    //alert(adrr);
    //alert(title);
    //alert(desc);
    url=base+"editor?mode=addcontent&contenttype=OntoClass&id="+addr+"&title="+name+"&desc="+desc+"&par="+parent_class;
    //alert(url);
    jq("#mess").load(url);

    _prop.edit(oprop_data);
    if (domain) domain.edit({oProps: domain_prop});
    this.refreshObjPropsTree();
    this.selectProp(name);
  }
}
OntologyEditor.prototype.showDeleteObjectPropertyForm = function(prop_name) {
  var _prop = this.cobj = this.ontology.getObjectProperty(prop_name),
      _domain = _prop.getDomain(), _ro = {}, _po = {},
      _restrictions = [], _properties = [], that = this;
  if (_domain) {
    jq.each(_domain.getAllSubClasses(true), function() {
      if (_ro[this.name]) return true;
      _ro[this.name] = true;
      var _r = this.getObjectRestrictions();
      if (_r[_prop.name]) {
        _restrictions.push({domain: this, prop: _prop, range: _r[_prop.name]});
      }
    });
    _restrictions
    jq.each(_domain.getChildren(false, true), function() {
      if (_po[this.name]) return true;
      _po[this.name] = true;
      var _p = this.getObjectValues();
      if (_p[_prop.name]) {
        _properties.push({domain: this, prop: _prop, range: _p[_prop.name]});
      }
    });
  }
  var delete_info = {
        _prop: _prop,
        subProperties: {
          props: _prop.getSubProperties(),
          subPropertyOf: _prop.getSubPropertyOf()
        },
        restrictions: _restrictions,
        properties: _properties
      };
  this.mode = OntologyEditor.MODE_DELETE;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getObjectPropertyDeleteTpl(delete_info));
}
OntologyEditor.prototype.deleteObjectProperty = function() {
  var _prop = this.cobj;
  if (_prop) {
    this.ontology.removeObjectProperty(_prop);
    this.refreshObjPropsTree();
    var _subPropertyOf = jq.one(_prop.getSubPropertyOf()) || jq.one(this.ontology.getObjectProperties());
    this.selectProp(_subPropertyOf ? _subPropertyOf.name : '');
  }
}
OntologyEditor.prototype.newDataProperty = function() {
  this.editDataProperty();
}
OntologyEditor.prototype.editDataProperty = function(prop_name) {
  var _prop = this.cobj = this.ontology.getDataProperty(prop_name);
  this.mode = _prop ? OntologyEditor.MODE_EDIT : OntologyEditor.MODE_NEW;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getDataPropertyEditTpl());
  jq('#dataPropertyName').val(_prop && _prop.name || '');
  jq('#dataPropertyDesc').val(_prop && _prop.desc || '');
  var _domain = _prop && _prop.getDomain() || null,
      _range = _prop && _prop.getRange() || null;
  new OntoSelector('dataPropertyDomain', {
    width: 306,
    multiselect: false,
    data: this.ontology.getClasses(),
    selected: _domain ? [_domain] : {}
  });
  new OntoSelector('dataPropertyRange', {
    width: 306,
    multiselect: false,
    data: this.ontology.getBuiltInClasses(),
    selected: _range ? [_range] : {}
  });
}
OntologyEditor.prototype.saveDataProperty = function() {
  var name = jq.trim(jq('#dataPropertyName').val()),
      desc = jq.trim(jq('#dataPropertyDesc').val()),
      domain = jq('#dataPropertyDomain').get(0).selector.selected(),
      range = jq('#dataPropertyRange').get(0).selector.selected(),
      _prop;
  if (!name || (_prop = this.ontology.getDataProperty(name)) && _prop.name != this.cobj.name) {
    jq('#dataPropertyName').blink(true);
    return false;
  }
  if (this.mode == OntologyEditor.MODE_NEW) {
    _prop = this.ontology.addDataProperty(name);
  } else if (this.mode == OntologyEditor.MODE_EDIT) {
    _prop = this.cobj;
  }
  var domain_prop = {},
      dprop_data = {
        name: name,
        description: desc,
        domain: domain,
        range: (domain_prop[name] = range)
      };
  if (_prop) {
    _prop.edit(dprop_data);
    if (domain) domain.edit({dProps: domain_prop});
    this.refreshDataPropsTree();
    this.selectProp(name);
  }
}
OntologyEditor.prototype.showDeleteDataPropertyForm = function(prop_name) {
  var _prop = this.cobj = this.ontology.getDataProperty(prop_name),
      _domain = _prop.getDomain(), _ro = {}, _po = {},
      _restrictions = [], _properties = [], that = this;
  if (_domain) {
    jq.each(_domain.getAllSubClasses(true), function() {
      if (_ro[this.name]) return true;
      _ro[this.name] = true;
      var _r = this.getDataRestrictions();
      if (_r[_prop.name]) {
        _restrictions.push({domain: this, prop: _prop, range: _r[_prop.name]});
      }
    });
    _restrictions
    jq.each(_domain.getChildren(false, true), function() {
      if (_po[this.name]) return true;
      _po[this.name] = true;
      var _p = this.getDataValues();
      if (_p[_prop.name]) {
        _properties.push({domain: this, prop: _prop, range: _p[_prop.name]});
      }
    });
  }
  var delete_info = {
        _prop: _prop,
        restrictions: _restrictions,
        properties: _properties
      };
  this.mode = OntologyEditor.MODE_DELETE;
  jq('#ontoEditor .infoBoxContent').html(this.ui.getDataPropertyDeleteTpl(delete_info));
}
OntologyEditor.prototype.deleteDataProperty = function() {
  var _prop = this.cobj;
  if (_prop) {
    this.ontology.removeDataProperty(_prop);
    this.refreshDataPropsTree();
    var _dprop = jq.one(this.ontology.getDataProperties());
    this.selectProp(_dprop ? _dprop.name : '');
  }
}
OntologyEditor.prototype.backToView = function() {
  this.mode = OntologyEditor.MODE_VIEW;
  jq('#ontoEditor .editorLeftPanel li.selected a').nth(0).click();
}
OntologyEditor.prototype.selectClass = function(a, force) {
  jq('.editorLeftPanel dt.classes').click();
  var name = a.innerHTML || a,
      className = Ontology.safeName(name),
      obj;
  className && jq('.'+className).owlSelect();
  if (obj = this.ontology.getClass(name)) {
    if (!force) jq.history.load('class/' + className);
    setTitle('class ' + name);
    jq('#ontoEditor .infoBoxContent').html(this.ui.getClassInfoTpl(obj));
  } else {
    if (!force) jq.history.load('');
    setTitle('');
    jq('#ontoEditor .infoBoxContent').html('');
  }
}
OntologyEditor.prototype.selectProp = function(a, force) {
  jq('.editorLeftPanel dt.properties').click();
  var name = a.innerHTML || a,
      className = Ontology.safeName(name),
      obj;
  className && jq('.'+className).owlSelect();
  if (obj = (this.ontology.getObjectProperty(name) || this.ontology.getDataProperty(name))) {
    if (!force) jq.history.load('property/' + className);
    setTitle('property ' + name);
    jq('#ontoEditor .infoBoxContent').html(this.ui.getPropertyInfoTpl(obj));
  } else {
    if (!force) jq.history.load('');
    setTitle('');
    jq('#ontoEditor .infoBoxContent').html('');
  }
}
OntologyEditor.prototype.selectInd = function(a, force) {
  jq('.editorLeftPanel dt.individuals').click();
  var name = a.innerHTML || a,
      className = Ontology.safeName(name),
      obj;
  className && jq('.'+className).owlSelect();
  if (obj = this.ontology.getIndividual(name)) {
    if (!force) jq.history.load('individual/' + className);
    setTitle('individual ' + name);
    jq('#ontoEditor .infoBoxContent').html(this.ui.getIndividualInfoTpl(obj));
  } else {
    if (!force) jq.history.load('');
    setTitle('');
    jq('#ontoEditor .infoBoxContent').html('');
  }
}

function OntoEditorUI() {
  
}
OntoEditorUI.prototype.getClassesTpl = function(classes) {
  var html = '';
  html += '<ul class="tList">';
  for (var i=0, l=classes.length; i<l; i++) {
    var _class = classes[i],
        _subclasses = _class.getSubClasses();
    html += '<li class="tNode' + (l-i-1 ? '' : ' isLast') + (_subclasses.length ? ' tPlus' : ' tLeaf') + ' tClass">';
    html +=   '<div class="tExp"></div>';
    html +=   '<div class="tImg"></div>';
    html +=   '<div class="tLabel">';
    html +=     '<a class="oClass '+_class.__name+'" onclick="return ontoEditor.selectClass(this);">'+_class.name+'</a>';
    html +=   '</div>';
    if (_subclasses.length) html += this.getClassesTpl(_subclasses);
    html +=   '</li>';
  }
  html += '</ul>';
  return html;
}
OntoEditorUI.prototype.getObjectPropsTpl = function(oprops) {
  var html = '';
  html += '<ul class="tList">';
  for (var i=0, l=oprops.length; i<l; i++) {
    var _oprop = oprops[i],
        _suboprops = _oprop.getSubProperties();
    html += '<li class="tNode' + (l-i-1 ? '' : ' isLast') + (_suboprops.length ? ' tPlus' : ' tLeaf') + ' tOProp">';
    html +=   '<div class="tExp"></div>';
    html +=   '<div class="tImg"></div>';
    html +=   '<div class="tLabel">';
    html +=     '<a class="oOProp '+_oprop.__name+'" onclick="return ontoEditor.selectProp(this);">'+_oprop.name+'</a>';
    html +=   '</div>';
    if (_suboprops.length) html += this.getObjectPropsTpl(_suboprops);
    html +=   '</li>';
  }
  html += '</ul>';
  return html;
}
OntoEditorUI.prototype.getDataPropsTpl = function(dprops) {
  var html = '';
  html += '<ul class="tList">';
  for (var i=0, l=dprops.length; i<l; i++) {
    var _dprop = dprops[i];
    html += '<li class="tNode' + (l-i-1 ? '' : ' isLast') + ' tLeaf tOProp">';
    html +=   '<div class="tExp"></div>';
    html +=   '<div class="tImg"></div>';
    html +=   '<div class="tLabel">';
    html +=     '<a class="oDProp '+_dprop.__name+'" onclick="return ontoEditor.selectProp(this);">'+_dprop.name+'</a>';
    html +=   '</div>';
    html +=   '</li>';
  }
  html += '</ul>';
  return html;
}
OntoEditorUI.prototype.getIndividualsTpl = function(individs) {
  var html = '';
  html += '<ul class="tList">';
  for (var i=0, l=individs.length; i<l; i++) {
    var _individ = individs[i];
    html += '<li class="tNode' + (l-i-1 ? '' : ' isLast') + ' tLeaf tInd">';
    html +=   '<div class="tExp"></div>';
    html +=   '<div class="tImg"></div>';
    html +=   '<div class="tLabel">';
    html +=     '<a class="oInd '+_individ.__name+'" onclick="return ontoEditor.selectInd(this);">'+_individ.name+'</a>';
    html +=   '</div>';
    html +=   '</li>';
  }
  html += '</ul>';
  return html;
}
OntoEditorUI.prototype.getClassInfoTpl = function(_class) {
  var html = '',
      _isThing = _class.name == 'Thing',
      _subClassOf = jq.sortOn(_class.getSubClassOf(), 'name'),
      _oprops = jq.sortOn(jq.toArray(_class.getObjectProperties(), true), 'k'),
      _dprops = jq.sortOn(jq.toArray(_class.getDataProperties(), true), 'k'),
      _individs = jq.sortOn(_class.getIndividuals(), 'name');
  if (!_isThing) {
    html += '<div class="header_links">';
    html +=   '<a onclick="return ontoEditor.editClass(\'' + _class.name + '\');">edit info</a>|';
    html +=   '<a onclick="return ontoEditor.showDeleteClassForm(\'' + _class.name + '\');">delete class</a>';
    html += '</div>';
  }
  html +=   '<h4>Info</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oClass ' + _class.__name + ' b" onclick="return ontoEditor.selectClass(this);">' + _class.name + '</a></dd>';
  html +=       '<dt>Description:</dt>';
  html +=       '<dd>' + (_class.description || '&nbsp;') + '</dd>';
  html +=       '<dt>Address:</dt>';
  html +=       '<dd>' + (_class.address || '&nbsp;') + '</dd>';
  if (_subClassOf.length > 0) {
    html +=     '<dt>SubClassOf:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      html +=       '<li><a class="oClass ' + _subClassOf[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _subClassOf[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
  }
  html +=     '</dl>';
  html +=   '</div>';
  if (!_isThing && (_oprops.length || _dprops.length)) {
    html += '<div class="header_links">';
    html +=   '<a onclick="return ontoEditor.editClassRestrictions(\'' + _class.name + '\');">edit restrictions</a>';
    html += '</div>';
  }
  html +=   '<h4>Restrictions</h4>';
  html +=   '<div class="contentBox">';
  if (_oprops.length > 0) {
    html +=   '<dl class="props">';
    for (var i=0, li=_oprops.length; i<li; i++) {
      var _op = _oprops[i],
          _oprop = _class._ontology.getObjectProperty(_op.k),
          _range = _op.v;
      html +=   '<dt><a class="oOProp ' + _oprop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _oprop.name + '</a></dt>';
      if (jq.isArray(_range) && _range.length>1) {
        html += '<dd>';
        html +=   '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=   '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + ' ' + _range[j].__name + '" onclick="return ' + (_isClass ? 'ontoEditor.selectClass' : 'ontoEditor.selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=     '<li class="bottom"></li>';
        html +=   '</ul>';
        html += '</dd>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html += '<dd><a class="' + (_isClass ? 'oClass' : 'oInd') + ' ' + _range.__name + '" onclick="return ' + (_isClass ? 'ontoEditor.selectClass' : 'ontoEditor.selectInd') + '(this);">' + _range.name + '</a></dd>';
      }
    }
    html +=   '</dl>';
  }
  if (_dprops.length > 0) {
    html +=   '<dl class="props">';
    for (var i=0, li=_dprops.length; i<li; i++) {
      var _dp = _dprops[i],
          _dprop = _class._ontology.getDataProperty(_dp.k),
          _range = _dp.v;
      html +=   '<dt><a class="oDProp ' + _dprop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _dprop.name + '</a></dt>';
      if (jq.isArray(_range) && _range.length>1) {
        html += '<dd>';
        html +=   '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=   '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=     '<li class="bottom"></li>';
        html +=   '</ul>';
        html += '</dd>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html += '<dd><a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range.name + '</a></dd>';
      }
    }
    html +=   '</dl>';
  }
  if (!_oprops.length && !_dprops.length) {
    html +=   '<div class="empty">No properties</div>'
  }
  html +=   '</div>';
  html +=   '<div class="header_links">';
  html +=     '<a class="hedit" onclick="return ontoEditor.showCreateIndividualForm(\'' + _class.name + '\');">create individual</a>';
  html +=   '</div>';
  html +=   '<h4>Individuals</h4>';
  html +=   '<div class="contentBox">';
  if (_individs.length > 0) {
    html +=   '<ul class="array">';
    for (var i=0, l=_individs.length; i<l; i++) {
      var _ind = _individs[i];
      html +=   '<li><a class="oInd ' + _ind.__name + '" onclick="return ontoEditor.selectInd(this);">' + _ind.name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=     '<li class="bottom"></li>';
    html +=   '</ul>';
  } else {
    html +=   '<div class="empty">No individuals</div>'
  }
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getClassEditTpl = function() {
  var html = '';
  html += '<h4>Info</h4>';
  html += '<div class="contentBox">';
  html +=   '<dl class="info edit">';
  html +=     '<dt>Name:</dt>';
  html +=     '<dd><input type="text" class="field" id="className" value="" /></dd>';
  html +=     '<dt>Description:</dt>';
  html +=     '<dd><input type="text" class="field" id="classDesc" value="" /></dd>';
  html +=     '<dt>Address:</dt>';
  html +=     '<dd><input type="text" class="field" id="classAddr" value="" /></dd>';
  html +=     '<dt>SubClassOf:</dt>';
  html +=     '<dd>';
  html +=       '<div id="classSubClassOf" class="field"></div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt></dt>';
  html +=     '<dd>';
  html +=       '<button onclick="ontoEditor.saveClass();">Save Class</button>';
  html +=       '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=     '</dd>';
  html +=   '</dl>';
  html += '</div>';
  return html;
}
OntoEditorUI.prototype.getClassRestrictionsEditTpl = function(_class, _oprop_info, _dprop_info) {
  var html = '',
      _subClassOf = jq.sortOn(_class.getSubClassOf(), 'name'),
      _poprops = jq.sortOn(jq.toArray(_oprop_info.parent.prop, true), 'k'),
      _oprops = jq.sortOn(jq.toArray(_oprop_info.self.prop, true), 'k'),
      _pdprops = jq.sortOn(jq.toArray(_dprop_info.parent.prop, true), 'k'),
      _dprops = jq.sortOn(jq.toArray(_dprop_info.self.prop, true), 'k');
  html +=   '<h4>Info</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oClass ' + _class.__name + ' b" onclick="return ontoEditor.selectClass(this);">' + _class.name + '</a></dd>';
  html +=       '<dt>Description:</dt>';
  html +=       '<dd>' + (_class.description || '&nbsp;') + '</dd>';
  html +=       '<dt>Address:</dt>';
  html +=       '<dd>' + (_class.address || '&nbsp;') + '</dd>';
  if (_subClassOf.length > 0) {
    html +=     '<dt>SubClassOf:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subClassOf.length; i<l; i++) {
      html +=       '<li><a class="oClass ' + _subClassOf[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _subClassOf[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
  }
  html +=     '</dl>';
  html +=   '</div>';
  html +=   '<h4>Restrictions</h4>';
  html +=   '<div class="contentBox">';
  if (_poprops.length > 0) {
    html +=   '<dl class="info edit">';
    for (var i=0, li=_poprops.length; i<li; i++) {
      var _op = _poprops[i],
          _parent = _class.getParentObjectRestriction(_op.k) || _class,
          _oprop = _class._ontology.getObjectProperty(_op.k),
          _range = _op.v;
      html +=   '<dt><a class="oOProp" onclick="return false;">' + _oprop.name + '</a></dt>';
      html +=   '<dd>';
      html +=     '<div id="' + _oprop.__name + '_range" class="field"></div>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass" onclick="return false;">' + _parent.name + '</a>';
      html +=       '<a class="oOProp" onclick="return false;">' + _oprop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return false;">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return false;">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=     '<div class="cf"></div>';
      html +=   '</dd>';
    }
    html +=   '</dl>';
  }
  /*
  properties without domain
  html +=     '<dl class="info">';
  for (var i=0, li=_oprops.length; i<li; i++) {
    var _op = _oprops[i],
        _oprop = _class._ontology.getObjectProperty(_op.k),
        _range = _op.v;
    html +=     '<dt>';
    html +=       '<div id="' + _oprop.__name + '_prop" class="field"></div>';
    html +=       '<div class="cf"></div>';
    html +=     '</dt>';
    html +=     '<dd>';
    html +=       '<div id="' + _oprop.__name + '_range" class="field"></div>';
    html +=       '<div class="cf"></div>';
    html +=     '</dd>';
  }
  html +=     '</dl>';*/
  if (_pdprops.length > 0) {
    html +=   '<dl class="info edit">';
    for (var i=0, li=_pdprops.length; i<li; i++) {
      var _dp = _pdprops[i],
          _parent = _class.getParentDataRestriction(_dp.k) || _class,
          _dprop = _class._ontology.getDataProperty(_dp.k),
          _range = jq.arr(_dp.v);
      html +=   '<dt><a class="oDProp" onclick="return false;">' + _dprop.name + '</a></dt>';
      html +=   '<dd>';
      html +=     '<div id="' + _dprop.__name + '_range" class="field"></div>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass" onclick="return false;">' + _parent.name + '</a>';
      html +=       '<a class="oDProp" onclick="return false;">' + _dprop.name + '</a>';
      if (_range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=     '<div class="cf"></div>';
      html +=   '</dd>';
    }
    html +=   '</dl>';
  }
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.saveClassProperties();">Save Properties</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getClassDeleteTpl = function(delete_info) {
  var html = '',
      _class = delete_info._class,
      _subClasses = delete_info.subClasses,
      _restrictions = jq.toArray(delete_info.restrictions, true),
      _propsDomain = delete_info.propsDomain,
      _propsRange = delete_info.propsRange,
      _restRangeChange = delete_info.restRangeChange,
      _restRangeDelete = delete_info.restRangeDelete,
      _individuals = delete_info.individuals;
  html +=   '<h4>Delete class</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oClass b" onclick="return false;">' + _class.name + '</a></dd>';
  html +=     '</dl>';
  html +=   '</div>';
  if (_subClasses.classes.length > 0) {
    html += '<h4 class="sub">Change info</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="info">';
    html +=     '<dt>Classes:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subClasses.classes.length; i<l; i++) {
      html +=       '<li><a class="oClass ' + _subClasses.classes[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _subClasses.classes[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=     '<dt>SubClassOf:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subClasses.subClassOf.length; i<l; i++) {
      html +=       '<li><a class="oClass ' + _subClasses.subClassOf[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _subClasses.subClassOf[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=   '</dl>';
    html += '</div>';
  }
  if (_restrictions.length > 0) {
    html += '<h4 class="sub">Delete restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restrictions.length; i<li; i++) {
      var _r = _restrictions[i],
          _prop = _class._ontology.getProperty(_r.k),
          _isObj = _prop instanceof ObjectProperty,
          _range = _r.v;
      html +=   '<dt><a class="' + (_isObj ? 'oOProp' : 'oDProp') + ' ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a></dt>';
      if (jq.isArray(_range) && _range.length>1) {
        html += '<dd>';
        html +=   '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=   '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + ' ' + _range[j].__name + '" onclick="return ' + (_isClass ? 'ontoEditor.selectClass' : 'ontoEditor.selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=     '<li class="bottom"></li>';
        html +=   '</ul>';
        html += '</dd>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html += '<dd><a class="' + (_isClass ? 'oClass' : 'oInd') + ' ' + _range.__name + '" onclick="return ' + (_isClass ? 'ontoEditor.selectClass' : 'ontoEditor.selectInd') + '(this);">' + _range.name + '</a></dd>';
      }
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_propsDomain.props.length > 0) {
    html += '<div class="header_links">';
    html +=   '<a onclick="return ontoEditor.changeDomainPropOption(this);">or delete properties</a>';
    html += '</div>';
    html += '<h4 class="sub" id="domain_prop_h">Change info</h4>';
    html += '<input type="hidden" id="domain_prop_option" value="change" />';
    html += '<div class="contentBox" id="domain_prop_option_delete" style="display: none;">';
    html +=   '<dl class="info">';
    html +=     '<dt>Properties:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_propsDomain.props.length; i<l; i++) {
      var _prop = _propsDomain.props[i],
          _isObj = _prop instanceof ObjectProperty;
      html +=       '<li><a class="' + (_isObj ? 'oOProp' : 'oDProp') + ' ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=   '</dl>';
    html += '</div>';
    html += '<div class="contentBox" id="domain_prop_option_change">';
    html +=   '<dl class="info">';
    html +=     '<dt>Properties:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_propsDomain.props.length; i<l; i++) {
      var _prop = _propsDomain.props[i],
          _isObj = _prop instanceof ObjectProperty;
      html +=       '<li><a class="' + (_isObj ? 'oOProp' : 'oDProp') + ' ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=     '<dt>Domain:</dt>';
    html +=     '<dd><a class="oClass ' + _propsDomain.domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _propsDomain.domain.name + '</a></dd>';
    html +=   '</dl>';
    html += '</div>';
  }
  if (_propsRange.props.length > 0) {
    html += '<h4 class="sub">Change info</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="info">';
    html +=     '<dt>Properties:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_propsRange.props.length; i<l; i++) {
      html +=       '<li><a class="oOProp ' + _propsRange.props[i].__name + '" onclick="return ontoEditor.selectProp(this);">' + _propsRange.props[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=     '<dt>Range:</dt>';
    html +=     '<dd><a class="oClass ' + _propsRange.range.__name + '" onclick="return ontoEditor.selectClass(this);">' + _propsRange.range.name + '</a></dd>';
    html +=   '</dl>';
    html += '</div>';
  }
  if (_restRangeChange.length > 0) {
    html += '<h4 class="sub">Change restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restRangeChange.length; i<li; i++) {
      var _r = _restRangeChange[i],
          _domain = _r.domain,
          _prop = _r.prop,
          _range = _r.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>';
      html +=       '<a class="oOProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_restRangeDelete.length > 0) {
    html += '<h4 class="sub">Delete restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restRangeDelete.length; i<li; i++) {
      var _r = _restRangeDelete[i],
          _domain = _r.domain,
          _prop = _r.prop,
          _range = _r.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>';
      html +=       '<a class="oOProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_individuals.inds.length > 0) {
    html += '<h4 class="sub">Change info</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="info">';
    html +=     '<dt>Individuals:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_individuals.inds.length; i<l; i++) {
      html +=       '<li><a class="oInd ' + _individuals.inds[i].__name + '" onclick="return ontoEditor.selectInd(this);">' + _individuals.inds[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=     '<dt>SourceClass:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_individuals.source.length; i<l; i++) {
      html +=       '<li><a class="oClass ' + _individuals.source[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _individuals.source[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=   '</dl>';
    html += '</div>';
  }
  html +=   '<h4>Do you really want to make all these changes?</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.deleteClass();">Delete Class</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getPropertyInfoTpl = function(_prop) {
  var html = '',
      _domain = _prop.getDomain(),
      _range = _prop.getRange(),
      _isObj = _prop instanceof ObjectProperty,
      _subPropertyOf = _isObj ? jq.sortOn(_prop.getSubPropertyOf(), 'name') : null,
      _isClass = _range instanceof OntoClass;
  html +=   '<div class="header_links">';
  html +=     '<a onclick="return ontoEditor.' + (_isObj ? 'editObjectProperty' : 'editDataProperty') + '(\'' + _prop.name + '\');">edit info</a>|';
  html +=     '<a onclick="return ontoEditor.' + (_isObj ? 'showDeleteObjectPropertyForm' : 'showDeleteDataPropertyForm') + '(\'' + _prop.name + '\');">delete property</a>';
  html +=   '</div>';
  html +=   '<h4>Info</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="' + (_isObj ? 'oOProp' : 'oDProp') + ' ' + _prop.__name + ' b" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a></dd>';
  html +=       '<dt>Description:</dt>';
  html +=       '<dd>' + (_prop.description || '&nbsp;') + '</dd>';
  if (_isObj && _subPropertyOf.length > 0) {
    html +=     '<dt>SubPropertyOf:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subPropertyOf.length; i<l; i++) {
      html +=       '<li><a class="oOProp ' + _subPropertyOf[i].__name + '" onclick="return ontoEditor.selectProp(this);">' + _subPropertyOf[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
  }
  html +=       '<dt>Domain:</dt>';
  html +=       '<dd>' + (_domain ? '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>' : '&nbsp;') + '</dd>';
  html +=       '<dt>Range:</dt>';
  html +=       '<dd>' + (_range ? '<a class="' + (_isObj ? 'oClass ' + _range.__name : (_isClass ? 'oType' : 'oValue')) + '" onclick="return ' + (_isObj ? 'ontoEditor.selectClass(this)' : 'false') + ';">' + _range.name + '</a>' : '&nbsp;') + '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getObjectPropertyEditTpl = function() {
  var html = '';
  html += '<h4>Info</h4>';
  html += '<div class="contentBox">';
  html +=   '<dl class="info edit">';
  html +=     '<dt>Name:</dt>';
  html +=     '<dd><input type="text" class="field" id="objectPropertyName" value="" /></dd>';
  html +=     '<dt>Description:</dt>';
  html +=     '<dd><input type="text" class="field" id="objectPropertyDesc" value="" /></dd>';
  html +=     '<dt>SubPropertyOf:</dt>';
  html +=     '<dd>';
  html +=       '<div id="objectPropertySubPropertyOf" class="field"></div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt>Domain:</dt>';
  html +=     '<dd>';
  html +=       '<div id="objectPropertyDomain" class="field"></div>';
  html +=       '<div id="domainRightTip" class="rightTip">';
  html +=         '<div class="cf"></div>';
  html +=       '</div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt>Range:</dt>';
  html +=     '<dd>';
  html +=       '<div id="objectPropertyRange" class="field"></div>';
  html +=       '<div id="rangeRightTip" class="rightTip">';
  html +=         '<div class="cf"></div>';
  html +=       '</div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt></dt>';
  html +=     '<dd>';
  html +=       '<button onclick="ontoEditor.saveObjectProperty();">Save Object property</button>';
  html +=       '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=     '</dd>';
  html +=   '</dl>';
  html += '</div>';
  return html;
}
OntoEditorUI.prototype.getObjectPropertyDeleteTpl = function(delete_info) {
  var html = '',
      _prop = delete_info._prop,
      _subProperties = delete_info.subProperties,
      _restrictions = delete_info.restrictions,
      _properties = delete_info.properties;
  html +=   '<h4>Delete object property</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oOProp b" onclick="return false;">' + _prop.name + '</a></dd>';
  html +=     '</dl>';
  html +=   '</div>';
  if (_subProperties.props.length > 0) {
    html += '<h4 class="sub">Change info</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="info">';
    html +=     '<dt>Properties:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subProperties.props.length; i<l; i++) {
      html +=       '<li><a class="oOProp ' + _subProperties.props[i].__name + '" onclick="return ontoEditor.selectProp(this);">' + _subProperties.props[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=     '<dt>SubPropertyOf:</dt>';
    html +=     '<dd>';
    html +=       '<ul class="array">';
    for (var i=0, l=_subProperties.subPropertyOf.length; i<l; i++) {
      html +=       '<li><a class="oOProp ' + _subProperties.subPropertyOf[i].__name + '" onclick="return ontoEditor.selectProp(this);">' + _subProperties.subPropertyOf[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
    }
    html +=         '<li class="bottom"></li>';
    html +=       '</ul>';
    html +=     '</dd>';
    html +=   '</dl>';
    html += '</div>';
  }
  if (_restrictions.length > 0) {
    html += '<h4 class="sub">Delete restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restrictions.length; i<li; i++) {
      var _r = _restrictions[i],
          _domain = _r.domain,
          _prop = _r.prop,
          _range = _r.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>';
      html +=       '<a class="oOProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_properties.length > 0) {
    html += '<h4 class="sub">Delete properties</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_properties.length; i<li; i++) {
      var _p = _properties[i],
          _domain = _p.domain,
          _prop = _p.prop,
          _range = _p.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oInd ' + _domain.__name + '" onclick="return ontoEditor.selectInd(this);">' + _domain.name + '</a>';
      html +=       '<a class="oOProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      html +=       '<a class="oInd ' + _range.__name + '" onclick="return ontoEditor.selectInd(this);">' + _range.name + '</a>';
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  html +=   '<h4>Do you really want to make all these changes?</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.deleteObjectProperty();">Delete Object property</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getDataPropertyEditTpl = function() {
  var html = '';
  html += '<h4>Info</h4>';
  html += '<div class="contentBox">';
  html +=   '<dl class="info edit">';
  html +=     '<dt>Name:</dt>';
  html +=     '<dd><input type="text" class="field" id="dataPropertyName" value="" /></dd>';
  html +=     '<dt>Description:</dt>';
  html +=     '<dd><input type="text" class="field" id="dataPropertyDesc" value="" /></dd>';
  html +=     '<dt>Domain:</dt>';
  html +=     '<dd>';
  html +=       '<div id="dataPropertyDomain" class="field"></div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt>Range:</dt>';
  html +=     '<dd>';
  html +=       '<div id="dataPropertyRange" class="field"></div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt></dt>';
  html +=     '<dd>';
  html +=       '<button onclick="ontoEditor.saveDataProperty();">Save Data property</button>';
  html +=       '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=     '</dd>';
  html +=   '</dl>';
  html += '</div>';
  return html;
}
OntoEditorUI.prototype.getDataPropertyDeleteTpl = function(delete_info) {
  var html = '',
      _prop = delete_info._prop,
      _restrictions = delete_info.restrictions,
      _properties = delete_info.properties;
  html +=   '<h4>Delete data property</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oDProp b" onclick="return false;">' + _prop.name + '</a></dd>';
  html +=     '</dl>';
  html +=   '</div>';
  if (_restrictions.length > 0) {
    html += '<h4 class="sub">Delete restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restrictions.length; i<li; i++) {
      var _r = _restrictions[i],
          _domain = _r.domain,
          _prop = _r.prop,
          _range = _r.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>';
      html +=       '<a class="oDProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_properties.length > 0) {
    html += '<h4 class="sub">Delete properties</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_properties.length; i<li; i++) {
      var _p = _properties[i],
          _domain = _p.domain,
          _prop = _p.prop,
          _range = _p.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oInd ' + _domain.__name + '" onclick="return ontoEditor.selectInd(this);">' + _domain.name + '</a>';
      html +=       '<a class="oDProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      html +=       '<a class="oValue ' + _range.__name + '" onclick="return false;">' + _range.name + '</a>';
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  html +=   '<h4>Do you really want to make all these changes?</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.deleteDataProperty();">Delete Data property</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getIndividualInfoTpl = function(_ind) {
  var html = '',
      _sourceClass = _ind.getSourceClass(),
      _oprops = jq.sortOn(jq.toArray(_ind.getObjectProperties(true), true), 'k'),
      _dprops = jq.sortOn(jq.toArray(_ind.getDataProperties(true), true), 'k');
  html +=   '<div class="header_links">';
  html +=     '<a onclick="return ontoEditor.editIndividual(\'' + _ind.name + '\');">edit info</a>|';
  html +=     '<a onclick="return ontoEditor.showDeleteIndividualForm(\'' + _ind.name + '\');">delete individual</a>';
  html +=   '</div>';
  html +=   '<h4>Info</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oInd ' + _ind.__name + ' b" onclick="return ontoEditor.selectInd(this);">' + _ind.name + '</a></dd>';
  html +=       '<dt>Description:</dt>';
  html +=       '<dd>' + (_ind.description || '&nbsp;') + '</dd>';
  html +=       '<dt>SourceClass:</dt>';
  html +=       '<dd>';
  html +=         '<ul class="array">';
  for (var i=0, l=_sourceClass.length; i<l; i++) {
    html +=         '<li><a class="oClass ' + _sourceClass[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _sourceClass[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
  }
  html +=           '<li class="bottom"></li>';
  html +=         '</ul>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  if (_oprops.length || _dprops.length) {
    html += '<div class="header_links">';
    html +=   '<a onclick="return ontoEditor.editIndProperties(\'' + _ind.name + '\');">edit properties</a>';
    html += '</div>';
  }
  html +=   '<h4>Properties</h4>';
  html +=   '<div class="contentBox">';
  if (_oprops.length > 0) {
    html +=   '<dl class="props">';
    for (var i=0, li=_oprops.length; i<li; i++) {
      var _op = _oprops[i],
          _oprop = _ind._ontology.getObjectProperty(_op.k),
          _range = jq.one(_op.v);
      html +=   '<dt><a class="oOProp ' + _oprop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _oprop.name + '</a></dt>';
      html +=   '<dd><a class="oInd ' + _range.__name + '" onclick="return ontoEditor.selectInd(this);">' + _range.name + '</a></dd>';
    }
    html +=   '</dl>';
  }
  if (_dprops.length > 0) {
    html +=   '<dl class="props">';
    for (var i=0, li=_dprops.length; i<li; i++) {
      var _dp = _dprops[i],
          _dprop = _ind._ontology.getDataProperty(_dp.k),
          _range = jq.one(_dp.v);
      html +=   '<dt><a class="oDProp ' + _dprop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _dprop.name + '</a></dt>';
      html +=   '<dd><a class="oValue" onclick="return false;">' + _range.name + '</a></dd>';
    }
    html +=   '</dl>';
  }
  if (!_oprops.length && !_dprops.length) {
    html +=   '<div class="empty">No properties</div>'
  }
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getIndividualEditTpl = function() {
  var html = '';
  html += '<h4>Info</h4>';
  html += '<div class="contentBox">';
  html +=   '<dl class="info edit">';
  html +=     '<dt>Name:</dt>';
  html +=     '<dd><input type="text" class="field" id="individualName" value="" /></dd>';
  html +=     '<dt>Description:</dt>';
  html +=     '<dd><input type="text" class="field" id="individualDesc" value="" /></dd>';
  html +=     '<dt>SourceClass:</dt>';
  html +=     '<dd>';
  html +=       '<div id="individualSourceClass" class="field"></div>';
  html +=       '<div class="cf"></div>';
  html +=     '</dd>';
  html +=     '<dt></dt>';
  html +=     '<dd>';
  html +=       '<button onclick="ontoEditor.saveIndividual();">Save Individual</button>';
  html +=       '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=     '</dd>';
  html +=   '</dl>';
  html += '</div>';
  return html;
}
OntoEditorUI.prototype.getIndPropertiesEditTpl = function(_ind, _oprop_info, _dprop_info) {
  var html = '',
      _sourceClass = _ind.getSourceClass(),
      _poprops = jq.sortOn(jq.toArray(_oprop_info, true), 'k'),
      _pdprops = jq.sortOn(jq.toArray(_dprop_info, true), 'k');
  html +=   '<h4>Info</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oInd ' + _ind.__name + ' b" onclick="return ontoEditor.selectInd(this);">' + _ind.name + '</a></dd>';
  html +=       '<dt>Description:</dt>';
  html +=       '<dd>' + (_ind.description || '&nbsp;') + '</dd>';
  html +=       '<dt>SourceClass:</dt>';
  html +=       '<dd>';
  html +=         '<ul class="array">';
  for (var i=0, l=_sourceClass.length; i<l; i++) {
    html +=         '<li><a class="oClass ' + _sourceClass[i].__name + '" onclick="return ontoEditor.selectClass(this);">' + _sourceClass[i].name + '</a>' + (l-i-1 ? ', ' : '') + '</li>';
  }
  html +=           '<li class="bottom"></li>';
  html +=         '</ul>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  html +=   '<h4>Properties</h4>';
  html +=   '<div class="contentBox">';
  if (_poprops.length > 0) {
    html +=   '<dl class="info edit">';
    for (var i=0, li=_poprops.length; i<li; i++) {
      var _op = _poprops[i],
          _parent = _ind.getSourceObjectRestriction(_op.k),
          _oprop = _ind._ontology.getObjectProperty(_op.k),
          _range = _op.v;
      html +=   '<dt><a class="oOProp" onclick="return false;">' + _oprop.name + '</a></dt>';
      html +=   '<dd>';
      html +=     '<div id="' + _oprop.__name + '_range" class="field"></div>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass" onclick="return false;">' + _parent.name + '</a>';
      html +=       '<a class="oOProp" onclick="return false;">' + _oprop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return false;">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return false;">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=     '<div class="cf"></div>';
      html +=   '</dd>';
    }
    html +=   '</dl>';
  }
  /*
  properties without domain
  html +=     '<dl class="info">';
  for (var i=0, li=_oprops.length; i<li; i++) {
    var _op = _oprops[i],
        _oprop = _class._ontology.getObjectProperty(_op.k),
        _range = _op.v;
    html +=     '<dt>';
    html +=       '<div id="' + _oprop.__name + '_prop" class="field"></div>';
    html +=       '<div class="cf"></div>';
    html +=     '</dt>';
    html +=     '<dd>';
    html +=       '<div id="' + _oprop.__name + '_range" class="field"></div>';
    html +=       '<div class="cf"></div>';
    html +=     '</dd>';
  }
  html +=     '</dl>';*/
  if (_pdprops.length > 0) {
    html +=   '<dl class="info edit">';
    for (var i=0, li=_pdprops.length; i<li; i++) {
      var _dp = _pdprops[i],
          _parent = _ind.getSourceDataRestriction(_dp.k),
          _dprop = _ind._ontology.getDataProperty(_dp.k),
          _range = jq.arr(_dp.v);
      html +=   '<dt><a class="oDProp" onclick="return false;">' + _dprop.name + '</a></dt>';
      html +=   '<dd>';
      html +=     '<div id="' + _dprop.__name + '_range" class="field"></div>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass" onclick="return false;">' + _parent.name + '</a>';
      html +=       '<a class="oDProp" onclick="return false;">' + _dprop.name + '</a>';
      if (_range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oType' : 'oValue') + '" onclick="return false;">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=     '<div class="cf"></div>';
      html +=   '</dd>';
    }
    html +=   '</dl>';
  }
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.saveIndProperties();">Save Properties</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getIndividualDeleteTpl = function(delete_info) {
  var html = '',
      _ind = delete_info._ind,
      _properties = jq.toArray(delete_info.properties, true),
      _restRangeChange = delete_info.restRangeChange,
      _restRangeDelete = delete_info.restRangeDelete;
  html +=   '<h4>Delete individual</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><a class="oInd b" onclick="return false;">' + _ind.name + '</a></dd>';
  html +=     '</dl>';
  html +=   '</div>';
  if (_properties.length > 0) {
    html += '<h4 class="sub">Delete properties</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_properties.length; i<li; i++) {
      var _p = _properties[i],
          _prop = _ind._ontology.getProperty(_p.k),
          _isObj = _prop instanceof ObjectProperty,
          _range = _p.v;
      html +=   '<dt><a class="' + (_isObj ? 'oOProp' : 'oDProp') + ' ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a></dt>';
      html +=   '<dd><a class="oInd ' + _range.__name + '" onclick="return ontoEditor.selectInd(this);">' + _range.name + '</a></dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_restRangeChange.length > 0) {
    html += '<h4 class="sub">Change restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restRangeChange.length; i<li; i++) {
      var _r = _restRangeChange[i],
          _domain = _r.domain,
          _prop = _r.prop,
          _range = _r.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>';
      html +=       '<a class="oOProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  if (_restRangeDelete.length > 0) {
    html += '<h4 class="sub">Delete restrictions</h4>';
    html += '<div class="contentBox">';
    html +=   '<dl class="props">';
    for (var i=0, li=_restRangeDelete.length; i<li; i++) {
      var _r = _restRangeDelete[i],
          _domain = _r.domain,
          _prop = _r.prop,
          _range = _r.range;
      html +=   '<dt>';
      html +=     '<div class="rightTip">';
      html +=       '<a class="oClass ' + _domain.__name + '" onclick="return ontoEditor.selectClass(this);">' + _domain.name + '</a>';
      html +=       '<a class="oOProp ' + _prop.__name + '" onclick="return ontoEditor.selectProp(this);">' + _prop.name + '</a>';
      if (jq.isArray(_range) && _range.length>1) {
        html +=     '<ul class="array">';
        for (var j=0, lj=_range.length; j<lj; j++) {
          var _isClass = _range[j] instanceof OntoClass;
          html +=     '<li>' + (j ? '' : '{') + '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range[j].name + '</a>' + (lj-j-1 ? ', ' : '}') + '</li>';
        }
        html +=       '<li class="bottom"></li>';
        html +=     '</ul>';
      } else {
        if (jq.isArray(_range)) _range = _range[0];
        var _isClass = _range instanceof OntoClass;
        html +=     '<a class="' + (_isClass ? 'oClass' : 'oInd') + '" onclick="return ontoEditor.' + (_isClass ? 'selectClass' : 'selectInd') + '(this);">' + _range.name + '</a>';
      }
      html +=       '<div class="cf"></div>';
      html +=     '</div>';
      html +=   '</dt>';
      html +=   '<dd>&nbsp;</dd>';
    }
    html +=   '</dl>';
    html += '</div>';
  }
  html +=   '<h4>Do you really want to make all these changes?</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.deleteIndividual();">Delete Individual</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}
OntoEditorUI.prototype.getCreateIndividualTpl = function(_class, _oprop_info, _dprop_info) {
  var html = '',
      _poprops = jq.sortOn(jq.toArray(_oprop_info, true), 'k'),
      _pdprops = jq.sortOn(jq.toArray(_dprop_info, true), 'k');
  html +=   '<h4>Create ' + _class.name + '\'s individual</h4>';
  html +=   '<div class="contentBox">';
  html +=     '<dl class="info edit">';
  html +=       '<dt>Name:</dt>';
  html +=       '<dd><input type="text" class="field" id="individualName" value="" /></dd>';
  html +=       '<dt>Description:</dt>';
  html +=       '<dd><input type="text" class="field" id="individualDesc" value="" /></dd>';
  html +=       '<dt>SourceClass:</dt>';
  html +=       '<dd>';
  html +=         '<div id="individualSourceClass" class="field"></div>';
  html +=         '<div class="cf"></div>';
  html +=       '</dd>';
  html +=     '</dl>';
  if (_poprops.length > 0) {
    html +=   '<dl class="info edit">';
    for (var i=0, li=_poprops.length; i<li; i++) {
      var _op = _poprops[i],
          _oprop = _class._ontology.getObjectProperty(_op.k),
          _range = _op.v;
      html +=   '<dt><a class="oOProp" onclick="return false;">' + _oprop.name + '</a>:</dt>';
      html +=   '<dd>';
      html +=     '<div id="' + _oprop.__name + '_range" class="field"></div>';
      html +=     '<div class="cf"></div>';
      html +=   '</dd>';
    }
    html +=   '</dl>';
  }
  if (_pdprops.length > 0) {
    html +=   '<dl class="info edit">';
    for (var i=0, li=_pdprops.length; i<li; i++) {
      var _dp = _pdprops[i],
          _dprop = _class._ontology.getDataProperty(_dp.k),
          _range = jq.arr(_dp.v);
      html +=   '<dt><a class="oDProp" onclick="return false;">' + _dprop.name + '</a>:</dt>';
      html +=   '<dd>';
      html +=     '<div id="' + _dprop.__name + '_range" class="field"></div>';
      html +=     '<div class="cf"></div>';
      html +=   '</dd>';
    }
    html +=   '</dl>';
  }
  html +=     '<dl class="info edit">';
  html +=       '<dt></dt>';
  html +=       '<dd>';
  html +=         '<button onclick="ontoEditor.createIndividual();">Create Individual</button>';
  html +=         '<button class="link" onclick="ontoEditor.backToView();">Cancel</button>';
  html +=       '</dd>';
  html +=     '</dl>';
  html +=   '</div>';
  return html;
}

var ontoEditor;
jq(function() {
  /*
  {'classes':[{'name':'Thing','address':'http://www.w3.org/2002/07/owl#Thing','oProps':{'locatedIn':'Region'}},{'name':'wine','address':'#wine','subClassOf':['Thing'],'oProps':{'hasWineDescriptor':'Wine Descriptor','hasMaker':'Winery','madeFromGrape':'Wine Grape','hasSugar':'Wine Sugar','hasColor':'Wine Color','hasBody':'Wine Body'}},{'name':'White Wine','address':'#White Wine','subClassOf':['wine'],'oProps':{'hasColor':'White'}},{'name':'White Table Wine','address':'#White Table Wine','subClassOf':['White Wine','Table Wine']},{'name':'White Loire','address':'#White Loire','subClassOf':['White Wine','Loire'],'oProps':{'madeFromGrape':['Chenin Blanc Grape','Pinot Blanc Grape','Sauvignon Blanc Grape']}},{'name':'Table Wine','address':'#Table Wine','subClassOf':['wine'],'oProps':{'hasSugar':'Dry'}},{'name':'Loire','address':'#Loire','subClassOf':['wine'],'oProps':{'locatedIn':'Loire Region'}},{'name':'Wine Descriptor','description':'Made WineDescriptor unionType of tastes and color','address':'#Wine Descriptor','subClassOf':['Thing']},{'name':'Winery','address':'#Winery','subClassOf':['Thing']},{'name':'Wine Grape','address':'#Wine Grape','subClassOf':['Thing']},{'name':'Wine Taste','address':'#Wine Taste','subClassOf':['Wine Descriptor']},{'name':'Wine Sugar','address':'#Wine Sugar','subClassOf':['Wine Taste']},{'name':'Region','address':'#Region','subClassOf':['Thing']},{'name':'Wine Color','address':'#Wine Color','subClassOf':['Wine Descriptor']},{'name':'Vintage Year','address':'#Vintage Year','subClassOf':['Thing'],'dProps':{'yearValue':'positiveInteger'}},{'name':'Red Wine','address':'#Red Wine','subClassOf':['wine'],'oProps':{'hasColor':'Red'}},{'name':'Zinfandel','address':'#Zinfandel','subClassOf':['Table Wine','Red Wine'],'oProps':{'madeFromGrape':'Zinfandel Grape','hasBody':['Medium','Full']}},{'name':'Wine Body','address':'#Wine Body','subClassOf':['Wine Taste']},{'name':'positiveInteger','address':'http://www.w3.org/2001/XMLSchema#positiveInteger','builtIn':true}],'oProps':[{'name':'locatedIn','domain':'Thing','range':'Region'},{'name':'madeFromGrape','domain':'wine','range':'Wine Grape'},{'name':'hasWineDescriptor','domain':'wine','range':'Wine Descriptor'},{'name':'hasVintageYear','range':'Vintage Year'},{'name':'hasBody','subPropOf':['hasWineDescriptor'],'range':'Wine Body'},{'name':'hasSugar','subPropOf':['hasWineDescriptor'],'range':'Wine Sugar'},{'name':'hasMaker','subPropOf':['hasWineDescriptor']},{'name':'hasColor','subPropOf':['hasWineDescriptor'],'range':'Wine Color'}],'dProps':[{'name':'yearValue',domain: 'Vintage Year',range: 'positiveInteger'}],'individuals':[{'name':'1998','sourceClass':'positiveInteger','builtIn':true},{'name':'White','sourceClass':'Wine Color'},{'name':'Dry','sourceClass':'Wine Sugar'},{'name':'French Region','sourceClass':'Region'},{'name':'Loire Region','sourceClass':'Region','oProps':{'locatedIn':'French Region'}},{'name':'US Region','sourceClass':'Region'},{'name':'California Region','sourceClass':'Region','oProps':{'locatedIn':'US Region'}},{'name':'Arroyo Grande Region','sourceClass':'Region','oProps':{'locatedIn':'California Region'}},{'name':'Chenin Blanc Grape','sourceClass':'Wine Grape'},{'name':'Pinot Blanc Grape','sourceClass':'Wine Grape'},{'name':'Sauvignon Blanc Grape','sourceClass':'Wine Grape'},{'name':'Zinfandel Grape','sourceClass':'Wine Grape'},{'name':'Year1998','sourceClass':'Vintage Year','dProps':{'yearValue':'1998'}},{'name':'Red','sourceClass':'Wine Color'},{'name':'Light','sourceClass':'Wine Body'},{'name':'Medium','sourceClass':'Wine Body'},{'name':'Full','sourceClass':'Wine Body'},{'name':'Saucelito Canyon Zinfandel1998','sourceClass':'Zinfandel','oProps':{'hasBody':'Medium','hasMaker':'Saucelito Canyon','hasVintageYear':'Year1998','locatedIn':'Arroyo Grande Region'}},{'name':'Saucelito Canyon','sourceClass':'Winery'}]}
  */
  /*ontoEditor = new OntologyEditor({
    ontology: {
      name: 'Wine',
      description: 'The wine ontology',
      classes: [
        {
          name: 'Thing',
          address: 'http://www.w3.org/2002/07/owl#Thing',
          oProps: {
            'locatedIn': 'Region'
          }
        },
        {
          name: 'wine',
          address: '#wine',
          subClassOf: ['Thing'],
          oProps: {
            'hasWineDescriptor': 'Wine Descriptor',
            'hasMaker': 'Winery',
            'madeFromGrape': 'Wine Grape',
            'hasSugar': 'Wine Sugar',
            'hasColor': 'Wine Color',
            'hasBody': 'Wine Body'
          }
        },
        {
          name: 'White Wine',
          address: '#White Wine',
          subClassOf: ['wine'],
          oProps: {
            'hasColor': 'White'
          }
        },
        {
          name: 'White Table Wine',
          address: '#White Table Wine',
          subClassOf: ['White Wine', 'Table Wine']
        },
        {
          name: 'White Loire',
          address: '#White Loire',
          subClassOf: ['White Wine', 'Loire'],
          oProps: {
            'madeFromGrape': ['Chenin Blanc Grape', 'Pinot Blanc Grape', 'Sauvignon Blanc Grape']
          }
        },
        {
          name: 'Table Wine',
          address: '#Table Wine',
          subClassOf: ['wine'],
          oProps: {
            'hasSugar': 'Dry'
          }
        },
        {
          name: 'Loire',
          address: '#Loire',
          subClassOf: ['wine'],
          oProps: {
            'locatedIn': 'Loire Region'
          }
        },
        {
          name: 'Wine Descriptor',
          description: 'Made WineDescriptor unionType of tastes and color',
          address: '#Wine Descriptor',
          subClassOf: ['Thing']
        },
        {
          name: 'Winery',
          address: '#Winery',
          subClassOf: ['Thing']
        },
        {
          name: 'Wine Grape',
          address: '#Wine Grape',
          subClassOf: ['Thing']
        },
        {
          name: 'Wine Taste',
          address: '#Wine Taste',
          subClassOf: ['Wine Descriptor']
        },
        {
          name: 'Wine Sugar',
          address: '#Wine Sugar',
          subClassOf: ['Wine Taste']
        },
        {
          name: 'Region',
          address: '#Region',
          subClassOf: ['Thing']
        },
        {
          name: 'Wine Color',
          address: '#Wine Color',
          subClassOf: ['Wine Descriptor']
        },
        {
          name: 'Vintage Year',
          address: '#Vintage Year',
          subClassOf: ['Thing'],
          dProps: {
            'yearValue': 'positiveInteger'
          }
        },
        {
          name: 'Vintage Year 90x',
          address: '#VintageYear90x',
          subClassOf: ['Vintage Year'],
          dProps: {
            'yearValue': ['1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000']
          }
        },
        {
          name: 'Red Wine',
          address: '#Red Wine',
          subClassOf: ['wine'],
          oProps: {
            'hasColor': 'Red'
          }
        },
        {
          name: 'Zinfandel',
          address: '#Zinfandel',
          subClassOf: ['Table Wine', 'Red Wine'],
          oProps: {
            'madeFromGrape': 'Zinfandel Grape',
            'hasBody': ['Medium', 'Full']
          }
        },
        {
          name: 'Wine Body',
          address: '#Wine Body',
          subClassOf: ['Wine Taste']
        },
        {
          name: 'positiveInteger',
          address: 'http://www.w3.org/2001/XMLSchema#positiveInteger',
          builtIn: true
        }
      ],
      oProps: [
        {
          name: 'locatedIn',
          domain: 'Thing',
          range: 'Region'
        },
        {
          name: 'madeFromGrape',
          domain: 'wine',
          range: 'Wine Grape'
        },
        {
          name: 'hasWineDescriptor',
          domain: 'wine',
          range: 'Wine Descriptor'
        },
        {
          name: 'hasVintageYear',
          domain: 'Thing',
          range: 'Vintage Year'
        },
        {
          name: 'hasBody',
          subPropOf: ['hasWineDescriptor'],
          range: 'Wine Body'
        },
        {
          name: 'hasSugar',
          subPropOf: ['hasWineDescriptor'],
          range: 'Wine Sugar'
        },
        {
          name: 'hasMaker',
          subPropOf: ['hasWineDescriptor']
        },
        {
          name: 'hasColor',
          subPropOf: ['hasWineDescriptor'],
          range: 'Wine Color'
        }
      ],
      dProps: [
        {
          name: 'yearValue',
          domain: 'Vintage Year',
          range: 'positiveInteger'
        }
      ],
      individuals: [
        {
          name: '1991',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1992',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1993',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1994',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1995',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1996',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1997',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1998',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '1999',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: '2000',
          sourceClass: 'positiveInteger',
          builtIn: true
        },
        {
          name: 'White',
          sourceClass: 'Wine Color'
        },
        {
          name: 'Dry',
          sourceClass: 'Wine Sugar'
        },
        {
          name: 'French Region',
          sourceClass: 'Region'
        },
        {
          name: 'Loire Region',
          sourceClass: 'Region',
          oProps: {
            'locatedIn': 'French Region'
          }
        },
        {
          name: 'US Region',
          sourceClass: 'Region'
        },
        {
          name: 'California Region',
          sourceClass: 'Region',
          oProps: {
            'locatedIn': 'US Region'
          }
        },
        {
          name: 'Arroyo Grande Region',
          sourceClass: 'Region',
          oProps: {
            'locatedIn': 'California Region'
          }
        },
        {
          name: 'Chenin Blanc Grape',
          sourceClass: 'Wine Grape'
        },
        {
          name: 'Pinot Blanc Grape',
          sourceClass: 'Wine Grape'
        },
        {
          name: 'Sauvignon Blanc Grape',
          sourceClass: 'Wine Grape'
        },
        {
          name: 'Zinfandel Grape',
          sourceClass: 'Wine Grape'
        },
        {
          name: 'Year1998',
          sourceClass: 'Vintage Year',
          dProps: {
            'yearValue': '1998'
          }
        },
        {
          name: 'Red',
          sourceClass: 'Wine Color'
        },
        {
          name: 'Light',
          sourceClass: 'Wine Body'
        },
        {
          name: 'Medium',
          sourceClass: 'Wine Body'
        },
        {
          name: 'Full',
          sourceClass: 'Wine Body'
        },
        {
          name: 'Saucelito Canyon Zinfandel1998',
          sourceClass: 'Zinfandel',
          oProps: {
            'hasBody': 'Medium',
            'hasMaker': 'Saucelito Canyon',
            'hasVintageYear': 'Year1998',
            'locatedIn': 'Arroyo Grande Region'
          }
        },
        {
          name: 'Saucelito Canyon',
          sourceClass: 'Winery'
        }
      ]
    }
  });*/
  
  
});
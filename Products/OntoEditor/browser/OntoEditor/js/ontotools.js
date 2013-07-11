jq.noConflict();
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

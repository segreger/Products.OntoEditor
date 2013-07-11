

function OntologyEditor(data) {
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
    alert(url);
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
  var _classes = jq.unjqueArray(jq.map(this.ontology.getClassesWithRange(_class), function(_class) {
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
  var _classes = jq.unjqueArray(jq.map(this.ontology.getClassesWithRange(_ind), function(_class) {
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
    url=base+"editor?mode=addcontent&contenttype=ObjectProperty&id="+name+"&title="+name+"&desc="+desc+"&domen="+dom+"&range="+range+"&spof="+spof;
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
  base=document.baseURI
  dom=opt_prop['subClassOf']
  parent_class='';
  adrr=class_data['address'];
  title=class_data['name'];
  desc=class_data['description'];
  url=base+"editor?mode=addcontent&contenttype=DataProperty&id="+addr+"&title="+name+"&desc="+desc+"&par="+parent_class;
    jq("#mess").load(url);    
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


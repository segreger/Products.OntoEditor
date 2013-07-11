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
    //html +=     '<a class="oClass '+_class.__name+'" onclick="return ontoEditor.selectClass(this);">'+_class.name+'</a>';
    html +=     '<a class="oClass '+_class.__name+'" >'+_class.name+'</a>';
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
    html +=     '<a class="oOProp '+_oprop.__name+'">'+_oprop.name+'</a>';
    //html +=     '<a class="oOProp '+_oprop.__name+'" onclick="return ontoEditor.selectProp(this);">'+_oprop.name+'</a>';
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
    //html +=     '<a class="oDProp '+_dprop.__name+'" onclick="return ontoEditor.selectProp(this);">'+_dprop.name+'</a>';
    html +=     '<a class="oDProp '+_dprop.__name+'">'+_dprop.name+'</a>';
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
    html +=     '<a class="oInd '+_individ.__name+'">'+_individ.name+'</a>';
    //    html +=     '<a class="oInd '+_individ.__name+'" onclick="return ontoEditor.selectInd(this);">'+_individ.name+'</a>';
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
  html +=       '<dd><a class="oClass ' + _class.__name + ' b" onclick="return OntologyEditor.selectClass(this);">' + _class.name + '</a></dd>';
  html +=       '<dd><a class="oClass ' + _class.__name + ' b" >' + _class.name + '</a></dd>';
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
  html +=       '<button class="save" onclick="ontoEditor.saveClass();">Save Class</button>';
  //html +=       '<button class="save">Save Class</button>';
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

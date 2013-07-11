
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
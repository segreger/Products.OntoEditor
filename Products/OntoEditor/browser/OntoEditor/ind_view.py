# -*- coding: utf-8 -*-
#
# File: monthselect.py
#
# Copyright (c) 2010 by []
# Generator: ArchGenXML Version 2.5
#            http://plone.org/products/archgenxml
#
# GNU General Public License (GPL)
#

__author__ = """unknown <unknown>"""
__docformat__ = 'plaintext'



##code-section module-header #fill in your manual code here
##/code-section module-header
import pdb
from zope import interface
from zope import component
from Products.CMFPlone import utils
from Products.Five import BrowserView
from zope.interface import implements
from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin
from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
    ReferenceBrowserWidget
from DateTime.DateTime import *
from Products.CMFCore.utils import getToolByName
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.site.hooks import getSite

class ind_add(BrowserView):
    template = ViewPageTemplateFile('templates/ind_add.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()


    def getParentsList(self):
        p_list=[]
        tec=self.context
        item=self.context
        while tec.getSubClassOf():
            item=tec.getSubClassOf()[0]
            p_list.append(item)
            tec=item
        p_list.append(self.context)
        return p_list 
    def ListDProp(self, ocls):
        dp=ocls.getDataProps()
        if dp:
            return dp
        else:
            return 0
    def dPropRange(self, dprop):
        if dprop.getRange():
            return dprop.getRange()[0]
        else:
            return 0
    def __call__(self):
        if self.request.form.has_key("submitted"):
            print "hhhh"
            postback = True
            form = self.request.form
            # Make sure we had a proper form submit, not just a GET request
            submitted = form.get('submitted', False)
            save_button = form.get('form.button.Save', False)
            cancel_button = form.get('form.button.Cancel', False)
            print "submitted=",submitted
            print "save_button=",save_button
            print "cancel_button=",cancel_button
            if submitted and save_button:
                fields={}
                context_uid = form['context_uid']
                ind_id = form['ind_id']
                title = form['title']
                container=self.context
                ind = container.invokeFactory('OntoIndividual', id=ind_id, title=title)
                #self.catalogtool.refreshCatalog()
                container = [i.getObject() for i in self.catalogtool.searchResults({'id': ind})][0]                
                for i in form.keys():
                    print i,i[0:4], i[4:],form[i]
                    if i[0:4] == "sel_" and form[i]:
                        range_value = form[i]
                        id_prop = container.invokeFactory('IndObjectProperty', id=ind_id+"_"+i[4:], title=i[4:])
                        prop = [item.getObject() for item in self.catalogtool.searchResults({'id': id_prop})][0]
                        r=[]
                        print 'field=',i[4:], prop 
                        r.append(form[i])
                        prop.setRange(r)
                self.catalogtool.refreshCatalog()        
                # Update the acquire-roles setting
                # Other buttons return to the sharing page

                #result = [i.getObject() for i in catalog.searchResults({'id': ind})][0]
        else:
            return self.template()
            """
            if 'dataproperty' in data.keys():
                dprop = data['dataproperty']
                for item in dprop:
                    pname = item['nameproperty']
                    pid = item['nameproperty']
                    prop_parents=item['sub_dataproperty_of']
                    v= item['value']
                    #print item
                    container=result
                    container.invokeFactory("IndDataProperty", pid)
                    f = getattr(container, pid)
                    f.setTitle(pname)
                    if v:
                        f.setValue(v)
            if 'objproperty' in data.keys():
                oprop = data['objproperty']
                #print 'oprop=', oprop
               
                for item in oprop:
                    pname = item['nameproperty']
                    pid = item['nameproperty']
                    prop_parents=item['sub_objproperty_of']
                    
                    #print item
                    container=result
                    #container.invokeFactory("IndObjectProperty", pid)
                    #f = getattr(container, pid)
                    #f.setTitle(pname)
            
        if save_button or cancel_button:
            postback = False
        if postback:
            return self.template()
        else:
            self.request.response.redirect(self.context.absolute_url())
            return ''
            """
    def get_fromreq(self, name):
        if hasattr(self.request, name):
            return self.request[name]
        else:
            return None
    def addobjprop(self,owltype, id, title, desc, parent_class):
        """
        add new object for ontoogy type
        """
        user = self.context.getWrappedOwner()
        newSecurityManager(self.context, user)
        if owltype and id and title:
                
            container=self.context
            id_obj=id
            if hasattr(container, id):
                obj = getattr(container, id_obj)
            else:
                container.invokeFactory(owltype, id_obj)
                obj = getattr(container, id_obj)
            #pdb.set_trace()
            obj.setTitle(title)
            if desc:
                obj.setDescription(desc)
            if parent_class:
                if hasattr(self.context, parent_class):
                    target=getattr(self.context, parent_class)
                    save_list=[]
                    save_list.append(target.UID())
                obj.setSubClassOf(save_list)
            self.catalogtool.refreshCatalog()
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Ok</p>"
            return html.encode('utf8')
        else:
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Not</p>"
            return html.encode('utf8')
    def addcontent(self,owltype, id, title, desc, parent_class):
        """
        add new object for ontoogy type
        """
        user = self.context.getWrappedOwner()
        newSecurityManager(self.context, user)
        if owltype and id and title:
                
            container=self.context
            id_obj=id
            if hasattr(container, id):
                obj = getattr(container, id_obj)
            else:
                container.invokeFactory(owltype, id_obj)
                obj = getattr(container, id_obj)
            #pdb.set_trace()
            obj.setTitle(title)
            if desc:
                obj.setDescription(desc)
            if parent_class:
                if hasattr(self.context, parent_class):
                    target=getattr(self.context, parent_class)
                    save_list=[]
                    save_list.append(target.UID())
                obj.setSubClassOf(save_list)
            self.catalogtool.refreshCatalog()
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Ok</p>"
            return html.encode('utf8')
        else:
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Not</p>"
            return html.encode('utf8')
            
    def list_ontologys(self):
        l=[i.getObject() for i in self.catalogtool.searchResults(portal_type="Ontology")]
        f={}
        
        for i in l:
            f[str(i.title_or_id())]=i.getId()
        return f    
    def json_call(self):
        self.onto_data = json.dumps(self.listontologys())
        #return self.onto_data
        return json.dumps(self.onto_data)

    def getClassParentsList(self,nameclass):
        p_list=[]
        tec=self.getClassByName(nameclass)
        while tec and tec.getSubClassOf():
            item=tec.getSubClassOf()[0]
            p_list.append(item)
            tec=item
        return p_list 
    def getParentsList(self):
        p_list=[]
        tec=self.context
        item=self.context
        while tec.getSubClassOf():
            item=tec.getSubClassOf()[0]
            p_list.append(item)
            tec=item
        p_list.append(self.context)
        return p_list 
    def getOPropByParent(self, name):
        op={}
        context_class=self.getClassByName(nameclass)
        par_list=self.getParentsList(nameclass),append(context_class)
        for i in par_list:
            op1=dict([(j.getTitle(), j.getRange()[0].title_or_id()) for j in i.getObjectProps() if j.getRange()])
            op.update(op1)
        return op
    def ListDProp(self, ocls):
        dp=ocls.getDataProps()
        if dp:
            return dp
        else:
            return 0
    def dPropRange(self, dprop):
        if dprop.getRange():
            return dprop.getRange()[0]
        else:
            return 0        

    def getOnto(self, onto):
        #obj_list=self.catalogtool.searchResults(Title=onto)
        obj_list=[i.getObject() for i in self.catalogtool.searchResults(portal_type="Ontology")]
        #pdb.set_trace()
        if obj_list:
            for item in obj_list:
                if item.title_or_id()==onto:
                    return item
    def getClassByName(self, name):
        #obj_list=self.catalogtool.searchResults(Title=onto)
        obj_list=[i.getObject() for i in self.catalogtool.searchResults(portal_type="OntoClass")]
        if obj_list:
            for item in obj_list:
                if item.title_or_id()==name:
                    return item

    def vocabRange(self, ouid):
        terms = {}
        site = getSite()
        refCatalog = getToolByName(site, 'reference_catalog')
        uid_catalog = getToolByName(site, 'uid_catalog')
        #список индивидуалов
        if ouid:
            itemUID=ouid
            list_rangeitem = [k.getObject() for k in uid_catalog(UID=itemUID)]
            if list_rangeitem:
                rangeitem=list_rangeitem[0]
                #print "rangeitem=",rangeitem
                if rangeitem.getRange():
                    crange=rangeitem.getRange()[0].UID()
                    references = refCatalog.getBackReferences(crange, relationship="source_class")
                    inds = [ref.getSourceObject() for ref in references]
                    for brain in inds:
                        terms[brain.title_or_id()]=brain.UID()
                        
        return terms






##code-section module-footer #fill in your manual code here
##/code-section module-footer











##code-section module-footer #fill in your manual code here
##/code-section module-footer


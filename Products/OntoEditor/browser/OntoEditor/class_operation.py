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
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
from zope.component.hooks import getSite
from class_utility import *

class class_view(BrowserView):
    #template = ViewPageTemplateFile('templates/class_view.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')


    def __init__(self, context, request):
        self.context=self.getContextClass(context, request)
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()  

    def getContextClass(self,context, request):
        return viewContextClass(context, request)
    def getParentsList(self):
        #for i in ClassParentsList(self.context):print "getParentsList cls=", i
        return ClassParentsList(self.context.title_or_id())


    def ObjPropByParent(self, nameclass):
        #print "nameclass=", nameclass
        a=getObjPropByParent(nameclass).items()
        return getObjPropByParent(nameclass).items()
        


    def vocabRange(self,ouid):
        return getVocabRange(ouid)

    def ListDProp(self, ocls):
        return ListDataProp(ocls)


        
    def dPropRange(self, dprop):
        return DataPropRange(dprop)
    def getBackRef(self):
        return backref(self.context)
    def getListFieldTypes(self, rootfield):
        return ListFieldTypes(rootfield)
    def ref(self):
        refCatalog = getToolByName(self.portal, 'reference_catalog')
        uid_catalog=getToolByName(self.portal, 'uid_catalog')
        lcurses = [i.getObject() for i in self.catalogtool.searchResults()]
        res=[]
        item = self.context
        refs = refCatalog.getReferences(item)
        for i in refs:
            #print i.targetUID, i.sourceUID, i.relationship
            #print uid_catalog(UID=i.targetUID), uid_catalog(UID=i.sourceUID)
            a=[k.getObject() for k in uid_catalog(UID=i.targetUID)][0]
            b=[k.getObject() for k in uid_catalog(UID=i.sourceUID)][0]
            print "a=", a.title_or_id(), "b=", b.title_or_id()
            res.append((a,b))
        return res
    def ref_dexterity(self):
        all_content_brains = self.catalogtool(DomainClassIndexer="OntoClass")
        b=[k.getObject() for k in all_content_brains]
        #back_references
        s=[]
        for i in b:
            s.append(i)
        return s
    def checkSubClassOf(self, obj):
        if isinstance(obj, OntoClass):
            if obj.getSubClassOf():
                return 1
        else:
            return 0




class class_add(BrowserView):
    template = ViewPageTemplateFile('templates/class_add.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()

    def getContextClass(self,context, request):
        return viewContextClass(context, request)
    def ListDProp(self, ocls):
        return ListDataProp(ocls)

    def dPropRange(self, dprop):
        return DataPropRange(dprop)

    def list_ontologys(self):
        return listontologys()

    def vocabRange(self,ouid):
        return getVocabRange(ouid)

    def __call__(self):
        if self.request.form.has_key("submitted"):
            #print "hhhh"
            postback = True
            form = self.request.form
            # Make sure we had a proper form submit, not just a GET request
            submitted = form.get('submitted', False)
            save_button = form.get('form.button.Save', False)
            cancel_button = form.get('form.button.Cancel', False)
            #print "submitted=",submitted
            #print "save_button=",save_button
            #print "cancel_button=",cancel_button
            if submitted and save_button:
                fields={}
                context_uid = form['context_uid']
                ind_id = form['ind_id']
                title = form['title']
                container=self.context
                ind = container.invokeFactory('OntoIndividual', id=ind_id, title=title)
                #self.catalogtool.refreshCatalog()
                container = [i.getObject() for i in self.catalogtool.searchResults({'id': ind})][0]
                container.setSubClassOf([context_uid])                
                for i in form.keys():
                    #print i,i[0:4], i[4:],form[i]
                    if i[0:4] == "sel_" and form[i]:
                        range_value = form[i]
                        id_prop = container.invokeFactory('IndObjectProperty', id=ind_id+"_"+i[4:], title=i[4:])
                        prop = [item.getObject() for item in self.catalogtool.searchResults({'id': id_prop})][0]
                        r=[]
                        #print 'field=',i[4:], prop 
                        r.append(form[i])
                        prop.setRange(r)
                self.catalogtool.refreshCatalog()        
                # Update the acquire-roles setting
                # Other buttons return to the sharing page

                #result = [i.getObject() for i in catalog.searchResults({'id': ind})][0]
        else:
            return self.template()
   
    def getClassParentsList(self,nameclass):
        return ClassParentsList(nameclass)

    def getParentsList(self,context):
        return ParentsList(context)
        
    def getOPropByParent(self, name):
        return ObjPropByParent(name)

      
class subclass_add(BrowserView):
    template = ViewPageTemplateFile('templates/subclass_add.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=self.getContextClass(context, request)
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()

    def getContextClass(self,context, request):
        return viewContextClass(context, request)

    def ListDProp(self, ocls):
        return ListDataProp(ocls)

    def dPropRange(self, dprop):
        return DataPropRange(dprop)

    def list_ontologys(self):
        return listontologys()

    def vocabRange(self,ouid):
        return getVocabRange(ouid)

    def __call__(self):
        if self.request.form.has_key("submitted"):
            #print "hhhh"
            postback = True
            form = self.request.form
            # Make sure we had a proper form submit, not just a GET request
            submitted = form.get('submitted', False)
            save_button = form.get('form.button.Save', False)
            cancel_button = form.get('form.button.Cancel', False)
            #print "submitted=",submitted
            #print "save_button=",save_button
            #print "cancel_button=",cancel_button
            if submitted and save_button:
                fields={}
                context_uid = form['context_uid']
                ind_descript = form['descript']
                title = form['title']
                container=self.context
                ind = container.invokeFactory('OntoClass', id=getNewId(), title=title)
                container = [i.getObject() for i in self.catalogtool.searchResults({'id': ind})][0]
                container.setSubClassOf([context_uid])
                container.setDescription(ind_descript)
                dictop=getObjPropByParent(container.title_or_id())
                if dictop:
                    for i in dictop.keys():
                        print 'i=',i
                        id_prop = container.invokeFactory('ClassObjectProperty', id=getNewId(), title=i)
                """
                        #id_prop = container.invokeFactory('ClassObjectProperty', id=ind_id+"_"+i[4:], title=title)
                        prop = [item.getObject() for item in self.catalogtool.searchResults({'id': id_prop})][0]
                        r=[]
                        #print 'field=',i[4:], prop 
                        r.append(form[i])
                        prop.setRange(r)
                        r=[]
                        #print 'field=',i[4:], prop 
                        if subprop:
                            r.append(subprop.UID())
                            prop.setObjectProperty(r)

                    if i[0:3] == "dp_" and form[i]:
                        id_subprop=i[3:]
                        if id_subprop in self.context.keys():
                            subprop=self.context[id_subprop]
                          else  title=subprop.title_or_id()
                        :
                            title=i[3:]
                            subprop=0
                        range_value = form[i]
                """
                if self.context.getDataProps():
                    #ListDataProp(container.title_or_id()):
                    for i in self.context.getDataProps():
                        print 'oprop=', i.title_or_id()
                        id_prop = container.invokeFactory('ClassDataProperty', id=getNewId(), title=i.Title())
                        prop = [item.getObject() for item in self.catalogtool.searchResults({'id': id_prop})][0]
                """
                        prop.setValue(form[i])
                        if subprop:
                            r=[]
                            #print 'field=',i[4:], prop 
                            r.append(subprop.UID())
                            prop.setDataProperty(r)
                """
                self.catalogtool.refreshCatalog()
                self.request.response.redirect(self.context.absolute_url())        
                # Update the acquire-roles setting
                # Other buttons return to the sharing page

                #result = [i.getObject() for i in catalog.searchResults({'id': ind})][0]
        else:
            return self.template()
           
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
            

        
   
    def json_call(self):
        self.onto_data = json.dumps(self.listontologys())
        #return self.onto_data
        return json.dumps(self.onto_data)

    def getClassParentsList(self,nameclass):
        return ClassParentsList(nameclass)

    def getParentsList(self):
        #for i in ClassParentsList(self.context):print "getParentsList cls=", i
        return ClassParentsList(self.context.title_or_id())
        
    def getOPropByParent(self, name):
        return ObjPropByParent(name)

    def ListDProp(self, ocls):
        return ListDataProp(ocls.title_or_id())

    def dPropRange(self, dprop):
        return DataPropRange(dprop)
      







##code-section module-footer #fill in your manual code here
##/code-section module-footer











##code-section module-footer #fill in your manual code here
##/code-section module-footer


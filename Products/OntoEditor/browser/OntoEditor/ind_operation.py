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



class ind_view(BrowserView):
    #template = ViewPageTemplateFile('templates/ind_view.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()

        #def __call__(self):
        #return self.template

    def getAllPropList(self):
        #OntoObjects1 = self.context.listFolderContents(contentFilter={'portal_type' : 'IndDataProperty'})
        #OntoObjects2 = self.context.listFolderContents(contentFilter={'portal_type' : 'IndObjectProperty'})
        #return {'DataProp':OntoObjects1,'ObjProp':OntoObjects2} 
        return ObjectAllPropList(self.context.UID())
    def dPropRange(self, dprop):
        if dprop.getRange():
            return dprop.getRange()
        else:
            return 0
   



class ind_add(BrowserView):
    template = ViewPageTemplateFile('templates/ind_add.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=self.getContextClass(context, request)
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()

    def getContextClass(self,context, request):
        return viewContextClass(context, request)

    def ListIndKindOf(self):
        if self.context.getHasKindOf():
            cls=self.context.getHasKindOf()
            if isinstance(cls, list):
               cls1=cls[0]
            if isinstance(cls, int):
               cls1=cls
            ref = backref(cls1)
            rf =[item for item in ref if item.meta_type == 'OntoIndividual']
            return rf
        else:
            return []
   

    """
    def ListDProp(self, ocls):
        print 'ocls=',ocls,ocls.title_or_id()
        return ListDataProp(ocls.title_or_id())
    """

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
                ind = container.invokeFactory('OntoIndividual', id=getNewId(), title=title)
                container = [i.getObject() for i in self.catalogtool.searchResults({'id': ind})][0]
                container.setSourceClass([context_uid])
                container.setDescription(ind_descript)                
                for i in form.keys():
                    if i[0:4] == "sel_" and form[i]:
                        id_subprop=i[4:]
                        if id_subprop in self.context.keys():
                            subprop=self.context[id_subprop]
                            title=subprop.title_or_id()
                        else:
                            title=i[4:]
                            subprop=0
                        range_value = form[i]
                        id_prop = container.invokeFactory('IndObjectProperty', id=getNewId(), title=title)
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
                            title=subprop.title_or_id()
                        else:
                            title=i[3:]
                            subprop=0
                        range_value = form[i]
                        id_prop = container.invokeFactory('IndDataProperty', id=getNewId(), title=title)
                        prop = [item.getObject() for item in self.catalogtool.searchResults({'id': id_prop})][0]
                        prop.setValue(form[i])
                        if subprop:
                            r=[]
                            #print 'field=',i[4:], prop 
                            r.append(subprop.UID())
                            prop.setDataProperty(r)
                self.catalogtool.refreshCatalog()
                #return self.request.RESPONSE.redirect(self.context.absolute_url()+'/folder_content')        
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
        """
    def getClassParentsList(self,nameclass):
        print nameclass
        cls=ClassParentsList(nameclass)
        cls.append(nameclass)
        return cls
        """

    def getParentsList(self):
        cls=ClassParentsList(self.context.title_or_id())
        cls.append(self.context)
        return cls
        
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


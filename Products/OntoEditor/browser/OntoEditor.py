# -*- coding: utf-8 -*-
#
# File: GuiEditor.py
#
# Copyright (c) 2011 by []
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
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
import json
from Products.CMFCore.utils import getToolByName
from AccessControl.SecurityManagement import newSecurityManager, noSecurityManager


class GuiEditor1(BrowserView):



    """

    """



    ##code-section class-header_OntoEditor #fill in your manual code here
    ##/code-section class-header_OntoEditor
    template = ViewPageTemplateFile('templates/OntoEditor.pt')
    def __init__(self, context,request):
        self.context=context
        self.request=request
        self.urltool = getToolByName(self, "portal_url")
        self.catalogtool = getToolByName(self, "portal_catalog")
        self.portal = self.urltool.getPortalObject()
    def __call__(self):
        #pdb.set_trace()
        if hasattr(self.request, 'mode') and self.request['mode']=='addcontent':
            mode=self.get_fromreq('mode')
            contenttype=self.get_fromreq('contenttype')
            id=self.get_fromreq('id')
            title=self.get_fromreq('title')
            desc=self.get_fromreq('desc')
            parent_class=self.get_fromreq('par')
            return self.addcontent(contenttype, id, title,desc, parent_class)
        if hasattr(self.request, 'mode') and self.request['mode']=='addobjprop':
            mode=self.get_fromreq('mode')
            contenttype=self.get_fromreq('contenttype')
            id=self.get_fromreq('id')
            title=self.get_fromreq('title')
            desc=self.get_fromreq('desc')
            parent_class=self.get_fromreq('par')
            return self.addobjprop(contenttype, id, title,desc, parent_class)
        if hasattr(self.request, 'listonto'):
            if self.request['listonto']=='all':
                self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
                response_body = self.list_ontologys()
                response_http = json.dumps(response_body)
                self.request.response.setHeader('content-length', len(response_http))
                return response_http
        if hasattr(self.request, 'ontovalue'):
            onto_id=self.request['ontovalue']
            obj_list=self.catalogtool.searchResults(Title=onto_id)
            onto=self.getOnto(onto_id)
            #if len(obj_list)>0:
            #    onto=[i.getObject() for i in obj_list][0]
            #    onto_data = onto.getInfo()
            #else:
            #    onto_data = None
            onto_data = onto.getInfo()    
            self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
            response_body = onto_data
            response_http = json.dumps({'ontology':response_body})
            self.request.response.setHeader('content-length', len(response_http))
            return response_http
        if hasattr(self.request, 'ontology'):
            #pdb.set_trace()
            onto_id=self.request['ontology']
            onto_obj=self.getOnto(onto_id)
            ontodata=None
            if hasattr(self.request, 'ontoitem'):
               ontoitem=self.request['ontoitem']
               result=onto_obj.getInfo()[ontoitem]
               onto_data ={ontoitem: result}
            self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
            response_body = onto_data
            response_http = json.dumps(response_body)
            self.request.response.setHeader('content-length', len(response_http))
            return response_http              
            
        #self.onto_data = json.dumps({'ontology': self.context.getInfo()})
        #self.new_oe_js = 'var ontoEditor; $(function() { try { ontoEditor = new OntologyEditor('+self.onto_data+'); } catch(e) {}; });'

        return self.template()
        
    def getOnto(self, onto):
        #obj_list=self.catalogtool.searchResults(Title=onto)
        obj_list=[i.getObject() for i in self.catalogtool.searchResults(portal_type="Ontology")]
        if obj_list:
            for item in obj_list:
                if item.title_or_id()==onto:
                    return item
        
        
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
            f[str(i.getTitle())]=i.getId()
        return f    
    def json_call(self):
        self.onto_data = json.dumps(self.listontologys())
        #return self.onto_data
        return json.dumps({u'test': u'testString'})









##code-section module-footer #fill in your manual code here
##/code-section module-footer



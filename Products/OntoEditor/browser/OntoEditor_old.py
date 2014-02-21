# -*- coding: utf-8 -*-
#
# File: OntoEditor.py
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

#import pdb
from zope import interface
from zope import component
from Products.CMFPlone import utils
from Products.Five import BrowserView
from zope.interface import implements
from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin
from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
    ReferenceBrowserWidget
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
import json
from Products.CMFCore.utils import getToolByName
from AccessControl.SecurityManagement import newSecurityManager, noSecurityManager


class OntoEditor(BrowserView):



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
        self.data={}
    def __call__(self):
        #pdb.set_trace()
        if hasattr(self.request, 'mode') and self.request['mode']=='addcontent':
            self.get_request_data()
            obj=self.addcontent()
            obj=self.addOntoClass(obj)
            if obj:
                response = self.request.response
                response.setHeader('Content-Type','text/html')
                html=self.data['owltype']+"<p> created</p>"
                return html.encode('utf8')
            else:
                response = self.request.response
                response.setHeader('Content-Type','text/html')
                html=self.data['owltype']+"<p> not created</p>"
                return html.encode('utf8')
            return True
        if hasattr(self.request, 'getcontent') and self.request['mode']=='ontology':
            if isinstance(self.context, 'Ontology'):
                return self.context
            if isinstance(self.context, 'Folder'):
                brain=self.context.listFolderContents(contentFilter={"portal_type" : "Ontology"})
            return True
        else:
            self.onto_data = json.dumps({'ontology': self.context.getInfo()})
            self.new_oe_js = 'var data1='+self.onto_data+';'
            return self.template()
    def get_request_data(self):
        self.data={}
        self.data['mode']=self.get_fromreq('mode')
        self.data['contenttype']=self.get_fromreq('contenttype')
        self.data['id']=self.get_fromreq('id')
        self.data['title']=self.get_fromreq('title')
        self.data['desc']=self.get_fromreq('desc')
        
        
    def get_fromreq(self, name):
        if hasattr(self.request, name):
            return self.request[name]
        else:
            return None


    def addcontent():
        """
        add new object for ontoogy type
        """
        user = self.context.getWrappedOwner()
        newSecurityManager(self.context, user)
        owltype=self.data['owltype']
        id=self.data['id']
        title=self.data['title']
        desc=self.data['desc']
        parent_class=self.data['parent_class']
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
            self.catalogtool.refreshCatalog()
            return obj
        else:
            return None

    def addOntoClass(self, obj):
        parent_class=self.get_fromreq('par')
        if parent_class:
            if hasattr(self.context, parent_class):
                target=getattr(self.context, parent_class)
                save_list=[]
                save_list.append(target.UID())
                obj.setSubClassOf(save_list)
        return obj
    def addObjectProperty(self, obj):
        domen=self.get_fromreq("domen")
        range=self.get_fromreq("range")
        spof=self.get_fromreq("spof")
        if domen:
            if hasattr(self.context, domen):
                target=getattr(self.context, domen)
                save_list=[]
                save_list.append(target.UID())
                obj.setDomen(save_list)
        if range:
            if hasattr(self.context, range):
                target=getattr(self.context, range)
                save_list=[]
                save_list.append(target.UID())
                obj.setRange(save_list)
                
        if spof:
            if hasattr(self.context, range):
                target=getattr(self.context, range)
                save_list=[]
                save_list.append(target.UID())
                obj.setSubPropertyOf(save_list)         
        return obj            
            










##code-section module-footer #fill in your manual code here
##/code-section module-footer



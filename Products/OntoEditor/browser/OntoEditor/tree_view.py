# -*- coding: utf-8 -*-
#
# File: tema_view.py
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
from Products.CMFCore.utils import getToolByName
from zope.interface import implements
from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin
from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import  ReferenceBrowserWidget
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
import json

def subclasses(context,parent_name):
    urltool = getToolByName(context,"portal_url")
    catalogtool = getToolByName(context, "portal_catalog")
    portal = urltool.getPortalObject()
    refCatalog = getToolByName(portal, 'reference_catalog')
    uid_catalog=getToolByName(portal, 'uid_catalog')
                
    if hasattr(context,parent_name):
        par=getattr(context,parent_name)
    else:
        par=None
    if par:
        #refs = self.refCatalog.getReferences(par, 'sub_class_of')
        brefs=refCatalog.getBackReferences(par)
        l=[uid_catalog(UID=i.sourceUID) for i in refCatalog.getBackReferences(par)]
        targ_list=[refCatalog.lookupObject(i.sourceUID) for i in brefs]
        return targ_list
    else:
        return None
class recurse(BrowserView):
    recurse=ViewPageTemplateFile('templates/recurse.pt')
    def __init__(self,context, request):
        self.context=context
        self.request=request
    def __call__(self):
        #pdb.set_trace()
        if hasattr(self.request, 'node'):
            self.parent_name=getattr(self.request,'node')
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html=self.recurse(node=self.parent_name, list_obj=self.ul_content())
            return html.encode('utf8')
        
    def ul_content(self):
        l=subclasses(self.context, self.parent_name)
        return l
         
        
    
class tree_view(BrowserView):



    """

    """
    template = ViewPageTemplateFile('templates/tree_view.pt')
    def __init__(self, context, request):
        self.context=context
        self.request=request
        self.urltool = getToolByName(self, "portal_url")
        self.catalogtool = getToolByName(self, "portal_catalog")
        self.portal = self.urltool.getPortalObject()
        self.refCatalog = getToolByName(self.portal, 'reference_catalog')
        self.uid_catalog=getToolByName(self.portal, 'uid_catalog')
    def __call__(self):
        if hasattr(self.request, 'test'):
            response = self.request.response
            response.setHeader('Content-Type','application/json')
            a=self.json_call()
            return a

        if hasattr(self.request, 'node'):
            
            parent_name=getattr(self.request,'node')
            subclasses(self.context, parent_name)    
        else:
            return self.template()
    
    
    def list_subclasses(self, parent_name):
        """        
        if hasattr(self.context,parent_name):
            par=getattr(self.context,parent_name)
        else:
            par=None
        if hasattr(self.request,'mode'):
            mode=getattr(self.request,'mode')
        else:
            mode=None
        if par:
            #refs = self.refCatalog.getReferences(par, 'sub_class_of')
            brefs=self.refCatalog.getBackReferences(par)
            l=[self.uid_catalog(UID=i.sourceUID) for i in self.refCatalog.getBackReferences(par)]
            #for i in brefs:
            #print refCatalog.lookupObject(i.targetUID), refCatalog.lookupObject(i.sourceUID)
            targ_list=[(self.refCatalog.lookupObject(i.sourceUID)) for i in brefs]
            #obj_list=[k.getObject() for k in targ_list]
            #ret="<ul>"
            #    ret=ret+"<li>"+j.title_or_id()+"</li>"
            #ret=ret+"</ul>"    
            if mode:
                
                if targ_list:
                    obj_list=[k.getObject() for k in targ_list]
                    ret="<ul>"
                    for j in obj_list:
                        ret=ret+"<li>"+j.title_or_id()+"</li>"
                    ret=ret+"</ul>"
                else:
                    ret="<p>kkkk<.p>"
                response = self.request.response
                response.setHeader('Content-Type','text/html')
                return ret
            else:
                return targ_list
        else:
            return None
        """
        return subclasses(self.context, parent_name)
  
    
        
    def view_location(self):
        return 'var location="'+str(self.portal.absolute_url()+'/'+__name__)+'"'
    def json_call(self):
        res=[]
        a1={"text": "1. Review of existing structures",	"expanded": "true","children":[{"text": "1.1 jQuery core"}, {"text":"1.2 metaplugins"}]}
        a2={"text": "2. Wrapper plugins"}
        a3={"text": "3. Summary"}
        a4={"text": "4. Questions and answers"}
        res.append(a1)
        res.append(a2)
        res.append(a3)
        res.append(a4)
        self.onto_data = json.dumps(res)
        return self.onto_data
    ##code-section class-header_tema_view #fill in your manual code here
    ##/code-section class-header_tema_view










##code-section module-footer #fill in your manual code here
##/code-section module-footer

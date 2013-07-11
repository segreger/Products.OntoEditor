# -*- coding: utf-8 -*-
#
# File: ontoeditor_tab.py
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


from zope import interface

from zope import component

from Products.CMFPlone import utils

from Products.Five import BrowserView

from Products.CMFCore.utils import getToolByName

from zope.interface import implements

from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin

from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
    ReferenceBrowserWidget
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile


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

class recurse_tab(BrowserView):
    recurse=ViewPageTemplateFile('templates/recurse_tab.pt')
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
        else:
            self.parent_name='thing'
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html=self.recurse(node=self.parent_name, list_obj=self.ul_content())
            return html.encode('utf8')
        
    def ul_content(self):
        l=subclasses(self.context, self.parent_name)
        return l
         








class ontoeditor_tab(BrowserView):

    def __init__(self, context, request):
        self.context=context
        self.request=request
        self.valuid=None
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()
        self.disclist=[i.getObject() for i in self.context.portal_catalog.searchResults(portal_type='OntoClass')]
        #self.speclist=[i.getObject() for i in self.context.portal_catalog.searchResults(portal_type='Specialty')]
        self.ontofolder=[i.getObject() for i in self.catalogtool.searchResults(portal_type='Ontology')]
        self.portal.acl_users.credentials_cookie_auth.login_path = ""

    def obj_fold(self):
        ref_folder=self.context.getDirectoryEntry()
        obj=self.context.unrestrictedTraverse(ref_folder)
        return obj
    def list_tab(self):
        return ('Classes','Properties','Individuals')

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
  
    
        

    """

    """



    ##code-section class-header_curse_view #fill in your manual code here
    ##/code-section class-header_curse_view










##code-section module-footer #fill in your manual code here
##/code-section module-footer


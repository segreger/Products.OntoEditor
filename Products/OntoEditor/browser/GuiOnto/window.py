# -*- coding: utf-8 -*-
__author__ = """unknown <unknown>"""
__docformat__ = 'plaintext'

import pdb
from zope import interface
from zope import component
from Products.CMFPlone import utils
from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName
from zope.interface import implements
from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin
from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import  ReferenceBrowserWidget
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
import json
def baskref(context):
    par=context
    refCatalog = getToolByName(portal, 'reference_catalog')
    uid_catalog=getToolByName(portal, 'uid_catalog')
    #refs = refCatalog.getReferences(par.UID(), 'sub_class_of')
    bref=refCatalog.getBackReferences(par)

def ObjByValUID(valuid):
    if valuid:
        list_obj=self.context.portal_catalog.searchResults(UID=valuid)
        if list_obj[0]:
            objid=list_obj[0].getObject()
            return objid
        else:
            return None
    else:
        return None
def get_links(context):
    brain=context.listFolderContents(contentFilter={"portal_type" : "IndObjectProperty"})
    #pdb.set_trace()
    panels=[]
    for i in brain:
        if i.getRange():
            l_obj=i.getRange()
            p_obj=i.getObjectProperty()
            tpl=p_obj.getRange().getAddress()
            list_pan=[]
            list_pan.append(l_obj)
            list_pan.append(tpl)
            panels.append(list_pan)
               
    return panels    
class window(BrowserView):
    render_tpl=ViewPageTemplateFile('templates/window.pt')
    def __init__(self,context, request):
        self.context=context
        self.request=request
        self.title=self.context.title_or_id()
    def __call__(self):
        widgets=get_links(self.context)
        #pdb.set_trace()
        response = self.request.response
        response.setHeader('Content-Type','text/html')
        if widgets:
            html=self.render_tpl(title=self.title, objs=widgets)
        else:
            html=self.render_tpl(title=self.title)
        return html.encode('utf8')
    """    
    def get_widgets(self):
        brain=self.context.listFolderContents(contentFilter={"portal_type" : "IndObjectProperty"})
        #pdb.set_trace()
        panels=[]
        for i in brain:
            if i.getRange():
                l_obj=i.getRange()
                p_obj=i.getObjectProperty()
                tpl=p_obj.getRange().getAddress()
                list_pan=[]
                list_pan.append(l_obj)
                list_pan.append(tpl)
                panels.append(list_pan)
                
        return panels
    def get_link(self):
        brain=self.context.listFolderContents(contentFilter={"portal_type" : "IndObjectProperty"})
        #pdb.set_trace()
        panels=[]
        for i in brain:
            if i.getRange():
                l_obj=i.getRange()
                list_pan=[]
                panels.append(l_obj)
                
        return panels
    """    
    def get_list(self):
        pass
class hiperlink(BrowserView):
    render_tpl=ViewPageTemplateFile('templates/hiperlink.pt')
    def __init__(self,context, request):
        self.context=context
        self.request=request
        self.title=self.context.title_or_id()
    def __call__(self):
        response = self.request.response
        response.setHeader('Content-Type','text/html')
        html=self.render_tpl(title=self.title)
        return html.encode('utf8') 
class panel(BrowserView):
    render_tpl=ViewPageTemplateFile('templates/panel.pt')
    def __init__(self,context, request):
        self.context=context
        self.request=request
        self.title=self.context.title_or_id()
    def __call__(self):
        widgets=get_links(self.context)
        response = self.request.response
        response.setHeader('Content-Type','text/html')
        html=self.render_tpl(objs=widgets)
        return html.encode('utf8')          
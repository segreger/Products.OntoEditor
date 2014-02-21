# -*- coding: utf-8 -*-
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
from  zope.component.hooks import getSite
from class_utility import *

class gene_view(BrowserView):
    template = ViewPageTemplateFile('templates/gene_view.pt')
 
    def __call__(self):
        return self.template()
    def __init__(self, context, request):
        #self.context=self.viewContextClass(context, request)
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        #self.portal = urltool.getPortalObject()  

    def getContextClass(self,context, request):
        return viewContextClass(context, request)

    def ListItems(self):
        return getListOntoObject(self.context.UID())
    def ItemContent(self):
        return ObjectAllPropList(self.context.UID())

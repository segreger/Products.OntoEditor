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
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile


class gene_view(BrowserView):
    #template = ViewPageTemplateFile('templates/gene_view.pt')
    
    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()

    def __call__(self):
        pass


    def getParent(self, item_name):
    	"""
    	возвращает родительский класс
    	"""
    	tec=getObjectsByName(self, byType=item_name)
        if tec.getSubClassOf():
            item=tec.getSubClassOf()[0]
            return item
        else:
            return None

    def ListOntoClasses(self):
    	return self.context.getClasses()
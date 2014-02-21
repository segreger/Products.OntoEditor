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
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
import json
from class_utility import *

      
    
class listontoitem_view(BrowserView):



    """

    """
    template = ViewPageTemplateFile('templates/listontoitem_view.pt')
    def __init__(self, context, request):
        self.context=context
        self.request=request
        self.urltool = getToolByName(self, "portal_url")
        self.catalogtool = getToolByName(self, "portal_catalog")
        self.portal = self.urltool.getPortalObject()
        self.refCatalog = getToolByName(self.portal, 'reference_catalog')
        self.uid_catalog=getToolByName(self.portal, 'uid_catalog')
        
    def __call__(self):
        self.context=self.getContextClass(self.context, self.request)
        return self.template()
    def getContextClass(self,context, request):
        return viewContextClass(context, request)
    

    def ListItems(self):
        return getListOntoObject(self.context.UID())
    def ItemContent(self, ouid):
        return ObjectAllPropList(ouid)









##code-section module-footer #fill in your manual code here
##/code-section module-footer

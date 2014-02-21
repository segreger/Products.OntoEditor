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
from  zope.component.hooks import getSite
from class_utility import *

class listitem_view(BrowserView):
    template = ViewPageTemplateFile('templates/listitem_view.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')


    def __init__(self, context, request):
        #self.context=self.viewContextClass(context, request)
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()  

    def __call__(self):
        return self.template()
    def getContextClass(self,context, request):
        return viewContextClass(context, request)

    def ListItems(self):
        return getListOntoObject(self.context.UID())
    def ItemContent(self):
        return ObjectAllPropList(self.context.UID())


##code-section module-footer #fill in your manual code here
##/code-section module-footer


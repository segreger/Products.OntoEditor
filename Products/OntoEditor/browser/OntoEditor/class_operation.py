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
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.site.hooks import getSite
from class_utility import *

class class_view(BrowserView):
    #template = ViewPageTemplateFile('templates/class_view.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')


    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()  

    def getParentsList(self):
        return ParentsList(self.context)


    def ObjPropByParent(self, nameclass):
        return getObjPropByParent(nameclass)


    def vocabRange(self,ouid):
        return getVocabRange(ouid)

    def ListDProp(self, ocls):
        return ListDataProp(ocls)
        
    def dPropRange(self, dprop):
        return DataPropRange(dprop)
    def getBackRef(self):
        return backref(self.context)


class class_add(BrowserView):
    template = ViewPageTemplateFile('templates/ind_add.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()

    def ListDProp(self, ocls):
        return ListDataProp(ocls)

    def dPropRange(self, dprop):
        return DataPropRange(dprop)

    def list_ontologys(self):
        return listontologys()

    def vocabRange(self,ouid):
        return getVocabRange(ouid)

    def __call__(self):
        if self.request.form.has_key("submitted"):
            print "hhhh"
            postback = True
            form = self.request.form
            # Make sure we had a proper form submit, not just a GET request
            submitted = form.get('submitted', False)
            save_button = form.get('form.button.Save', False)
            cancel_button = form.get('form.button.Cancel', False)
            print "submitted=",submitted
            print "save_button=",save_button
            print "cancel_button=",cancel_button
            if submitted and save_button:
                fields={}
                context_uid = form['context_uid']
                ind_id = form['ind_id']
                title = form['title']
                container=self.context
                ind = container.invokeFactory('OntoIndividual', id=ind_id, title=title)
                #self.catalogtool.refreshCatalog()
                container = [i.getObject() for i in self.catalogtool.searchResults({'id': ind})][0]
                container.setSubClassOf([context_uid])                
                for i in form.keys():
                    print i,i[0:4], i[4:],form[i]
                    if i[0:4] == "sel_" and form[i]:
                        range_value = form[i]
                        id_prop = container.invokeFactory('IndObjectProperty', id=ind_id+"_"+i[4:], title=i[4:])
                        prop = [item.getObject() for item in self.catalogtool.searchResults({'id': id_prop})][0]
                        r=[]
                        print 'field=',i[4:], prop 
                        r.append(form[i])
                        prop.setRange(r)
                self.catalogtool.refreshCatalog()        
                # Update the acquire-roles setting
                # Other buttons return to the sharing page

                #result = [i.getObject() for i in catalog.searchResults({'id': ind})][0]
        else:
            return self.template()
   
    def getClassParentsList(self,nameclass):
        return ClassParentsList(nameclass)

    def getParentsList(self):
        return ParentsList(self.context)
        
    def getOPropByParent(self, name):
        return ObjPropByParent(name)

    def ListDProp(self, ocls):
        return ListDataProp(ocls)

    def dPropRange(self, dprop):
        return DataPropRange(dprop)
      





##code-section module-footer #fill in your manual code here
##/code-section module-footer











##code-section module-footer #fill in your manual code here
##/code-section module-footer


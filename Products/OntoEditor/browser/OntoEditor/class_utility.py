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

def getObjPropByParent(nameclass):
    """
    Возвращает словарь {title, list object for Range} всех ClassObjrctProperty для лерева классов
    """
    op={}
    context_class=getClassByName(nameclass)
    par_list=getParentsList(nameclass),append(context_class)
    for i in par_list:
        op1=dict([(j.getTitle(), j.getRange()[0].title_or_id()) for j in i.getObjectProps() if j.getRange()])
        op.update(op1)
    return op
def ParentsList(context):
    p_list=[]
    tec=context
    item=context
    while tec.getSubClassOf():
        item=tec.getSubClassOf()[0]
        p_list.append(item)
        p_list.extend(KindList(item))
        p_list.extend(MetatypeList(item))
        tec=item
    p_list.append(context)
    p_list.extend(KindList(context))
    p_list.extend(MetatypeList(context))
    return p_list 

def KindList(context):
    p_list=[]
    tec=context
    item=context
    while tec.getHasKindOf():
        item=tec.getHasKindOf()[0]
        p_list.append(item)
        tec=item
    return p_list

def MetatypeList(context):
    p_list=[]
    tec=context
    item=context
    while tec.getHasMetatype():
        item=tec.getHasMetatype()[0]
        p_list.append(item)
        tec=item
    return p_list

def ClassParentsList(nameclass):
    p_list=[]
    tec=getClassByName(nameclass)
    while tec and tec.getSubClassOf():
        item=tec.getSubClassOf()[0]
        p_list.append(item)
        tec=item
    return p_list

def ListDataProp(ocls):
    dp=ocls.getDataProps()
    if dp:
        return dp
    else:
        return 0

def DataPropRange(dprop):
        
    if dprop.getRange():
        return dprop.getRange()[0]
    else:
        return 0

def listontologys():
    site = getSite()
    catalogtool = getToolByName(site, 'portal_catalog')
    l=[i.getObject() for i in catalogtool.searchResults(portal_type="Ontology")]
    f={}
    for i in l:
        f[str(i.title_or_id())]=i.getId()
    return f 

def getOnto(onto):
    site = getSite()
    catalogtool = getToolByName(site, 'portal_catalog')
    #obj_list=self.catalogtool.searchResults(Title=onto)
    obj_list=[i.getObject() for i in catalogtool.searchResults(portal_type="Ontology")]
    #pdb.set_trace()
    if obj_list:
        for item in obj_list:
            if item.title_or_id()==onto:
                return item
def getClassByName(name):
    #obj_list=self.catalogtool.searchResults(Title=onto)
    site = getSite()
    catalogtool = getToolByName(site, 'portal_catalog')
    obj_list=[i.getObject() for i in catalogtool.searchResults(portal_type="OntoClass")]
    if obj_list:
        for item in obj_list:
            if item.title_or_id()==name:
                return item

def getVocabRange(ouid):
    terms = {}
    site = getSite()
    refCatalog = getToolByName(site, 'reference_catalog')
    uid_catalog = getToolByName(site, 'uid_catalog')
    #список индивидуалов
    if ouid:
        itemUID=ouid
        list_rangeitem = [k.getObject() for k in uid_catalog(UID=itemUID)]
        if list_rangeitem:
            rangeitem=list_rangeitem[0]
            #print "rangeitem=",rangeitem
            if rangeitem.getRange():
                crange=rangeitem.getRange()[0].UID()
                references = refCatalog.getBackReferences(crange, relationship="source_class")
                inds = [ref.getSourceObject() for ref in references]
                for brain in inds:
                    terms[brain.title_or_id()]=brain.UID()
                        
    return terms

def backref(context):
    site = getSite()
    refCatalog = getToolByName(site, 'reference_catalog')
    uid_catalog = getToolByName(site, 'uid_catalog')
    par=context
    #refs = refCatalog.getReferences(par.UID(), 'sub_class_of')
    bref=refCatalog.getBackReferences(par)
    #print bref
    #l=[uid_catalog(UID=i.sourceUID) for i in refCatalog.getBackReferences(par)]
    #for i in bref:
    #    print refCatalog.lookupObject(i.sourceUID).title_or_id() 
    return [ref.getSourceObject() for ref in bref]
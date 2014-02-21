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
from zope.component.hooks import getSite
import random
from Products.OntoEditor.OntoClass import OntoClass

def ClassParentsList(oclass):
    p_list=[]
    tec=oclass
    p_list=MetatypeList(oclass)
    #tec=getClassByName(nameclass)[0]
    #tec=getClassByName(nameclass)[0]
    while tec.getSubClassOf():
        if isinstance(tec, OntoClass):
            item=tec.getSubClassOf()[0]
            #print "ClassParentsList=+",item
            p_list.append(item)
            tec=item
        else:
            pass
    return p_list
def KindList(context):
    p_list=[]
    tec=context
    item=context
    while isinstance(tec, OntoClass) and tec.getHasKindOf():
        item=tec.getHasKindOf()[0]
        p_list.append(item)
        tec=item
    return p_list

def MetatypeList(context):
    p_list=[]
    tec=context
    item=context
    print "context=", context.title_or_id()
    while tec.getHasMetatype():
        item=tec.getHasMetatype()[0]
        p_list.append(item)
        tec=item
        print "meta=",p_list
    return p_list




def getObjPropByParent(nameclass):
    """
    Возвращает словарь {title, list object for Range} всех ClassObjrctProperty для лерева классов
    """
    #pdb.set_trace()
    op={}
    context_class=getClassByName(nameclass)[0]
    #print "context=", context_class
    parclas_list=ClassParentsList(context_class)
    print 'p1=',parclas_list
    parclas_list.append(context_class)
    print 'p2=',parclas_list
    print "parclas_list=", parclas_list
    if isinstance(parclas_list, list):
        lst=[]
        for j in parclas_list:
            k=j.title_or_id()
            for i in j.getObjectProps():
                if i.getRange():
                    #v=[i,i.getRange()[0]]
                    v=[i,i.getRange()]
                else:
                    v=[i, 0]
                print "k,v=", k,v
                lst.append(v)
    return lst
def ListDataProp(ocls):

    dp=ocls.getDataProps()
    print "ocls=", ocls
    print "dp=", dp
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
def getClassByName(oname):
    #obj_list=self.catalogtool.searchResults(Title=onto)
    site = getSite()
    items=[]
    if not isinstance(oname, unicode):
      oname = unicode(oname, 'utf-8', 'replace')
    catalogtool = getToolByName(site, 'portal_catalog')
    brain=catalogtool.searchResults(portal_type="OntoClass", Title = oname) 
    obj_list=[i.getObject() for i in brain]
    if obj_list:
        return obj_list
    else:
        return 0

def getClassObjectPropertyByName(oname):
    #obj_list=self.catalogtool.searchResults(Title=onto)
    site = getSite()
    items=[]
    if not isinstance(oname, unicode):
      oname = unicode(oname, 'utf-8', 'replace')
    catalogtool = getToolByName(site, 'portal_catalog')
    brain=catalogtool.searchResults(portal_type="ClassObjectProperty", Title = oname) 
    obj_list=[i.getObject() for i in brain]
    if obj_list:
        return obj_list
    else:
        return 0

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

def getListRangeObject(ouid):
    inds=[]
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
                      
    return inds

def ObjectAllPropList(ouid):

    """
    по UID индивидуала возвращает словарь:
    ключ  'DataProp' - список объектов IndDataProperty индивидуала
    ключ  'ObjectProp' - список объектов IndObjectProperty индивидуала
    """
    site = getSite()
    refCatalog = getToolByName(site, 'reference_catalog')
    uid_catalog = getToolByName(site, 'uid_catalog')
    #список индивидуалов
    if ouid:
        itemUID=ouid
        list_rangeitem = [k.getObject() for k in uid_catalog(UID=itemUID)]
        if list_rangeitem:
            rangeitem=list_rangeitem[0]
            OntoObjects1 = rangeitem.listFolderContents(contentFilter={'portal_type' : 'IndDataProperty'})
            OntoObjects2 = rangeitem.listFolderContents(contentFilter={'portal_type' : 'IndObjectProperty'})
            return {'DataProp':OntoObjects1,'ObjProp':OntoObjects2}
        else:
            return 0 
    else:
        return 0

def getListOntoObject(ouid):
    site = getSite()
    refCatalog = getToolByName(site, 'reference_catalog')
    references = refCatalog.getBackReferences(ouid, relationship="source_class")
    inds = [ref.getSourceObject() for ref in references]
    return inds


def backref(context):
    site = getSite()
    refCatalog = getToolByName(site, 'reference_catalog')
    uid_catalog = getToolByName(site, 'uid_catalog')
    par=context
    if par:
        bref=[ref.getSourceObject() for ref in refCatalog.getBackReferences(par)]
        #print par, bref
    else:
        bref=[]
    return bref


def ListFieldTypes(rootfield):
    """
    получает список классов, наследующих класс с именем @rootfield
    """
    if isinstance(getClassByName(rootfield), list):
        cls1=getClassByName(rootfield)[0]
    if isinstance(getClassByName(rootfield), int):
        cls1=getClassByName(rootfield)
    return backref(cls1)



def getNewId():
    """
    """
    # возвращает новый ид для добавления объекта
    str = 'abcdefghijklmnopqastuvwxyzABCDEFGHIJKLMNOPQSTUVWXYZ1234567890'
    nId = [ random.choice(str) for i in xrange(16) ]
    nId = "".join( nId )
    return nId
def back_references(source_object, attribute_name):
    """ Return back references from source object on specified attribute_name """
    catalog = getUtility(ICatalog)
    intids = getUtility(IIntIds)
    result = []
    for rel in catalog.findRelations(
                            dict(to_id=intids.getId(aq_inner(source_object)),
                                 from_attribute=attribute_name)
                            ):
        obj = intids.queryObject(rel.from_id)
        if obj is not None and checkPermission('zope2.View', obj):
            result.append(obj)
    return result
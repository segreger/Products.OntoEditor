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
#import pdb
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
from Products.OntoEditor.OntoClass import OntoClass
import random

def getObjPropByParent(nameclass):
    """
    Возвращает словарь {title, list object for Range} всех ClassObjrctProperty для лерева классов
    """
    #print 'nameclass=',nameclass
    dict_meta={}
    dict_class={}
    dict_par={}
    dict_prop={}
    par_list=[]
    meta_list=[]
    context_class=[]
    context_class.append(getClassByName(nameclass))
    dict_class=ListRangeItems(context_class)
    meta_list=MetatypeList(nameclass)
    if meta_list:
        dict_meta=ListRangeItems(meta_list)
    if ClassParentsList(nameclass):
        par_list=ClassParentsList(nameclass)
        dict_par=ListRangeItems(par_list)
    if par_list and context_class:
        dict_prop=DeleteParentProp(dict_par,dict_class)
    if meta_list and context_class:
        dict_prop=DeleteParentProp(dict_meta, dict_class)
    if context_class and not (par_list or meta_list):
        dict_prop=dict_class
    if par_list and meta_list:
        dict_prop={}
    return dict_prop



def DeleteParentProp(par_prop, class_prop):
    """
    заменяет объектное свойство родителя свойством класса и расширяет словарь родителя словарем класса
    """
    for k,v in class_prop.items():
       par_prop[k]=v
    return par_prop
def ListRangeItems(par_list):
    op={}
    for i in par_list:
        #print 'par_list=',par_list
        if isinstance(i, OntoClass):
            for j in i.ListObjectProps():
                #print unicode(i.title_or_id()), j.absolute_url()
                rangeitem=[]
                rangeitem=[(r.title_or_id(), r.absolute_url()) for r in j.getRange() if j.getRange()]
                op[j.title_or_id()]=rangeitem
                #op[i.title_or_id()+'.'+j.title_or_id()]=rangeitem
            """
            for j in ListDataProp(i.title_or_id()):
                drangeitem=[]
                drangeitem=[(r.title_or_id(), r.absolute_url()) for r in j.getRange() if j.getRange()]
                op[j.title_or_id()]=drangeitem
            """
    return op
def ParentsList(context):
    p_list=[]
    tec=context
    item=context
    if isinstance(tec, OntoClass):    
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
    if isinstance(tec, OntoClass): 
        while tec.getHasKindOf():
            item=tec.getHasKindOf()[0]
            p_list.append(item)
            tec=item
    return p_list

def MetatypeList(nameclass):
    p_list=[]
    tec=getClassByName(nameclass)
    item=tec
    if isinstance(tec, OntoClass) and tec.getHasMetatype():
        """
        while tec.getHasMetatype():
        """    
        item=tec.getHasMetatype()[0]
        #print 'meta=',tec,item
        p_list.append(item)
        tec=item
    return p_list

def ClassParentsList(nameclass):
    p_list=[]

    tec=getClassByName(nameclass)
    p_list.append(tec)
    #print 'nameclass1=',nameclass
    #print 'tec=',tec
    if isinstance(tec, OntoClass) and tec.getSubClassOf():
        """
        while tec and tec.getSubClassOf():
        """
        item=tec.getSubClassOf()[0]
        p_list.append(item)
        tec=item
        print 'item=',item, 'p_list=', p_list
    return p_list

def ListDataProp(nameclass):
    print 'nameclass=',nameclass
    ocls=getClassByName(nameclass)
    dp=''
    if ocls:
        dp=ocls.getDataProps()
        print 'dp=',dp
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
    #print "onto=", onto
    if obj_list:
        for item in obj_list:
            if item.getId()==onto:
                #print 'item=', item.getId()
                return item
        else:
            return 0
def getClassByName(name):
    #obj_list=self.catalogtool.searchResults(Title=onto)
    site = getSite()
    catalogtool = getToolByName(site, 'portal_catalog')
    obj_list=[i.getObject() for i in catalogtool.searchResults({'Title':name, 'portal_type':"OntoClass"})]
    if obj_list:
        return obj_list[0]
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

def SubClassRef(context, name_ref):
    ref={'subclass':'sub_class_of', 'ind':'source_class'}
    site = getSite()
    out=[]
    refCatalog = getToolByName(site, 'reference_catalog')
    uid_catalog = getToolByName(site, 'uid_catalog')
    item=context
    references = refCatalog.getBackReferences(item.UID(), relationship=ref[name_ref])
    #references = refCatalog.getBackReferences(item.UID(), relationship=ref['name_ref'])
    out = [ref.getSourceObject() for ref in references]
    """
    cls = [ref.getSourceObject() for ref in references]

    refs = refCatalog.getReferences(item, ref[name_ref'])
    for i in refs:
        if i.targetUID == item.UID():
            out.append[item]
    """
    return out
def MetaClassRef(classname, ontoname):
    site = getSite()
    #print 'classname=',classname, 'ontoname==', ontoname
    out=[]
    cls=getClassByNamePath(classname, ontoname)
    refCatalog = getToolByName(site, 'reference_catalog')
    uid_catalog = getToolByName(site, 'uid_catalog')
    references = refCatalog.getBackReferences(cls.UID(), relationship="has_metatype")
    out = [ref.getSourceObject() for ref in references]
    #for i in out:
    #    print i, i.title_or_id(),
    return out
def getClassByNamePath(classname, ontoname):
    #obj_list=self.catalogtool.searchResults(Title=onto)
    site = getSite()
    onto_cls=getOnto(ontoname)
    #print 'onto-cls=', onto_cls
    catalogtool = getToolByName(site, 'portal_catalog')
    obj_list = [i.getObject() for i in catalogtool.searchResults({'portal_type':'OntoClass', 'Title':classname, 'path':onto_cls.getPath()})]
    if obj_list:
        #print 'cls=',obj_list[0]
        return obj_list[0]
    else:
        return 0
def getClassObjectPropertyByName(oname):
    #obj_list=self.catalogtool.searchResults(Title=onto)
    site = getSite()
    items=[]
    if not isinstance(oname, unicode):
      oname = unicode(oname, 'utf-8', 'replace')
    catalogtool = getToolByName(site, 'portal_catalog')
    brain=catalogtool.searchResults({'portal_type':"ClassObjectProperty", 'Title': oname}) 
    obj_list=[i.getObject() for i in brain]
    if obj_list:
        return obj_list
    else:
        return 0
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

def getListInd(ouid):
    site = getSite()
    refCatalog = getToolByName(site, 'reference_catalog')
    references = refCatalog.getBackReferences(ouid, relationship="source_class")
    inds = [ref.getSourceObject() for ref in references]
    return inds
def ListFieldTypes(rootfield):
    """
    получает список классов, наследующих класс с именем @rootfield
    """
    cls=getClassByName(rootfield)
    return backref(cls)



def getNewId():
    """
    """
    # возвращает новый ид для добавления объекта
    str = 'abcdefghijklmnopqastuvwxyzABCDEFGHIJKLMNOPQSTUVWXYZ1234567890'
    nId = [ random.choice(str) for i in xrange(16) ]
    nId = "".join( nId )
    return nId

def ObjByUID(ouid):
    site = getSite()
    uid_catalog=getToolByName(site, 'uid_catalog')
    obj=[k.getObject() for k in uid_catalog(UID=ouid) if ouid]
    if obj:
        return obj[0]
    else:
        return 0
def OPropByNameList(ouid,refname):
    """
    список Range класов у о.свойства
    """
    cls=ObjByUID(ouid)
    commands1=[]
    #print 'cls=', cls.title_or_id()
    mainop=''
    if cls:
        op=getClassObjectPropertyByName(refname)
        #print 'op=', op
        if op:
            for o in op:
                commands1.extend(o.getRange())
        else:
            return 0 
    return commands1
def viewContextClass(context, request):
    if 'onto_uid' in request.keys():
        ouid=request['onto_uid']
        obj=ObjByUID(ouid)
        return obj
    else:
        return context
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



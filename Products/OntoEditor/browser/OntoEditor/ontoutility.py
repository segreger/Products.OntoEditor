# -*- coding: utf-8 -*-
#
# File: GuiEditor.py
#
# Copyright (c) 2011 by []
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
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
import json
from Products.CMFCore.utils import getToolByName
from AccessControl.SecurityManagement import newSecurityManager, noSecurityManager
from Products.CMFCore.utils import getToolByName
from zope.component.hooks import getSite
from class_utility import *

class OntoJSON(BrowserView):
    """

    """
    #template = ViewPageTemplateFile('templates/ind_add.pt')


    def __init__(self, context,request):
        self.context=context
        self.request=request
        self.urltool = getToolByName(self, "portal_url")
        self.catalogtool = getToolByName(self, "portal_catalog")
        self.portal = self.urltool.getPortalObject()
    def __call__(self):
        #pdb.set_trace()
        # add ontoelement
        # @par mode = 'addcontent'
        # @par contenttype = meta_type 
        # @par id = id  of object
        # @par title = title of  object
        # @par desc = description of  object
        # @par par = parent folder
        if hasattr(self.request, 'mode') and self.request['mode']=='addcontent':
            mode=self.get_fromreq('mode')
            contenttype=self.get_fromreq('contenttype')
            id=self.get_fromreq('id')
            title=self.get_fromreq('title')
            desc=self.get_fromreq('desc')
            parent_class=self.get_fromreq('par')
            return self.addcontent(contenttype, id, title,desc, parent_class)
        # add objprop
        # @par mode = 'addobjprop'
        # @par contenttype = meta_type 
        # @par id = id  of object
        # @par title = title of  object
        # @par desc = description of  object
        # @par par = parent folder
        if hasattr(self.request, 'mode') and self.request['mode']=='addobjprop':
            mode=self.get_fromreq('mode')
            contenttype=self.get_fromreq('contenttype')
            id=self.get_fromreq('id')
            title=self.get_fromreq('title')
            desc=self.get_fromreq('desc')
            parent_class=self.get_fromreq('par')
            return self.addobjprop(contenttype, id, title,desc, parent_class)
        # get list ontologes
        # @par listonto ='all'
        if hasattr(self.request, 'listonto'):
            if self.request['listonto']=='all':
                self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
                response_body = self.list_ontologys()
                response_http = json.dumps(response_body)
                self.request.response.setHeader('content-length', len(response_http))
                return response_http
        # get ontology Info by title of ontology
        # @par ontovalues = title of object
        if hasattr(self.request, 'ontovalue'):
            onto_id=self.request['ontovalue']
            obj_list=self.catalogtool.searchResults(Title=onto_id)
            onto=self.getOnto(onto_id)
            #if len(obj_list)>0:
            #    onto=[i.getObject() for i in obj_list][0]
            #    onto_data = onto.getInfo()
            #else:
            #    onto_data = None
            onto_data = onto.getInfo()    
            self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
            response_body = onto_data
            response_http = json.dumps({'ontology':response_body})
            self.request.response.setHeader('content-length', len(response_http))
            return response_http
        # getInfo by type
        # @par ontology = title of ontology
        # @par ontoitem = 
        # возвращаем информацию по онтологии
        #name: <ontology_name>,
        #description: <ontology_description>,
        #classes: <ontology_classes>,
        #oProps: <ontology_object_properties>,
        #dProps: <ontology_data_properties>,
        #individuals: <ontology_individuals>
        
        if hasattr(self.request, 'reflist'):
            #pdb.set_trace()
            ref=self.get_fromreq('reflist')
            ouid=self.get_fromreq('ouid')
            list_comm=[]
            """
            получаем список Range класов у о.свойства
            """
            onto_objs=OPropByNameList(ouid,ref)
            print 'onto_obj=',onto_objs
            if onto_objs:
                onto_data={}
                for i in onto_objs:
                    onto_data['command_name']=i.title_or_id()
                    for j in ListDataProp(i.title_or_id()):
                        onto_data[j.title_or_id()]=j.getDefault_value()
                    list_comm.append(onto_data)
                    onto_data={}
                print 'list=',list_comm
                response_body = list_comm
                response_http = json.dumps(response_body)
                self.request.response.setHeader('content-length', len(response_http))
                return response_http
            else:
                self.response_json([])

        if hasattr(self.request, 'ontology'):
            #pdb.set_trace()
            onto_id=self.request['ontology']
            onto_obj=self.getOnto(onto_id)
            onto_data=''
            if hasattr(self.request, 'ontoitem'):
               ontoitem=self.request['ontoitem']
               if ontoitem=='rootclass':
                   if onto_obj and onto_obj.getRootClass():
                       onto_data=onto_obj.getRootClass()
               else:
                   result=onto_obj.getInfo()[ontoitem]
                   onto_data ={ontoitem: result}
            self.response_json(onto_data)


        """  
                   
        else:
            #self.onto_data = json.dumps({'ontology': self.context.getInfo()})
            #self.new_oe_js = 'var data1='+self.onto_data+';'
            return self.template()
        """
               
        #self.onto_data = json.dumps({'ontology': self.context.getInfo()})
        #self.new_oe_js = 'var ontoEditor; $(function() { try { ontoEditor = new OntologyEditor('+self.onto_data+'); } catch(e) {}; });'
    

    def response_json(self, onto_data):
        self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
        response_body = onto_data
        response_http = self.json_call(response_body)
        self.request.response.setHeader('content-length', len(response_http))
        return response_http

        
    def get_fromreq(self, name):
        if hasattr(self.request, name):
            return self.request[name]
        else:
            return None
    def addobjprop(self,owltype, id, title, desc, parent_class):
        """
        add new object for ontoogy type
        """
        user = self.context.getWrappedOwner()
        newSecurityManager(self.context, user)
        if owltype and id and title:
                
            container=self.context
            id_obj=id
            if hasattr(container, id):
                obj = getattr(container, id_obj)
            else:
                container.invokeFactory(owltype, id_obj)
                obj = getattr(container, id_obj)
            #pdb.set_trace()
            obj.setTitle(title)
            if desc:
                obj.setDescription(desc)
            if parent_class:
                if hasattr(self.context, parent_class):
                    target=getattr(self.context, parent_class)
                    save_list=[]
                    save_list.append(target.UID())
                obj.setSubClassOf(save_list)
            self.catalogtool.refreshCatalog()
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Ok</p>"
            return html.encode('utf8')
        else:
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Not</p>"
            return html.encode('utf8')
    def addcontent(self,owltype, id, title, desc, parent_class):
        """
        add new object for ontoogy type
        """
        user = self.context.getWrappedOwner()
        newSecurityManager(self.context, user)
        if owltype and id and title:
                
            container=self.context
            id_obj=id
            if hasattr(container, id):
                obj = getattr(container, id_obj)
            else:
                container.invokeFactory(owltype, id_obj)
                obj = getattr(container, id_obj)
            #pdb.set_trace()
            obj.setTitle(title)
            if desc:
                obj.setDescription(desc)
            if parent_class:
                if hasattr(self.context, parent_class):
                    target=getattr(self.context, parent_class)
                    save_list=[]
                    save_list.append(target.UID())
                obj.setSubClassOf(save_list)
            self.catalogtool.refreshCatalog()
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Ok</p>"
            return html.encode('utf8')
        else:
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html="<p>Not</p>"
            return html.encode('utf8')
            
    def list_ontologys(self):
        l=[i.getObject() for i in self.catalogtool.searchResults(portal_type="Ontology")]
        f={}
        
        for i in l:
            f[str(i.title_or_id())]=i.getId()
        return f    
    def json_call(self, onto_data):
        #self.onto_data = json.dumps(self.listontologys())
        #return self.onto_data
        x=json.dumps(onto_data)
        print 'x=', x
        return x

    def getClassParentsList(self,nameclass):
        p_list=[]
        tec=self.getClassByName(nameclass)
        while tec and tec.getSubClassOf():
            item=tec.getSubClassOf()[0]
            p_list.append(item)
            tec=item
        return p_list 
    def getParentsList(self):
        p_list=[]
        tec=self.context
        item=self.context
        while tec.getSubClassOf():
            item=tec.getSubClassOf()[0]
            p_list.append(item)
            tec=item
        p_list.append(self.context)
        return p_list 
    def getOPropByParent(self, name):
        op={}
        context_class=self.getClassByName(nameclass)
        par_list=self.getParentsList(nameclass),append(context_class)
        for i in par_list:
            op1=dict([(j.getTitle(), j.getRange()[0].title_or_id()) for j in i.getObjectProps() if j.getRange()])
            op.update(op1)
        return op
    def ListDProp(self, ocls):
        dp=ocls.getDataProps()
        if dp:
            return dp
        else:
            return 0
    def dPropRange(self, dprop):
        if dprop.getRange():
            return dprop.getRange()[0]
        else:
            return 0        

    def getOnto(self, onto):
        #obj_list=self.catalogtool.searchResults(Title=onto)
        obj_list=[i.getObject() for i in self.catalogtool.searchResults(portal_type="Ontology")]
        #pdb.set_trace()
        if obj_list:
            for item in obj_list:
                if item.title_or_id()==onto:
                    return item
    def getClassByName(self, name):
        #obj_list=self.catalogtool.searchResults(Title=onto)
        obj_list=[i.getObject() for i in self.catalogtool.searchResults(portal_type="OntoClass")]
        if obj_list:
            for item in obj_list:
                if item.title_or_id()==name:
                    return item

    def vocabRange(self, ouid):
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






##code-section module-footer #fill in your manual code here
##/code-section module-footer



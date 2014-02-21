# -*- coding: utf-8 -*-
#
# File: ontoeditor_tab.py
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


from zope import interface

from zope import component

from Products.CMFPlone import utils

from Products.Five import BrowserView

from Products.CMFCore.utils import getToolByName

from zope.interface import implements

from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin

from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
    ReferenceBrowserWidget
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
from Products.OntoEditor.class_utility import *

def subclasses(context,parent_name):
    urltool = getToolByName(context,"portal_url")
    catalogtool = getToolByName(context, "portal_catalog")
    portal = urltool.getPortalObject()
    refCatalog = getToolByName(portal, 'reference_catalog')
    uid_catalog=getToolByName(portal, 'uid_catalog')
                
    if hasattr(context,parent_name):
        par=getattr(context,parent_name)
    else:
        par=None
    if par:
        #refs = self.refCatalog.getReferences(par, 'sub_class_of')
        brefs=refCatalog.getBackReferences(par)
        l=[uid_catalog(UID=i.sourceUID) for i in refCatalog.getBackReferences(par)]
        targ_list=[refCatalog.lookupObject(i.sourceUID) for i in brefs]
        return targ_list
    else:
        return None

class recurse_tab(BrowserView):
    recurse=ViewPageTemplateFile('templates/recurse_tab.pt')
    def __init__(self,context, request):
        self.context=context
        self.request=request
    def __call__(self):
        #pdb.set_trace()
        if hasattr(self.request, 'node'):
            self.parent_name=getattr(self.request,'node')
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html=self.recurse(node=self.parent_name, list_obj=self.ul_content())
            return html.encode('utf8')
        else:
            self.parent_name='thing'
            response = self.request.response
            response.setHeader('Content-Type','text/html')
            html=self.recurse(node=self.parent_name, list_obj=self.ul_content())
            return html.encode('utf8')
        
    def ul_content(self):
        l=subclasses(self.context, self.parent_name)
        return l
         








class ontoeditor_tab(BrowserView):
    template=ViewPageTemplateFile('templates/ontoeditor_tab.pt')
    template1=ViewPageTemplateFile('templates/ontoeditor_tab.pt')
    template2=ViewPageTemplateFile('templates/ontoeditor_tab.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        self.valuid=None
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()


    def __call__(self):
        if hasattr(self.request, 'file_item') and not hasattr(self.request, 'verify'):
            self.file_item=getattr(self.request,'file_item')
            return self.template()
        if hasattr(self.request, 'file_item') and hasattr(self.request, 'verify'):
            self.file_item=getattr(self.request,'file_item')
            return self.template()
        else:
            return self.template()

    def weblist(self):
        files = self.catalogtool.searchResults(portal_type = 'File')
        return [i.getObject() for i in files]
    def parse_file(self,mode):
        id_file=self.file_item
        files = self.catalogtool.searchResults(portal_type = 'File', id=id_file)
        file = files[0].getObject()
        data = file.get_data()
        rows=data.split('\r\n')
        list_class=[]
        a=''
        for row in rows:
            fields =row.split(' ')
            if fields and len(fields)==3:
                oclass=fields[0]
                ontotitle=fields[1]
                pclass=fields[2]
                a=(oclass,ontotitle,pclass)
            if fields and len(fields)==1:
                oclass=fields[0]
                ontotitle='None '
                pclass='None '
                a=(oclass,ontotitle,pclass)
            if fields and len(fields)==2:
                oclass=fields[0]
                ontotitle=fields[1]
                pclass='None '
                a=(oclass,ontotitle,pclass)
            if a:list_class.append(a)
        if mode=="verif":
            return self.verif_file(list_class)
        if mode=="change":
            x=self.change_onto(self.verif_file(list_class))
            return self.parse_file('verif')


    def create_class(self, onto,title):
        container = getOnto(onto)
        ind_id = title
        title = title
        ind = container.invokeFactory('OntoClass', id=ind_id, title=title)
        #self.catalogtool.refreshCatalog()
        cls = [i.getObject() for i in self.catalogtool.searchResults({'id': ind})][0]
        #container.setSubClassOf([context_uid])
        return cls

    def verif_file(self, list_class):
        res=[]
        for fields in list_class:
            #print 'fields=',fields
            oclass=fields[0]
            ontotitle=fields[1]
            pclass=fields[2]
            obj_class="none"
            par_class="none"
            #t=set([oclass,ontotitle,pclass])
            classes=self.get_classes(ontotitle, oclass, pclass)
            #print "classes=", classes
            if isinstance(classes,tuple):
                y=0
                ontology=classes[0]
                if classes[1]:
                    obj_class=classes[1].title_or_id()
                if classes[2]:
                    par_class=classes[2].title_or_id()
                if classes[1] and classes[2] and classes[1].getSubClassOf():
                    p=classes[1].getSubClassOf()[0]
                    if p.title_or_id()==classes[2].title_or_id():
                        y=1
                    else:
                        y=0
                if oclass==obj_class and pclass==par_class and y:
                    res.append((oclass, pclass,obj_class,par_class, "verify"))
                else:
                    res.append((oclass, pclass,obj_class,par_class, "not_verify"))

                #"add classes if not exist"
                if classes[1]:
                    obj_class=classes[1].title_or_id()
                else:
                    obj_class=self.create_class(ontology,oclass).title_or_id()

                if classes[2]:
                    par_class=classes[2].title_or_id()
                else:
                    par_class=self.create_class(ontology,pclass).title_or_id()
        self.verif=(ontotitle,res)    
        return (ontotitle,res)

    def change_onto(self, verif_res):
        ontotitle=verif_res[0]
        for item in verif_res[1]:
            oclass = item[0]
            pclass = item[1]
            obj_class=item[2]
            par_class=item[3]
            mess=item[4]
            if mess=='not_verify':
                res=self.get_classes(ontotitle, obj_class, par_class)
                print 'res=',res,
                if res:
                    cls=res[1]
                    par=res[2]
                    cls.setSubClassOf([par.UID()])
                    print cls.title_or_id(),'subClassOf=', cls.getSubClassOf()[0].title_or_id(),
        return 1

    def see_transf(self):
        x=self.verif
        return self.change_onto(x)

    def addparent(self):
        set_parentclass(onttitle, oclass, pclass)

    def obj_fold(self):
        ref_folder=self.context.getDirectoryEntry()
        obj=self.context.unrestrictedTraverse(ref_folder)
        return obj
    def list_tab(self):
        return ('Import','Properties','Individuals')
    """
    def set_parentclass(self, ontotitle, oclass, pclass):
        classes=self.get_classes(ontotitle, oclass, pclass)
        obj_class=classes[1]
        par_class=classes[2]
        if isinstance(obj_class, OntoClass) and obj_class.getSubClassOf():
            item=obj_class.getSubClassOf()[0]
            if item and par_class and not item.Title()==par_class.Title():
                obj_class.setSubClassOf([par_class.UID()])
    """
   
    def get_classes(self, ontotitle, oclass, pclass):
        ontology = getOnto(ontotitle)
        print "onto=", ontology,
        obj_class=''
        par_class=''
        if ontology:
            obj_clases=ontology.getObjectsByName(byType="OntoClass", byName=oclass, byPath=ontology.getPath())
            par_clases=ontology.getObjectsByName(byType="OntoClass", byName=pclass, byPath=ontology.getPath())
            """
            print "onto=", ontology

            print 'obj_clases=', obj_clases.title_or_id(), 'par_clases=', par_clases.title_or_id(),
            """
            if obj_clases:
                obj_class=obj_clases
            if par_clases:
                par_class=par_clases
            return (ontotitle, obj_class, par_class)
        else:
            return 0

            
                



    ##code-section class-header_curse_view #fill in your manual code here
    ##/code-section class-header_curse_view










##code-section module-footer #fill in your manual code here
##/code-section module-footer


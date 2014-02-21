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




class owlselect(BrowserView):
    template = ViewPageTemplateFile('templates/owlselect.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        self.valuid=None
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()
        self.disclist=[i.getObject() for i in self.context.portal_catalog.searchResults(portal_type='OntoClass')]
        #self.speclist=[i.getObject() for i in self.context.portal_catalog.searchResults(portal_type='Specialty')]
        self.ontofolder=[i.getObject() for i in self.catalogtool.searchResults(portal_type='Ontology')]
        self.portal.acl_users.credentials_cookie_auth.login_path = ""
    def ObjByUID(self):
        if hasattr(self.request, 'valuid'):
            self.valuid=self.request['valuid']
        if hasattr(self.request.form, 'valuid'):
            self.valuid=self.request.form['valuid']
        if self.valuid:
            list_obj=self.context.portal_catalog.searchResults(UID=self.valuid)
            if list_obj[0]:
                objid=list_obj[0].getObject()
                return objid
            else:
                return None
        else:
            return None
    def ObjByValUID(self, valuid):
        if valuid:
            list_obj=self.context.portal_catalog.searchResults(UID=valuid)
            if list_obj[0]:
                objid=list_obj[0].getObject()
                return objid
            else:
                return None
        else:
            return None
    def list_ontology(self):
        #pdb.set_trace()
        ontofolder=[i.getObject() for i in self.catalogtool.searchResults(portal_type='Ontology')]
        return ontofolder
    def list_ontoclass(self, ontouid):
        if ontouid:
            #pdb.set_trace()
            onto=self.ObjByValUID(ontouid)
            #return onto.listFolderContents(contentFilter={"portal_type" : "OntoClass"})
            return onto.contentItems()
        else:
            return []

    def list_subclass(self, objuid):
        par_obj=self.ObjByValUID()
        list_obj=par_obj.contentItems()
        rel_list=[]
        for i in list_obj:
            if objuid in i.getsubClassOf():
                rel_list.append(i)
        return rel_list


        """
        for item in self.ontofolder:
            if self.valuid and (self.valuid==str(i[1].UID())):
                s='<option selected value="'+self.portal.absolute_url()+'/owlselect?valuid='+str(i[1].UID())+'">'+i[1].title_or_id()+'</option>'
            else:
                s='<option value="'+self.portal.absolute_url()+'/owlselect?valuid='+str(i[1].UID())+'">'+i[1].title_or_id()+'</option>'
            ss=ss+s
            #dict_spec[item.title_or_id()]=list_item
        """
        #return self.ontofolder
    def getRelList(self):
        if hasattr(self.request, 'valuid'):
            self.valuid=self.request['valuid']
            list_obj=[]
            for i in self.context.portal_catalog.searchResults(UID=self.valuid):
                if i.getObject():
                    objid=i.getObject()
                    list_obj.append(objid)
            if list_obj:
                self.obj=list_obj[0]
                list_rel=self.obj.getList_disc()
                return list_rel
            else:
                return 'id not'
        else:
            return "valuid not exist"
    #def __call__(self):
        #name = self.request.form.get('sel_spec', None)
        #if not name==None:
        #    self.portal.acl_users.credentials_cookie_auth.login_path = ""
        #    return self.request.response.redirect(self.context.absolute_url())
    def container_content(self,valuid):
        if valuid:
            obj=self.ObjByValUID(valuid)
            return obj.listFolderContents(contentFilter={"portal_type" : "OntoClass"})
        else:
            return None
    def property_list(self, prop_type):
        list_prop=[]
        class_obj=None
        list_prop_uid=None
        if hasattr(self.request, 'ontouid'):
            self.valuid=self.request['ontouid']
            onto_obj=self.ObjByValUID(self.valuid)
            if prop_type=='object':
                list_prop_obj=onto_obj.listFolderContents(contentFilter={"portal_type" : "ObjectProperty"})
            if prop_type=="value":
                list_prop_obj=onto_obj.listFolderContents(contentFilter={"portal_type" : "DataProperty"})
            list_prop_uid=[(i,i.UID()) for i in list_prop_obj]
        if hasattr(self.request, 'classuid'):
            classuid=self.request['classuid']
            class_obj=self.ObjByValUID(classuid)
        if list_prop_uid and class_obj:
            list_dataprop=[]
            for item in list_prop_uid:
                l=item[0].getRange()
                if class_obj in l:
                    list_dataprop.append(item[0])
            return list_dataprop
        else:
            return None


    def __call__(self):
        #pdb.set_trace()
        curse_check = self.request.form.get('curse_check', None)
        self.request.set('disable_border', True)
        postback = True
        form = self.request.form
        # Make sure we had a proper form submit, not just a GET request
        submitted = form.get('form.submitted', False)
        save_button = form.get('form.button.Save', None) is not None
        cancel_button = form.get('form.button.Cancel', None) is not None

        #obj=self.ObjByUID()
        if submitted and not cancel_button:
            # Update the acquire-roles setting
            # Other buttons return to the sharing page
            #pass
            #obj=self.ObjByUID()
            #pdb.set_trace()
            valuid=self.request['valuid']
            if valuid:
                list_obj=self.context.portal_catalog.searchResults(UID=valuid)
                if list_obj[0]:
                    obj=list_obj[0].getObject()
                    list_rel=obj.getList_disc()
                    save_list=[]
                    for i in curse_check:
                        if not(i in list_rel):
                            save_list.append(i)
                    obj.setList_disc(save_list)
                    self.request.response.redirect(obj.absolute_url())
                else:
                    obj=None
            else:
                obj=None

            #if save_list:
                #s=''
                #for k in save_list:
                #    s=s+k
                #response = self.request.response
                #return "<html><body>"+s+"</body></html>"

        if save_button or cancel_button:
            postback = False
        if postback:
            return self.template()
        else:
            if obj:
                self.request.response.redirect(obj.absolute_url())
            else:
                self.request.response.redirect(self.context.absolute_url())

class onto_fullview(BrowserView):
    template = ViewPageTemplateFile('templates/onto_fullview.pt')
    #result_template = ViewPageTemplateFile('feedback_result.pt')

    def __init__(self, context, request):
        self.context=context
        self.request=request
        urltool = getToolByName(context, "portal_url")
        self.catalogtool=getToolByName(context, "portal_catalog")
        self.portal = urltool.getPortalObject()
    def getDataProps(self):
	    pass
	








##code-section module-footer #fill in your manual code here
##/code-section module-footer


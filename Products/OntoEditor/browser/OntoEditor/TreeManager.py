#import pdb
from zope import interface
from zope import component
from Products.CMFPlone import utils
from Products.Five import BrowserView
from zope.interface import implements
from datetime import datetime
#from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin
#from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
#    ReferenceBrowserWidget
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
import json
from Products.CMFCore.utils import getToolByName
from AccessControl.SecurityManagement import newSecurityManager, noSecurityManager
from class_utility import *

class TreeManager(BrowserView):
	template = ViewPageTemplateFile('templates/TreeManager.pt')
	def __init__(self, context,request):
		self.context = context
		self.request = request
		self.urltool = getToolByName(self, "portal_url")
		self.catalogtool = getToolByName(self, "portal_catalog")
		self.refcatalog = getToolByName(self, "reference_catalog")
		self.portal = self.urltool.getPortalObject()
		#obj_list=[i.getObject() for i in self.catalogtool.searchResults(portal_type="NavNode")]
		
		
	def __call__(self):
		if hasattr(self.request, 'action'):

			if self.request['action']=='getChildren':
				if hasattr(self.request, 'onto'):
					onto_name=self.request['onto']
					print 'onto_name=',onto_name
					self.onto=getOnto(onto_name)
					print 'onto_obj=', self.onto
					if not self.onto:
						self.onto=self.context
					else:
					    self.onto=self.context
				for i in self.request.keys():
					print i
				if 'ontoclass' in self.request.keys():
					print "ooo=", self.request['ontoclass']
					class_name=self.request['ontoclass']
					print 'ontoclass=',class_name
					self.ontoclass=getClassByName(class_name)
				else:
					self.ontoclass=''
					print 'ontoclass=',self.ontoclass
				
				response = []
				OntoTypes = {
					'OntoClass' : ['sub_class_of', 'source_class', 'main_domain'], 
					'ObjectProperty' : ['sub_property_of', 'main_domain'], 
					'DataProperty' : ['main_domain'], 
					'OntoIndividual' : ['sub_class_of', 'source_class', 'main_domain'],

				};
#					'ClassObjectProperty' : ['sub_property_of', 'main_domain'],
#					'ClassDataProperty' : ['sub_property_of', 'main_domain'] #?				
				OntoObjects = [i.getObject() for i in self.catalogtool.searchResults(
					portal_type={"query": OntoTypes.keys(), "operator": "or" }, 
					path=self.onto.getPath()
				)]
				if hasattr(self.request, 'uid'): uid = self.request['uid']
				if self.ontoclass and not uid:
						response.append({
							'data':self.ontoclass.title_or_id(),
							'metadata':{'id':self.ontoclass.UID()},
							'state':'open',
							'attr':{'id':self.ontoclass.UID(), 'rel':self.ontoclass.portal_type}
							})
				for item in OntoObjects:


					if hasattr(item, 'rootclass') and not uid:
						if item.rootclass:
							response.append({
								'data':item.title_or_id(),
								'metadata':{'id':item.UID()},
								'state':'open',
								'attr':{'id':item.UID(), 'rel':item.portal_type}
							})


					else:
						obj=ObjByUID(uid)
						"""
						if obj and isinstance(obj, OntoClass):

							list_oprop=obj.listFolderContents(contentFilter={"portal_type" : "ClassObjectProperty"})
							if list_oprop:
								for  item in list_oprop:
									response.append({
											'data':item.title_or_id(),
											'metadata':{'id':item.UID()},
											'state':'open',
											'attr':{'id':item.UID(), 'rel':item.portal_type}
										})
						"""	
						refs = self.refcatalog.getReferences(item, OntoTypes[item.portal_type])
						for i in refs:
							if i.targetUID == uid: 
								response.append({
									'data':item.title_or_id(),
									'metadata':{'id':item.UID()},
									'state':'open',
									'attr':{'id':item.UID(), 'rel':item.portal_type}
								})
						
			response_http = json.dumps(response)
			self.request.response.setHeader('content-length', len(response_http))
			return response_http
				

		return self.template()

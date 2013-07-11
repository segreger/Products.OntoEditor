import pdb
from zope import interface
from zope import component
from Products.CMFPlone import utils
from Products.Five import BrowserView
from zope.interface import implements
from datetime import datetime
#from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin
#from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
#    ReferenceBrowserWidget
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
import json
from Products.CMFCore.utils import getToolByName
from AccessControl.SecurityManagement import newSecurityManager, noSecurityManager


class OntologyManager(BrowserView):
	template = ViewPageTemplateFile('templates/OntologyManager.pt')
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
				print '\n'+str(datetime.now())

				response = []
				OntoTypes = {
					'OntoClass' : ['sub_class_of', 'source_class', 'main_domain'], 
					'ObjectProperty' : ['sub_property_of', 'main_domain'], 
					'DataProperty' : ['main_domain'], 
					'OntoIndividual' : ['sub_class_of', 'source_class', 'main_domain'] #?
				};
				
				OntoObjects = [i.getObject() for i in self.catalogtool.searchResults(
					portal_type={"query": OntoTypes.keys(), "operator": "or" }, 
					path=self.context.getPath()
				)]
				
				for item in OntoObjects:
					if hasattr(self.request, 'uid'): uid = self.request['uid']
					if hasattr(item, 'rootclass') and not uid:
						if item.rootclass:
							response.append({
								'data':item.title_or_id(),
								'metadata':{'id':item.UID()},
								'state':'open',
								'attr':{'id':item.UID(), 'rel':item.portal_type}
							})
					else:
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
				
			"""
			if self.request['action']=='get_children':
				typeRelations = {
					'OntoClass'		: 'sub_class_of', 
					'ObjectProperty': 'sub_property_of', 
					'DataProperty' 	: 'main_range', 
					'OntoIndividual': 'source_class'
				}
				uid = None
				response = []
				
				if hasattr(self.request, 'uid'): uid = self.request['uid']
				if hasattr(self.request, 'type'): type = self.request['type'].split(',')
				
				OntoObjects = [i.getObject() for i in self.catalogtool.searchResults(portal_type={"query": type, "operator": "or" })]
				for object in OntoObjects:
					print object.portal_type
					refs = self.refcatalog.getReferences(object, typeRelations[object.portal_type])
					if uid:
						for i in refs:
							if i.targetUID == uid: 
								response.append({
									'data':object.title_or_id(),
									'metadata':{'id':object.UID()},
									'state':'open',
									'attr':{'id':object.UID(), 'rel':object.portal_type}
								})
					elif len(refs) == 0:
						response.append({
							'data':object.title_or_id(),
							'metadata':{'id':object.UID()},
							'state':'open',
							'attr':{'id':object.UID(), 'rel':object.portal_type}
						})
				response_http = json.dumps(response)
				self.request.response.setHeader('content-length', len(response_http))
				return response_http
			
				types = ['OntoClass', 'ObjectProperty', 'DataProperty', 'OntoIndividual']
				OntoObjects = [i.getObject() for i in self.catalogtool.searchResults(portal_type={"query": types,"operator": "or" })]
				
				
				
				
				id  = -1 # Parent ID
				lvl = 0
				types = "OntoClass"
				
				if hasattr(self.request, 'type'): types = self.request['type'].split(',')
				if hasattr(self.request, 'lvl'): lvl = int(self.request['lvl'])
				if hasattr(self.request, 'id'): id = self.request['id']
				self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
				results = self.catalogtool.searchResults(portal_type={"query": types,"operator": "or" })
				
				#if type == "ObjectProperty": results.append(self.catalogtool.searchResults(portal_type="DataProperty"));
				response = []
				for i in results:
					splittedPath = i.getPath().split('/')[3:]
					if (len(splittedPath) == 1 and lvl == 0) or (lvl == len(splittedPath)-1 and splittedPath[lvl-1] == id): 
						response.append({
							'data':i.Title,
							'metadata':{'id':i.getId},
							'state':'open',
							'attr':{'id':i.getId, 'lvl':(lvl+1), 'rel':i.portal_type}
						})
				response_http = json.dumps(response)
				self.request.response.setHeader('content-length', len(response_http))
				return response_http
			
				
				
			if self.request['action']=='get_childrens':
				uid  = '' # Parent ID
				types = "OntoClass"
				#res = self.refcatalog.searchResults()
				#for r in res:
				#	print r.getObject()
				if hasattr(self.request, 'type'): types = self.request['type'].split(',')
				#if hasattr(self.request, 'lvl'): lvl = int(self.request['lvl'])
				if hasattr(self.request, 'uid'): id = self.request['uid']
				self.request.response.setHeader('content-type', 'application/json; charset=utf-8')
				OntoObjects = [i.getObject() for i in catalogtool.searchResults(portal_type={"query": types,"operator": "or" })]
				#for item in OntoObjects: 
				refs = refCatalog.getReferences(item, 'content_source')
					
				#if type == "ObjectProperty": results.append(self.catalogtool.searchResults(portal_type="DataProperty"));
				response = []
				for i in results:
					splittedPath = i.getPath().split('/')[3:]
					if (len(splittedPath) == 1 and lvl == 0) or (lvl == len(splittedPath)-1 and splittedPath[lvl-1] == id): 
						response.append({
							'data':i.Title,
							'metadata':{'id':i.getId},
							'state':'open',
							'attr':{'id':i.getId, 'lvl':(lvl+1), 'rel':i.portal_type}
						})
				response_http = json.dumps(response)
				self.request.response.setHeader('content-length', len(response_http))
				return response_http
			"""
		return self.template()

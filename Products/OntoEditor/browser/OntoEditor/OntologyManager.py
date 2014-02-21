import pdb
from zope import interface
from zope import component
from Products.CMFPlone import utils
from Products.Five import BrowserView
from zope.interface import implements
from datetime import datetime
from zope.browserpage.viewpagetemplatefile import ViewPageTemplateFile
import json
from Products.CMFCore.utils import getToolByName
from AccessControl.SecurityManagement import newSecurityManager, noSecurityManager
from class_utility import *
from Products.OntoEditor.OntoClass import OntoClass
from Products.OntoEditor.OntoIndividual import OntoIndividual

class OntologyManager(BrowserView):
	template = ViewPageTemplateFile('templates/OntologyManager.pt')
	def __init__(self, context,request):
		self.context = context
		self.request = request
		self.urltool = getToolByName(self, "portal_url")
		self.catalogtool = getToolByName(self, "portal_catalog")
		self.refcatalog = getToolByName(self, "reference_catalog")
		self.portal = self.urltool.getPortalObject()
		self.OntoTypes = {'OntoClass' : ['sub_class_of', 'source_class', 'main_domain'],
		'ObjectProperty' : ['sub_property_of', 'main_domain'],
		'DataProperty' : ['main_domain'],
		'OntoIndividual' : ['sub_class_of', 'source_class', 'main_domain'],
		}
		self.response = []

	def __call__(self):
		if hasattr(self.request, 'action'):
			if self.request['action']=='getChildren':
				response = []
				response=self.getResponse()
				response_http = json.dumps(response)
				self.request.response.setHeader('content-length', len(response_http))
				return response_http
		


		return self.template()

	
	def insert_out(self, output, item):
		output.append({'data':item.title_or_id(),
			'metadata':{'id':item.UID()},
			'state':'open',
			'attr':{'id':item.UID(), 'rel':item.portal_type}
		})
		return output
	def insert_outmeta(self, output, title, item):
		output.append({'data':title,
			'metadata':{'id':item.UID()},
			'state':'open',
			'attr':{'id':item.UID(), 'rel':item.portal_type}
		})
		return output
	def getResponse(self):
		if ('uid' in self.request.keys() and self.request['uid']):
			uid=self.request['uid']
			return self.Observer(uid)
		if hasattr(self.request, 'uid') and not self.request['uid']:
			return self.GetItem()


	def GetItem(self):
		output=[]
		root=[]
		for o in self.getOntoObjects(self.context):
			if isinstance(o, OntoClass):
				if o.getRootclass():
					root.append(o)
		if root:
			for item in root:
				output=self.insert_out(output, item)
		return output

	def ListRangeObj(self,obj):
		output=[]
		if obj and obj.getRange():
			for op in obj.getRange():
				output=self.insert_out(output, op)
		return output

	def Observer(self, uid):
		obj=ObjByUID(uid)
		output=[]
		if obj and obj.portal_type=='ClassObjectProperty':
			if obj and obj.getRange():
				output.extend(self.ListRangeObj(obj))
		if obj and obj.portal_type=='OntoClass':
			output=self.Class_observer(output, uid, 'subclass')
			output.extend(self.ListMetatype(obj))
			output.extend(self.ListKindOf(obj))
			output.extend(self.ListChidren(obj))
			output.extend(self.ListInd(obj))
		if obj and obj.portal_type=='ClassDataProperty':
			if obj and obj.getRange():
				output=self.insert_out(output, obj.getRange()[0])
		if obj and obj.portal_type=='OntoIndividual':
			output.extend(self.ListChidren(obj))
		if obj and obj.portal_type=='IndObjectProperty':
			if obj and obj.getRange():
				output.extend(self.ListRangeObj(obj))
				
		return output

	def getOntoObjects(self, obj):
		OntoObjects = [i.getObject() for i in self.catalogtool.searchResults(portal_type='OntoClass', path=obj.getPath())]
		return OntoObjects
	def Class_observer(self, output, uid, ref_type):
		obj=ObjByUID(uid)
		out=SubClassRef(obj, ref_type)
		for item in out:
			output=self.insert_out(output, item)

		return output
	def ListChidren(self, obj):
		output=[]
		if isinstance(obj, OntoClass):
			if obj and obj.ListObjectProps():
				for op in obj.ListObjectProps():
					if op and op.getRange():
						output=self.insert_out(output, op)
		if isinstance(obj, OntoIndividual):
			if obj and obj.getObjectProps():
				for op in obj.getObjectProps():
					if op and op.getRange():
						output=self.insert_out(output, op)
		if obj and obj.getDataProps():
			for dp in obj.getDataProps():
				if dp and dp.getRange():
					output=self.insert_out(output, dp)

		return output
	def ListMetatype(self, obj):
		output=[]
		if obj and obj.getHasMetatype():
			for op in obj.getHasMetatype():
				if op:
					output=self.insert_outmeta(output, 'meta:'+op.title_or_id(), op)
		return output
	def ListInd(self, obj):
		output=[]
		if obj and getListInd(obj.UID()):
			for op in getListInd(obj.UID()):
				if op:
					output=self.insert_outmeta(output, op.title_or_id(), op)
		return output

	def ListKindOf(self, obj):
		output=[]
		if obj and obj.getHasKindOf():
			for op in obj.getHasKindOf():
				if op:
					output=self.insert_outmeta(output, 'classif:'+op.title_or_id(), op)
		return output
	def ItemByUID(self):
		obj=''
		oid=''
		if 'uid' in self.request.keys():
			oid=self.request['uid']
			obj=ObjByUID(oid)
		return obj
class TempOProp(object):
	def __init__(self,title, range, uid):
		self.title=title
		self.uid=uid
		self.range=range
	def UID(self):
		return self.uid
	def title_or_id(self):
		return self.title



        








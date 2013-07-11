# -*- coding: utf-8 -*-
#
# File: DataProperty.py
#
# Copyright (c) 2011 by []
# Generator: ArchGenXML Version 2.5
#            http://plone.org/products/archgenxml
#
# GNU General Public License (GPL)
#

__author__ = """unknown <unknown>"""
__docformat__ = 'plaintext'

from AccessControl import ClassSecurityInfo
from Products.Archetypes.atapi import *
from zope.interface import implements
import interfaces

from Products.CMFDynamicViewFTI.browserdefault import BrowserDefaultMixin

from Products.ATReferenceBrowserWidget.ATReferenceBrowserWidget import \
    ReferenceBrowserWidget
from Products.OntoEditor.config import *

from Products.CMFCore.utils import getToolByName

##code-section module-header #fill in your manual code here
##/code-section module-header

schema = Schema((

    StringField(
        name='description',
        widget=StringField._properties['widget'](
            label='Description',
            label_msgid='OntoEditor_label_description',
            i18n_domain='OntoEditor',
        ),
    ),
    ReferenceField(
        name='domain',
        widget=ReferenceBrowserWidget(
            label='Domain',
            label_msgid='OntoEditor_label_domain',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass',),
        multiValued=0,
        relationship='main_domain',
    ),
    ReferenceField(
        name='range',
        widget=ReferenceBrowserWidget(
            label='Range',
            label_msgid='OntoEditor_label_range',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass',),
        multiValued=0,
        relationship='main_range',
    ),

),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

DataProperty_schema = BaseSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class DataProperty(BaseContent, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IDataProperty)

    meta_type = 'DataProperty'
    _at_rename_after_creation = True

    schema = DataProperty_schema

    ##code-section class-header #fill in your manual code here
    ##/code-section class-header

    # Methods

    security.declarePrivate('getName')
    def getName(self):
       """
       """
       # ���������� ��� ���� ��������
       return self.title_or_id()

    security.declarePrivate('getInfo')
    def getInfo(self):
        """
        """
        # ���������� ���������� �� ���� ��������
        #    name: <data_property_name>,
        #    description: <object_property_description>,
        #    domain: <domain_class_name>,
        #    range: <range_class_name>
        
        # ��������� ������������ �������� - ���
        res = { 
                  'name': self.getName()
              }
        # ��������� ��������, ���� �� ������
        tmp = self.getDescription()
        if ( tmp != '' ):
            res['description'] = tmp
        # ��������� �����, ���� �� ����������
        tmp = self.getDomain()
        if ( ( tmp is not None ) ):
            res['domain'] = tmp.getName()
        # ��������� ����, ���� �� ���������
        tmp = self.getRange()
        if ( ( tmp is not None ) ):
            res['range'] = tmp.getName()                
        # ���������� ���������� � ���� ��������
        return res

    security.declarePrivate('getObjectsByName')
    def getObjectsByName(self, byType, byName, byPath):
        """
        """
        # �������� ������� �� �����
        catalogtool = getToolByName( self, 'portal_catalog' )
        res = []
        # ������� ��� ������� ������� ���� ��� ������ ���������
        for i in catalogtool.searchResults( Title = byName
                                          , portal_type = byType
                                          , path = {'query' : byPath}
                                          ):
            obj = i.getObject()
            if ( obj.getName() == byName ):
                res.append( i.getObject() )
        return res
        
    security.declarePrivate('update')
    def update(self, changes, byPath):
        """
        """
        # �������� �������� ���� ��������
        # �������� ���
        if ( changes.has_key('name') ):
            f = self.getField('title')
            f.set( self, changes['name'] )
        # �������� ��������
        if ( changes.has_key('description') ):
            self.setDescription( changes['description'] )
        # �������� �����, ���� ����
        if ( changes.has_key('domain') ):
            self.setDomain( self.getObjectsByName( 'OntoClass', changes['domain'] , byPath )[0].UID() )
        # �������� �����, ���� ����
        if ( changes.has_key('range') ):
            self.setRange( self.getObjectsByName( 'OntoClass', changes['range'] , byPath )[0].UID() )
        return self.getName()
        
registerType(DataProperty, PROJECTNAME)
# end of class DataProperty

##code-section module-footer #fill in your manual code here
##/code-section module-footer


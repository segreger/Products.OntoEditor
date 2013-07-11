# -*- coding: utf-8 -*-
#
# File: ObjectProperty.py
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
        name='subPropertyOf',
        widget=ReferenceBrowserWidget(
            label='Subpropertyof',
            label_msgid='OntoEditor_label_subPropertyOf',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('ObjectProperty','OntoClass'),
        multiValued=1,
        relationship='sub_property_of',
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

ObjectProperty_schema = BaseSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class ObjectProperty(BaseContent, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IObjectProperty)

    meta_type = 'ObjectProperty'
    _at_rename_after_creation = True

    schema = ObjectProperty_schema

    ##code-section class-header #fill in your manual code here
    ##/code-section class-header

    # Methods

    security.declarePrivate('getName')
    def getName(self):
       """
       """
       # возвращаем имя объектного свойства
       return self.title_or_id()

    security.declarePrivate('getInfo')
    def getInfo(self):
        """
        """
        # возвращаем информацию по объектному свойству
        #     name: <object_property_name>,
        #     description: <object_property_description>,
        #     subPropOf: <object_property_subpropertyof>,
        #     domain: <domain_class_name>,
        #     range: <range_class_name>
        
        # вставляем обязательный параметр - имя
        res = { 
                  'name': self.getName()
              }
        # вставляем описание, если не пустое
        tmp = self.getDescription()
        if ( tmp != '' ):
            res['description'] = tmp
        # вставляем надсвойство, если он существует
        tmp = self.getSubPropertyOf()
        if ( tmp != [] ):
            sub_prop = []
            for i in tmp:
                sub_prop.append( i.getName() )
            res['subPropOf'] = sub_prop
        # вставляем домен, если он существует
        tmp = self.getDomain()
        if ( ( tmp is not None ) ):
            res['domain'] = tmp.getName()
        # вставляем рэнж, если он сущестует
        tmp = self.getRange()
        if ( ( tmp is not None ) ):
            res['range'] = tmp.getName()
        # возвращаем информацию об объектном свойстве
        return res

    security.declarePrivate('getObjectsByName')
    def getObjectsByName(self, byType, byName, byPath):
        """
        """
        # получаем объекты по имени
        catalogtool = getToolByName( self, 'portal_catalog' )
        res = []
        # находим все объекты данного типа для данной онтологии
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
        # изменяем свойства объектного свойства
        # изменяем имя
        if ( changes.has_key('name') ):
            f = self.getField('title')
            f.set( self, changes['name'] )
        # изменяем описание
        if ( changes.has_key('description') ):
            self.setDescription( changes['description'] )
        # изменяем параметр родительские свойства
        if ( changes.has_key('subPropertyOf') ):
            sPOf = []
            for i in changes['subPropertyOf']:
                 sPOf.append( self.getObjectsByName( 'ObjectProperty', i , byPath )[0].UID() )
            self.setSubPropertyOf( sPOf )
        # изменяем домен, если есть
        if ( changes.has_key('domain') ):
            self.setDomain( self.getObjectsByName( 'OntoClass', changes['domain'] , byPath )[0].UID() )
        # изменяем рэндж, если есть
        if ( changes.has_key('range') ):
            self.setRange( self.getObjectsByName( 'OntoClass', changes['range'] , byPath )[0].UID() )
        return self.getName()

registerType(ObjectProperty, PROJECTNAME)
# end of class ObjectProperty

##code-section module-footer #fill in your manual code here
##/code-section module-footer


# -*- coding: utf-8 -*-
#
# File: IndObjectProperty.py
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
        name='address',
        widget=StringField._properties['widget'](
            label='Address',
            label_msgid='OntoEditor_label_address',
            i18n_domain='OntoEditor',
        ),
    ),


    ReferenceField(
        name='range',
        widget=ReferenceBrowserWidget(
            label='Range',
            label_msgid='OntoEditor_label_range',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoIndividual', 'OntoClass','Ontology'),
        multiValued=0,
        relationship='ind_object_range',
    ),
    ReferenceField(
        name='objectProperty',
        widget=ReferenceBrowserWidget(
            label='Objectproperty',
            label_msgid='OntoEditor_label_objectProperty',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('ObjectProperty',),
        multiValued=0,
        relationship='ind_object_property',
    ),

),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

IndObjectProperty_schema = BaseSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class IndObjectProperty(BaseContent, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IIndObjectProperty)

    meta_type = 'IndObjectProperty'
    _at_rename_after_creation = True

    schema = IndObjectProperty_schema

    ##code-section class-header #fill in your manual code here
    ##/code-section class-header

    # Methods
    security.declarePrivate('getName')
    def getName(self):
       """
       """
       # возвращаем имя развязки объектного свойства между индивидами
       return self.title_or_id()
    
    security.declarePrivate('getInfo')
    def getInfo(self):
       """
       """
       # возвращаем информацию по развязке объектного свойства между индивидами
       #    name: <ind_object_property_name>,
       #    object_property: <object_property_name>,
       #    range: <range_individual_name>
       # вставляем обязательный параметр - имя
       res = {
                 'name': self.getName()
             }
       # вставляем имя объектного свойства, если существует
       tmp = self.getObjectProperty()
       if ( tmp is not None ):
           res['object_property'] = tmp.getName()
       # вставляем имя рэнжа, если существует
       tmp = self.getRange()
       if ( tmp is not None ):
           res['range'] = tmp.getName()
       # возвращаем информацию о развязке объектного свойства между индивидами
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
    def update(self, byOProperty, byRange, byPath):
        """
        """
        # обновляем данные для ограничения
        # изменяем свойство
        tmp = self.getObjectsByName( 'ObjectProperty', byOProperty, byPath )
        if ( tmp == [] ):
            return 'Error of getting ObjectProperty ' + byOProperty + ' in ' + byPath
        self.setObjectProperty( tmp[0].UID() )
        # изменяем рэнж
        tmp = self.getObjectsByName( 'OntoIndividual', byRange, byPath )
        if ( tmp == [] ):
            return 'Error of getting Range (OntoIndivdual) ' + byRange + ' in ' + byPath
        self.setRange( tmp[0].UID() )
        return self.getName()

registerType(IndObjectProperty, PROJECTNAME)
# end of class IndObjectProperty

##code-section module-footer #fill in your manual code here
##/code-section module-footer


# -*- coding: utf-8 -*-
#
# File: ClassDataProperty.py
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

    ReferenceField(
        name='range',
        widget=ReferenceBrowserWidget(
            label='Range',
            label_msgid='OntoEditor_label_range',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass','OntoIndividual'),
        multiValued=1,
        relationship='data_range',
    ),
    ReferenceField(
        name='dataProperty',
        widget=ReferenceBrowserWidget(
            label='Dataproperty',
            label_msgid='OntoEditor_label_dataProperty',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('DataProperty',),
        multiValued=0,
        relationship='class_data_property',
    ),
    StringField(
        name='default_value',
        widget=StringField._properties['widget'](
            label='Default value',
            label_msgid='OntoEditor_label_defaultvalue',
            i18n_domain='OntoEditor',
        ),
    ),
),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

ClassDataProperty_schema = BaseSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class ClassDataProperty(BaseContent, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IClassDataProperty)

    meta_type = 'ClassDataProperty'
    _at_rename_after_creation = True

    schema = ClassDataProperty_schema

    ##code-section class-header #fill in your manual code here
    ##/code-section class-header

    # Methods
    security.declarePrivate('getName')
    def getName(self):
       """
       """
       # возвращаем имя развязки дата свойства между классами
       return self.title_or_id()
    
    security.declarePrivate('getInfo')
    def getInfo(self):
       """
       """
       # возвращаем информацию по развязки дата свойства между классами
       #    name: <class_data_property_name>,
       #    data_property: <data_property_name>,
       #    range: <range_class_or_individual_name>
       # вставляем обязательный параметр - имя
       res = {
                 'name': self.getName()
             }
       # вставляем имя дата свойства, если существует
       tmp = self.getDataProperty()
       if ( tmp is not None ):
           res['data_property'] = tmp.getName()
       # вставляем имя рэнжа, если существует
       tmp = self.getRange()
       if ( tmp is not None ):
           res['range'] = []
           for i in tmp:
               res['range'].append( i.getName() )
       # возвращаем информацию о развязке дата свойства между классами
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
    def update(self, byDProperty, byRange, byPath):
        """
        """
        # обновляем данные для ограничения
        # изменяем свойство
        self.setDataProperty( self.getObjectsByName( 'DataProperty', byDProperty, byPath )[0].UID() )
        # изменяем рэнж
        dPR = []
        for i in byRange:
            # получаем все объекты онтоКласс рэнжа по их именам в виде списка
            tmp = self.getObjectsByName( 'OntoClass', i , byPath )
            # бьем список на объекты, уид объектов забиваем в массив
            if ( tmp != [] ):
                for j in tmp:
                    dPR.append( j.UID() )
            # получаем все объекты онтоИндивидуал рэнжа по их именам в виде списка
            tmp = self.getObjectsByName( 'OntoIndividual', i , byPath )
            # бьем список на объекты, уид объектов забиваем в массив
            if ( tmp != [] ):
                for j in tmp:
                    dPR.append( j.UID() )
        # записываем свойство
        self.setRange( dPR )
        return 1

registerType(ClassDataProperty, PROJECTNAME)
# end of class ClassDataProperty

##code-section module-footer #fill in your manual code here
##/code-section module-footer


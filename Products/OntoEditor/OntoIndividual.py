# -*- coding: utf-8 -*-
#
# File: OntoIndividual.py
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
import random
##code-section module-header #fill in your manual code here
##/code-section module-header

schema = Schema((

    TextField(
        name='description',
        widget=TextField._properties['widget'](
           label='Description',
            label_msgid='OntoEditor_label_description',
            i18n_domain='OntoEditor',
        ),
    ),
    StringField(
        name='address',
        widget=StringField._properties['widget'](
            label='Address',
            label_msgid='OntoEditor_label_address',
            i18n_domain='OntoEditor',
        ),
    ),
    
    BooleanField(
        name='builtIn',
        widget=BooleanField._properties['widget'](
            label='Builtin',
            label_msgid='OntoEditor_label_builtIn',
            i18n_domain='OntoEditor',
        ),
    ),
    ReferenceField(
        name='sourceClass',
        widget=ReferenceBrowserWidget(
            label='Sourceclass',
            label_msgid='OntoEditor_label_sourceClass',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass',),
        multiValued=1,
        relationship='source_class',
    ),

),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

OntoIndividual_schema = BaseFolderSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class OntoIndividual(BaseFolder, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IOntoIndividual)

    meta_type = 'OntoIndividual'
    _at_rename_after_creation = True

    schema = OntoIndividual_schema

    ##code-section class-header #fill in your manual code here
    ##/code-section class-header

    # Methods
    
    security.declarePrivate('getNewId')
    def getNewId(self):
        """
        """
        # возвращает новый ид для добавления объекта
        str = 'abcdefghijklmnopqastuvwxyzABCDEFGHIJKLMNOPQSTUVWXYZ1234567890'
        nId = [ random.choice(str) for i in xrange(16) ]
        nId = "".join( nId )
        return nId

    security.declarePrivate('getName')
    def getName(self):
       """
       """
       # возвращаем имя индивидуала
       return self.title_or_id()
    
    security.declarePrivate('getInfo')
    def getInfo(self):
        """
        """
        # возвращаем информацию по индивидуалу
        #     name: <individual_name>,
        #     description: <individual_description>,
        #     sourceClass: <individual_sourceclass>,
        #     oProps: <individual_object_properties>,
        #     dProps: <individual_data_properties>
        res = {}
        # если не встроенный
        if ( 1 ): # self.getBuiltIn() != 1 ):
            # вставляем обязательный параметр - имя
            res = { 
                      'name': self.getName()
                  }
            # вставляем описание, если не пустое
            tmp = self.getDescription()
            if ( tmp != '' ):
                res['description'] = tmp
            tmp = self.getBuiltIn()
            if ( tmp ):
                res['builtIn'] = True
            # вставляем класс-источник, если есть
            tmp = self.getSourceClass()
            if ( tmp != [] ):
                ind_sourceClass = []
                for i in tmp:
                   ind_sourceClass.append( i.getName() ) 
                res['sourceClass'] = ind_sourceClass
            # вставляем объектное свойство, если есть
            tmp_obj = {}
            tmp = self.getObjectProps()
            if ( tmp != [] ):
                for i in tmp:
                    obj_info = i.getInfo()
                    if 'range' in obj_info.keys() and 'object_property' in obj_info.keys():
                        tmp_obj[obj_info['object_property']] = obj_info['range']
                res['oProps'] = tmp_obj
            # вставляем дата свойство, если есть
            tmp_data = {}
            tmp = self.getDataProps()
            if ( tmp != [] ):
                for i in tmp:
                    data_info = i.getInfo()
                    if 'range' in data_info.keys():
                        tmp_data[data_info['data_property']] = data_info['range']
                res['dProps'] = tmp_data
        # возвращаем информацию об индивидуале
        return res

    security.declarePublic('getObjectProps')
    def getObjectProps(self):
        """
        """
        # получаем все развязки объектного свойства данного индивидуала
        props = []
        for item_name in self.keys():
            if ( self[item_name].meta_type == 'IndObjectProperty' ):
                props.append( self[item_name] )
        return props

    security.declarePublic('getDataProps')
    def getDataProps(self):
        """
        """
        # получаем все развязки дата свойства данного индивидуала
        props = []
        for item_name in self.keys():
            if ( self[item_name].meta_type == 'IndDataProperty' ):
                props.append( self[item_name] )
        return props

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
        
    security.declarePrivate('addIndividualProperty')
    def addIndividualProperty(self, aType, aId, aTitle):
        """
        """
        # фабрика по добавлению новых развязок
        res = self.invokeFactory( aType 
                                , id = aId
                                , title = aTitle
                                )
        return res

    security.declarePrivate('update')
    def update(self, changes, byPath):
        """
        """
        # изменяем свойства класса
        changeList = [self.getName()]
        # изменяем имя
        if ( changes.has_key('name') ):
            changeList.append( 'Changing [title] to ' + changes['name'] )
            f = self.getField('title')
            f.set( self, changes['name'] )
        # изменяем описание
        if ( changes.has_key('description') ):
            changeList.append( 'Changing [description] to ' + changes['description'] )
            self.setDescription( changes['description'] )
        # изменяем параметр встроенный
        if ( changes.has_key('builtIn') ):
            changeList.append( 'Changing [builtIn] to ' + `changes['builtIn']`) 
            self.setBuiltIn( changes['builtIn'] )
        # изменяем параметр родительские классы
        if ( changes.has_key('sourceClass') ):
            sC = []
            for i in changes['sourceClass']:
                changeList.append( 'Changing [sourceClass] to ' + i )
                sC.append( self.getObjectsByName( 'OntoClass', i , byPath )[0].UID() )
            self.setSourceClass( sC )
        # изменяем параметр объектного ограничения на классы
        if ( changes.has_key('oProps') ):
            for i in changes['oProps']:
                if ( changes['oProps'][i] is None ):
                    changeList.append( 'Deleting Link [ObjectProperty] ' + i )
                    self.delete( i, 'IndObjectProperty', byPath )
                else:
                    newId = self.getNewId()
                    newTitle = self.getName() + i + newId[:5]
                    new_obj_name = self.addIndividualProperty( 'IndObjectProperty', newId, newTitle)
                    tmp = self[new_obj_name].update( i, changes['oProps'][i], byPath )
                    if ( tmp[:5] == 'Error' ):
                        return tmp
                    changeList.append( 'Changing Link [ObjectProperty] ' + i + ' to ' + changes['oProps'][i] )
        # изменяем параметр дата ограничения на классы
        if ( changes.has_key('dProps') ):
            for i in changes['dProps']:
                if ( changes['dProps'][i] is None ):
                    changeList.append( 'Deleting Link [DataProperty] ' + i )
                    self.delete( i, 'IndDataProperty', byPath )                    
                else:
                    newId = self.getNewId()
                    newTitle = self.getName() + i + newId[:5]
                    new_data_name = self.addIndividualProperty( 'IndDataProperty', newId, newTitle)
                    tmp = self[new_data_name].update( i, changes['dProps'][i], byPath )
                    if ( tmp[:5] == 'Error' ):
                        return tmp
                    changeList.append( 'Changing Link [DataProperty] ' + i + ' to ' + changes['dProps'][i] )
        return changeList

    security.declarePublic('delete')
    def delete(self, obj_name, obj_type, byPath):
        """
        """
        # список изменений
        changeList = []
        # получаем объект по имени
        del_obj = self.getObjectsByName( obj_type, obj_name, byPath )
        for i in del_obj:
           # удаляем текущий объект
           changeList.append( { 'UID': i.UID(), 'name': i.getName(), 'id': i.getId() } )
           self.manage_delObjects( i.getId() )
        return changeList

registerType(OntoIndividual, PROJECTNAME)
# end of class OntoIndividual

##code-section module-footer #fill in your manual code here
##/code-section module-footer


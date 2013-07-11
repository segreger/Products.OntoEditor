# -*- coding: utf-8 -*-
#
# File: Ontolet.py
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

from Products.OntoEditor.config import *

from Products.PythonScripts.standard import html_quote
from Products.CMFCore.utils import getToolByName 

import random

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

),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

Ontolet_schema = BaseFolderSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class Ontolet(BaseFolder, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IOntolet)

    meta_type = 'Ontolet'
    _at_rename_after_creation = True

    schema = Ontolet_schema

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
        # возвращаем имя онтологии
        return self.title_or_id()

    security.declarePublic('getInfo')
    def getInfo(self):
        """
        """
        # возвращаем информацию по онтологии
        #name: <Ontolet_name>,
        #description: <Ontolet_description>,
        #classes: <Ontolet_classes>,
        #oProps: <Ontolet_object_properties>,
        #dProps: <Ontolet_data_properties>,
        #individuals: <Ontolet_individuals>
        # вставляем обязательный параметр - имя
        res = { 
                  'name': self.getName()
              }
        # вставляем описание, если не пустое
        tmp = self.getDescription()
        if ( tmp != '' ):
            res['description'] = tmp
        # получаем классы, если есть
        tmp = self.getClasses()
        if ( tmp != []):
            res['classes']     = [i.getInfo() for i in tmp]
        # получаем объектные свойства, если есть
        tmp = self.getObjectProperties()
        if ( tmp != []):
            res['oProps']      = [i.getInfo() for i in tmp]            
        # получаем дата свойства, если есть
        tmp = self.getDataProperties()
        if ( tmp != []):
            res['dProps']      = [i.getInfo() for i in tmp]            
        # получаем индивиды, если есть
        tmp = self.getIndividuals()
        if ( tmp != []):
            res['individuals'] = [i.getInfo() for i in tmp]            
        return res

    security.declarePrivate('getPath')
    def getPath(self):
        """
        """
        byPath = self.getPhysicalPath()
        byPath = "/".join( byPath )
        return byPath

        security.declarePrivate('getObjectsByType')
    def getObjectsByType(self, byType):
        """
        """
        # получаем объекты по их типу
        # относительный путь онтологии (получить объекты только из данной онтологии)
        byPath = self.getPath()
        catalogtool = getToolByName( self, 'portal_catalog' )
        res = []
        # находим все объекты данного типа для данной онтологии
        for i in catalogtool.searchResults( portal_type = byType, path = {'query' : byPath} ):
            res.append( i.getObject() )
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
            return obj.getName() + ' ' + byName
            if ( obj.getName() == byName ):
                res.append( i.getObject() )
        return res
        
    security.declarePrivate('getClasses')
    def getClasses(self):
        """
        """
        # получаем все классы
        return self.getObjectsByType( 'OntoClass' )

    security.declarePrivate('getIndividuals')
    def getIndividuals(self):
        """
        """
        # получаем всех индивидов
        return self.getObjectsByType( 'OntoIndividual' )

    security.declarePrivate('getObjectProperties')
    def getObjectProperties(self):
        """
        """
        # получаем все объектные свойства
        return self.getObjectsByType( 'ObjectProperty' )

    security.declarePrivate('getDataProperties')
    def getDataProperties(self):
        """
        """
        # получаем все дата-свойства
        return self.getObjectsByType( 'DataProperty' )

    security.declarePrivate('create')
    def create(self, aType, aId, aTitle):
        """
        """
        # фабрика по добавлению новых объектов
        res = self.invokeFactory( aType 
                                , id = aId
                                , title = aTitle
                                )
        return res

    security.declarePublic('wo')
    def wo(self):
        """
        """
        #return self.delete('Заводной апельсин1',
        #                    {'type': 'OntoClass'}
        #                  )
        #return self.add('Зеленое яблоко', 
        #                   {
        #                     'type': 'OntoIndividual'
        #                   , 'name': 'Сиреневый апельсин'
        #                   , 'sourceClass': ['Апельсин']
        #                   , 'oProps': {'Имеет качество': 'Оранжевый апельсин'}
        #                   , 'dProps': {'Срок годности': 'Оранжевый апельсин'}
        #                   }
        #                )
        #return self.add( 'Зеленое яблоко',
        #                 {
        #                   'type': 'OntoIndividual'
        #                 , 'name': 'Зеленое яблоко'
        #                 , 'description': 'Конкретное зеленое яблоко'
        #                 , 'builtIn': 0
        #                 , 'sourceClass': ['Яблоко']
        #                 }
        #               )
        #return self.add( 'Оранжевый апельсин',
        #                 {
        #                   'type': 'OntoIndividual'
        #                 , 'name': 'Оранжевый апельсин'
        #                 , 'description': 'Конкретный оранжвый апельсин'
        #                 , 'builtIn': 0
        #                 , 'sourceClass': ['Апельсин']
        #                 }
        #               )
        return self.update('Оранжевый апельсин',
                           {
                             'type': 'OntoIndividual'
                           #, 'name': 'Оранжевый апельсин 1'
                           #, 'description': 'yohoho'
                           #, 'builtIn': 1
                           #, 'oProps': {'Имеет качество': 'Зеленое яблоко'}
                           , 'dProps': {'Срок годности': None}
                           }
                          )#6TsodQKnWCoc7vn2
        return 1

    security.declarePublic('workOut')
    def workOut(self, obj):
        """
        """
        self.add( obj['add'] )
        self.update( obj['update'] )
        return 1

    security.declarePublic('add')
    def add(self, obj_name, obj):
        """
        """
        # добавляем новый объект
        # сперва добавляем с основными свойствами, потом апдейтим дополнительными
        # иначе возникнет ошибка при апдейте класса, если свойства нет
        # или свойства при апдейте, если нет такого класса
        res = 1
        # получаем путь до онтологии (для дальнейших поисков внутри онтологии)
        byPath = self.getPath()
        # создаем объект
        new_obj_name = self.create( obj['type'], self.getNewId(), obj_name )
        # запоминаем имя объекта для его апдейта позже
        if ( new_obj_name is not None ):
            # обновляем созданный объект (устанавливаем дополнительные свойства)
            res = self[new_obj_name].update( obj, byPath )
        return res

    security.declarePublic('update')
    def update(self, obj_name, obj):
        """
        """
        # апдейтим новые объекты (работает только на удаление пока!)
        # получаем путь до онтологии (для дальнейших поисков внутри онтологии)
        byPath = self.getPath()
        # получаем объект по имени
#        return obj['type'] + ' ' + obj_name + ' ' + byPath + self['6TsodQKnWCoc7vn2'].title_or_id()
        #curr_obj = 
        return self.getObjectsByName( obj['type'], obj_name, byPath )#[0]
        
        res = curr_obj.update( obj, byPath )
        return res

    security.declarePublic('delete')
    def delete(self, obj_name, obj):
        """
        """
        # список изменений
        changeList = []
        # получаем путь до онтологии (для дальнейших поисков внутри онтологии)
        byPath = self.getPath()
        # получаем объект по имени
        del_obj = self.getObjectsByName( obj['type'], obj_name, byPath )
        for i in del_obj:
           # удаляем текущий объект
           changeList.append( { 'UID': i.UID(), 'name': i.getName(), 'id': i.getId() } )
           self.manage_delObjects( i.getId() )
        return changeList

registerType(Ontolet, PROJECTNAME)
# end of class Ontolet

##code-section module-footer #fill in your manual code here
##/code-section module-footer


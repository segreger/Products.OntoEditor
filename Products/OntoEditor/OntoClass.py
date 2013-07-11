# -*- coding: utf-8 -*-
#
# File: OntoClass.py
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

    StringField(
        name='description',
        widget=StringField._properties['widget'](
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
        name='rootclass',
        widget=BooleanField._properties['widget'](
            label='rootclass',
            label_msgid='OntoEditor_label_rootclass',
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
        name='subClassOf',
        widget=ReferenceBrowserWidget(
            label='Subclassof',
            label_msgid='OntoEditor_label_subClassOf',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass',),
        multiValued=1,
        relationship='sub_class_of',
    ),
    ReferenceField(
        name='hasKindOf',
        widget=ReferenceBrowserWidget(
            label='hasKindOf',
            label_msgid='OntoEditor_label_hasKindOf',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass',),
        multiValued=1,
        relationship='has_kind_of',
    ),
    ReferenceField(
        name='hasMetatype',
        widget=ReferenceBrowserWidget(
            label='hasMetatype',
            label_msgid='OntoEditor_label_hasMetatype',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('OntoClass',),
        multiValued=1,
        relationship='has_metatype',
    ),
),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

OntoClass_schema = BaseFolderSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class OntoClass(BaseFolder, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IOntoClass)

    meta_type = 'OntoClass'
    _at_rename_after_creation = True

    schema = OntoClass_schema

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
    
    security.declarePublic('getInfo')
    def getInfo(self):
        """
        """
        # возвращаем информацию по классу
        # name: <class_name>,
        # description: <class_description>,
        # address: <class_address>,
        # subClassOf: <class_subclassof>,
        # oProps: <class_object_properties>,
        # dProps: <class_data_properties>
        res = {}
        # если не встроенный
        if ( 1 ): #self.getBuiltIn() != 1 ):
            # вставляем обязательный параметр - имя
            res = { 
                      'name': self.getName()
                  }
            # вставляем описание, если не пустое
            tmp = self.getDescription()
            if ( tmp != '' ):
                res['description'] = tmp
            tmp = self.getAddress()
            if ( tmp != '' ):
                res['address'] = tmp
            tmp = self.getBuiltIn()
            if ( tmp ):
                res['builtIn'] = True
            # вставляем надкласс, если он существует
            tmp = self.getSubClassOf()
            if ( tmp != [] ):
                sub_class = []
                for i in tmp:
                    sub_class.append( i.getName() )
                res['subClassOf'] = sub_class                
            # вставляем объектное свойство, если есть
            tmp_obj = {}
            tmp = self.getObjectProps()
            if ( tmp != [] ):
                for i in tmp:
                    obj_info = i.getInfo()
                    tmp_obj['object_property'] = obj_info['range']
                res['oProps'] = tmp_obj
            # вставляем дата свойство, если есть
            tmp_data = {}
            tmp = self.getDataProps()
	    tmp_data['data_property']=[]
            if ( tmp != [] ):
                for i in tmp:
                    data_info = i.getInfo()
                    #tmp_data[data_info['data_property']] = data_info['range']
                    #tmp_data['data_property'] = data_info['range']
		    tmp_data['data_property'].append(data_info)
                    res['dProps'] = tmp_data
        # возвращаем информацию о классе
        return res        


    security.declarePublic('getObjectProps')
    def getObjectProps(self):
        """
        """
        # получаем все развязки объектного свойства данного класса
        props = []
        for item_name in self.keys():
            if ( self[item_name].meta_type == 'ClassObjectProperty' ):
                props.append( self[item_name] )
        return props

    security.declarePublic('ReleazeByComponent')
    def ReleazeByComponent(self):

        """
        # проверяем реализацию компонентом
        """
        props = self.getObjectProps()
        for i in props:
            if 'objectproperty' in i.getInfo().keys():
                if i.getInfo()['objectproperty'] == 'ReleazeByComponent':
                    range = i.getRange()
                    return range
        return None

    security.declarePublic('getDataProps')
    def getDataProps(self):
        """
        """
        # получаем все развязки дата свойства данного класса
        props = []
        for item_name in self.keys():
            if ( self[item_name].meta_type == 'ClassDataProperty' ):
                props.append( self[item_name] )
        return props        

    security.declarePublic('getProperties')
    def getProperties(self):
        """
        """
        pass

    security.declarePublic('getIndividuals')
    def getIndividuals(self):
        """
        """
        byPath = self.__parent__.getPath()
        catalogtool = getToolByName( self, 'portal_catalog' )
        lst = [ i.getObject() for i in catalogtool.searchResults( portal_type = 'OntoIndividual', path = {'query' : byPath} ) ]
        self.arr = []
        for item in lst:
            refs = item.getSourceClass()
            for i in refs:
                if ( self.UID() == i.UID() ):
                    self.arr.append( {'UID': item.UID(), 'Title': item.title_or_id()} )
        if ( len(self.arr) == 0 ):
            self.arr = ['']
        return self.arr

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
        
    security.declarePrivate('addClassProperty')
    def addClassProperty(self, aType, aId, aTitle):
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
        # изменяем имя
        if ( changes.has_key('name') ):
            f = self.getField('title')
            f.set( self, changes['name'] )
        # изменяем описание
        if ( changes.has_key('description') ):
            self.setDescription( changes['description'] )
        # изменяем адрес
        if ( changes.has_key('address') ):
            self.setAddress( changes['address'] )
        # изменяем параметр встроенный
        if ( changes.has_key('builtIn') ):
            self.setBuiltIn( changes['builtIn'] )
        # изменяем параметр родительские классы
        if ( changes.has_key('subClassOf') ):
            sCOf = []
            for i in changes['subClassOf']:
                 sCOf.append( self.getObjectsByName( 'OntoClass', i , byPath )[0].UID() )
            self.setSubClassOf( sCOf )
        # изменяем параметр объектного ограничения на классы
        if ( changes.has_key('oProps') ):
            for i in changes['oProps']:
                if ( changes['oProps'][i] is None ):
                    self.delete( i, 'ClassObjectProperty', byPath )
                else:
                    newId = self.getNewId()
                    newTitle = self.getName() + i + newId[:5]
                    new_obj_name = self.addClassProperty( 'ClassObjectProperty', newId, newTitle)
                    self[new_obj_name].update( i, changes['oProps'][i], byPath )
        # изменяем параметр дата ограничения на классы
        if ( changes.has_key('dProps') ):
            for i in changes['dProps']:
                if ( changes['dProps'][i] is None ):
                    self.delete( i, 'ClassDataProperty', byPath )
                else:
                    newId = self.getNewId()
                    newTitle = self.getName() + i + newId[:5]
                    new_data_name = self.addClassProperty( 'ClassDataProperty', newId, newTitle)
                    self[new_data_name].update( i, changes['dProps'][i], byPath )
        return self.getName()        

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

registerType(OntoClass, PROJECTNAME)
# end of class OntoClass

##code-section module-footer #fill in your manual code here
##/code-section module-footer


# -*- coding: utf-8 -*-
#
# File: IndDataProperty.py
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
        allowed_types=('OntoIndividual', 'OntoClass','Ontology'),
        multiValued=0,
        relationship='ind_data_range',
    ),
    ReferenceField(
        name='dataProperty',
        widget=ReferenceBrowserWidget(
            label='Dataproperty',
            label_msgid='OntoEditor_label_dataProperty',
            i18n_domain='OntoEditor',
        ),
        allowed_types=('DataProperty','ClassDataProperty',),
        multiValued=0,
        relationship='ind_data_property',
    ),
    StringField(
        name='value',
        widget=StringField._properties['widget'](
            label='Value',
            label_msgid='OntoEditor_label_value',
            i18n_domain='OntoEditor',
        ),
    ),

),
)

##code-section after-local-schema #fill in your manual code here
##/code-section after-local-schema

IndDataProperty_schema = BaseSchema.copy() + \
    schema.copy()

##code-section after-schema #fill in your manual code here
##/code-section after-schema

class IndDataProperty(BaseContent, BrowserDefaultMixin):
    """
    """
    security = ClassSecurityInfo()

    implements(interfaces.IIndDataProperty)

    meta_type = 'IndDataProperty'
    _at_rename_after_creation = True

    schema = IndDataProperty_schema

    ##code-section class-header #fill in your manual code here
    ##/code-section class-header

    # Methods
    security.declarePrivate('getName')
    def getName(self):
       """
       """
       # âîçâðàùàåì èìÿ ðàçâÿçêè äàòà ñâîéñòâà ìåæäó èíäèâèäàìè
       return self.title_or_id()
    
    security.declarePrivate('getInfo')
    def getInfo(self):
       """
       """
       # âîçâðàùàåì èíôîðìàöèþ ïî ðàçâÿçêè äàòà ñâîéñòâà ìåæäó èíäèâèäàìè
       #    name: <ind_data_property_name>,
       #    data_property: <data_property_name>,
       #    range: <range_individual_name>
       # âñòàâëÿåì îáÿçàòåëüíûé ïàðàìåòð - èìÿ
       res = {
                 'name': self.getName()
             }
       # âñòàâëÿåì èìÿ äàòà ñâîéñòâà, åñëè ñóùåñòâóåò
       tmp = self.getDataProperty()
       if ( tmp is not None ):
           res['data_property'] = tmp.getName()
       # âñòàâëÿåì èìÿ ðýíæà, åñëè ñóùåñòâóåò
       tmp = self.getRange()
       if ( tmp is not None ):
           res['range'] = tmp.getName()
       # âîçâðàùàåì èíôîðìàöèþ î ðàçâÿçêå äàòà ñâîéñòâà ìåæäó èíäèâèäàìè
       return res

    security.declarePrivate('getObjectsByName')
    def getObjectsByName(self, byType, byName, byPath):
        """
        """
        # ïîëó÷àåì îáúåêòû ïî èìåíè
        catalogtool = getToolByName( self, 'portal_catalog' )
        res = []
        # íàõîäèì âñå îáúåêòû äàííîãî òèïà äëÿ äàííîé îíòîëîãèè
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
        # îáíîâëÿåì äàííûå äëÿ îãðàíè÷åíèÿ
        # èçìåíÿåì ñâîéñòâî
        tmp = self.getObjectsByName( 'DataProperty', byDProperty, byPath )
        if ( tmp == [] ):
            return 'Error of getting DataProperty ' + byDProperty + ' in ' + byPath
        self.setDataProperty( tmp[0].UID() )
        # èçìåíÿåì ðýíæ
        tmp = self.getObjectsByName( 'OntoIndividual', byRange, byPath )
        if ( tmp == [] ):
            return 'Error of getting Range (OntoIndivdual) ' + byRange + ' in ' + byPath
        self.setRange( tmp[0].UID() )
        return self.getName()

registerType(IndDataProperty, PROJECTNAME)
# end of class IndDataProperty

##code-section module-footer #fill in your manual code here
##/code-section module-footer


# -*- coding: utf-8 -*-
#
# File: OntoEditor.py
#
# Copyright (c) 2011 by []
# Generator: ArchGenXML Version 2.5
#            http://plone.org/products/archgenxml
#
# GNU General Public License (GPL)
#

__author__ = """unknown <unknown>"""
__docformat__ = 'plaintext'



# Product configuration.

#

# The contents of this module will be imported into __init__.py, the

# workflow configuration and every content type module.

#

# If you wish to perform custom configuration, you may put a file

# AppConfig.py in your product's root directory. The items in there

# will be included (by importing) in this file if found.



from Products.CMFCore.permissions import setDefaultRoles



##code-section config-head #fill in your manual code here
##/code-section config-head




PROJECTNAME = "OntoEditor"



# Permissions

DEFAULT_ADD_CONTENT_PERMISSION = "Add portal content"

setDefaultRoles(DEFAULT_ADD_CONTENT_PERMISSION, ('Manager', 'Owner', 'Contributor'))



ADD_CONTENT_PERMISSIONS = {
    'Ontology': 'OntoEditor: Add Ontology',
    'OntoClass': 'OntoEditor: Add OntoClass',
    'OntoIndividual': 'OntoEditor: Add OntoIndividual',
    'ObjectProperty': 'OntoEditor: Add ObjectProperty',
    'DataProperty': 'OntoEditor: Add DataProperty',
    'IndObjectProperty': 'OntoEditor: Add IndObjectProperty',
    'ClassToIndObjectProperty': 'OntoEditor: Add ClassToIndObjectProperty',
    'IndDataProperty': 'OntoEditor: Add IndDataProperty',
    'ClassObjectProperty': 'OntoEditor: Add ClassObjectProperty',
    'ClassDataProperty': 'OntoEditor: Add ClassDataProperty',
	'ClassToIndObjectProperty': 'OntoEditor: Add ClassToIndObjectProperty',
}

setDefaultRoles('OntoEditor: Add Ontology', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add OntoClass', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add OntoIndividual', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add ObjectProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add DataProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add IndObjectProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add ClassToIndObjectProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add IndDataProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add ClassObjectProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add ClassDataProperty', ('Manager','Owner'))
setDefaultRoles('OntoEditor: Add ClassToIndObjectProperty', ('Manager','Owner'))
product_globals = globals()

# Dependencies of Products to be installed by quick-installer

# override in custom configuration

DEPENDENCIES = []

# Dependend products - not quick-installed - used in testcase

# override in custom configuration

PRODUCT_DEPENDENCIES = []

##code-section config-bottom #fill in your manual code here
##/code-section config-bottom

# Load custom configuration not managed by archgenxml

try:

    from Products.OntoEditor.AppConfig import *

except ImportError:

    pass


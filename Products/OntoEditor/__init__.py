import logging

logger = logging.getLogger('OntoEditor')

logger.debug('Installing Product')
import os
import os.path
from Globals import package_home
import Products.CMFPlone.interfaces
from Products.Archetypes import listTypes
from Products.Archetypes.atapi import *
from Products.Archetypes.utils import capitalize
from Products.CMFCore import DirectoryView
from Products.CMFCore import permissions as cmfpermissions
from Products.CMFCore import utils as cmfutils
from Products.CMFPlone.utils import ToolInit
from config import *

DirectoryView.registerDirectory('skins', product_globals)

##code-section custom-init-head #fill in your manual code here
##/code-section custom-init-head

def initialize(context):

    """initialize product (called by zope)"""

    ##code-section custom-init-top #fill in your manual code here
    ##/code-section custom-init-top




    # imports packages and types for registration
    import browser
    import Ontology
    import Ontolet
    import OntoClass
    import OntoIndividual
    import ObjectProperty
    import DataProperty
    import IndObjectProperty
    import IndDataProperty
    import ClassObjectProperty
    import ClassDataProperty
    import ClassToIndObjectProperty
    # Initialize portal content
    all_content_types, all_constructors, all_ftis = process_types(
        listTypes(PROJECTNAME),
        PROJECTNAME)
    cmfutils.ContentInit(

        PROJECTNAME + ' Content',

        content_types      = all_content_types,

        permission         = DEFAULT_ADD_CONTENT_PERMISSION,

        extra_constructors = all_constructors,

        fti                = all_ftis,

        ).initialize(context)



    # Give it some extra permissions to control them on a per class limit

    for i in range(0,len(all_content_types)):

        klassname=all_content_types[i].__name__

        if not klassname in ADD_CONTENT_PERMISSIONS:

            continue



        context.registerClass(meta_type   = all_ftis[i]['meta_type'],

                              constructors= (all_constructors[i],),

                              permission  = ADD_CONTENT_PERMISSIONS[klassname])







    ##code-section custom-init-bottom #fill in your manual code here
    ##/code-section custom-init-bottom






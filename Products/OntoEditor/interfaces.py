# -*- coding: utf-8 -*-

from zope.interface import Interface

##code-section HEAD
##/code-section HEAD

class IOntology(Interface):
    """Marker interface for .Ontology.Ontology
    """
class IOntolet(Interface):
    """Marker interface for .Ontology.Ontology
    """
class IOntoClass(Interface):
    """Marker interface for .OntoClass.OntoClass
    """

class IOntoIndividual(Interface):
    """Marker interface for .OntoIndividual.OntoIndividual
    """

class IObjectProperty(Interface):
    """Marker interface for .ObjectProperty.ObjectProperty
    """

class IDataProperty(Interface):
    """Marker interface for .DataProperty.DataProperty
    """

class IIndObjectProperty(Interface):
    """Marker interface for .IndObjectProperty.IndObjectProperty
    """

class IClassToIndObjectProperty(Interface):
    """Marker interface for .ClassToIndObjectProperty.ClassToIndObjectProperty
    """

class IIndDataProperty(Interface):
    """Marker interface for .IndDataProperty.IndDataProperty
    """

class IClassObjectProperty(Interface):
    """Marker interface for .ClassObjectProperty.ClassObjectProperty
    """

class IClassDataProperty(Interface):
    """Marker interface for .ClassDataProperty.ClassDataProperty
    """

##code-section FOOT
##/code-section FOOT

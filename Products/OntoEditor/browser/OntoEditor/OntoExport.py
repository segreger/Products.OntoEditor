class IOntoElementVisitor():
    __module__ = __name__

    def visitOntology(Ontology):
        """Visit all Ontology elements"""
        pass


    def visitOntoClass(OntoClass):
        """Visit OntoClass"""
        pass


    def visitOntoIndividual(OntoIndividual):
        """Visit OntoIndividual"""
        pass


    def visitObjectProperty(ObjectProperty):
        """Visit Object Property"""
        pass


    def visitDataProperty(DataProperty):
        """Visit Data Property"""
        pass


class OWLPrintExporter(IOntoElementVisitor):
    __module__ = __name__

    def visitOntoClass(OntoClass):
        print 'Visiting Class...'



    def visitOntoIndividual(OntoIndividual):
        print 'Visiting Individual...'



    def visitObjectProperty(ObjectProperty):
        print 'Visiting Object Property...'



    def visitDataProperty(DataProperty):
        print 'Visiting Data Property...'



class OntoExport():
    __module__ = __name__

    def __init__(self):
        self.catalogtool = getToolByName(self, 'portal_catalog')




#+++ okay decompyling
# decompiled 1 files: 1 okay, 0 failed, 0 verify failed

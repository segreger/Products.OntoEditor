from Acquisition import aq_inner
from zope.component import getMultiAdapter
from zope.interface import alsoProvides
from Products.Five import BrowserView

from plone.memoize.view import memoize

from plone.app.layout.globals.interfaces import IViewView


class PageView(BrowserView):
    """
    PFG Quick Editor (interactive form editor)
    """

    def __init__(self, context, request):
        # mark this view with IViewView so that we get
        # content actions
        #alsoProvides(self, IViewView)

        self.context = context
        self.request = request
    def full_code(self):
        page=[]
        tags={'HTML_header1':["<h1>","</h1>"], 'HTML_paragraph':["<p>","</p>"], 'HTML_header2':["<h2>","</h2>"],} 
        list_obj=self.context.listFolderContents()
        list_type=[i.Type() for i in list_obj]
        for item in list_obj:
            page.append(tags[item.Type()][0]+item.tag_value+tags[item.Type()][1])
    

        return page
    
    @memoize
    def mymethod(self):
        pass



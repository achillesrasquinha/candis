# imports - standard imports
try:
    from urlparse import urljoin
except ImportError:
    from urllib.parse import urljoin

_format    = 'e{name}.fcgi'

class URL(object):
    BASE   = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
    INFO   = urljoin(BASE, _format.format(name = 'info'))
    SEARCH = urljoin(BASE, _format.format(name = 'search'))
    SUMMARY= urljoin(BASE, _format.format(name = 'summary'))


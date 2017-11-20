#!/usr/bin/env python

import os
import urllib
import json
import endpoints
import os

from datetime import datetime

from messages.checkInMessages import CheckInMessage, CheckInResponseMessage

from google.appengine.api import users
from google.appengine.ext import ndb

from google.appengine.api.taskqueue import taskqueue
from google.appengine.ext import ndb
from protorpc import message_types
from protorpc import remote

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

DEFAULT_GUESTBOOK_NAME = 'default_guestbook'

def guestbook_key(guestbook_name=DEFAULT_GUESTBOOK_NAME):
    """Constructs a Datastore key for a Guestbook entity.

    We use guestbook_name as the key.
    """
    return ndb.Key('Guestbook', guestbook_name)


# [START greeting]
class Author(ndb.Model):
    """Sub model for representing an author."""
    identity = ndb.StringProperty(indexed=False)
    email = ndb.StringProperty(indexed=False)


class Greeting(ndb.Model):
    """A main model for representing an individual Guestbook entry."""
    author = ndb.StructuredProperty(Author)
    content = ndb.StringProperty(indexed=False)
    date = ndb.DateTimeProperty(auto_now_add=True)
# [END greeting]


# [START main_page]
@endpoints.api(name='timetracker', version='v1',
        allowed_client_ids=[endpoints.API_EXPLORER_CLIENT_ID],
        scopes=[])

class MainPage(remote.Service):

    @endpoints.method(CheckInMessage, CheckInResponseMessage,
    path = 'check_in', http_method = 'POST', name = 'check_in')
    def check_in(self, request):
        date = datetime.now()
        if date.hour >= 7 and date.hour < 9:
            return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto")
        elif date.hour == 9 and date.minute == 00:
            return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto")
        elif date.hour < 7 or date.hour > 19:
            return CheckInResponseMessage(response_code = 405, response_status = "Fuera de hora")
        else:
            return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto. Se ha generado un reporte")



    def post(self):
        # We set the same parent key on the 'Greeting' to ensure each
        # Greeting is in the same entity group. Queries across the
        # single entity group will be consistent. However, the write
        # rate to a single entity group should be limited to
        # ~1/second.
        guestbook_name = self.request.get('guestbook_name',
                                          DEFAULT_GUESTBOOK_NAME)
        greeting = Greeting(parent=guestbook_key(guestbook_name))

        if users.get_current_user():
            greeting.author = Author(
                    identity=users.get_current_user().user_id(),
                    email=users.get_current_user().email())

        greeting.content = self.request.get('content')
        greeting.put()

        query_params = {'guestbook_name': guestbook_name}
        self.redirect('/?' + urllib.urlencode(query_params))
# [END guestbook]

application = endpoints.api_server([MainPage], restricted=False)

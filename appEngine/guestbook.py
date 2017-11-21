#!/usr/bin/env python

# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START imports]
import os
import urllib
import json

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2

from protorpc import message_types
from protorpc import remote

from login.timetrackerlogin import LoginMessage, LoginMessageResponse
import endpoints
JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

DEFAULT_GUESTBOOK_NAME = 'default_guestbook'


# We set a parent key on the 'Greetings' to ensure that they are all
# in the same entity group. Queries across the single entity group
# will be consistent. However, the write rate should be limited to
# ~1/second.

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

class Perfil(ndb.Model):
    email = ndb.StringProperty(indexed=True)

@endpoints.api(name='timeTracker', version='v1',
            allowed_client_ids=["1001374037432-ahu9hf73400ijjj3orjt7gi212n9m9vc.apps.googleusercontent.com"],
	        scopes=[endpoints.EMAIL_SCOPE])



# [START main_page]
class MainPage(remote.Service):

# [END main_page]

    @endpoints.method(LoginMessage, LoginMessageResponse, path='login', http_method='POST',
    name='login')
    def login(self, request):
        current_user = endpoints.get_current_user().email()
        profile = Perfil.query(Perfil.email == current_user).get()
        if profile is None: 
            profile = Perfil()
            profile.email = current_user
            profile.put()
            print ("nuevo user")
            return LoginMessageResponse(response_code=200, email=current_user, name=current_user)
        else:
            print ("entre por aqui")
            profile = Perfil()
            profile.email = "estoesunemail@email.com"
            profile.put()
            return LoginMessageResponse(response_code=200, email=current_user, name=current_user)
# [START guestbook]




# [START app]
application = endpoints.api_server([MainPage], restricted=False)
# [END app]

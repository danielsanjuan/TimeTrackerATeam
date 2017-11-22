#!/usr/bin/env python

import os
import urllib
import json
import endpoints
import os

from datetime import datetime

from messages.checkInMessages import CheckInMessage, CheckInResponseMessage, CheckOutMessage, CheckOutResponseMessage
from messages.timetrackerlogin import LoginMessage, LoginMessageResponse

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

class Workday(ndb.Model):
    checkin = ndb.DateTimeProperty(indexed=True)
    checkout = ndb.DateTimeProperty(indexed=True)

class Employee(ndb.Model):
    name = ndb.StringProperty(indexed=True)
    email = ndb.StringProperty(indexed=True)
    role = ndb.StringProperty(indexed=True)
    workday = ndb.StructuredProperty(Workday, repeated=True)

employee = Employee()
# [START main_page]
@endpoints.api(name='timetracker', version='v1',
        allowed_client_ids=['678273591464-2donjmj0olnnsvmsp1308fd3ufl818dm.apps.googleusercontent.com'],
        scopes=[endpoints.EMAIL_SCOPE])

class MainPage(remote.Service):

    @endpoints.method(CheckInMessage, CheckInResponseMessage,
    path = 'check_in', http_method = 'POST', name = 'check_in')
    def check_in(self, request):
        date = datetime.now()
        # query = Employee.query()
        # query = query.filter(Employee.email == request.email).get()
        # workday = Workday (checkin=date)
        # query.workday.append(workday)
        # query.put()
        if date.hour >= 7 and date.hour < 9:
            return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto")
        elif date.hour == 9 and date.minute == 00:
            return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto")
        elif date.hour < 7 or date.hour > 19:
            return CheckInResponseMessage(response_code = 406, response_status = "Check in fuera de hora")
        else:
            return CheckInResponseMessage(response_code = 202, response_status = "Check in correcto. Se ha generado un reporte")

    @endpoints.method(CheckOutMessage, CheckOutResponseMessage,
    path = 'check_out', http_method = 'POST', name = 'check_out')
    def check_out(self, request):
        date = datetime.now()
        print employee.email()
        if date.hour >= 14 and date.hour < 19:
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto")
        elif date.hour == 19 and date.minute == 00:
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto")
        elif date.hour < 7 or date.hour > 19:
            return CheckOutResponseMessage(response_code = 406, response_status = "Check out fuera de hora")
        else:
            return CheckOutResponseMessage(response_code = 202, response_status = "Check out correcto. Se ha generado un reporte")


    @endpoints.method(LoginMessage, LoginMessageResponse, path='login', http_method='POST', name='login')
    def login(self, request):
        current_user = endpoints.get_current_user()
        profile = Employee.query(Employee.email == current_user.email()).get()
        employee = current_user
        if profile is None:
            profile = Employee()
            profile.name = current_user.nickname()
            profile.email = current_user.email()
            profile.put()
            return LoginMessageResponse(response_code=200, email=profile.email, name=profile.name)
        else:
            return LoginMessageResponse(response_code=300, email=current_user.email(), name=current_user.nickname())
# [END guestbook]

application = endpoints.api_server([MainPage], restricted=False)

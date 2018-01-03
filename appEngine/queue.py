#!/usr/bin/env python

from google.appengine.ext import ndb
import webapp2
from datetime import datetime

class Workday(ndb.Model):
    checkin = ndb.DateTimeProperty(indexed=True)
    checkout = ndb.DateTimeProperty(indexed=True)
    employee = ndb.StructuredProperty(Employee, indexed=True)

@endpoints.api(name='queue', version='v1',
        allowed_client_ids=['678273591464-2donjmj0olnnsvmsp1308fd3ufl818dm.apps.googleusercontent.com'],
        scopes=[endpoints.EMAIL_SCOPE])
class QueuePage(webapp2.RequestHandler):

    def autoCheckOut(self):
        query = Workday.query()
        query = query.filter(Workday.checkout == None).fetch()
        for day in query:
            day.checkout = datetime.now()
            day.put()
        return 200

application = endpoints.api_server([MainPage], restricted=False)

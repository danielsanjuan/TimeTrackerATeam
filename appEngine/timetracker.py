#!/usr/bin/env python

import urllib
import endpoints
import os
import json

from datetime import datetime, timedelta

from messages.checkInMessages import CheckInMessage, CheckInResponseMessage, CheckOutMessage, CheckOutResponseMessage, CheckInGetMessage
from messages.timetrackerlogin import LoginMessage, LoginMessageResponse

from google.appengine.api import users
from google.appengine.ext import ndb

from google.appengine.api.taskqueue import taskqueue
from protorpc import message_types
from protorpc import remote

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

class Employee(ndb.Model):
    name = ndb.StringProperty(indexed=True)
    email = ndb.StringProperty(indexed=True)
    role = ndb.IntegerProperty(indexed=True)
    status = ndb.BooleanProperty(indexed=True)

class Workday(ndb.Model):
    checkin = ndb.DateTimeProperty(indexed=True)
    checkout = ndb.DateTimeProperty(indexed=True)
    employee = ndb.StructuredProperty(Employee, indexed=True)

# [START main_page]
@endpoints.api(name='timetracker', version='v1',
        allowed_client_ids=['678273591464-2donjmj0olnnsvmsp1308fd3ufl818dm.apps.googleusercontent.com'],
        scopes=[endpoints.EMAIL_SCOPE])

class MainPage(remote.Service):
    def set_checkin(self, date, email):
        query = Employee.query()
        query = query.filter(Employee.email == email).get()
        workday = Workday (
            checkin=date,
            employee=Employee (name=query.name,email=query.email,role=query.role)
        )
        workday.put()

    def set_checkout(self, date, email):
        query = Workday.query()
        query = query.filter(Workday.employee.email == email)
        query = query.filter(Workday.checkout == None).get()
        query.checkout = date
        query.put()

    def filter_checkin(self, date, email):
        query = Workday.query()
        if query is None:
            return False
        else:
            query = query.filter(Workday.employee.email == email).fetch()
            for workday in query:
                if datetime(workday.checkin.year, workday.checkin.month, workday.checkin.day) == datetime(date.year, date.month, date.day):
                    return True
            return False

    @endpoints.method(CheckInMessage, CheckInResponseMessage,
    path = 'check_in', http_method = 'POST', name = 'check_in')
    def check_in(self, request):
        date = datetime.now()
        if self.filter_checkin(date, request.email):
            return CheckInResponseMessage(response_code = 500, response_status = "Solo se permite un checkin diario", response_date = date.strftime("%y%b%d%H:%M:%S"))
        else:
            if date.hour >= 7 and date.hour < 9:
                self.set_checkin(date, request.email)
                return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
            elif date.hour == 9 and date.minute == 00:
                self.set_checkin(date, request.email)
                return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
            elif date.hour < 7 or date.hour > 19:
                return CheckInResponseMessage(response_code = 406, response_status = "Check in fuera de hora", response_date = date.strftime("%y%b%d%H:%M:%S"))
            else:
                self.set_checkin(date, request.email)
                return CheckInResponseMessage(response_code = 202, response_status = "Check in correcto. Se ha generado un reporte", response_date = date.strftime("%y%b%d%H:%M:%S"))

    @endpoints.method(CheckOutMessage, CheckOutResponseMessage,
    path = 'check_out', http_method = 'POST', name = 'check_out')
    def check_out(self, request):
        date = datetime.now()
        if date.hour >= 14 and date.hour < 19:
            self.set_checkout(date, request.email)
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
        elif date.hour == 19 and date.minute == 00:
            self.set_checkout(date, request.email)
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
        elif date.hour < 7 or date.hour > 19:
            return CheckOutResponseMessage(response_code = 406, response_status = "Check out fuera de hora", response_date = date.strftime("%y%b%d%H:%M:%S"))
        else:
            self.set_checkout(date, request.email)
            return CheckOutResponseMessage(response_code = 202, response_status = "Check out correcto. Se ha generado un reporte", response_date = date.strftime("%y%b%d%H:%M:%S"))


    @endpoints.method(LoginMessage, LoginMessageResponse, path='login', http_method='POST', name='login')
    def login(self, request):
        current_user = endpoints.get_current_user()
        profile = Employee.query(Employee.email == current_user.email()).get()
        if profile is None:
            employee = Employee(
                name=request.name,
                email=current_user.email(),
                role=0
            )
            employee.put()
            return LoginMessageResponse(response_code=200, email=employee.email, name=employee.name)
        else:
            return LoginMessageResponse(response_code=300, email=current_user.email(), name=request.name)

    @endpoints.method(CheckInMessage, CheckInGetMessage, path='getCheckin', http_method='GET', name='getCheckin')
    def getCheckin(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        for day in query:
            if day.checkin.isocalendar()[2] == datetime.now().isocalendar()[2] and day.checkin.isocalendar()[1] == datetime.now().isocalendar()[1] and day.checkin.isocalendar()[0] == datetime.now().isocalendar()[0]:
                return CheckInGetMessage(response_date=str(day.checkin))
        return CheckInGetMessage(response_date="No hay fecha de checkin")




    # @endpoints.method(ReportMessage, ReportResponseMessage, path='report', http_method='GET', name='report')
    # def report(self, request):
    #     day = datetime.today()
    #     if datetime.today().isocalendar()[2] != 1:
    #         query = Employee.query().fetch()
    #         for currentEmployee in query:
    #             report =
    #             report =  report + "name:" + currentEmployee.name
    #             report1 = report + self.singleReport(currentEmployee, day)
    #         return ReportResponseMessage(response_code=200, response_report=report)
    #     return ReportResponseMessage(response_code=502, response_report="no existe reporte")

    # def singleReport(self, employee, date):
    #     report = {}
    #     weekdays = ['twilday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    #     currentDay = date.today()
    #     currentWeek = currentDay.isocalendar()[1]
    #     for day in employee.workday:
    #         if day.checkin.isocalendar()[1] == currentWeek:
    #             dayWorkTime = day.checkout.hour - day.checkin.hour
    #             print weekdays[day.checkin.isocalendar()[2]]
    #             #cogemos el dia de la semana del isocalendar que va de 1 a 7
    #             report =({weekdays[day.checkin.isocalendar()[2]]: dayWorkTime})
    #     return json.dumps(report, dayWorkTime)








# [END guestbook] dayWorkTime = day.check_out - day.check_in

application = endpoints.api_server([MainPage], restricted=False)

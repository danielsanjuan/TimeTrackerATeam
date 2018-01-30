#!/usr/bin/env python

import urllib
import endpoints
import os
import json
import calendar
from protorpc import messages
from datetime import datetime, timedelta, time

from messages.checkInMessages import CheckInMessage, CheckInResponseMessage, CheckOutMessage, CheckOutResponseMessage, CheckResponse, GetTimeWorkedTodayReponse
from messages.timetrackerlogin import LoginMessage, LoginMessageResponse
from messages.reportMessages import ReportMessage, ReportDateMessage, ReportResponseMessage, JsonMessage
from messages.DateNowMessages import DateNowMessage, DateNowGetMessage
from messages.reportMonthlyMessages import ReportMonthlyMessage, ReportMonthlyMessageWithDate, ReportMonthlyResponseMessage, JsonMonthlyMessage, JsonSingleDayMessage
from messages.incidencesMessages import CheckIncidenceMessage, CheckIncidenceResponse, IncidencesReportMessage, IncidencesMessage, IncidencesReportResponseMessage, SolveIncidence, SolveIncidenceResponse, LogsResponse, Log
from messages.incidencesUsersListMessages import IncidencesUsersMessage, incidencesUsersListMessage, IncidencesUserListResponseMessage, JsonEmployee, EmployeeMessage, EmployeeMessageResponse
from messages.userListMessages import UserListMessage, UserListResponseMessage, JsonUserRoleMessage
from messages.changeRoleMessages import ChangeRoleMessages, ChangeRoleResponse, JsonChangedRoleEmployee
from messages.CompanyTimesMessages import CompanyTimesMessage, CompanyTimesResponseMessage, CompanyTimesSetResponseMessage
from messages.changeCheckHoursMessages import ChangeCheckHoursMessage, JsonChangeCheckHoursMessage, FixCheckHoursMessage, ChangeCheckHoursResponseMessage, FixHoursResponseMessage
from messages.userListIpMessages import JsonUserIPListMessage, JsonUserIPMessage, JsonUserMessage, IpMessage, UserIPResponse, PersonalIP, PersonalIPByWorkday, PersonalIPListResponse, FilterIpByDateMessage

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
    image = ndb.StringProperty(indexed=False)
    role = ndb.IntegerProperty(indexed=True)
    status = ndb.BooleanProperty(indexed=True)

class Workday(ndb.Model):
    checkin = ndb.DateTimeProperty(indexed=True)
    checkout = ndb.DateTimeProperty(indexed=True)
    employee = ndb.StructuredProperty(Employee, indexed=True)
    ipAddressIn = ndb.StringProperty(indexed=True)
    ipAddressOut = ndb.StringProperty(indexed=True)

class Incidences(ndb.Model):
    message = ndb.StringProperty(indexed=True)
    incidenceDate = ndb.DateTimeProperty(indexed=True)
    employee = ndb.StructuredProperty(Employee, indexed=True)
    check = ndb.BooleanProperty(indexed=True)
    solved = ndb.BooleanProperty(indexed=True)

class CompanyTimes(ndb.Model):
    checkinmin = ndb.StringProperty(indexed=True)
    checkinmax = ndb.StringProperty(indexed=True)
    checkoutmin = ndb.StringProperty(indexed=True)
    checkoutmax = ndb.StringProperty(indexed=True)
    checkoutminfriday = ndb.StringProperty(indexed=True)
    checkoutmaxfriday = ndb.StringProperty(indexed=True)

class Logs(ndb.Model):
    hrm = ndb.StringProperty(indexed=True)
    employee = ndb.StringProperty(indexed=True)
    changesIn = ndb.StringProperty(indexed=True)
    changesOut = ndb.StringProperty(indexed=True)
    dateLog = ndb.DateTimeProperty(indexed=True)

def autoCheckOut(self, request):
    mainPage = MainPage()
    date = datetime.now()
    if date.weekday() == 4:
        date = str(date).split(' ')[0]
        date = date + " 15:00:00.000000"
    else:
        date = str(date).split(' ')[0]
        date = date + " 19:00:00.000000"
    date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f")
    query = Workday.query()
    query = query.filter(Workday.checkout == None).fetch()
    for userWithoutCheckOut in query:
        userWithoutCheckOut.checkout = date
        userWithoutCheckOutself.ipAddressOut = "auto"
        userWithoutCheckOut.put()
        mainPage.set_incidences(" didn't check out, this is the automatic check out", date, userWithoutCheckOut.employee.email, False)
    response = {"status": "200"}
    return response

# [START main_page]
@endpoints.api(name='timetracker', version='v1',
        allowed_client_ids=['678273591464-2donjmj0olnnsvmsp1308fd3ufl818dm.apps.googleusercontent.com'],
        scopes=[endpoints.EMAIL_SCOPE])

class MainPage(remote.Service):

    def createLogs(self, workday, request, check_in, check_out, newCheckin=0, newCheckout=0):
        if check_in and check_out:
            logs = Logs (hrm=request.hrm, employee=workday.employee.email,
            changesIn=str(request.hrm) + " has updated field checkin with date: " + str(workday.checkin) + ", to date: " + str(newCheckin) + ", from this employee: " + str(workday.employee.email),
            changesOut=str(request.hrm) + " has updated field checkout with date: " + str(workday.checkout) + ", to date: " + str(newCheckout) + ", from this employee: " + str(workday.employee.email),
            dateLog=datetime.now()).put()
        elif check_in:
            logs = Logs (hrm=request.hrm, employee=workday.employee.email,
            changesIn=str(request.hrm) + " has updated field checkin with date: " + str(workday.checkin) + ", to date: " + str(newCheckin) + ", from this employee: " + str(workday.employee.email),
            dateLog=datetime.now()).put()
        elif check_out:
            logs = Logs (hrm=request.hrm, employee=workday.employee.email,
            changesOut=str(request.hrm) + " has updated field checkout with date: " + str(workday.checkout) + ", to date: " + str(newCheckout) + ", from this employee: " + str(workday.employee.email),
            dateLog=datetime.now()).put()
        else:
            logs = Logs (hrm=request.hrm, employee=workday.employee.email,
            changesOut=str(request.hrm) + " has seen the incidence: " + str(workday.employee.email) + " on: " + str(workday.checkin) + " and was solved without changes",
            dateLog=datetime.now()).put()

    def set_companyTimes(self, checkinminMT, checkinmaxMT, checkoutminMT, checkoutmaxMT, checkoutminF, checkoutmaxF):
        query = CompanyTimes.query().get()
        if query is None:
            company = CompanyTimes (
                checkinmin= checkinminMT,
                checkinmax = checkinmaxMT,
                checkoutmin = checkoutminMT,
                checkoutmax = checkoutmaxMT,
                checkoutminfriday = checkoutminF,
                checkoutmaxfriday = checkoutmaxF
            ).put()
        else:
            query.checkinmin = checkinminMT
            query.checkinmax = checkinmaxMT
            query.checkoutmin = checkoutminMT
            query.checkoutmax = checkoutmaxMT
            query.checkoutminfriday = checkoutminF
            query.checkoutmaxfriday = checkoutmaxF
            query.put()

    def set_checkin(self, date, email, ip):
        query = Employee.query()
        query = query.filter(Employee.email == email).get()
        workday = Workday (
            checkin=date,
            employee=Employee (name=query.name,email=query.email,role=query.role),
            ipAddressIn=ip,
            ipAddressOut="-"
        )
        workday.put()

    def set_checkout(self, date, email, ip):
        query = Workday.query()
        query = query.filter(Workday.employee.email == email)
        query = query.filter(Workday.checkout == None).get()
        query.checkout = date
        query.ipAddressOut = ip
        query.put()

    def filter_checkin(self, date, email):
        count = 1
        query = Workday.query()
        if query is None:
            return count
        else:
            query = query.filter(Workday.employee.email == email)
            for workday in query:
                if workday.checkin.date() == date.date() and count <= 3:
                    count = count + 1
                if count > 3:
                    return count
            return count

    def singleReport(self, currentEmployee, date):
        report = JsonMessage()
        week = date.isocalendar()[1]
        query = Workday.query()
        query = query.filter(Workday.employee.email == currentEmployee.email).fetch()
        report.name = currentEmployee.name
        report.monday = 0
        report.tuesday = 0
        report.wednesday = 0
        report.thursday = 0
        report.friday = 0
        report.saturday = 0
        report.sunday = 0
        report.email = currentEmployee.email
        monday = tuesday = wednesday = thursday = friday = saturday = sunday = 0

        for worked in query:
            if worked.checkin.isocalendar()[0] == date.year and worked.checkin.isocalendar()[1] == week and worked.checkout != None:
                if worked.checkin.isocalendar()[2] == 1:
                    monday = monday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.monday = monday/60
                elif worked.checkin.isocalendar()[2] == 2:
                    tuesday = tuesday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.tuesday = tuesday/60
                elif worked.checkin.isocalendar()[2] == 3:
                    wednesday = wednesday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.wednesday = wednesday/60
                elif worked.checkin.isocalendar()[2] == 4:
                    thursday = thursday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.thursday = thursday/60
                elif worked.checkin.isocalendar()[2] == 5:
                    friday = friday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.friday = friday/60
                elif worked.checkin.isocalendar()[2] == 5:
                    saturday = saturday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.saturday = saturday/60
                elif worked.checkin.isocalendar()[2] == 5:
                    sunday = sunday + int((worked.checkout - worked.checkin).total_seconds())/60
                    report.sunday = sunday/60
        report.total = monday + tuesday + wednesday + thursday + friday + saturday + sunday
        report.totalhm = '{:02d}:{:02d}'.format(*divmod(report.total, 60))
        return report

    def singleMonthlyReport(self, currentEmployee, date):
        if date.month == 1:
            currentmonth = 12
            currentyear = date.year-1
        else:
            currentmonth = date.month - 1
            currentyear = date.year
        query = Workday.query()
        query = query.filter(Workday.employee.email == currentEmployee.email).fetch()
        dayOfMoth = [0] * calendar.monthrange(currentyear, currentmonth)[1]
        reportMonth = JsonMonthlyMessage()
        reportMonth.hours_day = []
        reportMonth.name = currentEmployee.name
        reportMonth.month = int(currentmonth)
        reportMonth.jornadas = 0
        reportMonth.total = 0
        reportMonth.year = int(currentyear)

        for worked in query:
            if worked.checkin.isocalendar()[0] == currentyear and worked.checkin.month == currentmonth and worked.checkout != None:
                dayOfMoth[worked.checkin.day-1] = dayOfMoth[worked.checkin.day-1] + int((worked.checkout - worked.checkin).total_seconds())/3600

        for i in range(0, len(dayOfMoth)-1):
            reportDay = JsonSingleDayMessage()
            if dayOfMoth[i] != 0:
                reportDay.hour = dayOfMoth[i]
                reportDay.day = i
                reportMonth.hours_day.append(reportDay)
                reportMonth.jornadas = reportMonth.jornadas + 1
                reportMonth.total = reportMonth.total+reportDay.hour
        return reportMonth

    def singleMonthlyReportWithDate(self, currentEmployee, date):
        query = Workday.query()
        query = query.filter(Workday.employee.email == currentEmployee.email).fetch()
        dayOfMoth = [0] * calendar.monthrange(date.year, date.month)[1]
        reportMonth = JsonMonthlyMessage()
        reportMonth.hours_day = []
        reportMonth.name = currentEmployee.name
        reportMonth.month = int(date.month)
        reportMonth.jornadas = 0
        reportMonth.total = 0
        reportMonth.year = int(date.year)

        for worked in query:
            if worked.checkin.isocalendar()[0] == date.year and worked.checkin.month == date.month and worked.checkout != None:
                dayOfMoth[worked.checkin.day-1] = dayOfMoth[worked.checkin.day-1] + int((worked.checkout - worked.checkin).total_seconds())/3600

        for i in range(0, len(dayOfMoth)-1):
            reportDay = JsonSingleDayMessage()
            if dayOfMoth[i] != 0:
                reportDay.hour = dayOfMoth[i]
                reportDay.day = i
                reportMonth.hours_day.append(reportDay)
                reportMonth.jornadas = reportMonth.jornadas + 1
                reportMonth.total = reportMonth.total+reportDay.hour
        return reportMonth

    def set_incidences(self, message, date, email, check):
        query = Employee.query()
        query = query.filter(Employee.email == email).get()
        finalMessage = query.name + message
        incidences = Incidences (
            message= finalMessage,
            incidenceDate=date,
            employee=Employee (name=query.name,email=query.email,role=query.role,image=query.image),
            check=check,
            solved=False
        )
        incidences.put()

    def incidencesList(self, oneIncidence):
        incidence = IncidencesMessage()
        incidence.date = str(oneIncidence.incidenceDate)
        incidence.message = oneIncidence.message
        return incidence

    def getSingleUser(self, employee):
        user = JsonUserRoleMessage()
        user.name = employee.name
        user.email = employee.email
        user.role = employee.role
        user.image = employee.image
        return user

    def filterIPByEmail(self, query):
        personalIPByWorkday = PersonalIPByWorkday(
            date="-",
            ip1="-",
            ip2="-",
            ip3="-",
            ip4="-",
            ip5="-",
            ip6="-"
        )
        array = []
        x = 0
        pos = 0
        for workday in query:
            if x != workday.checkin.date():
                if pos >= 1:
                    array.append(personalIPByWorkday)
                    personalIPByWorkday = PersonalIPByWorkday(
                        date="-",
                        ip1="-",
                        ip2="-",
                        ip3="-",
                        ip4="-",
                        ip5="-",
                        ip6="-"
                    )
                    pos = 0
                x = workday.checkin.date()
                personalIPByWorkday.date = str(workday.checkin.date())
                personalIPByWorkday.ip1 = str(workday.ipAddressIn)
                pos = pos + 1
                personalIPByWorkday.ip2 = str(workday.ipAddressOut)
            else:
                if pos == 1:
                    personalIPByWorkday.ip3 = str(workday.ipAddressIn)
                    pos = pos + 1
                    personalIPByWorkday.ip4 = str(workday.ipAddressOut)
                elif pos == 2:
                    personalIPByWorkday.ip5 = str(workday.ipAddressIn)
                    pos = pos + 1
                    personalIPByWorkday.ip6 = str(workday.ipAddressOut)
        array.append(personalIPByWorkday)
        return array

    @endpoints.method(IpMessage, UserIPResponse, path = 'getDailyIpReport', http_method = 'GET', name = 'getDailyIpReport')
    def getDailyIpReport(self, request):
        jsonUserIPMessage = JsonUserIPMessage()
        jsonUserMessage  = JsonUserMessage()
        employees = Employee.query()
        array = []
        for employee in employees:
            userIPResponse = UserIPResponse()
            query = Workday.query()
            jsonUserIPMessage = JsonUserIPMessage()
            jsonUserIPMessage.response_list_employee = JsonUserMessage(
                    name=employee.name,
                    email=employee.email,
                    image=employee.image,
                    role=employee.role
                )
            jsonUserIPMessage.response_list_ip = JsonUserIPListMessage(
                    ip1="-",
                    ip2="-",
                    ip3="-",
                    ip4="-",
                    ip5="-",
                    ip6="-"
                )
            query = query.filter(Workday.employee.email == employee.email)

            pos = 0
            for workday in query:
                if workday.checkin.date() == datetime.strptime(request.date, "%d-%m-%Y").date() and pos == 0:
                    jsonUserIPMessage.response_list_ip.ip1 = str(workday.ipAddressIn)
                    pos = pos + 1
                    jsonUserIPMessage.response_list_ip.ip2 = str(workday.ipAddressOut)
                elif workday.checkin.date() == datetime.strptime(request.date, "%d-%m-%Y").date() and pos == 1:
                    jsonUserIPMessage.response_list_ip.ip3 = str(workday.ipAddressIn)
                    pos = pos + 1
                    jsonUserIPMessage.response_list_ip.ip4 = str(workday.ipAddressOut)
                elif workday.checkin.date() == datetime.strptime(request.date, "%d-%m-%Y").date() and pos == 2:
                    jsonUserIPMessage.response_list_ip.ip5 = str(workday.ipAddressIn)
                    pos = pos + 1
                    jsonUserIPMessage.response_list_ip.ip6 = str(workday.ipAddressOut)

            if pos >= 0:
                array.append(jsonUserIPMessage)
        return UserIPResponse(response_list = array)

    @endpoints.method(PersonalIP, PersonalIPListResponse, path = 'getPersonalIPList', http_method = 'GET', name = 'getPersonalIPList')
    def getPersonalIPList(self, request):
        query = Workday.query(Workday.employee.email == request.email)
        query = query.order(Workday.checkin).fetch()
        return PersonalIPListResponse(response_list = self.filterIPByEmail(query))

    @endpoints.method(FilterIpByDateMessage, PersonalIPListResponse, path = 'getPersonalIPWithRange', http_method = 'GET', name = 'getPersonalIPWithRange')
    def getPersonalIPWithRange(self, request):
        query = Employee.query()
        query = query.filter(Employee.email == request.email).get()
        query2 = Workday.query(Workday.employee.email == query.email)
        query2 = query2.order(Workday.checkin)
        x = 0
        pos = 0
        array = []
        personalIPByWorkday = PersonalIPByWorkday(date="-",ip1="-",ip2="-",ip3="-",ip4="-",ip5="-",ip6="-")
        for workday in query2:
            if workday.checkin.date() >= datetime.strptime(request.dateStart, "%Y-%m-%d").date() and workday.checkin.date() <= datetime.strptime(request.dateEnd, "%Y-%m-%d").date():
                if x != workday.checkin.date():
                    if pos >= 1:
                        array.append(personalIPByWorkday)
                        personalIPByWorkday = PersonalIPByWorkday(date="-",ip1="-",ip2="-",ip3="-",ip4="-",ip5="-",ip6="-")
                        pos = 0
                    x = workday.checkin.date()
                    personalIPByWorkday.date = str(workday.checkin.date())
                    personalIPByWorkday.ip1 = str(workday.ipAddressIn)
                    pos = pos + 1
                    personalIPByWorkday.ip2 = str(workday.ipAddressOut)
                else:
                    if pos == 1:
                        personalIPByWorkday.ip3 = str(workday.ipAddressIn)
                        pos = pos + 1
                        personalIPByWorkday.ip4 = str(workday.ipAddressOut)
                    elif pos == 2:
                        personalIPByWorkday.ip5 = str(workday.ipAddressIn)
                        pos = pos + 1
                        personalIPByWorkday.ip6 = str(workday.ipAddressOut)
        array.append(personalIPByWorkday)
        return PersonalIPListResponse(response_list = array)

    @endpoints.method(message_types.VoidMessage,CompanyTimesResponseMessage,
    path = 'getCompanyTimes', http_method = 'GET', name = 'getCompanyTimes')
    def getCompanyTimes(self, request):
        query = CompanyTimes.query().get()
        companySettings = CompanyTimesMessage()
        companySettings.checkinmax = query.checkinmax
        companySettings.checkinmin = query.checkinmin
        companySettings.checkoutmax =  query.checkoutmax
        companySettings.checkoutmaxfriday = query.checkoutmaxfriday
        companySettings.checkoutmin = query.checkoutmin
        companySettings.checkoutminfriday = query.checkoutminfriday
        return CompanyTimesResponseMessage(response = companySettings)

    @endpoints.method(CompanyTimesMessage, CompanyTimesSetResponseMessage,
    path = 'setCompanyTimes', http_method = 'POST', name = 'setCompanyTimes')
    def setCompanyTimes(self, request):
        if (request.checkinmin >= request.checkinmax or request.checkinmin >= request.checkoutmin or
        request.checkinmin >= request.checkoutmax or request.checkinmin >= request.checkoutminfriday or
        request.checkinmin >= request.checkoutmaxfriday):
            return CompanyTimesSetResponseMessage(response_code = 500)
        if(request.checkinmax >= request.checkoutmin or request.checkinmax >= request.checkoutmax or request.checkinmax >= request.checkoutminfriday or
        request.checkinmax >= request.checkoutmaxfriday):
            return CompanyTimesSetResponseMessage(response_code = 501)
        if(request.checkoutmin >= request.checkoutmax):
            return CompanyTimesSetResponseMessage(response_code = 502)
        if(request.checkoutminfriday >= request. checkoutmaxfriday):
            return CompanyTimesSetResponseMessage(response_code = 503)
        else:
            self.set_companyTimes(request.checkinmin, request.checkinmax, request.checkoutmin,
            request.checkoutmax, request.checkoutminfriday, request.checkoutmaxfriday)
            return CompanyTimesSetResponseMessage(response_code = 200)

    @endpoints.method(CheckInMessage, CheckInResponseMessage,
    path = 'check_in', http_method = 'POST', name = 'check_in')
    def check_in(self, request):
        date = datetime.now()
        hm = str(date.time())[0:5]
        companyTimes = CompanyTimes.query().get()
        numberOfCheckin = self.filter_checkin(date, request.email)
        if numberOfCheckin > 3:
            return CheckInResponseMessage(response_code = 500, response_status = "Solo se permite 3 checkin diario", response_date = date.strftime("%y%b%d%H:%M:%S"))
        else:
            if str(date.time()) >= companyTimes.checkinmin and str(date.time()) < companyTimes.checkinmax:
                self.set_checkin(date, request.email, request.ip)
                return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
            elif hm == companyTimes.checkinmax:
                self.set_checkin(date, request.email, request.ip)
                return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
            elif str(date.time()) < companyTimes.checkinmin or str(date.time()) > companyTimes.checkoutmax:
                return CheckInResponseMessage(response_code = 406, response_status = "Check in fuera de hora", response_date = date.strftime("%y%b%d%H:%M:%S"))
            else:
                self.set_checkin(date, request.email, request.ip)
                if numberOfCheckin == 1:
                    message = " has done a check-in after limit hour."
                    check = False
                    self.set_incidences(message, date, request.email, check)
                return CheckInResponseMessage(response_code = 202, response_status = "Check in correcto. Se ha generado un reporte", response_date = date.strftime("%y%b%d%H:%M:%S"))

    @endpoints.method(CheckOutMessage, CheckOutResponseMessage,
    path = 'check_out', http_method = 'POST', name = 'check_out')
    def check_out(self, request):
        date = datetime.now()
        hm = str(date.time())[0:5]
        companyTimes = CompanyTimes.query().get()
        if str(date.time()) >= companyTimes.checkoutmin and str(date.time()) < companyTimes.checkoutmax:
            self.set_checkout(date, request.email, request.ip)
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
        elif hm == companyTimes.checkoutmax:
            self.set_checkout(date, request.email, request.ip)
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
        elif str(date.time()) < companyTimes.checkinmin or str(date.time()) > companyTimes.checkoutmax:
            return CheckOutResponseMessage(response_code = 406, response_status = "Check out fuera de hora", response_date = date.strftime("%y%b%d%H:%M:%S"))
        else:
            self.set_checkout(date, request.email, request.ip)
            message = " has done a check-out before limit hour."
            check = False
            self.set_incidences(message, date, request.email, check)
            return CheckOutResponseMessage(response_code = 202, response_status = "Check out correcto. Se ha generado un reporte", response_date = date.strftime("%y%b%d%H:%M:%S"))

    @endpoints.method(LoginMessage, LoginMessageResponse, path='login', http_method='POST', name='login')
    def login(self, request):
        current_user = endpoints.get_current_user()
        profile = Employee.query(Employee.email == current_user.email()).get()
        if profile is None:
            employee = Employee(
                name=request.name,
                email=current_user.email(),
                image=request.image,
                role=0
            )
            employee.put()
            return LoginMessageResponse(response_code=200, email=employee.email, name=employee.name)
        else:
            return LoginMessageResponse(response_code=300, email=current_user.email(), name=request.name)

    @endpoints.method(CheckInMessage, CheckResponse, path='checkWorkedDay', http_method='GET', name='checkWorkedDay')
    def checkWorkedDay(self, request):
        date = datetime.now()
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email)
        day = query.order(-Workday.checkin).get()
        if day.checkin != None:
            if day.checkout != None:
                if (day.checkin.date() == date.date() and day.checkout.date() == date.date()):
                    return CheckResponse(response_date=str(day.checkin))
            else:
                return CheckResponse(response_date="No has hecho checkout")
        return CheckResponse(response_date="No has hecho checkin")

    @endpoints.method(CheckInMessage, CheckResponse, path='getLastCheckIn', http_method='GET', name='getLastCheckIn')
    def getLastCheckIn(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email)
        query = query.filter(Workday.checkout == None).get()
        return CheckResponse(response_date=str(query.checkin))

    @endpoints.method(CheckInMessage, CheckResponse, path='getCheckin', http_method='GET', name='getCheckin')
    def getCheckin(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        for day in query:
            if(day.checkin != None):
                if day.checkin.isocalendar()[2] == datetime.now().isocalendar()[2] and day.checkin.isocalendar()[1] == datetime.now().isocalendar()[1] and day.checkin.isocalendar()[0] == datetime.now().isocalendar()[0]:
                    return CheckResponse(response_date=str(day.checkin))
        return CheckResponse(response_date="No hay fecha de checkin")

    @endpoints.method(CheckOutMessage, CheckResponse, path='getCheckout', http_method='GET', name='getCheckout')
    def getCheckout(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        for day in query:
            if(day.checkout != None):
                if day.checkout.isocalendar()[2] == datetime.now().isocalendar()[2] and day.checkout.isocalendar()[1] == datetime.now().isocalendar()[1] and day.checkout.isocalendar()[0] == datetime.now().isocalendar()[0]:
                    return CheckResponse(response_date=str(day.checkout))
        return CheckResponse(response_date="No hay fecha de checkout")
    @endpoints.method(CheckOutMessage, GetTimeWorkedTodayReponse, path='getWorkedHoursToday', http_method='GET', name='getWorkedHoursToday')
    def getWorkedHoursToday(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        day = datetime.today()
        hoursWorkedToday = 0
        for worked in query:
            if worked.checkin.date() == day.date() and worked.checkout != None:
                hoursWorkedToday = hoursWorkedToday + int((worked.checkout - worked.checkin).total_seconds())*1000
            if worked.checkin.date() == day.date() and worked.checkout == None:
                hoursWorkedToday = hoursWorkedToday + int((datetime.now() - worked.checkin).total_seconds())*1000
        return GetTimeWorkedTodayReponse(response_date=int(hoursWorkedToday))

    @endpoints.method(CheckOutMessage, GetTimeWorkedTodayReponse, path='getWorkedHoursByWeek', http_method='GET', name='getWorkedHoursByWeek')
    def getWorkedHoursByWeek(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        day = datetime.today()
        hoursWorkedThisWeek = 0
        for worked in query:
            if worked.checkin.isocalendar()[0] == day.year and worked.checkin.isocalendar()[1] == day.isocalendar()[1]:
                if worked.checkout == None:
                    hoursWorkedThisWeek = hoursWorkedThisWeek + int((day - worked.checkin).total_seconds())*1000
                else:
                    hoursWorkedThisWeek = hoursWorkedThisWeek + int((worked.checkout - worked.checkin).total_seconds())*1000
        return GetTimeWorkedTodayReponse(response_date=int(hoursWorkedThisWeek))
    @endpoints.method(CheckIncidenceMessage, CheckIncidenceResponse, path='setCheckIncidence', http_method='POST', name='setCheckIncidence')
    def setCheckIncidence(self, request):
        query = Incidences.query()
        query = query.filter(Incidences.employee.email == request.email).fetch()
        for incidence in query:
            incidence.check=True
            incidence.put()
        return CheckIncidenceResponse()

    @endpoints.method(ReportMessage, ReportResponseMessage, path='weeklyReport', http_method='GET', name='weeklyReport')
    def weeklyReport(self, request):
        workedDays = []
        day = datetime.today()
        if datetime.today().isocalendar()[2] != 1:
            query = Employee.query()
            for currentEmployee in query:
                workedDays.append(self.singleReport(currentEmployee, day))
            return ReportResponseMessage(response_list=workedDays)
        else:
            return ReportResponseMessage(response_list=[])

    @endpoints.method(ReportDateMessage, ReportResponseMessage, path='weeklyReportWithDate', http_method='GET', name='weeklyReportWithDate')
    def reportWithDate(self, request):
        workedDays = []
        week = datetime(int(request.week[6:10]),int(request.week[3:5]),int(request.week[0:2]))
        query = Employee.query()
        if week < datetime.today():
            for currentEmployee in query:
                workedDays.append(self.singleReport(currentEmployee, week))
            return ReportResponseMessage(response_list=workedDays)
        else:
            return ReportResponseMessage(response_list=[])

    @endpoints.method(ReportMonthlyMessage, ReportMonthlyResponseMessage, path='monthlyReport', http_method='GET', name='monthlyReport')
    def reportMonthly(self, request):
        workedDays = []
        date = datetime.today()
        query = Employee.query()
        for currentEmployee in query:
            workedDays.append(self.singleMonthlyReport(currentEmployee, date))
        return ReportMonthlyResponseMessage(response_report=workedDays)

    @endpoints.method(ReportMonthlyMessageWithDate, ReportMonthlyResponseMessage, path='monthlyReportDate', http_method='GET', name='monthlyReportDate')
    def reportMonthlyWithDate(self, request):
        workedDays = []
        date = datetime(int(request.monthDate[6:10]),int(request.monthDate[3:5]), int(request.monthDate[0:2]))
        today = datetime.today()
        if date < today:
            query = Employee.query()
            for currentEmployee in query:
                workedDays.append(self.singleMonthlyReportWithDate(currentEmployee, date))
            return ReportMonthlyResponseMessage(response_report=workedDays)
        return ReportMonthlyResponseMessage(response_report=[])


    @endpoints.method(IncidencesReportMessage, IncidencesReportResponseMessage, path='incidencesReport', http_method='GET', name='incidencesReport')
    def incidencesReport(self, request):
        incidences = []
        query = Incidences.query()
        query = query.filter(Incidences.employee.email == request.email)
        query = query.filter(Incidences.solved != True).fetch()
        for oneIncidence in query:
            incidences.append(self.incidencesList(oneIncidence))
        return IncidencesReportResponseMessage(incidences=incidences)

    @endpoints.method(IncidencesUsersMessage, IncidencesUserListResponseMessage, path='incidencesUsersList', http_method='GET', name='incidencesUsersList')
    def incidencesUsersList(self, request):
        users = []
        allIncidences = Incidences.query()
        allIncidences = allIncidences.filter(Incidences.solved != True).fetch()
        for oneIncidence in allIncidences:
            employee = incidencesUsersListMessage()
            employee.name = oneIncidence.employee.name
            employee.email = oneIncidence.employee.email
            employee.image = oneIncidence.employee.image
            query = Incidences.query().filter(Incidences.employee.email == oneIncidence.employee.email)
            query = query.filter(Incidences.check != True).fetch()
            employee.incidencesNumber = len(query)
            users.append(employee)
        allUsers = []
        for user in users:
            if user not in allUsers:
                allUsers.append(user)
        return IncidencesUserListResponseMessage(users=allUsers)

    @endpoints.method(DateNowMessage, DateNowGetMessage, path='getDateNow', http_method='GET', name='getDateNow')
    def getDateNow(self, request):
        date = datetime.now()
        return DateNowGetMessage(response_date=str(date))

    @endpoints.method(UserListMessage, UserListResponseMessage, path='getUserList', http_method='GET', name='getUserList')
    def getUserList(self, request):
        userList = []
        query = Employee.query()
        for employee in query:
            userList.append(self.getSingleUser(employee))
        return UserListResponseMessage(response_list=userList)

    @endpoints.method(EmployeeMessage, EmployeeMessageResponse, path='getEmployee', http_method='GET', name='getEmployee')
    def getEmployee(self, request):
        query = Employee.query()
        query = query.filter(Employee.email == request.email).get()
        employee = JsonEmployee(
            name=query.name,
            email=query.email,
            image=query.image,
            role=query.role
        )
        return EmployeeMessageResponse(employee=employee)
    @endpoints.method(ChangeRoleMessages, ChangeRoleResponse, path='setRole', http_method='POST', name='setRole')
        # change role value in datastore and update the value in modaluserview
    def setRole(self, request):
        query = Employee.query()
        query = query.filter(Employee.email == request.email).get()
        query.role = request.role
        query.put()
        employee = JsonChangedRoleEmployee(
            name=query.name,
            email=query.email,
            image=query.image,
            role=query.role
        )
        return ChangeRoleResponse(employee=employee)

    @endpoints.method(SolveIncidence, SolveIncidenceResponse, path='solveIncidence', http_method='POST', name='solveIncidence')
    def solveIncidence(self, request):
        query = Incidences.query(Incidences.employee.email == request.email)
        query = query.filter(Incidences.incidenceDate == datetime.strptime(request.incidenceDate, "%Y-%m-%d %H:%M:%S.%f")).get()
        query.solved = True
        query.put()
        return SolveIncidenceResponse()

    @endpoints.method(ChangeCheckHoursMessage, ChangeCheckHoursResponseMessage, path='getCheckHours', http_method='GET', name='getCheckHours')
    def getCheckHours(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        newDate = datetime.strptime(request.date, "%Y-%m-%d %H:%M:%S.%f")
        for day in query:
            if day.checkin ==  newDate or day.checkout == newDate:
                response_change_check = JsonChangeCheckHoursMessage(
                key = day.key.id(),
                checkin = str(day.checkin),
                checkout = str(day.checkout))
                return ChangeCheckHoursResponseMessage(response_change_check = response_change_check)
        return ChangeCheckHoursResponseMessage(response_change_check = JsonChangeCheckHoursMessage())

    @endpoints.method(FixCheckHoursMessage, FixHoursResponseMessage, path='changeCheckHours', http_method='POST', name='changeCheckHours')
    def changeCheckHours(self, request):
        query = CompanyTimes.query().get()
        if request.dateUpdatedCheckOut is not None:
            if (request.dateUpdatedCheckIn < request.dateUpdatedCheckOut and
            query.checkinmin <= request.dateUpdatedCheckIn.split(' ')[1] and query.checkoutmax >= request.dateUpdatedCheckIn.split(' ')[1] and
            query.checkinmin <= request.dateUpdatedCheckOut.split(' ')[1] and query.checkoutmax >= request.dateUpdatedCheckOut.split(' ')[1][0:4]):
                query = Workday.query()
                query = query.filter(Workday.employee.email == request.email)
                for day in query:
                    if day.key.id() == request.key:
                        newCheckin = datetime.strptime(request.dateUpdatedCheckIn, "%Y-%m-%d %H:%M:%S.%f")
                        newCheckout = datetime.strptime(request.dateUpdatedCheckOut, "%Y-%m-%d %H:%M:%S.%f")
                        if day.checkin != newCheckin and day.checkout != newCheckout:
                            self.createLogs(day, request, True, True, newCheckin, newCheckout)
                        elif day.checkin != newCheckin:
                            self.createLogs(day, request, True, False, newCheckin)
                        elif day.checkout != newCheckout:
                            self.createLogs(day, request, False, True, 0, newCheckout)
                        else:
                            self.createLogs(day, request, False, False)
                        day.checkin = newCheckin
                        day.checkout = newCheckout
                        day.put()
                        return FixHoursResponseMessage(response_code = 200)
            else:
                return FixHoursResponseMessage(response_code = 404)
        else:
            if (query.checkinmin <= request.dateUpdatedCheckIn.split(' ')[1] and query.checkoutmax >= request.dateUpdatedCheckIn.split(' ')[1]):
                query = Workday.query()
                query = query.filter(Workday.employee.email == request.email)
                for day in query:
                    if day.key.id() == request.key:
                        newCheckin = datetime.strptime(request.dateUpdatedCheckIn, "%Y-%m-%d %H:%M:%S.%f")
                        if day.checkin != newCheckin:
                            self.createLogs(day, request, True, False, newCheckin)
                            day.checkin = newCheckin
                            day.put()
                        return FixHoursResponseMessage(response_code = 200)
            else:
                return FixHoursResponseMessage(response_code = 404)

    @endpoints.method(message_types.VoidMessage, LogsResponse, path='downloadLogs', http_method='GET', name='downloadLogs')
    def downloadLogs(self, request):
        array = []
        query = Logs.query()
        for x in query:
            log = Log(hrm=x.hrm, employee=x.employee, changesIn=x.changesIn, changesOut=x.changesOut, dateLog=str(x.dateLog))
            array.append(log)
        return LogsResponse(response=array, response_date=str(datetime.now().date()))

# [END guestbook]


application = endpoints.api_server([MainPage], restricted=False)

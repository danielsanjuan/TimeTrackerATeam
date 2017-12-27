#!/usr/bin/env python

import urllib
import endpoints
import os
import json
from protorpc import messages
from datetime import datetime, timedelta, time

from messages.checkInMessages import CheckInMessage, CheckInResponseMessage, CheckOutMessage, CheckOutResponseMessage, CheckResponse
from messages.timetrackerlogin import LoginMessage, LoginMessageResponse
from messages.reportMessages import ReportMessage, ReportDateMessage, ReportResponseMessage, JsonMessage
from messages.DateNowMessages import DateNowMessage, DateNowGetMessage
from messages.reportMonthlyMessages import ReportMonthlyMessage, ReportMonthlyMessageWithDate, ReportMonthlyResponseMessage, JsonMonthlyMessage, JsonSingleDayMessage
from messages.incidencesMessages import CheckIncidenceMessage, CheckIncidenceResponse, IncidencesReportMessage, IncidencesMessage, IncidencesReportResponseMessage, SolveIncidence, SolveIncidenceResponse
from messages.incidencesUsersListMessages import IncidencesUsersMessage, incidencesUsersListMessage, IncidencesUserListResponseMessage, JsonEmployee, EmployeeMessage, EmployeeMessageResponse
from messages.userListMessages import UserListMessage, UserListResponseMessage, JsonUserMessage
from messages.changeRoleMessages import ChangeRoleMessages, ChangeRoleResponse, JsonChangedRoleEmployee
from messages.CompanyTimesMessages import CompanyTimesMessage, CompanyTimesResponseMessage, CompanyTimesSetResponseMessage
from messages.changeCheckHoursMessages import ChangeCheckHoursMessage, JsonChangeCheckHoursMessage, FixCheckHoursMessage, ChangeCheckHoursResponseMessage, FixHoursResponseMessage

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

# [START main_page]
@endpoints.api(name='timetracker', version='v1',
        allowed_client_ids=['678273591464-2donjmj0olnnsvmsp1308fd3ufl818dm.apps.googleusercontent.com'],
        scopes=[endpoints.EMAIL_SCOPE])

class MainPage(remote.Service):

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
        count = 1
        query = Workday.query()
        if query is None:
            return False
        else:
            query = query.filter(Workday.employee.email == email)
            for workday in query:
                if workday.checkin.date() == date.date() and count < 3:
                    count = count + 1
                else:
                    return True
            return False

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
        monday = tuesday = wednesday = thursday = friday = saturday = sunday = 0

        for worked in query:
            if worked.checkin.isocalendar()[0] == date.year and worked.checkin.isocalendar()[1] == week and worked.checkout != None:
                if worked.checkin.isocalendar()[2] == 1:
                    monday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.monday = monday/60
                elif worked.checkin.isocalendar()[2] == 2:
                    tuesday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.tuesday = tuesday/60
                elif worked.checkin.isocalendar()[2] == 3:
                    wednesday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.wednesday = wednesday/60
                elif worked.checkin.isocalendar()[2] == 4:
                    thursday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.thursday = thursday/60
                elif worked.checkin.isocalendar()[2] == 5:
                    friday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.friday = friday/60
                elif worked.checkin.isocalendar()[2] == 5:
                    saturday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.saturday = saturday/60
                elif worked.checkin.isocalendar()[2] == 5:
                    sunday = int((worked.checkout - worked.checkin).total_seconds())/60
                    report.sunday = sunday/60
        report.total = monday + tuesday + wednesday + thursday + friday + saturday + sunday
        report.totalhm = '{:02d}:{:02d}'.format(*divmod(report.total, 60))
        return report

    def singleMonthlyReport(self, currentEmployee, date):
        reportMonth = JsonMonthlyMessage()
        currentmonth = date.month - 1
        query = Workday.query()
        query = query.filter(Workday.employee.email == currentEmployee.email).fetch()
        reportMonth.hours_day = []
        reportMonth.name = currentEmployee.name
        reportMonth.month = int(currentmonth)
        reportMonth.jornadas = 0
        reportMonth.total = 0
        if(currentmonth == 1): reportMonth.year = date.year - 1
        else: reportMonth.year = date.year

        for worked in query:
            reportDay = JsonSingleDayMessage()
            if worked.checkin.isocalendar()[0] == date.year and worked.checkin.month == currentmonth and worked.checkout != None:
                reportDay.hour = int((worked.checkout - worked.checkin).total_seconds())/3600
                reportDay.day = worked.checkin.day
                reportMonth.hours_day.append(reportDay)
                reportMonth.jornadas = reportMonth.jornadas + 1
                reportMonth.total = reportMonth.total+reportDay.hour


        return reportMonth

    def singleMonthlyReportWithDate(self, currentEmployee, date):
        reportMonth = JsonMonthlyMessage()
        currentmonth = date.month
        query = Workday.query()
        query = query.filter(Workday.employee.email == currentEmployee.email).fetch()
        reportMonth.hours_day = []
        reportMonth.name = currentEmployee.name
        reportMonth.month = int(currentmonth)
        reportMonth.jornadas = 0
        reportMonth.total = 0
        if(currentmonth == 1): reportMonth.year = date.year - 1
        else: reportMonth.year = date.year

        for worked in query:
            reportDay = JsonSingleDayMessage()
            if worked.checkin.isocalendar()[0] == date.year and worked.checkin.month == currentmonth and worked.checkout != None:
                reportDay.hour = int((worked.checkout - worked.checkin).total_seconds())/3600
                reportDay.day = worked.checkin.day
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
        user = JsonUserMessage()
        user.name = employee.name
        user.email = employee.email
        user.role = employee.role
        user.image = employee.image
        return user

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
        request.checkinmin >= request.checkoutmaxfriday or request.checkinmax >= request.checkoutmin or
        request.checkinmax >= request.checkoutmax or request.checkinmax >= request.checkoutminfriday or
        request.checkinmax >= request.checkoutmaxfriday  or request.checkoutmin >= request.checkoutmax or
        request.checkoutminfriday >= request. checkoutmaxfriday):
            return CompanyTimesSetResponseMessage(response_code = 500)
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
        if self.filter_checkin(date, request.email):
            return CheckInResponseMessage(response_code = 500, response_status = "Solo se permite un checkin diario", response_date = date.strftime("%y%b%d%H:%M:%S"))
        else:
            if str(date.time()) >= companyTimes.checkinmin and str(date.time()) < companyTimes.checkinmax:
                self.set_checkin(date, request.email)
                return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
            elif hm == companyTimes.checkinmax:
                self.set_checkin(date, request.email)
                return CheckInResponseMessage(response_code = 200, response_status = "Check in correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
            elif str(date.time()) < companyTimes.checkinmin or str(date.time()) > companyTimes.checkoutmax:
                return CheckInResponseMessage(response_code = 406, response_status = "Check in fuera de hora", response_date = date.strftime("%y%b%d%H:%M:%S"))
            else:
                self.set_checkin(date, request.email)
                message = " ha llegado fuera de los limites horarios"
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
            self.set_checkout(date, request.email)
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
        elif hm == companyTimes.checkoutmax:
            self.set_checkout(date, request.email)
            return CheckOutResponseMessage(response_code = 200, response_status = "Check out correcto", response_date = date.strftime("%y%b%d%H:%M:%S"))
        elif str(date.time()) < companyTimes.checkinmin or str(date.time()) > companyTimes.checkoutmax:
            return CheckOutResponseMessage(response_code = 406, response_status = "Check out fuera de hora", response_date = date.strftime("%y%b%d%H:%M:%S"))
        else:
            self.set_checkout(date, request.email)
            message = " ha realizado un checkout antes de la hora minima"
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
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email).fetch()
        for day in query:
            if day.checkin != None:
                if day.checkout != None:
                    if day.checkin.isocalendar()[2] == datetime.now().isocalendar()[2] and day.checkin.isocalendar()[1] == datetime.now().isocalendar()[1] and day.checkin.isocalendar()[0] == datetime.now().isocalendar()[0]:
                        if day.checkout.isocalendar()[2] == datetime.now().isocalendar()[2] and day.checkout.isocalendar()[1] == datetime.now().isocalendar()[1] and day.checkout.isocalendar()[0] == datetime.now().isocalendar()[0]:
                            return CheckResponse(response_date=str(day.checkin))
                else:
                    return CheckResponse(response_date="No has hecho checkout")
        return CheckResponse(response_date="No has hecho checkin")

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
        query = Employee.query()
        if date.year <= today.year and date.month <= today.month :
            for currentEmployee in query:
                workedDays.append(self.singleMonthlyReportWithDate(currentEmployee, date))
            return ReportMonthlyResponseMessage(response_report=workedDays)
        else:
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
        queryRole = query.filter(Employee.role == 1).fetch()
        query = query.filter(Employee.email == request.email).get()
        code = 200
        if query.role == 0:
            query.role = 1
            query.put()
        else:
            if len(queryRole) > 1:
                query.role = 0
                query.put()
            else:
                code = 500
        employee = JsonChangedRoleEmployee(
            name=query.name,
            email=query.email,
            image=query.image,
            role=query.role
        )
        return ChangeRoleResponse(employee=employee,response_code=code)



    @endpoints.method(SolveIncidence, SolveIncidenceResponse, path='solveIncidence', http_method='POST', name='solveIncidence')
    def solveIncidence(self, request):
        query = Incidences.query()
        query = query.filter(Incidences.incidenceDate == datetime.strptime(request.incidenceDate, "%Y-%m-%d %H:%M:%S.%f")).get()
        query.solved = True
        query.put()
        return SolveIncidenceResponse()

    @endpoints.method(message_types.VoidMessage, message_types.VoidMessage, path='autoCheckOut', http_method='GET', name='autoCheckOut')
    def autoCheckOut(self, request):
        query = Workday.query()
        query = query.filter(Workday.checkout == None).fetch()
        for userWithoutCheckOut in query:
            userWithoutCheckOut.checkout = datetime.now()
            userWithoutCheckOut.put()
            self.set_incidences("The user didn't check out, this is the automatic check out", datetime.now(), userWithoutCheckOut.employee.email, False)

        return message_types.VoidMessage()

    @endpoints.method(ChangeCheckHoursMessage, ChangeCheckHoursResponseMessage, path='getCheckHours', http_method='GET', name='getCheckHours')
    def getCheckHours(self, request):
        query = Workday.query()
        query = query.filter(Workday.employee.email == request.email)
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
            query.checkinmin <= request.dateUpdatedCheckIn.split(' ')[1] and query.checkinmax >= request.dateUpdatedCheckIn.split(' ')[1] and
            query.checkoutmin <= request.dateUpdatedCheckOut.split(' ')[1] and query.checkoutmax >= request.dateUpdatedCheckOut.split(' ')[1]):
                query = Workday.query()
                query = query.filter(Workday.employee.email == request.email)
                for day in query:
                    if day.key.id() == request.key:
                        newCheckin = datetime.strptime(request.dateUpdatedCheckIn, "%Y-%m-%d %H:%M:%S.%f")
                        newChekout = datetime.strptime(request.dateUpdatedCheckOut, "%Y-%m-%d %H:%M:%S.%f")
                        day.checkin = newCheckin
                        day.checkout = newChekout
                        day.put()
                        return FixHoursResponseMessage(response_code = 200)
            else:
                return FixHoursResponseMessage(response_code = 404)
        else:
            if (query.checkinmin <= request.dateUpdatedCheckIn.split(' ')[1] and query.checkinmax >= request.dateUpdatedCheckIn.split(' ')[1]):
                query = Workday.query()
                query = query.filter(Workday.employee.email == request.email)
                for day in query:
                    if day.key.id() == request.key:
                        newCheckin = datetime.strptime(request.dateUpdatedCheckIn, "%Y-%m-%d %H:%M:%S.%f")
                        day.checkin = newCheckin
                        day.put()
                        return FixHoursResponseMessage(response_code = 200)
            else:
                return FixHoursResponseMessage(response_code = 404)




    ''' Endpoint to Mock Database '''

    @endpoints.method(DateNowMessage, DateNowMessage, path='mockDatabase', http_method='POST', name='mockDatabase')
    def mockDatabase(self, request):
        employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1, status=False).put()
        employee=Employee(name="Risa Jauncey", email="rjauncey0@wikipedia.org", image="http://dummyimage.com/167x105.png/dddddd/000000",role=1, status=False).put()
        employee=Employee(name="Dominic Esselin", email="desselin0@bloglines.com", image="http://dummyimage.com/224x248.png/ff4444/ffffff", role=0, status=False).put()
        employee=Employee(name="Cassy Kos", email="ckos0@creativecommons.org", image="http://dummyimage.com/193x206.png/ff4444/ffffff", role=0, status=False).put()
        employee=Employee(name="Gregorio Nannetti", email="gnannetti0@tmall.com", image="http://dummyimage.com/213x210.bmp/5fa2dd/ffffff", role=1, status=False).put()
        employee=Employee(name="Lavinia Berntssen", email="lberntssen0@reference.com", image="http://dummyimage.com/216x210.jpg/ff4444/ffffff", role=0, status=True).put()
        employee=Employee(name="Julianna Dedon", email="jdedon0@unc.edu", image="http://dummyimage.com/214x197.png/dddddd/000000", role=1, status=False).put()
        employee=Employee(name="Alexine Maxstead", email="amaxstead0@wikipedia.org", image="http://dummyimage.com/247x196.bmp/cc0000/ffffff", role=1, status=False).put()
        employee=Employee(name="Laurel Brosetti", email="lbrosetti0@taobao.com", image="http://dummyimage.com/183x193.bmp/cc0000/ffffff", role=0, status=False).put()
        employee=Employee(name="Vivia Egger", email="vegger0@walmart.com", image="http://dummyimage.com/208x236.png/ff4444/ffffff", role=1, status=True).put()
        employee=Employee(name="Oliviero Hutchens", email="ohutchens0@ehow.com", image="http://dummyimage.com/109x143.jpg/dddddd/000000", role=1, status=False).put()
        employee=Employee(name="Jacynth Levett", email="jlevett0@parallels.com", image="http://dummyimage.com/107x111.bmp/dddddd/000000", role=0, status=False).put()
        employee=Employee(name="Arney Coolahan", email="acoolahan0@google.ru", image="http://dummyimage.com/197x185.jpg/cc0000/ffffff", role=0, status=False).put()
        employee=Employee(name="Brynna Hatchette", email="bhatchette0@hubpages.com", image="http://dummyimage.com/104x173.bmp/dddddd/000000", role=0, status=True).put()
        employee=Employee(name="Arch Lunney", email="alunney0@cyberchimps.com", image="http://dummyimage.com/229x223.bmp/5fa2dd/ffffff", role=0, status=True).put()
        employee=Employee(name="Lucky Melesk", email="lmelesk0@comsenz.com", image="http://dummyimage.com/205x203.bmp/cc0000/ffffff", role=0, status=False).put()
        employee=Employee(name="Janet Hadenton", email="jhadenton0@baidu.com", image="http://dummyimage.com/170x178.bmp/ff4444/ffffff", role=1, status=True).put()
        employee=Employee(name="Shara Petraitis", email="spetraitis0@gmpg.org", image="http://dummyimage.com/119x127.bmp/5fa2dd/ffffff", role=0, status=True).put()
        employee=Employee(name="Tremaine Cucuzza", email="tcucuzza0@yelp.com", image="http://dummyimage.com/105x244.jpg/cc0000/ffffff", role=1, status=False).put()
        employee=Employee(name="Sadella Everard", email="severard0@printfriendly.com", image="http://dummyimage.com/128x126.bmp/cc0000/ffffff", role=0, status=True).put()
        workday = Workday(checkin=datetime.strptime("2017-12-10 20:50:10.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-10 22:52:26.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-12 20:50:10.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-12 22:52:26.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-15 20:50:10.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-15 22:52:26.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-16 20:50:10.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-16 22:52:26.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-10 16:20:54.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-10 19:16:08.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Risa Jauncey", email="rjauncey0@wikipedia.org", image="http://dummyimage.com/167x105.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-11 08:38:29.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-11 09:44:41.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Dominic Esselin", email="desselin0@bloglines.com", image="http://dummyimage.com/224x248.png/ff4444/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-11 03:13:31.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-11 04:46:04.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Cassy Kos", email="ckos0@creativecommons.org", image="http://dummyimage.com/193x206.png/ff4444/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-11 09:18:37.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-11 11:37:51.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Gregorio Nannetti", email="gnannetti0@tmall.com", image="http://dummyimage.com/213x210.bmp/5fa2dd/ffffff", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-07 02:13:47.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-07 03:42:37.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Lavinia Berntssen", email="lberntssen0@reference.com", image="http://dummyimage.com/216x210.jpg/ff4444/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-09 11:34:11.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-09 12:50:16.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Julianna Dedon", email="jdedon0@unc.edu", image="http://dummyimage.com/214x197.png/dddddd/000000", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-09 03:51:56.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-09 05:11:24.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Alexine Maxstead", email="amaxstead0@wikipedia.org", image="http://dummyimage.com/247x196.bmp/cc0000/ffffff", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-10 16:40:59.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-10 17:56:01.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Laurel Brosetti", email="lbrosetti0@taobao.com", image="http://dummyimage.com/183x193.bmp/cc0000/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-09 14:52:29.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-09 17:07:41.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Vivia Egger", email="vegger0@walmart.com", image="http://dummyimage.com/208x236.png/ff4444/ffffff", role=1, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-11 12:46:28.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-11 15:32:54.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Oliviero Hutchens", email="ohutchens0@ehow.com", image="http://dummyimage.com/109x143.jpg/dddddd/000000", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-10 14:32:46.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-10 16:47:49.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Jacynth Levett", email="jlevett0@parallels.com", image="http://dummyimage.com/107x111.bmp/dddddd/000000", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-10 13:34:16.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-10 16:30:52.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Arney Coolahan", email="acoolahan0@google.ru", image="http://dummyimage.com/197x185.jpg/cc0000/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-07 20:16:32.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-07 21:37:54.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Brynna Hatchette", email="bhatchette0@hubpages.com", image="http://dummyimage.com/104x173.bmp/dddddd/000000", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-08 03:18:24.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-08 05:41:29.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Arch Lunney", email="alunney0@cyberchimps.com", image="http://dummyimage.com/229x223.bmp/5fa2dd/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-10 19:36:44.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-10 20:49:19.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Lucky Melesk", email="lmelesk0@comsenz.com", image="http://dummyimage.com/205x203.bmp/cc0000/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-08 15:09:37.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-08 16:21:06.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Janet Hadenton", email="jhadenton0@baidu.com", image="http://dummyimage.com/170x178.bmp/ff4444/ffffff", role=1, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-09 21:03:27.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-09 23:20:33.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Shara Petraitis", email="spetraitis0@gmpg.org", image="http://dummyimage.com/119x127.bmp/5fa2dd/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-11 15:55:42.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-11 17:42:17.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Tremaine Cucuzza", email="tcucuzza0@yelp.com", image="http://dummyimage.com/105x244.jpg/cc0000/ffffff", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-12-08 08:26:52.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-12-08 09:43:05.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Sadella Everard", email="severard0@printfriendly.com", image="http://dummyimage.com/128x126.bmp/cc0000/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-11-10 20:50:10.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-11-10 22:52:26.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-10-10 16:20:54.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-10-10 19:16:08.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Risa Jauncey", email="rjauncey0@wikipedia.org", image="http://dummyimage.com/167x105.png/dddddd/000000",role=1,status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-09-11 08:38:29.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-09-11 09:44:41.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Dominic Esselin", email="desselin0@bloglines.com", image="http://dummyimage.com/224x248.png/ff4444/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-08-11 03:13:31.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-08-11 04:46:04.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Cassy Kos", email="ckos0@creativecommons.org", image="http://dummyimage.com/193x206.png/ff4444/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-07-11 09:18:37.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-07-11 11:37:51.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Gregorio Nannetti", email="gnannetti0@tmall.com", image="http://dummyimage.com/213x210.bmp/5fa2dd/ffffff", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-06-07 02:13:47.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-06-07 03:42:37.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Lavinia Berntssen", email="lberntssen0@reference.com", image="http://dummyimage.com/216x210.jpg/ff4444/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-05-09 11:34:11.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-05-09 12:50:16.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Julianna Dedon", email="jdedon0@unc.edu", image="http://dummyimage.com/214x197.png/dddddd/000000", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-04-09 03:51:56.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-04-09 05:11:24.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Alexine Maxstead", email="amaxstead0@wikipedia.org", image="http://dummyimage.com/247x196.bmp/cc0000/ffffff", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-03-10 16:40:59.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-03-10 17:56:01.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Laurel Brosetti", email="lbrosetti0@taobao.com", image="http://dummyimage.com/183x193.bmp/cc0000/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-02-09 14:52:29.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-02-09 17:07:41.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Vivia Egger", email="vegger0@walmart.com", image="http://dummyimage.com/208x236.png/ff4444/ffffff", role=1, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-01-11 12:46:28.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-01-11 15:32:54.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Oliviero Hutchens", email="ohutchens0@ehow.com", image="http://dummyimage.com/109x143.jpg/dddddd/000000", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-11-10 14:32:46.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-11-10 16:47:49.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Jacynth Levett", email="jlevett0@parallels.com", image="http://dummyimage.com/107x111.bmp/dddddd/000000", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-10-10 13:34:16.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-10-10 16:30:52.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Arney Coolahan", email="acoolahan0@google.ru", image="http://dummyimage.com/197x185.jpg/cc0000/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-09-07 20:16:32.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-09-07 21:37:54.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Brynna Hatchette", email="bhatchette0@hubpages.com", image="http://dummyimage.com/104x173.bmp/dddddd/000000", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-08-08 03:18:24.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-08-08 05:41:29.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Arch Lunney", email="alunney0@cyberchimps.com", image="http://dummyimage.com/229x223.bmp/5fa2dd/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-07-10 19:36:44.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-07-10 20:49:19.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Lucky Melesk", email="lmelesk0@comsenz.com", image="http://dummyimage.com/205x203.bmp/cc0000/ffffff", role=0, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-06-08 15:09:37.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-06-08 16:21:06.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Janet Hadenton", email="jhadenton0@baidu.com", image="http://dummyimage.com/170x178.bmp/ff4444/ffffff", role=1, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-05-09 21:03:27.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-05-09 23:20:33.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Shara Petraitis", email="spetraitis0@gmpg.org", image="http://dummyimage.com/119x127.bmp/5fa2dd/ffffff", role=0, status=True)).put()
        workday = Workday(checkin=datetime.strptime("2017-04-11 15:55:42.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-04-11 17:42:17.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Tremaine Cucuzza", email="tcucuzza0@yelp.com", image="http://dummyimage.com/105x244.jpg/cc0000/ffffff", role=1, status=False)).put()
        workday = Workday(checkin=datetime.strptime("2017-03-08 08:26:52.100", "%Y-%m-%d %H:%M:%S.%f"), checkout=datetime.strptime("2017-03-08 09:43:05.100", "%Y-%m-%d %H:%M:%S.%f"), employee=Employee(name="Sadella Everard", email="severard0@printfriendly.com", image="http://dummyimage.com/128x126.bmp/cc0000/ffffff", role=0, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-10 20:50:10.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Elinor Farryn", email="efarryn0@cocolog-nifty.com", image="http://dummyimage.com/116x156.png/dddddd/000000",role=1,status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-10 16:20:54.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Risa Jauncey", email="rjauncey0@wikipedia.org", image="http://dummyimage.com/167x105.png/dddddd/000000",role=1,status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-11 08:38:29.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Dominic Esselin", email="desselin0@bloglines.com", image="http://dummyimage.com/224x248.png/ff4444/ffffff", role=0, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-11 03:13:31.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Cassy Kos", email="ckos0@creativecommons.org", image="http://dummyimage.com/193x206.png/ff4444/ffffff", role=0, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-11 09:18:37.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Gregorio Nannetti", email="gnannetti0@tmall.com", image="http://dummyimage.com/213x210.bmp/5fa2dd/ffffff", role=1, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-07 02:13:47.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Lavinia Berntssen", email="lberntssen0@reference.com", image="http://dummyimage.com/216x210.jpg/ff4444/ffffff", role=0, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-09 11:34:11.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Julianna Dedon", email="jdedon0@unc.edu", image="http://dummyimage.com/214x197.png/dddddd/000000", role=1, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-09 03:51:56.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Alexine Maxstead", email="amaxstead0@wikipedia.org", image="http://dummyimage.com/247x196.bmp/cc0000/ffffff", role=1, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-10 16:40:59.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Laurel Brosetti", email="lbrosetti0@taobao.com", image="http://dummyimage.com/183x193.bmp/cc0000/ffffff", role=0, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-09 14:52:29.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Vivia Egger", email="vegger0@walmart.com", image="http://dummyimage.com/208x236.png/ff4444/ffffff", role=1, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-11 12:46:28.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Oliviero Hutchens", email="ohutchens0@ehow.com", image="http://dummyimage.com/109x143.jpg/dddddd/000000", role=1, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-10 14:32:46.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Jacynth Levett", email="jlevett0@parallels.com", image="http://dummyimage.com/107x111.bmp/dddddd/000000", role=0, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-10 13:34:16.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Arney Coolahan", email="acoolahan0@google.ru", image="http://dummyimage.com/197x185.jpg/cc0000/ffffff", role=0, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-07 20:16:32.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Brynna Hatchette", email="bhatchette0@hubpages.com", image="http://dummyimage.com/104x173.bmp/dddddd/000000", role=0, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-08 03:18:24.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Arch Lunney", email="alunney0@cyberchimps.com", image="http://dummyimage.com/229x223.bmp/5fa2dd/ffffff", role=0, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-10 19:36:44.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Lucky Melesk", email="lmelesk0@comsenz.com", image="http://dummyimage.com/205x203.bmp/cc0000/ffffff", role=0, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-08 15:09:37.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Janet Hadenton", email="jhadenton0@baidu.com", image="http://dummyimage.com/170x178.bmp/ff4444/ffffff", role=1, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-09 21:03:27.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Shara Petraitis", email="spetraitis0@gmpg.org", image="http://dummyimage.com/119x127.bmp/5fa2dd/ffffff", role=0, status=True)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-11 15:55:42.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Tremaine Cucuzza", email="tcucuzza0@yelp.com", image="http://dummyimage.com/105x244.jpg/cc0000/ffffff", role=1, status=False)).put()
        incidence = Incidences(incidenceDate=datetime.strptime("2017-12-08 08:26:52.100", "%Y-%m-%d %H:%M:%S.%f"), check=False, solved=False, message="Checkin fuera de hora", employee=Employee(name="Sadella Everard", email="severard0@printfriendly.com", image="http://dummyimage.com/128x126.bmp/cc0000/ffffff", role=0, status=True)).put()

        return DateNowMessage()
# [END guestbook]


application = endpoints.api_server([MainPage], restricted=False)

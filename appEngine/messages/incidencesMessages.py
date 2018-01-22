from protorpc import messages

class CheckIncidenceMessage(messages.Message):
    email = messages.StringField(1)

class CheckIncidenceResponse(messages.Message):
    pass

class IncidencesReportMessage(messages.Message):
    email = messages.StringField(1)

class IncidencesMessage(messages.Message):
    date = messages.StringField(1)
    message = messages.StringField(2)

class IncidencesReportResponseMessage(messages.Message):
    incidences = messages.MessageField(IncidencesMessage, 1, repeated=True)

class SolveIncidence(messages.Message):
    incidenceDate = messages.StringField(1)

class SolveIncidenceResponse(messages.Message):
    pass

class Log(messages.Message):
    hrm = messages.StringField(1)
    employee = messages.StringField(2)
    changesIn = messages.StringField(3)
    changesOut = messages.StringField(4)
    dateLog = messages.StringField(5)

class LogsResponse(messages.Message):
    response = messages.MessageField(Log, 1, repeated=True)
    response_date = messages.StringField(2)

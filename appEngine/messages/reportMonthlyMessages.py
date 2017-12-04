from protorpc import messages
class ReportMonthlyMessage(messages.Message):
    pass

class JsonSingleDayMessage(messages.Message):
    day = messages.IntegerField(1)
    hour = messages.IntegerField(2)

class JsonMonthlyMessage(messages.Message):
    name = messages.StringField(1)
    hours_day = messages.MessageField(JsonSingleDayMessage, 2, repeated=True)
    month = messages.IntegerField(3)
    jornadas = messages.IntegerField(4)
    total = messages.IntegerField(5)
    month = messages.IntegerField(6)
    year = messages.IntegerField(7)

class ReportMonthlyResponseMessage(messages.Message):
    response_report = messages.MessageField(JsonMonthlyMessage, 1, repeated=True)
from protorpc import messages

class DateNowMessage(messages.Message):
    pass

class DateNowGetMessage(messages.Message):
    response_date = messages.StringField(1)

from protorpc import messages

class CheckInMessage(messages.Message):
    email = messages.StringField(1)
    ip = messages.StringField(2)

class CheckInResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_status = messages.StringField(2)
    response_date = messages.StringField(3)

class CheckOutMessage(messages.Message):
    email = messages.StringField(1)
    ip = messages.StringField(2)

class CheckOutResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_status = messages.StringField(2)
    response_date = messages.StringField(3)

class CheckResponse(messages.Message):
    response_date = messages.StringField(1)

class GetTimeWorkedTodayReponse(messages.Message):
    response_date = messages.IntegerField(1)
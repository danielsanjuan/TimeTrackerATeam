from protorpc import messages

class CheckInMessage(messages.Message):
    email = messages.StringField(1)

class CheckInResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_status = messages.StringField(2)
    response_date = messages.StringField(3)

class CheckOutMessage(messages.Message):
    email = messages.StringField(1)

class CheckOutResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_status = messages.StringField(2)
    response_date = messages.StringField(3)

class CheckInGetMessage(messages.Message):
    response_date = messages.StringField(1)

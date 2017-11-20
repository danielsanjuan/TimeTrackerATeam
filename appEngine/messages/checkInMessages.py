from protorpc import messages

class CheckInMessage(messages.Message):
    pass

class CheckInResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_status = messages.StringField(2)

class CheckOutMessage(messages.Message):
    pass

class CheckOutResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_status = messages.StringField(2)

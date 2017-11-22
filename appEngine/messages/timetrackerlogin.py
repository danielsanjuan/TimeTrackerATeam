from protorpc import messages

class LoginMessage(messages.Message):
    email = messages.StringField(1, required=True)
    password = messages.StringField(2, required=True)
    name = messages.StringField(3, required=True)

class LoginMessageResponse(messages.Message):
    response_code = messages.IntegerField(1)
    email = messages.StringField(2)
    name = messages.StringField(3)

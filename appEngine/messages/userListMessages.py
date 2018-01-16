from protorpc import messages

class UserListMessage(messages.Message):
    pass

class JsonUserRoleMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    role = messages.IntegerField(3)
    image = messages.StringField(4)

class UserListResponseMessage(messages.Message):
    response_list = messages.MessageField(JsonUserRoleMessage, 1, repeated=True)
    response_code = messages.IntegerField(2)

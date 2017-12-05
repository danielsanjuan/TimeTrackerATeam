from protorpc import messages

class UserListMessage(messages.Message):
    pass
 
class JsonUserMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    role = messages.IntegerField(3)
    image = messages.StringField(4)
    
class UserListResponseMessage(messages.Message):
    response_list = messages.MessageField(JsonUserMessage, 1, repeated=True)

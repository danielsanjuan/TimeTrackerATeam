from protorpc import messages

class JsonUserIPListMessage(messages.Message):
    ip1 = messages.StringField(1)
    ip2 = messages.StringField(2)
    ip3 = messages.StringField(3)
    ip4 = messages.StringField(4)
    ip5 = messages.StringField(5)
    ip6 = messages.StringField(6)

class JsonUserMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    image = messages.StringField(3)
    role = messages.IntegerField(4)

class JsonUserIPMessage(messages.Message):
    response_list_employee = messages.MessageField(JsonUserMessage, 1)
    response_list_ip = messages.MessageField(JsonUserIPListMessage, 2)

class UserIPResponse(messages.Message):
    response_list = messages.MessageField(JsonUserIPMessage, 1,  repeated=True)

class IpMessage(messages.Message):
    date = messages.StringField(1)

class PersonalIP(messages.Message):
    email = messages.StringField(1)

class PersonalIPByWorkday(messages.Message):
    date = messages.StringField(1)
    ip1 = messages.StringField(2)
    ip2 = messages.StringField(3)
    ip3 = messages.StringField(4)
    ip4 = messages.StringField(5)
    ip5 = messages.StringField(6)
    ip6 = messages.StringField(7)

class PersonalIPListResponse(messages.Message):
    response_list = messages.MessageField(PersonalIPByWorkday, 1,  repeated=True)

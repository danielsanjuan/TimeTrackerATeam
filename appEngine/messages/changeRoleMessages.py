from protorpc import messages

class ChangeRoleMessages(messages.Message):
    email = messages.StringField(1)

class JsonChangedRoleEmployee(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    image = messages.StringField(3)
    role = messages.IntegerField(4)

class ChangeRoleResponse(messages.Message):
    employee = messages.MessageField(JsonChangedRoleEmployee, 1)
    response_code = messages.IntegerField(2)

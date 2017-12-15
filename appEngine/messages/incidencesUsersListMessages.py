from protorpc import messages

class IncidencesUsersMessage(messages.Message):
    pass

class incidencesUsersListMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    image = messages.StringField(3)
    incidencesNumber = messages.IntegerField(4)

class IncidencesUserListResponseMessage(messages.Message):
    users = messages.MessageField(incidencesUsersListMessage, 1, repeated=True)

class JsonEmployee(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    image = messages.StringField(3)
    role = messages.IntegerField(4)

class EmployeeMessage(messages.Message):
    email = messages.StringField(1)

class EmployeeMessageResponse(messages.Message):
    employee = messages.MessageField(JsonEmployee, 1)

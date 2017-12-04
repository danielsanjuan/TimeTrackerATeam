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
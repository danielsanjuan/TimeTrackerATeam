from protorpc import messages

class CheckIncidenceMessage(messages.Message):
    email = messages.StringField(1)

class CheckIncidenceResponse(messages.Message):
    pass

class IncidencesReportMessage(messages.Message):
    pass
    
class IncidencesMessage(messages.Message):
    date = messages.StringField(1)
    message = messages.StringField(2)


class UsersListMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    image = messages.StringField(3)
    incidences = messages.MessageField(IncidencesMessage, 4, repeated=True)

class IncidencesReportResponseMessage(messages.Message):
    users = messages.MessageField(UsersListMessage, 1, repeated=True)
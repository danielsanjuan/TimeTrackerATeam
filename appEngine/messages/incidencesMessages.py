from protorpc import messages

class CheckIncidenceMessage(messages.Message):
    email = messages.StringField(1)

class CheckIncidenceResponse(messages.Message):
    pass
    


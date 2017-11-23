from protorpc import messages

class ReportMessage(messages.Message):
    pass



class jsonMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    lunes = messages.IntegerField(3) 
    martes = messages.IntegerField(4) 
    miercoles = messages.IntegerField(5)
    jueves = messages.IntegerField(6)
    viernes = messages.IntegerField(7)
    total = messages.IntegerField(8)

class ReportResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    response_report = messages.StringField(2)
    json = messages.MessageField(jsonMessage, 3, repeated=True)
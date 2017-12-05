from protorpc import messages
class ReportMessage(messages.Message):
    pass
    
class JsonMessage(messages.Message):
    name = messages.StringField(1)
    monday = messages.IntegerField(2)
    tuesday = messages.IntegerField(3)
    wednesday = messages.IntegerField(4)
    thursday = messages.IntegerField(5)
    friday = messages.IntegerField(6)
    total = messages.StringField(7)

class ReportResponseMessage(messages.Message):
    response_list = messages.MessageField(JsonMessage, 1, repeated=True)
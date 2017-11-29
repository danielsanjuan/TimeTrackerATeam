from protorpc import messages

class JsonMessage(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)
    monday = messages.IntegerField(3)
    tuesday = messages.IntegerField(4)
    wednesday = messages.IntegerField(5)
    thursday = messages.IntegerField(6)
    friday = messages.IntegerField(7)
    total = messages.StringField(8)

class ReportResponseMessage(messages.Message):
    response_report =messages.MessageField(JsonMessage, repeated=True, 1)
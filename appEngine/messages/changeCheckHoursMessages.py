from protorpc import messages
class ChangeCheckHoursMessage(messages.Message):
    email = messages.StringField(1)
    date = messages.StringField(2)

class JsonChangeCheckHoursMessage(messages.Message):
    key = messages.IntegerField(1)
    checkin = messages.StringField(2)
    checkout = messages.StringField(3)

class FixCheckHoursMessage(messages.Message):
    key = messages.IntegerField(1)
    email = messages.StringField(2)
    dateUpdatedCheckIn = messages.StringField(3)
    dateUpdatedCheckOut = messages.StringField(4)


class ChangeCheckHoursResponseMessage(messages.Message):
    response_change_check = messages.MessageField(JsonChangeCheckHoursMessage, 1)


class FixHoursResponseMessage(messages.Message):
    pass
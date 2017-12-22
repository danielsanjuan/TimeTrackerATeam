from protorpc import messages
    
class CompanyTimesMessage(messages.Message):
    # setCompanyTimes = messages.MessageField(JsonCompanyTimesMessage, 1, repeated=True)
    checkinmin = messages.StringField(1)
    checkinmax = messages.StringField(2)
    checkoutmin = messages.StringField(3)
    checkoutmax = messages.StringField(4)
    checkoutminfriday = messages.StringField(5)
    checkoutmaxfriday = messages.StringField(6)


class CompanyTimesSetResponseMessage(messages.Message):
    response_code = messages.IntegerField(1)
    
class CompanyTimesResponseMessage(messages.Message):
    response = messages.MessageField(CompanyTimesMessage, 1)


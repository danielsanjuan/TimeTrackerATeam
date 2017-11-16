import unittest
from datetime import datetime

def check_out(date):
    # date = datetime.strftime("%H:%M:%S")
    if date.hour >= 14 and date.hour <= 19:
        return True
    elif date.hour < 7 or date.hour > 19:
        raise Exception, "Estas haciendo check-out fuera de hora"
    else:
        return "Check_out before 14:00, report will be sended"

class CheckOutTest(unittest.TestCase):
    def test_check_out(self):
        date = datetime(2017, 11, 16, 15, 14)
        self.assertEqual(check_out(date), True, "OK")
    def test_check_out_negative(self):
        self.assertRaises(Exception, check_out, datetime(2017, 11, 16, 20, 14))
    def test_check_out_with_notification(self):
        date = datetime(2017, 11, 16, 11, 14)
        self.assertEqual(check_out(date), "Check_out before 14:00, report will be sended", "Mala hora")
if __name__ == '__main__':
    unittest.main()

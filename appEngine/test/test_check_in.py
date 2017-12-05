import unittest
from datetime import datetime, date, time


def check_in(date, state):
    if date.hour >= 7 and date.hour < 9 and state:
        return True
    elif date.hour == 9 and date.minute == 00:
        return True
    elif date.hour < 7 or date.hour > 19:
        raise Exception, 'You are out of range to do check-in'
    else:
        return "Check_in after 9:00am. A report will be generated"

class SimplisticClass(unittest.TestCase):

    def test_check_in_success(self):
        checkin = check_in(datetime.now(), False)
        self.assertTrue(checkin)

    def test_check_in_out_of_range(self):
        d = date(2005, 7, 14)
        t = time(6, 30)
        self.assertRaises(Exception, check_in, datetime.combine(d, t), False)

    def test_check_in_with_notification(self):
        d = date(2005, 7, 14)
        t = time(9, 01)
        self.assertEqual(check_in(datetime.combine(d, t), False), "Check_in after 9:00am. A report will be generated")

if __name__ == '__main__':
    unittest.main()

#!/usr/bin/env python

import os
import unittest
import re
from email.utils import parseaddr


PanelNotificaciones = False
CambioVista = False
class Empleado:
    def __init__():
        """"Definimos empleado, email tendra su email 
            suspend dira si es un usuario fuera de la empresa.
            Position indicara que puesto ocupa. 0 no indicado
                 1 HHRR y tendra que cargar otro check in distinto
         """
        self.email = ""
        self.suspend = False
        self.position = 0


def check_email(email):
    
    if not re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', email): return False
    else: return True


def check_user_HHRR(value):
    if (value == 1): 
        PanelNotificaciones = True
        return True
    else: 
        PanelNotificaciones = False
        return False


def check_view_user(value):
    PanelNotificaciones = value
    if (PanelNotificaciones): 
        return True
    else: 
        return False


class login_test(unittest.TestCase):

    def test_rigth_email(self):
        self.assertTrue(check_email("daniel.arbelo@edosoft.com"))


    def test_wrong_email(self):
        self.assertFalse(check_email("pipaspalpajaro"), "Error, el correo es invalido")

    def test_HHRR_panel_login(self):
        self.assertTrue(check_user_HHRR(1))

    def test_HHRR_panel_login_fail(self):
        self.assertFalse(check_user_HHRR(0), "Error, este usuario no es un HHRR y no puede ver el panel de notificaciones")

    def test_cambio_index(self):

        self.assertTrue(check_view_user(True))

    def test_cambio_index_fail(self):
        self.assertFalse(check_view_user(False))


if __name__ =='__main__':
    unittest.main()



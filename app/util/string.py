def utf8_string(value):
    return bytes(value, "utf-8").decode("unicode_escape")

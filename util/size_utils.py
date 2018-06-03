#! -*- coding:utf8 -*-

symbols = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

def _get_carry_size(symbol):
    symbol_index = symbols.index(symbol)

    return 1 << symbol_index * 10


def _get_decimal_string(decimal):
    
    return '%.' + str(decimal) + 'f'


def get_human_size(size, symbol, decimal):

    return _get_decimal_string(decimal) % (float(size) / _get_carry_size(symbol))

if __name__ == "__main__":
    print _get_carry_size('M')
    print _get_decimal_string(1)
    print get_human_size(1982, 'K', 1)
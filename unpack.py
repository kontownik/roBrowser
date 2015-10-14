from collections import namedtuple
from cStringIO import StringIO
import re
import sys
import struct
import urllib
import zlib


HEADER_SIZE = 46

Header = namedtuple('Header', ['signature', 'key', 'table_offset', 'seeds', 'filecount', 'version'])
FileInfo = namedtuple('FileInfo', ['pack_size', 'length_aligned', 'real_size', 'flags', 'position'])


def parseFileTable(f):
    ft_info = f.read(8)
    packed_size, real_size = struct.unpack('<LL', ft_info)
    ft_data = f.read(packed_size)
    data = zlib.decompress(ft_data)

    if len(data) != real_size:
        raise ValueError('incorrect real_size of filetable (%s declared, %s actual)' %(real_size, len(data)))

    fileTable = {}

    ind = 0
    while True:
        try:
            filename_end = data.index('\x00', ind)
        except ValueError:
            break
        filename = data[ind:filename_end]
        file_info_data = data[filename_end+1:filename_end+18]
        file_info = FileInfo._make(struct.unpack('<LLLcL', file_info_data))
        ind = filename_end + 18
        fileTable[filename] = file_info
    return fileTable


def parseGRFInfo(f):
    header = f.read(HEADER_SIZE)
    return Header._make(struct.unpack('<15s15sLLLL', header))

import os.path
import os

def parseGRF(filename, target):
    f = open(filename)
    header = parseGRFInfo(f)
    f.seek(header.table_offset, 1)
    ft = parseFileTable(f)

    total = len(ft)

    for count, (filename, fileinfo) in enumerate(ft.iteritems()):

        filename = filename.replace('\\', '/')
        if '\xc5\xac\xb7\xce\xc5\xb7' in filename:
            print 'dupa', repr(filename)
        else:
            continue
        dirname = os.path.join(target, os.path.dirname(filename))
        filename = os.path.basename(filename)
        try:
            os.makedirs(dirname)
        except OSError as e:
            if e.errno != 17:
                raise
        f.seek(fileinfo.position + HEADER_SIZE)
        content_packed = f.read(fileinfo.pack_size)
        if count % 1000 == 0:
            print '%s/%s' % (count, total)
        try:
            content = zlib.decompress(content_packed)
        except Exception as e:
            print e
            continue

        if 'onet l copy.bmp' in content:
            print '!!!',dirname, filename
        with open(os.path.join(dirname, filename), 'w') as outf:

            outf.write(content)

if __name__ == '__main__':
    from sys import argv
    parseGRF(argv[1], argv[2])



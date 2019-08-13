#!python3
"""
Access windows credentials
"""
from typing import Tuple
import ctypes as CT
import ctypes.wintypes as WT
import sys

CRED_TYPE_GENERIC = 0x01

LPBYTE = CT.POINTER(WT.BYTE)
LPWSTR = WT.LPWSTR
LPCWSTR = WT.LPWSTR
class CREDENTIAL_ATTRIBUTE(CT.Structure):
    _fields_ = [
        ('Keyword', LPWSTR),
        ('Flags', WT.DWORD),
        ('ValueSize', WT.DWORD),
        ('Value', LPBYTE)]
PCREDENTIAL_ATTRIBUTE = CT.POINTER(CREDENTIAL_ATTRIBUTE)
class CREDENTIAL(CT.Structure):
    _fields_ = [
        ('Flags', WT.DWORD),
        ('Type', WT.DWORD),
        ('TargetName', LPWSTR),
        ('Comment', LPWSTR),
        ('LastWritten', WT.FILETIME),
        ('CredentialBlobSize', WT.DWORD),
        ('CredentialBlob', LPBYTE),
        ('Persist', WT.DWORD),
        ('AttributeCount', WT.DWORD),
        ('Attributes', PCREDENTIAL_ATTRIBUTE),
        ('TargetAlias', LPWSTR),
        ('UserName', LPWSTR)]
PCREDENTIAL = CT.POINTER(CREDENTIAL)

advapi32 = CT.WinDLL('Advapi32.dll')
advapi32.CredReadA.restype = WT.BOOL
advapi32.CredReadA.argtypes = [LPCWSTR, WT.DWORD, WT.DWORD, CT.POINTER(PCREDENTIAL)]


def GetGenericCredential(name:str) -> Tuple[str, str]:
    """
    Returns a Tuple of Name and Password of a Generic Windows Credential
    Uses bytes in Py3 and str in Py2 for url, name and password.
    """
    cred_ptr = PCREDENTIAL()
    if advapi32.CredReadW(name, CRED_TYPE_GENERIC, 0, CT.byref(cred_ptr)):
        username = cred_ptr.contents.UserName
        cred_blob = cred_ptr.contents.CredentialBlob
        cred_blob_size = cred_ptr.contents.CredentialBlobSize
        password_as_list = [int.from_bytes(cred_blob[pos:pos+2], 'little')
                           for pos in range(0, cred_blob_size, 2)]
        password = ''.join(map(chr, password_as_list))
        advapi32.CredFree(cred_ptr)
        return username, password
    else:
        raise IOError("Failure reading credential")


def main():
    target = sys.argv[1]
    name, pwd = GetGenericCredential(target)
    print(name, ":", pwd, sep="")


if __name__ == '__main__':
    main()
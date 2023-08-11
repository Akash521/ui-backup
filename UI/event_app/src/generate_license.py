import base64
from cryptography.fernet import Fernet
from secretpy import Caesar




def encode_cam(num_cam,customer_name):
    L = dict(zip("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",range(52)))
    I = dict(zip(range(52),"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"))
    key = 9
    prefix = 'Pivotchain_'
    client = customer_name
    key_text = client +'_' +prefix + str(num_cam)
    key_text = key_text.lower()

    for key in [1,4]:
        ciphertext = ""
        for c in key_text:
            if c.isalpha(): ciphertext += I[(L[c] + key)%52 ]
            else: ciphertext += c
        key_text = ciphertext      

    for key in [3,6,9]:
        key_bytes = key_text.encode('ascii')
        base128_bytes = base64.b64encode(key_bytes)
        base128_key = base128_bytes.decode('ascii')

        ciphertext = ""
        for c in base128_key:
            if c.isalpha(): ciphertext += I[(L[c] + key)%52 ]
            else: ciphertext += c

        new_ciphertext = ciphertext[int(len(ciphertext)/2):] +  ciphertext[:int(len(ciphertext)/2)]
    
        key_bytes = new_ciphertext.encode('ascii')
        base128_bytes = base64.b64encode(key_bytes)
        base128_key = base128_bytes.decode('ascii')
        key_text = base128_key

    #print('ciphertext1:',base128_key)

    key1 = b'1U5MClWgkwrxJwVtsJtsmH6sgHtMQVYYOqNQx6sygH0=' #Fernet.generate_key()
    cipher= Fernet(key1)
    ciphertext = cipher.encrypt(base128_key.encode('ascii'))
    #print('key1',key1)
    


    key2 = b'NHwLuDtRuKjzgDhwTTX1xoHTWFgBMAcn5efn5xxX5G4=' #Fernet.generate_key()
    cipher = Fernet(key2)
    ciphertext = cipher.encrypt(ciphertext)
    #print('key2',key2)
    #print('ciphertext2:',ciphertext)


    base128_bytes = base64.b64encode(ciphertext)
    base128_key = base128_bytes.decode('ascii')
    #print('base128_key_final:',base128_key)

    #decode_key(base128_key,key2,key1,[7,6,3],[4,1],2)
    base128_key = base128_key[int(len(base128_key)/2):] +  base128_key[:int(len(base128_key)/2)]

    # for key in [2,3,4]:


    return {"license_key":base128_key}  #,key1,key2
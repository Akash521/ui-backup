FROM pivotchaindata.com/drdo/common-base:dev 
#FROM pivotregistry.in/jk/base-image:dev
WORKDIR /app
COPY ./src .

RUN cd python-onvif2-zeep && python setup.py install
RUN pip install --upgrade onvif2_zeep

RUN apt-get update && apt-get install -y net-tools

ENV PATH=/root/.local/bin:$PATH
RUN python3 /app/setup.py build
ADD script.sh /app/
RUN chmod 777 -R /app/script.sh


ENTRYPOINT bash /app/script.sh
# CMD python3 /app/main.py




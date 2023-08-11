FROM pivotchaindata.com/drdo/common-base:dev 
# FROM pivotregistry.in/jk/base-image:dev
WORKDIR /app
COPY ./src .
ENV PATH=/root/.local/bin:$PATH
RUN python3 /app/setup.py build
CMD python3 /app/main.py

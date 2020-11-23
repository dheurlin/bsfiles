FROM python:3.9

RUN mkdir /db
RUN mkdir /project
RUN mkdir /scripts

WORKDIR /project

ADD requirements.txt /project
RUN pip install -r requirements.txt

ADD project /project
ADD scripts /scripts

ENV FLASK_APP "bsfiles"

CMD ["bash", "/scripts/entrypoint.sh"]


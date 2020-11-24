FROM python:3.9

RUN mkdir /db
RUN mkdir /project
RUN mkdir /scripts
ADD scripts /scripts

# Install SASS
RUN /scripts/sass-install.sh
ENV PATH="/usr/local/bin/dart-sass:${PATH}"

WORKDIR /project

ADD requirements.txt /project
RUN pip install -r requirements.txt

ADD project /project

ENV FLASK_APP "bsfiles"

CMD ["bash", "/scripts/entrypoint.sh"]


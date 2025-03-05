FROM python:3.10.5-alpine
# upgrade pip
RUN pip install --upgrade pip

WORKDIR /app
# copy all files to the container
COPY . /app
# python and venv setup
ENV VIRTUAL_ENV=/app/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN export FLASK_APP=app.py
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
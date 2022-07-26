FROM gradle:5.3.0-jdk-alpine AS TEMP_BUILD_IMAGE
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle settings.gradle $APP_HOME

COPY gradle $APP_HOME/gradle
COPY --chown=gradle:gradle . /home/gradle/src
USER root
RUN chown -R gradle /home/gradle/src

RUN gradle build || return 0
COPY . .
RUN gradle clean build

FROM openjdk:8-jdk-alpine
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME


ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} ./app.jar

COPY --from=TEMP_BUILD_IMAGE $APP_HOME/build/libs/* ./app.jar


EXPOSE 8080
CMD ["java", "-jar", "./app.jar"]

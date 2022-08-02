FROM gradle:jdk11 as gradleimage
COPY . /home/gradle/source
WORKDIR /home/gradle/source
RUN gradle build

FROM openjdk:8
WORKDIR /app
COPY --from=gradleimage /home/gradle/source/build/libs/*.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "./app.jar"]

name := """Bookstore"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "org.scalaj" %% "scalaj-http" % "2.3.0",
  "org.json4s" %% "json4s-jackson" % "3.2.10",
  "org.json4s" %% "json4s-native" % "3.5.0",
  "uk.gov.hmrc" %% "emailaddress" % "2.0.0"
)

resolvers += Resolver.bintrayRepo("hmrc", "releases")

fork in run := true
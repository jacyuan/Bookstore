package controllers

import javax.inject._

import play.api._
import play.api.mvc._
import java.security.MessageDigest
import java.util.Calendar

import play.api.libs.json._

import scala.util.parsing.json.JSONObject
import scalaj.http._

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject() extends Controller {

  /**
    * Create an Action to render an HTML page with a welcome message.
    * The configuration in the `routes` file means that this method
    * will be called when the application receives a `GET` request with
    * a path of `/`.
    */
  def index = Action {
    val itemsPerPage = 6
    val publicKey = "f63548d029560ca6297df5eab0ce1184"
    val privateKey = "21fb208a38c9feaf9e8a043d0f6276eba10784e7"
    val now = Calendar.getInstance().getTimeInMillis()
    val input = now + privateKey + publicKey
    val hash = md5Hash(input)

    var url = "http://gateway.marvel.com:80/v1/public/comics?limit=" + itemsPerPage + "&offset=0&apikey=" + publicKey

    url += "&ts=" + now + "&hash=" + hash


    val response: HttpResponse[String] = Http(url).asString

    val jsonObject = Json.parse(response.body)

    val result = (jsonObject \ "data").get

    val totalCount = (result \ "total").get
    val books = (result \ "results").get

    println(totalCount)
    println(books)

    Ok(views.html.index(jsonObject.toString()))
  }

  //generate md5 string
  def md5Hash(text: String): String = MessageDigest.getInstance("MD5").digest(text.getBytes()).map(0xFF & _).map {
    "%02x".format(_)
  }.foldLeft("") {
    _ + _
  }

}

package controllers

import java.security.MessageDigest
import java.util.Calendar
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import scalaj.http.{HttpResponse, _}

/**
  * Created by yuan on 2017/2/21.
  */
class BookController @Inject() extends Controller {
  val publicKey = "f63548d029560ca6297df5eab0ce1184"
  val privateKey = "21fb208a38c9feaf9e8a043d0f6276eba10784e7"
  val itemsPerPage = 6

  //generate md5 string
  private def md5Hash(text: String): String = MessageDigest.getInstance("MD5").digest(text.getBytes()).map(0xFF & _).map {
    "%02x".format(_)
  }.foldLeft("") {
    _ + _
  }

  private def getOffset(currentPage: Int): Int = {
    currentPage * itemsPerPage
  }

  private def getUrlForBookList(currentPage: Int): String = {
    val now = Calendar.getInstance().getTimeInMillis
    s"http://gateway.marvel.com:80/v1/public/comics?limit=$itemsPerPage&offset=${getOffset(currentPage)}&apikey=$publicKey&ts=$now&hash=${md5Hash(now + privateKey + publicKey)}"
  }

  private def getUrlForBookDetail(bookId: Int): String = {
    val now = Calendar.getInstance().getTimeInMillis
    s"http://gateway.marvel.com:80/v1/public/comics/$bookId?apikey=$publicKey&ts=$now&hash=${md5Hash(now + privateKey + publicKey)}"
  }

  private def getResult(response: HttpResponse[String]): String = {
    val jsonObject = Json.parse(response.body)
    (jsonObject \ "data").get.toString
  }

  //get book list
  def getBooks(currentPage: Int) = Action {
    val res = Http(getUrlForBookList(currentPage)).asString
    Ok(getResult(res))
  }

  //get book detail by id
  def getBook(bookId: Int) = Action {
    val res = Http(getUrlForBookDetail(bookId)).asString
    Ok(getResult(res))
  }
}
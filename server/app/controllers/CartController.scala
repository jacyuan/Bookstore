package controllers

import javax.inject.Inject

import play.api.mvc.{Action, Controller}
import org.json4s.jackson.Serialization.read
import org.json4s._
import org.json4s.jackson.Serialization


/**
  * Created by yuan on 2017/2/23.
  */
class CartController @Inject() extends Controller {
  implicit val formats = Serialization.formats(NoTypeHints)

  def saveCart() = Action { request =>
    val data = request.body.asJson.get

    println(read[CartDto](data.toString()))

    Ok
  }
}

case class Cart(id: Int, title: String, quantity: Int, price: Float)

case class PersonalInfo(email: String, street: String, city: String, dueDate: String)

case class CartDto(cart: List[Cart], personalInfo: PersonalInfo)

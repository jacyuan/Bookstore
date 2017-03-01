package controllers

import java.text.SimpleDateFormat
import java.util.Calendar
import javax.inject.Inject
import play.api.mvc._
import org.json4s._
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.{read, write}
import uk.gov.hmrc.emailaddress.EmailAddress

/**
  * Created by yuan on 2017/2/23.
  */
class CartController @Inject() extends Controller {
  implicit val formats = Serialization.formats(NoTypeHints)

  def ValidationCartInfo(cart: CartDto): Map[String, Boolean] = {
    Map(
      "email" -> EmailAddress.isValid(cart.personalInfo.email),
      "street" -> IsStreetValid(cart.personalInfo.street),
      "city" -> IsCityValid(cart.personalInfo.city),
      "dueDate" -> IsDueDateValid(cart.personalInfo.dueDate)
    )
  }

  def IsStringNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty

  def IsStreetValid(street: String): Boolean = !IsStringNullOrEmpty(street)

  def IsCityValid(city: String): Boolean = !IsStringNullOrEmpty(city) && city.length <= 50

  def IsDueDateValid(dueDate: String): Boolean = {
    try {
      val format = new SimpleDateFormat("dd/MM/yyyy")

      val inputDate = format.parse(dueDate).getTime
      val today = format.parse(format.format(Calendar.getInstance().getTime)).getTime

      val diffTime = inputDate - today
      val diffDays = diffTime / (1000 * 60 * 60 * 24)
      diffDays >= 2 && diffDays <= 15
    } catch {
      case e: Exception => {
        false
      };
    }
  }

  def saveCart(): Action[AnyContent] = {
    Action { request =>
      //get data
      val data = request.body.asJson.get
      val cart = read[CartDto](data.toString())

      //validations
      val validationRes = ValidationCartInfo(cart)

      if (validationRes.values.exists(_ == false)) {
        NotAcceptable(write(validationRes))
      } else {
        Ok
      }
    }
  }
}

case class Cart(id: Int, title: String, quantity: Int, price: Float)

case class PersonalInfo(email: String, street: String, city: String, dueDate: String)

case class CartDto(cart: List[Cart], personalInfo: PersonalInfo)
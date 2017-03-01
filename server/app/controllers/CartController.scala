package controllers

import java.text.SimpleDateFormat
import java.util.{Calendar, Date}
import javax.inject.Inject
import org.json4s._
import org.json4s.jackson.Serialization
import play.api.mvc._
import org.json4s.jackson.Serialization.{read, write}
import uk.gov.hmrc.emailaddress.EmailAddress

class CartController @Inject() extends Controller {
  implicit val formats = Serialization.formats(NoTypeHints)

  private val dateParseFormat = new SimpleDateFormat("dd/MM/yyyy")

  private def ValidationCartInfo(cart: CartDto): Map[String, Boolean] = {
    Map(
      "email" -> EmailAddress.isValid(cart.personalInfo.email),
      "street" -> IsStreetValid(cart.personalInfo.street),
      "city" -> IsCityValid(cart.personalInfo.city),
      "dueDate" -> IsDueDateValid(cart.personalInfo.dueDate)
    )
  }

  private def IsStringNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty

  private def IsStreetValid(street: String): Boolean = !IsStringNullOrEmpty(street)

  private def IsCityValid(city: String): Boolean = !IsStringNullOrEmpty(city) && city.length <= 50

  private def IsDueDateValid(dueDate: String): Boolean = {
    try {
      val inputDate = dateParseFormat.parse(dueDate)
      val diffDays = getDiffDays(inputDate)
      diffDays >= 2 && diffDays <= 15
    } catch {
      case e: Exception => {
        false
      };
    }
  }

  private def getDiffDays(dueDate: Date): Long = {
    val inputDate = dueDate.getTime
    val today = dateParseFormat.parse(dateParseFormat.format(Calendar.getInstance().getTime)).getTime

    val diffTime = inputDate - today
    diffTime / (1000 * 60 * 60 * 24)
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
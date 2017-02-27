package controllers

import java.text.SimpleDateFormat
import java.util.Calendar
import javax.inject.Inject

import org.joda.time.{DateTime, Period, PeriodType}
import play.api.mvc.{Action, Controller}
import org.json4s.jackson.Serialization.read
import org.json4s._
import org.json4s.jackson.Serialization
import uk.gov.hmrc.emailaddress.EmailAddress

/**
  * Created by yuan on 2017/2/23.
  */
class CartController @Inject() extends Controller {
  implicit val formats = Serialization.formats(NoTypeHints)

  def ValidationCartInfo(cart: CartDto): Map[String, Boolean] = {
    Map(
      "email" -> EmailAddress.isValid(cart.personalInfo.email),
      "street" -> StreetValidation(cart.personalInfo.street),
      "city" -> CityValidation(cart.personalInfo.street),
      "dueDate" -> DueDateValidation(cart.personalInfo.dueDate)
    )
  }

  def IsStringNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty

  def StreetValidation(street: String): Boolean = !IsStringNullOrEmpty(street)

  def CityValidation(city: String): Boolean = !IsStringNullOrEmpty(city) && city.length <= 50

  def DueDateValidation(dueDate: String): Boolean = {
    try {
      val format = new SimpleDateFormat("dd/MM/yyyy")
      val inputDate = new DateTime(format.parse(dueDate))
      val today = new DateTime(format.parse(format.format(Calendar.getInstance().getTime())))
      val p = new Period(today, inputDate).getDays
      p >= 2 && p <= 15
    } catch {
      case e: Exception => false;
    }
  }

  def saveCart() = Action { request =>
    val data = request.body.asJson.get

    val cart = read[CartDto](data.toString())

    val tt = ValidationCartInfo(cart)
    println(tt)

    if (tt.values.exists(_ == false)) {
      PreconditionFailed(tt.toString())
    }else{
      Ok
    }
  }
}

case class Cart(id: Int, title: String, quantity: Int, price: Float)

case class PersonalInfo(email: String, street: String, city: String, dueDate: String)

case class CartDto(cart: List[Cart], personalInfo: PersonalInfo)
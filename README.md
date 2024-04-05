<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Technologies Used
- Docker
- Redis
- RabbitMQ
- MongoDB
- Mongoose

## Architecture
The architecture of this project is microservices-based, consisting of three services: Authentication, Books, Cart, and an HTTP Gateway.

### Authentication Service
This service is responsible for user management. Users can perform the Register and Login processes using this service. Upon receiving a token, users can authenticate themselves for site access. Each user can have a Premium subscription, allowing them to view the list of books requiring a Premium subscription.

### Books Service
This service manages the book collection. Various genres related to books can be defined using this service, and we can use genre IDs to define books to obtain relevant genre information. Each book includes its title, author's name, information about the relevant genre, publication date, and description. Books can be defined with the aforementioned attributes, and besides these fields, the isPremium field can be utilized. When this field is set to true, it means that only users with a premium subscription have access to the book.

### Cart Service
This service relates to the user's shopping cart, where users can add available books to their cart. The shopping cart process works in such a way that each user can have multiple shopping carts but can only have one open cart. Determining whether the cart is still open or not is done through the isPaid field. When the user pays for their shopping cart, the cart changes to paid, and for a new order, a new shopping cart must be opened.

### Http Gateway Service
All project services are added to this service, and routing for the project is handled here.

@regression @api @createUser
Feature: Create User

  @createANewUser @createUser
  Scenario Outline: Create a new user
    When I request to create a new user with the following details
      | name   | gender   | email   | status   |
      | <name> | <gender> | <email> | <status> |
    Then the response status code should be 201
    And the response must contain the user details
      | name   | gender   | email   | status   |
      | <name> | <gender> | <email> | <status> |
    Examples:
      | name       | gender | email              | status   |
      | Jane Moe   | female | jsee@example.com   | active   |
      | Jonn Sitth | male   | j.smith@domain.com | inactive |

  @createUserMissingFields
  Scenario Outline: Attempt to create a new user with missing required fields
    When I request to create a new user with the invalid details
      | name   | gender   | email   | status   |
      | <name> | <gender> | <email> | <status> |
    Then the response status code should be 422
    And the response must contain an error message "<error message>" indicating field "<missingField>" is missing
    Examples:
      | name       | gender | email                 | status   | missingField | error message                         |
      | Jane Doe   | female |                       | active   | email        | can't be blank                        |
      | Kohn Smith |        | kohn.smith@domain.com | active   | gender       | can't be blank, can be male of female |
      |            | male   | kohn.smith@domain.com | inactive | name         | can't be blank                        |
      | Kohn Smith | male   | kohn.smith@domain.com |          | status       | can't be blank                        |

  @createUserInvalidEmail
  Scenario Outline: Attempt to create a new user with an invalid email format
    When I request to create a new user with the invalid details
      | name   | gender   | email   | status   |
      | <name> | <gender> | <email> | <status> |
    Then the response status code should be 422
    And the response must contain an error message "<error message>" indicating field "<missingField>" is missing
    Examples:
      | name       | gender | email              | status   | missingField | error message |
      | Kans Doe   | female | kanddoeexample.com | active   | email        | is invalid    |
      | Konn Smith | male   | konn@.com          | inactive | email        | is invalid    |

  @createUserDuplicateEmail @createUser
  Scenario: Attempt to create a new user with an already taken email address
    When I request to create a new user with the following details
      | name      | gender | email              | status |
      | Masse Doe | male   | massae@example.com | active |
    Then the response status code should be 201
    When I request to create a new user with the invalid details
      | name      | gender | email              | status |
      | Masse Doe | male   | massae@example.com | active |
    Then the response status code should be 422
    And the response must contain an error message "has already been taken" indicating field "email" is missing

  @createUserInvalidStatus
  Scenario Outline: Attempt to create a new user with an invalid status value
    When I request to create a new user with the invalid details
      | name   | gender   | email   | status   |
      | <name> | <gender> | <email> | <status> |
    Then the response status code should be 422
    And the response must contain an error message "can't be blank" indicating field "status" is missing
    Examples:
      | name         | gender | email                   | status   |
      | Jaxe MMoe    | female | jaaaaedoex@example.com  | disabled |
      | Joxn Sasdith | male   | joxaan.xmith@domain.com | pending  |

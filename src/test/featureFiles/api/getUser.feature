@regression @api @GetUser
Feature: Get User

  @getAllUsers
  Scenario: Get list of all users
    When I request to get all users
    Then the response status code should be 200
    And the response users must have the following fields
      | id   |
      | name |

  @getUserById
  Scenario: Get single user
    # Note: The ID being requested might not exist in the backend.
    # This scenario assumes that the ID "7522408" exists.
    # If the ID does not exist, the test will fail due to a 404 Not Found status code.
    When I request to get single user with id 7522408
    Then the response status code should be 200
    And the response user id must be 7522408

  @getUserByIdOrName @createUser
  Scenario Outline: Get single user by id or name
    When I request to create a new user with the following details
      | name     | gender | email               | status |
      | Jane Doe | female | jaximoa@example.com | active |
    And the response status code should be 201
    And I request to get the newly created user with "<field>"
    Then the response status code should be 200
    And the response must contain the user details
      | name     | gender | email               | status |
      | Jane Doe | female | jaximoa@example.com | active |
    Examples:
      | field |
      | id    |
      | name  |

  @getUsersWithPagination
  Scenario Outline: Get users with pagination
    When I request to get all users on page <page> with <perPage> users per page
    Then the response status code should be 200
    And the response must contain exactly <result> users
    And the response headers must contain pagination information "<limit>"
    Examples:
      | page | perPage | result | limit |
      |    1 |      10 |     10 |    10 |
      |    1 |     100 |    100 |   100 |
      |    1 |     101 |     10 |    10 |

  @getUserByIdWithoutAuth
  Scenario: Get user by ID without authentication
    When I request to get a user with id 12345 with no authentication
    Then the response status code should be 401
    And the response must have a "message" message

  @getUserByNonNumericId
  Scenario: Get user by non-numeric ID
    When I request to get a user with a non-numeric id "xyz"
    Then the response status code should be 404
    And the response must have a "error" message

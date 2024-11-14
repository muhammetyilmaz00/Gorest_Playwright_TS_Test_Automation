@regression @api @UpdateUser
Feature: Update User

  @createUser @updateUser
  Scenario: Update a user
    When I request to create a new user with the following details
      | name     | gender | email               | status |
      | Jane Doe | female | janiaoa@example.com | active |
    Then the response status code should be 201
    When I request to update the user with the following details
      | name     | gender | email               | status |
      | Jane Doe | male   | janiaoa@example.com | active |
    Then the response status code should be 200
    And the response must contain the user details
      | name     | gender | email               | status |
      | Jane Doe | male   | janiaoa@example.com | active |

  @createUser @partialUpdateUser
  Scenario: Partial update a user
    When I request to create a new user with the following details
      | name     | gender | email               | status |
      | Jane Doe | female | janiaoa@example.com | active |
    Then the response status code should be 201
    When I request to partial update the user with the following details
      | name        |
      | Jessie Jhan |
    Then the response status code should be 200
    And the response must contain the user details
      | name        | gender | email               | status |
      | Jessie Jhan | female | janiaoa@example.com | active |

  @updateUserWithoutAuth
  Scenario: Update user without authentication
    When I request to update a user with id 12345 with no authentication
      | name       | gender | email                  | status |
      | Ali Tester | male   | ali.tester@example.com | active |
    Then the response status code should be 401
    And the response must have a "message" message

  @updateUserMissingFields @createUser
  Scenario: Update user with missing required fields
    When I request to create a new user with the following details
      | name       | gender | email                  | status |
      | Alice Test | female | alice.test@example.com | active |
    And the response status code should be 201
    When I request to update the user with the following details
      | name |
      |      |
    Then the response status code should be 422
    And the response must contain an error message "can't be blank" indicating field "name" is missing
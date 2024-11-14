@regression @api @DeleteUser
Feature: Delete User

  @deleteUser
  Scenario: Delete a user
    When I request to create a new user with the following details
      | name     | gender | email               | status |
      | Jane Doe | female | janiaoa@example.com | active |
    Then the response status code should be 201
    When I request to delete the user
    Then the response status code should be 204

  @deleteNonExistingUser
  Scenario: Delete a user that does not exist
    When I request to delete the user with id "invalid_id"
    Then the response status code should be 404
    And the response must have a "error" message

  @deleteUserWithoutAuth @createUser
  Scenario: Attempt to delete a user without authentication
    Given I request to create a new user with the following details
      | name      | gender | email                 | status |
      | Alex Test | male   | alex.test@example.com | active |
    And the response status code should be 201
    When I request to delete the user without authentication
    Then the response status code should be 401
    And the response must have a "message" message

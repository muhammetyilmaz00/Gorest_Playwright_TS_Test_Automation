@regression @api @e2e
Feature: End to End User Tests

  Scenario: Create a user, get the user, update the user and delete the user
    When I request to create a new user with the following details
      | name     | gender | email               | status |
      | Jane Doe | female | janiaoa@example.com | active |
    Then the response status code should be 201
    And I request to get the newly created user with "id"
    Then the response status code should be 200
    When I request to update the user with the following details
      | name     | gender | email               | status |
      | Jane Doe | male   | janiaoa@example.com | active |
    Then the response status code should be 200
    And the response must contain the user details
      | name     | gender | email               | status |
      | Jane Doe | male   | janiaoa@example.com | active |
    When I request to delete the user
    Then the response status code should be 204  
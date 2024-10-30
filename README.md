## Description

This repository contains the backend for iMenu, a software solution designed to optimize the restaurant ordering process with a digital menu.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Here's a draft documentation based on the provided code, describing each endpoint in a concise format:

---

1.  Create User

- Path: `POST /v2/user/create`
- Description: Creates a new user.
- Request Body: `CreateUserDto`
- Response Type: JSON (created user details)

2.  Get All Users

- Path: `GET /v2/user`
- Description: Retrieves all users (requires SUPER_ADMIN role).
- Request Body: None
- Response Type: JSON (list of users)

3.  Add User to Space

- Path: `PATCH /v2/user/link-space`
- Description: Adds a user to a specific space by space ID.
- Query Parameter: `spaceId` (number, required)
- Request Body: None
- Response Type: JSON (status of operation)

4.  Add User to Space by Email

- Path: `POST /v2/user/link-space2`
- Description: Adds a user to a space based on email and space ID.
- Request Body: `LinkingSpace`
- Response Type: JSON (status of operation)

5.  Remove User from Space by Email

- Path: `POST /v2/user/unlink-space2`
- Description: Removes a user from a space based on email and space ID.
- Request Body: `LinkingSpace`
- Response Type: JSON (status of operation)

6.  Add User to Site

- Path: `PATCH /v2/user/link-site`
- Description: Adds a user to a site by site ID.
- Query Parameter: `siteId` (number, required)
- Request Body: None
- Response Type: JSON (status of operation)

7.  Get All Space Links

- Path: `GET /v2/user/get-all-space-links`
- Description: Retrieves all space links.
- Request Body: None
- Response Type: JSON (list of space links)

8.  Get User Spaces

- Path: `GET /v2/user/spaces`
- Description: Retrieves all spaces associated with the user.
- Request Body: None
- Response Type: JSON (list of spaces)

9.  Get User Sites

- Path: `GET /v2/user/sites`
- Description: Retrieves all sites associated with the user.
- Request Body: None
- Response Type: JSON (list of sites)

10. Get User Information

- Path: `GET /v2/user/infos`
- Description: Retrieves information about the current user.
- Request Body: None
- Response Type: JSON (user information)

11. Update User

- Path: `PATCH /v2/user/update`
- Description: Updates user details by user ID.
- Request Body: `UpdateUserDto`
- Response Type: JSON (updated user information)

12. Delete User

- Path: `DELETE /v2/user/delete`
- Description: Deletes the user by user ID.
- Request Body: None
- Response Type: JSON (status of deletion)

13. Get Kitchen Status

- Path: `GET /v2/user/kitchen-status/:kitchen_id`
- Description: Retrieves the status of a kitchen by kitchen ID.
- Request Parameter: `kitchen_id` (integer, required)
- Response Type: JSON (kitchen status)

14. Upload Profile Image

- Path: `POST /v2/user/upload-profile`
- Description: Uploads a profile image for the user.
- Request Body: `UploadProfileDto` (multipart/form-data)
- Response Type: JSON (status of upload)

15. Delete Current User

- Path: `DELETE /v2/user`
- Description: Deletes the current user.
- Request Body: None
- Response Type: JSON (status of deletion)

16. User Login

- Path: `POST /v2/user/auth/login`
- Description: Authenticates a user with email and password.
- Request Body: `LoginDto`
- Response Type: JSON (access token)

17. User Registration

- Path: `POST /v2/user/auth/register`
- Description: Registers a new user.
- Request Body: `RegisterDto`
- Response Type: JSON (status of registration)

18. Validate User Email

- Path: `GET /v2/user/auth/validate-email/:token`
- Description: Verifies the user's email using a verification token.
- Request Parameter: `token` (string, required)
- Response Type: JSON (status of verification)

19. Forgot Password

- Path: `POST /v2/user/auth/forgot-password`
- Description: Initiates the forgot password process.
- Request Body: `ForgotPasswordDto`
- Response Type: JSON (status of password reset initiation)

20. Reset Password

- Path: `POST /v2/user/auth/reset-password`
- Description: Resets the user's password.
- Request Body: `ResetPasswordDto`
- Response Type: JSON (status of password reset)

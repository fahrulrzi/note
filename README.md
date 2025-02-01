# API Documentation

## Base URL

- [Vercel](https://note-iota-two.vercel.app/) -> main
- https://note-iota-two.vercel.app/

## Endpoints

### Table of Contents

- [Auth](#1-auth)
  - [Register](#a-register)
  - [Login](#b-login)
- [Notes](#2-notes)
  - [Create Note](#a-create-note)
  - [Get All Notes](#b-get-all-notes)
  - [Get Single Note](#c-get-single-note)
  - [Update Note](#d-update-note)
  - [Delete Note](#e-delete-note)
  - [Get Note By Title Ascending](#f-get-note-by-title-ascending)
  - [Get Note By Updated](#g-get-note-by-updated)
  - [Get Note By Pinned](#h-get-note-by-pinned)
  - [Search Note By Title](#i-search-note-by-title)
- [Shared Notes](#3-shared-notes)
  - [Get All Shared Notes](#a-get-all-shared-notes)
  - [Create Shared Note](#b-create-shared-note)
  - [Update Shared Note](#c-update-shared-note)
  - [Delete Shared Note](#d-delete-shared-note)
- [Tags](#4-tags)
  - [Get All Tags](#a-get-all-tags)
  - [Create Tag](#b-create-tag)
  - [Update Tag](#c-update-tag)
  - [Delete Tag](#d-delete-tag)
- [Upload-Image](#5-upload-image)
  - [Post Image](#a-post-image)
  - [Delete Image](#b-delete-image)
- [User](#6-user)
  - [Get User by Name](#a-get-user-by-name)
- [Folders](#7-folders)
  - [Create Folder](#a-create-folder)
  - [Get All Folders](#b-get-all-folders)
  - [Update Folder](#c-update-folder)
  - [Delete Folder](#d-delete-folder)
  - [Get All Notes By Folder](#e-get-all-notes-by-folder)
  - [Sorting Folder](#f-sorting-folder)

### 1. **Auth**

#### a. **Register**

- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "example@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Registration successful",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "example@example.com"
      },
      "token": "token.example"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "status": "Error",
      "message": "Email already exists"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### b. **Login**

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "example@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "example@example.com"
      },
      "token": "token.example"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Invalid email or password"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

### 2. **Notes**

#### a. **Create Note**

- **URL**: `/api/notes`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Example Title",
    "content": { "json": "content" },
    "is_pinned": false,
    "folder_id": 1
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "status": "Success",
      "message": "Data posted successfully",
      "data": {
        "id": 14,
        "user_id": 12,
        "title": "ambatron",
        "content": {
          "json": "content"
        },
        "is_pinned": false,
        "created_at": "2025-01-30T11:22:43.084686+00:00",
        "updated_at": "2025-01-30T11:22:43.084686+00:00",
        "folder_id": null
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### b. **Get All Notes**

- **URL**: `/api/notes`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "folders": [
        // untuk note dengan folder
        {
          "id": 1,
          "folder_name": "folder name 1",
          "notes": [
            {
              "id": 1,
              "tags": [
                {
                  "tags": {
                    "id": 2,
                    "name": "note"
                  }
                },
                {
                  "tags": {
                    "id": 3,
                    "name": "penting"
                  }
                }
              ],
              "title": "note 1",
              "content": "lorem ipsum",
              "is_pinned": false,
              "created_at": "2025-01-24T06:05:26.789807+00:00"
            },
            {
              "id": 2,
              "title": "note 2",
              "content": "lorem ipsum",
              "is_pinned": false,
              "created_at": "2025-01-23T23:19:21.666202+00:00"
            }
          ]
        },
        {
          "id": 2,
          "folder_name": "folder name 2",
          "notes": [] // kosong tidak ada note
        }
      ],
      "standalone_notes": [
        // untuk note tanpa folder
        {
          "id": 3,
          "title": "note 3",
          "content": "lorem ipsum",
          "is_pinned": false,
          "created_at": "2025-01-24T09:16:45.769395+00:00",
          "tags": [
            {
              "tags": {
                "id": 1,
                "name": "note"
              }
            }
          ]
        },
        {
          "id": 4,
          "title": "note 4",
          "content": "lorem ipsum",
          "is_pinned": false,
          "created_at": "2025-01-25T15:45:32.604911+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### c. **Get Single Note**

- **URL**: `/api/notes/:id`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": {
        "id": 4,
        "title": "note 4",
        "content": "anggrek mekar pontianak",
        "is_pinned": false,
        "created_at": "2025-01-23T23:19:21.666202+00:00",
        "folders": {
          "id": 1,
          "name": "folder name "
        },
        "tags": [
          {
            "tags": {
              "id": 2,
              "name": "note"
            }
          },
          {
            "tags": {
              "id": 3,
              "name": "penting"
            }
          }
        ]
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "status": "Error",
      "message": "Note not found"
    }
    ```

#### d. **Update Note**

- **URL**: `/api/notes/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "title": "Updated Title", //Boleh kosong
    "content": {
      "json": "content"
    }, // Boleh kosong
    "is_pinned": false, // Boleh kosong
    "folder_id": 1 // Boleh kosong
  }
  ```
  **Boleh kosong yang dimaksud juga boleh request seperti berikut:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated Content" // boleh hanya 2 request
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Note updated successfully",
      "data": {
        "id": 4,
        "title": "Updated Title",
        "content": "Updated Content",
        "is_pinned": false,
        "created_at": "2025-01-23T23:19:21.666202+00:00",
        "folders": {
          "id": 1,
          "name": "folder name "
        }
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "status": "Error",
      "message": "Note not found"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### e. **Delete Note**

- **URL**: `/api/notes/:id`
- **Method**: `DELETE`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data deleted successfully",
      "data": {
        "id": 1,
        "user_id": 1,
        "title": "example note",
        "content": "lorem ipsum",
        "is_pinned": false,
        "created_at": "2025-01-25T15:45:32.604911+00:00",
        "updated_at": "2025-01-25T15:45:32.604911+00:00",
        "folder_id": null
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "status": "Error",
      "message": "Note not found"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### f. **Get Note By Title Ascending**

- **URL**: `/api/notes/sort-by-title`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "title": "note 1",
          "content": "lorem ipsum",
          "is_pinned": false,
          "created_at": "2025-01-24T06:05:26.789807+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        },
        {
          "id": 2,
          "title": "note 2",
          "content": "lorem ipsum",
          "is_pinned": false,
          "created_at": "2025-01-23T23:19:21.666202+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### g. **Get Note By Updated**

- **URL**: `/api/notes/sort-by-update`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "title": "note 1",
          "content": { "block": "content" },
          "is_pinned": false,
          "created_at": "2025-01-24T06:05:26.789807+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        },
        {
          "id": 2,
          "title": "note 2",
          "content": { "block": "content" },
          "is_pinned": false,
          "updated_at": "2025-01-24T06:05:26.789807+00:00",
          "created_at": "2025-01-23T23:19:21.666202+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### h. **Get Note By Pinned**

- **URL**: `/api/notes/pinned`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "title": "note 1",
          "content": { "block": "content" },
          "is_pinned": true,
          "created_at": "2025-01-24T06:05:26.789807+00:00"
        },
        {
          "id": 2,
          "title": "note 2",
          "content": { "block": "content" },
          "is_pinned": true,
          "created_at": "2025-01-23T23:19:21.666202+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### i. **Search Note By Title**

- **URL**: `/api/notes/search/:title`
- **Method**: `GET`
- **Request Query**:
  - **Required params**:
    - `title`: title of note
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "title": "note 1",
          "content": { "block": "content" },
          "is_pinned": false,
          "created_at": "2025-01-24T06:05:26.789807+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        },
        {
          "id": 2,
          "title": "note 2",
          "content": { "block": "content" },
          "is_pinned": false,
          "created_at": "2025-01-23T23:19:21.666202+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "status": "Error",
      "message": "Note not found"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

### 3. **Shared Notes**

#### a. **Get All Shared Notes**

- **URL**: `/api/notes/shared`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "permision_level": "view",
          "shared_with_user": {
            "id": 2,
            "name": "John Doe",
            "email": "user@example.com"
          },
          "shared_by_user": {
            "id": 3,
            "name": "John Doe",
            "email": "userrrr@example.com"
          },
          "note": {
            "id": 4,
            "title": "note 4",
            "content": "lorem ipsum"
          }
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

#### b. **Create Shared Note**

- **URL**: `/api/notes/:id/share`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data shared successfully",
      "data": {
        "permision_level": "view",
        "shared_with_user": {
          "id": 2,
          "name": "John Doe",
          "email": "user@example.com"
        },
        "note": {
          "id": 4,
          "title": "note 4",
          "content": "lorem ipsum"
        }
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

#### c. **Update Shared Note**

- **URL**: `/api/notes/share/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "title": "Updated Title", // tidak harus keduanya
    "content": "Updated Content"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data updated successfully",
      "data": {
        "title": "Note Title",
        "content": "Note Content"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "status": "Error",
      "message": "You don't have permission to edit this note"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

#### d. **Delete Shared Note**

- **URL**: `/api/notes/share/:id`
- **Method**: `DELETE`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data deleted successfully",
      "data": {
        "id": 6,
        "note_id": 4,
        "shared_by_user_id": 3,
        "shared_with_email": "user@example.com",
        "permision_level": "view",
        "shared_at": "2025-01-25T10:34:04.478376+00:00"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

### 4. **Tags**

#### a. **Get All Tags**

- **URL**: `/api/tags`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "name": "example tag"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### b. **Create Tag**

- **URL**: `/api/tags`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "example tag"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data created successfully",
      "data": {
        "id": 1,
        "name": "example tag"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

#### c. **Update Tag**

- **URL**: `/api/tags/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "name": "updated tag"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data updated successfully",
      "data": {
        "id": 1,
        "name": "updated tag"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

#### d. **Delete Tag**

- **URL**: `/api/tags/:id`
- **Method**: `DELETE`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data deleted successfully",
      "data": {
        "id": 1,
        "name": "updated tag"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "status": "Error",
      "message": "Unauthorized"
    }
    ```

### 5. **Upload Image**

#### a. **Post Image**

- **URL**: `/api/images/:id` => id notes
- **Method**: `POST`
- **Request Body (from-data)**:
  - **Required fields**:
    - `image`: image file (PNG, JPG, JPEG)
- **File Restrictions**:
  - **Max file size**: 5MB
  - **Allowed file types**: PNG, JPG, JPEG
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Image uploaded successfully",
      "data": {
        "publicUrl": "https://tszgokpzvjfncgdngqhx.supabase.co/storage/v1/object/public/image_note/2b401a63-8749-42f7-862a-52c205ab0c3c_362853BF-A855-4223-BB4B-1A39C82FF6A5.png"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal server error [object Object]"
    }
    ```

#### b. **Delete Image**

- **URL**: `/api/images/:id` => id notes
- **Method**: `DELETE`
- **Request Body**:
  ```json
  {
    "publicUrl": "https://publicURL/example.png"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Image uploaded successfully",
      "data": {
        "publicUrl": "https://tszgokpzvjfncgdngqhx.supabase.co/storage/v1/object/public/image_note/2b401a63-8749-42f7-862a-52c205ab0c3c_362853BF-A855-4223-BB4B-1A39C82FF6A5.png"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal server error [object Object]"
    }
    ```

### 6. **User**

#### a. **Get User by Name**

- **URL**: `/api/users/:name`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": {
        "id": 1,
        "name": "John Doe",
        "email": "example@example.com"
      }
    }
    ```
    - **500 Internal Server Error**:
      ```json
      {
        "status": "Error",
        "message": "Internal Server Error"
      }
      ```

### 7. **Folders**

#### a. **Create Folder**

- **URL**: `/api/folders`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Example Folder",
    "is_pinned": false // default false
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "status": "Success",
      "message": "Data posted successfully",
      "data": {
        "id": 1,
        "name": "Example Folder",
        "is_pinned": false,
        "created_at": "2025-01-30T11:22:43.084686+00:00",
        "updated_at": "2025-01-30T11:22:43.084686+00:00"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### b. **Get All Folders**

- **URL**: `/api/folders`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "name": "Example Folder",
          "is_pinned": false,
          "created_at": "2025-01-30T11:22:43.084686+00:00",
          "updated_at": "2025-01-30T11:22:43.084686+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### c. **Update Folder**

- **URL**: `/api/folders/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "name": "Updated Folder",
    "is_pinned": true
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data updated successfully",
      "data": {
        "id": 1,
        "name": "Updated Folder",
        "is_pinned": true,
        "created_at": "2025-01-30T11:22:43.084686+00:00",
        "updated_at": "2025-01-30T11:22:43.084686+00:00"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### d. **Delete Folder**

## ❗ `Kasih peringatan jika folder yang dihapus memiliki note di dalamnya dan jika folder dihapus, semua note didalamnya akan dihapus juga`

- **URL**: `/api/folders/:id`
- **Method**: `DELETE`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data deleted successfully",
      "data": {
        "id": 1,
        "name": "Updated Folder",
        "is_pinned": true,
        "created_at": "2025-01-30T11:22:43.084686+00:00",
        "updated_at": "2025-01-30T11:22:43.084686+00:00"
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### e. **Get All Notes By Folder**

- **URL**: `/api/folders/:id/notes`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "title": "note 1",
          "content": { "lorem ipsum": "content" },
          "is_pinned": false,
          "created_at": "2025-01-24T06:05:26.789807+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        },
        {
          "id": 2,
          "title": "note 2",
          "content": { "lorem ipsum": "content" },
          "is_pinned": false,
          "created_at": "2025-01-23T23:19:21.666202+00:00",
          "updated_at": "2025-01-24T06:05:26.789807+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

#### f. **Sorting Folder**

- **Key Value**:

  - `name`: sort by name
  - `sort-by-update`: sort by updated date
  - `pinned`: sort by pinned folder

- **URL**: `/api/folders/sorting`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "Success",
      "message": "Data fetched successfully",
      "data": [
        {
          "id": 1,
          "name": "Example Folder",
          "is_pinned": false,
          "created_at": "2025-01-30T11:22:43.084686+00:00",
          "updated_at": "2025-01-30T11:22:43.084686+00:00"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "Error",
      "message": "Internal Server Error"
    }
    ```

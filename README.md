# API Documentation 

## Base URL
- [Vercel](https://note-iota-two.vercel.app/) -> main

## Endpoints
### Table of Contents
- [Auth](#1-auth)
- [Notes](#2-notes)
- [Folders](#3-shared-notes)
- [Tags](#4-tags)


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
            "status": "error",
            "message": "Email already exists"
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
            "message": "Internal Server Error"
        }

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
            "status": "error",
            "message": "Invalid email or password"
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
            "message": "Internal Server Error"
        }
    
### 2. **Notes**
#### a. **Create Note**
- **URL**: `/api/notes`
- **Method**: `POST`
- **Request Body**: 
    ```json
    {
        "title": "Example Title",
        "content": "Example Content"
    }
    ```
- **Response**:
    - **201 Created**:
        ```json
        {
            "message": "Note created successfully",
            "note": {
                "id": 1,
                "title": "Example Title",
                "content": "Example Content"
            }
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
            "message": "Internal Server Error"
        }

#### b. **Get All Notes**
- **URL**: `/api/notes`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
        ```json
        {
            "status": "success",
            "message": "Data fetched successfully",
            "folders": [ // untuk note dengan folder
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
                    "notes": []  // kosong tidak ada note
                }
            ],
            "standalone_notes": [ // untuk note tanpa folder
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
                    ],
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
            "status": "error",
            "message": "Internal Server Error"
        }

#### c. **Get Single Note**
- **URL**: `/api/notes/:id`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
        ```json
        {
            "status": "success",
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
            "status": "error",
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
        "content": "Updated Content", // Boleh kosong
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
            "status": "success",
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
            "status": "error",
            "message": "Note not found"
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
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
            "status": "success",
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
            "status": "error",
            "message": "Note not found"
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
            "message": "Internal Server Error"
        }

### 3. **Shared Notes**
#### a.  **Get All Shared Notes**
- **URL**: `/api/notes/shared`
- **Method**: `GET`
- **Response**:
    - **200 OK**:
        ```json
        {
            "status": "success",
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
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",
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
            "status": "success",
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
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",
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
            "status": "success",
            "message": "Data updated successfully",
            "data": {
                "title": "Note Title",
                "content": "Note Content",
            }
        }
        ```
    - **400 Bad Request**:
        ```json
        {
            "status": "error",
            "message": "You don't have permission to edit this note",
        }
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",  
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
            "status": "success",
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
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",
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
            "status": "success",
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
            "status": "error",
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
            "status": "success",
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
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",
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
            "status": "success",
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
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",
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
            "status": "success",
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
            "status": "error",
            "message": "Internal Server Error"
        }
        ```
    - **401 Unauthorized**:
        ```json
        {
            "status": "error",
            "message": "Unauthorized"
        }
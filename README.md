# API Documentation 

## Base URL
- [Vercel](https://note-iota-two.vercel.app/) -> main
- https://note-iota-two.vercel.app/ 

## Endpoints
### Table of Contents
- [Auth](#1-auth)
- [Notes](#2-notes)
- [Shared Notes](#3-shared-notes)
- [Tags](#4-tags)
- [Upload-Image](#5-upload-image)


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
            "status": "success",
            "message": "Data posted successfully",
            "data": {
                "id": 14,
                "user_id": 12,
                "title": "ambatron",
                "content": {
                    "blocks": [
                        {
                            "id": "cKcVmNrXBi",
                            "data": {
                                "text": "Pengertian dan Manfaat Olahraga Lari",
                                "level": 2
                            },
                            "type": "header"
                        },
                        {
                            "id": "GcMnrBBu5a",
                            "data": {
                                "file": {
                                    "url": "http://127.0.0.1:8000/storage/images/articles/yphVkaU8GKQFNBZoTREoRsj7cs6Ng5fVF4JfuInt.png"
                                },
                                "caption": null,
                                "stretched": false,
                                "withBorder": false,
                                "withBackground": false
                            },
                            "type": "image"
                        },
                        {
                            "id": "DUzGmLkOI4",
                            "data": {
                                "text": "Lari adalah bentuk olahraga aerobik yang melibatkan gerakan berlari atau jogging untuk meningkatkan kebugaran fisik. Olahraga ini tergolong mudah dilakukan karena hanya membutuhkan sepasang sepatu yang nyaman dan area untuk berlari. Beberapa manfaat utama dari olahraga lari antara lain:"
                            },
                            "type": "paragraph"
                        },
                        {
                            "id": "ff_GeVgIZ_",
                            "data": {
                                "meta": [],
                                "items": [
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Meningkatkan kesehatan jantung dan sistem kardiovaskular"
                                    },
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Membantu menurunkan berat badan dan membakar kalori"
                                    },
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Mengurangi stres dan meningkatkan kesehatan mental"
                                    },
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Memperkuat otot dan tulang"
                                    },
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Meningkatkan daya tahan tubuh secara keseluruhan"
                                    },
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Membantu mengatur pola tidur yang lebih baik"
                                    },
                                    {
                                        "meta": [],
                                        "items": [],
                                        "content": "Menurunkan risiko penyakit kronis seperti diabetes tipe 2 dan hipertensi"
                                    }
                                ],
                                "style": "unordered"
                            },
                            "type": "list"
                        },
                        {
                            "id": "mrFuw8VgDI",
                            "data": {
                                "text": "Bagi pemula, penting untuk memulai olahraga lari secara bertahap agar tubuh bisa beradaptasi dan terhindar dari cedera. Berikut ini adalah panduan lengkap tips lari untuk pemula yang bisa Anda terapkan."
                            },
                            "type": "paragraph"
                        }
                    ]
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
            "status": "success",
            "message": "Image uploaded successfully",
            "data": {
                "publicUrl": "https://tszgokpzvjfncgdngqhx.supabase.co/storage/v1/object/public/image_note/2b401a63-8749-42f7-862a-52c205ab0c3c_362853BF-A855-4223-BB4B-1A39C82FF6A5.png"
            }
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
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
            "status": "success",
            "message": "Image uploaded successfully",
            "data": {
                "publicUrl": "https://tszgokpzvjfncgdngqhx.supabase.co/storage/v1/object/public/image_note/2b401a63-8749-42f7-862a-52c205ab0c3c_362853BF-A855-4223-BB4B-1A39C82FF6A5.png"
            }
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "status": "error",
            "message": "Internal server error [object Object]"
        }
        ```
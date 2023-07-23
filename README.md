# "Leave A Note" Server Documentation
Leave A Note is a revolutionary platform designed to address the challenges drivers face during parking incidents or accidents when direct communication with the other party is not possible. Our goal is to provide a secure and efficient way for users to leave notes and reports for each other, ensuring a smooth resolution even in the absence of the other driver or when acting as a witness to a parking incident.

---

## Table Of Content
1. [Source and Demo, Future Features for Upcoming Versions](#source-and-demo-future-features-for-upcoming-versions)
2. [Introduction](#introduction)
3. [Setup and Installation, Middleware Files, Entity Description](#setup-and-installation-middleware-files-entity-description)
4. [Folder Structure](#folder-structure)
5. [Database Schema](#database-schema)

## Source And Demo, Future Features for Upcoming Versions

**Source Code on GitHub:**
- [Client side React Native Repository](https://github.com/korenkaplan/Leave-A-Note)
  
**App Video Demo:**
- (Insert App Video Demo Link Here)

**Future Features for Upcoming Versions (Current Version 1.0):**
1. **Multi-Language Support:** Recognizing our diverse user base, we plan to introduce multi-language support. Users will be able to interact with the platform in their preferred language, promoting inclusivity and ease of use for everyone.
2. **Geo-Tagging and Mapping Integration:** To better understand incident locations, we will integrate geo-tagging and mapping functionalities. This will help users visualize the incident locations and provide a more accurate context for reporting and resolving parking incidents.
3. **Image Download and Note Share as PDF:** In response to user requests, we will be introducing the ability to download incident images and notes as PDF files. This feature ensures users can keep a secure offline copy for their records or easily share the incident details with relevant parties.
4. **User Feedback System for Problem and Bug Reports:** Your feedback matters to us! To provide a more streamlined way for users to report problems and bugs, we will introduce a user feedback system. This feature will allow you to submit any issues you encounter directly through the platform, enabling us to address and resolve them promptly.
5. **Inbox Message Notifications:** Stay updated on your conversations! We will implement a notification system that alerts you when a new inbox message is received. This ensures that you never miss important updates or communications from other users.

---

## Introduction



**The Problem:**
Parking incidents can be frustrating and stressful, especially when the other driver involved is not present to exchange details. This often leads to a lack of information and difficulties in resolving insurance claims. "Leave A Note" aims to bridge this communication gap and provide a reliable means for drivers and witnesses to share vital information, ensuring a fair and hassle-free process in such situations.

**Target Audience:**
Our platform caters to all drivers, whether they have experienced a parking incident or want to assist others as witnesses. By bringing drivers together on a single platform, "Leave A Note" fosters a community-driven approach to resolve parking-related issues.

**Benefits and Advantages:**
- Streamlined Process: Leave A Note takes simplicity to the next level. With just the car number involved in the accident and a quick picture, users can effortlessly document the incident. No complex forms or time-consuming processes, making it easy for anyone to use and contribute valuable information.
- Reduced Stress: Leave A Note alleviates the stress associated with parking accidents, making it easier for drivers to handle such situations.
- Community Support: The platform fosters a supportive community of drivers and witnesses, encouraging cooperative assistance during parking incidents.

**Privacy and Security:**
- Privacy of a Reporter (3rd Party Witness): As a 3rd party witness, you have the option to remain completely anonymous when reporting an accident between two other drivers. Your identity will never be disclosed to the involved parties, ensuring you can contribute valuable information without any concerns about personal exposure.
- Asymmetric Information Sharing: To further protect your privacy, "Leave A Note" operates on asymmetric information sharing. Only the damaged user will have access to the details of the hitting driver, while the reverse is not permitted. This ensures that the user who experienced the incident retains full control over the exchange of information, maintaining their privacy and personal safety.
---

## Setup and Installation, Middleware Files, Entity Description

**Setup and Installation:**
To run the server project locally, follow these steps:
1. Clone the repository from GitHub.
2. Navigate to the project's root directory.
3. Run `npm install` to install all the required dependencies.
4. Create a .env file with the necessary environment variables (refer to .env.example for the structure).
5. Start the server using `npm run dev`.

**Middleware Files:**
Middleware components in the Middleware/ folder handle various aspects of request processing:
- authenticated.middleware.ts: Authenticates users using JSON Web Tokens (JWTs) from the Authorization header.
- error.middleware.ts: Catches and processes HTTP exceptions, providing appropriate responses to clients.
- validation.middleware.ts: Validates request bodies against specified Joi schemas, ensuring data integrity.

**Entities Description:**
The server manages the following entities:
- User: Represents individuals using the application.
- Note: Messages left by one user for another user, related to a damaged vehicle.
- Report: Messages reporting accidents or incidents, submitted by users or witnesses.
- Unmatched Report: Reports where the damaged vehicle's owner is not found in the system, stored for later delivery.
- Stats: Provides analytics data for the admin's KPI page.
- Accident: A model representing both notes and reports, stored as a sub-document in the user's profile.

---


## Database Schemas

**Accident Schema (SubDocument):** [? = Optional]

| Field                                           | Type    |
|-------------------------------------------------|---------|
| _id                                             | ObjectId|
| hittingDriver                                   | { carNumber: str, name: str?, phoneNumber: str? } |
| imageSource                                     | string  |
| type                                            | string ("note" or "report") |
| isAnonymous                                     | boolean |
| isIdentify                                      | boolean |
| date                                            | string  |
| isDeleted                                       | boolean |
| createdAt                                       | ISO Date|
| reporter                                        | { name: str, phoneNumber: str }? |

**User Document Schema**

| Field                                         | Type      | Details                 |
|-----------------------------------------------|-----------|-------------------------|
| _id                                           | ObjectId  |                         |
| name                                          | string    |                         |
| email                                         | string    | Index: 1 (unique)       |
| password                                      | string (Hashed) |                    |
| role                                          | string    |                         |
| carNumber                                     | string    | Index: 1 (unique)       |
| phoneNumber                                   | string    | Index: 1 (unique)       |
| createdAt                                     | ISO Date  |                         |
| unreadMessages                                | Accident Schema array |     |
| accidents                                     | Accident Schema array |     |

**unMatchedReport Document (Before matching to user)**

| Field                                             | Type  |
|---------------------------------------------------|-------|
| _id                                               | ObjectId |
| accident                                          | Accident Schema |
| damagedCarNumber                                  | string |
| createdAt                                         | ISO Date|
| updatedAt                                         | ISO Date|

**unMatchedReport Document (After matching to user)**

| Field                                             | Type  |
|---------------------------------------------------|-------|
| _id                                               | ObjectId |
| accidentReference                                 | ObjectId |
| createdAt                                         | ISO Date|
| updatedAt                                         | ISO Date|



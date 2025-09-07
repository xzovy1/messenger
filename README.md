# Messenger

## Description

This web app allows users to send messages to each other similar to Discord or Whatsapp.

## Core Functionality

- Authorization
  - a user is only able to access their own account
- Sending and recieving messages from other users
  - ? able to have group chats
- Ability to customize a user profile - Profile pic, personal info (Name, profile pic, DOB, contact info)
  **the scope of this project does not cover real-time updates(ie automatically notify users when a message is sent).**

## UI

### Login/ sign up

- nothing special here, classic login and sign up forms.

### Home page

#### Messages

- displays any messages from other users.
- icon/button to create new message
- profile info



## Data models

#### Users
id
username
password
contacts
messages

#### Profile
id
name
DOB
profile pic?
bio

#### Messages
id
sender id
recipient id(s)
date/time
message body
read

## Routers
### Message Router `/chat/`
`/`:  all user message conversations (chats)
`/:id`:  individual conversation
`/message/:id`: individual message

### User Router `/user/`
`/profile`: user info

### Contact Router `/contacts/`
`/`: all known user contacts
`/add`: add contact based on info/name
`/favorites`: starred contacts

## UX Flow
user:
logs in 
-> : Create Conversation/Chat
  - contacts and messages tabs both visible 
  - user clicks message for specified contact
  - conversation tab opens
  - user sends message to recipient.
-> : Open and respond in Chat
  - views conversations in list, unread messages in bold.
  - opened messages marked as read
  - user response to sender



## UI
- User creates account/logs in
- redirects to dashboard displaying chats, contacts and profile info and logout.

#### Dashboard
- Tiled dashboard with nav bar containing redirects for contacts and view/edit profile
  - left tile displays chats(if any)
    - shows username/profile picture & truncated last sent message
    - edit widget to delete chats.
  - right tile shows currently open chat with widget in bottom corner for creating a new chat.
    - messages in chronological order oldest on top
    - recipients messages on left side
    - sender (user) messages on the right.

#### Profile edit
- similar to cv application app: 
  - left side, populated form with current info
  - right side, displayed info which updates along with the form.
  - update and cancel buttons

#### Contacts
- list all users (accepted and requested or all?) 


#### Considerations
- able to upload photos to chat.
- delete user and replace all chats with "*user removed*"
- user status (away, active, busy, etc...)
- login with more than just passport-local 
- send user contact requests (friend requests)
- instead of going to a new page for each nav bar button, do component hotswaps
  - left side is contact list and message list
  - right side is profile info and displayed message
- read receipts



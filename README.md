# WHERE2GO Web Application

## Project Overview

**WHERE2GO** is a web application designed to help groups of friends decide where to hang out for group events or save favorite places privately. Users can organize events, propose venues, and vote on their choices collaboratively.

### Live Demo

The application is available at:  
**URL**: [https://milestone-3-ckx-six.vercel.app/](https://milestone-3-ckx-six.vercel.app/)

### Key Features

- **Landing Page**: 
  - Users can browse public recommendations and create group codes without logging in. However, group codes will not be saved unless the user is signed in.
  
- **Private Space**: 
  - After logging in, users can manage their favorite places, update details, and publish them to the public space.
  - Integration with Yelp API allows users to fetch details and images for saved places.
  
- **Group Space**: 
  - Users can create new groups or events and invite friends via group URLs.
  - The group owner can manage group details and remove members.
  
- **Event Page**: 
  - Group members can create proposals, vote on event venues, and finalize plans.

### User Stories and Use Cases

- **Logged-In Users**:
  - Can manage their private space by adding, updating, or deleting places.
  - Can create or join groups, propose venues for events, and vote on group decisions.
  
- **Public Users**:
  - Can view public places but cannot save or vote without signing in.

### Technical Overview

- **Frontend**: The frontend is built with modern web technologies.
- **APIs**: Yelp API for fetching venue information and Google Maps API for location display.
- **Database**: Uses collections for groups, places, proposals, and votes.

#### Collections:
- **Groups**: Stores group details, members, and event dates.
- **Places**: Stores private and public place information.
- **Proposals**: Stores proposed events, their date, and associated group.
- **Votes**: Stores voting information for proposals.



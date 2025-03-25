# Exam Project Albums App

## Description
This is a fullstack web application for managing and exploring music albums. Users can add albums to their personal library, tag them, and browse recommendations based on shared tags across the community. The app features search functionality, user libraries, album details, and a tag-based recommendation system.

## Features
- User authentication (login/register)
- Personal album library with tagging
- Global tag aggregation
- Album search by title and tags
- Tag-based album recommendations
- Add new albums to the database

## Technologies Used
- **Frontend**: Vite + React
- **State Management**: Zustand
- **Backend**: AWS Lambda + DynamoDB (via Serverless Framework)
- **Authentication**: JWT-based authentication
- **Deployment**:
  - Frontend: AWS Amplify (Production), S3 (Dev)
  - Backend: AWS Lambda + API Gateway (via GitHub Actions)

## Deployment
- The development version of the frontend is available at:  
  [Dev Deployment](http://examprojectdevdeployment.s3-website.eu-north-1.amazonaws.com)
- Once completed, the main production deployment will be available at:  
  [Main Deployment](https://main.d1ac97jlan3z8g.amplifyapp.com/)


